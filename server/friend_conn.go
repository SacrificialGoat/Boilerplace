package main

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"time"
	"fmt"
	"encoding/json"
)

const (
	writeWait = 10 * time.Second

	pongWait = 60 * time.Second

	pingPeriod = (pongWait * 9) / 10

	maxMessageSize = 512

)

var friend_upgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
}

type friend_connection struct {
	ws *websocket.Conn
	send chan []byte
	userId string
	sendUsers chan map[*friend_connection]string
}

// reads message from websocket to hub
func (c *friend_connection) readPump(){
	// fmt.Println("Executing readPump..: Pongwait, ", pongWait)
	// this "defer" is for closing at unregister signal.  ?? Defer?
	defer func() {
		h.unregister <- c
		c.ws.Close()
	}()

	c.ws.SetReadLimit(maxMessageSize) // set maxsize.
	c.ws.SetReadDeadline(time.Now().Add(pongWait))  // reading deadline. Pongwait

		// ?? no idea what htis does
	c.ws.SetPongHandler(func(string) error {
			c.ws.SetReadDeadline(time.Now().Add(pongWait));
			return nil
		})

	// readmessage here
	for {
		_, message, err := c.ws.ReadMessage()  // if maxize reached, err out
		if err != nil {
			fmt.Println("exceeded Readmessage maxsize. Exiting current user:", c)
			break
		}
		fmt.Println("Reading message from client... ", message)
		h.broadcast <- message  // read message, pass to broadcast
	}
}


// 
func (c *friend_connection) write(mt int, payload []byte) error {
	c.ws.SetWriteDeadline(time.Now().Add(writeWait))
	return c.ws.WriteMessage(mt, payload)
}

// pumps message from hub to websocket friend_connection.  Send to friend_connections?
func (c *friend_connection) writePump() {
	ticker := time.NewTicker(pingPeriod)  // NewTicker has channel
	// ?? not sure about this
	defer func() {
		ticker.Stop()
		c.ws.Close()
	}()

	for {
		select {
		case message, ok := <- c.send:  // receive message from hub. 
			// close message if error reading
			if !ok {
				c.write(websocket.CloseMessage, []byte{})
				return
			}
			// write to user friend_connection
			fmt.Println("writing to C with Message", c, message)
			if err := c.write(websocket.TextMessage, message); err!=nil { 
				return
			}

		case <- ticker.C:  //ticker.C is channel. So when Receiving something from ticker.C...
			if err := c.write(websocket.PingMessage, []byte{}); err != nil {
				return
			}

		}

	}
}


// ======= Write pump for Friend List =========

// 
func (c *friend_connection) writeFL(mt int, payload []byte) error {
	c.ws.SetWriteDeadline(time.Now().Add(writeWait))
	return c.ws.WriteMessage(mt, payload)
}

// pumps message from hub to websocket friend_connection.  Send to friend_connections?
func (c *friend_connection) writePumpFL() {
	ticker := time.NewTicker(pingPeriod)  // NewTicker has channel
	// ?? not sure about this
	defer func() {
		ticker.Stop()
		c.ws.Close()
	}()

	for {
		select {
		case h, ok := <- c.sendUsers:  // receive message from hub. 
			// close message if error reading
			if !ok {
				c.writeFL(websocket.CloseMessage, []byte{})
				return
			}

			// build an array of current connections
			currConn := []string{}
			for conn := range h {
				currConn = append(currConn, h[conn])
			}
			fmt.Println("Connected users: ", currConn)


			j, _ := json.Marshal(currConn)
			fmt.Println("JSON string: ", j)


			if err := c.writeFL(websocket.TextMessage, j); err!=nil { 
				return
			}

		case <- ticker.C:  //ticker.C is channel. So when Receiving something from ticker.C...
			// if err := c.writeFL(websocket.PingMessage, []byte{}); err != nil {
			// 	return
			// }

		}

	}
}



// handles websocket request from peer.
// a friend_connection will be re routed here. Then "ws" gets pointer to that websocket friend_connection. 
// Then "c" is instantiated with &friend_connection struct (a user's friend_connection). Then pass to h.register.
// Then call c.writePump goroutine to 1) async write stuff from hub to friend_connection.
// Sync call c.readPump
func serveWs(w http.ResponseWriter, r *http.Request) {
	go h.run()  // place this here because we took out friend_list

	userId := CheckSession(w, r)  // This is in Pete's friend.go

	// ? Upgrade gets pointer to Websocket "ws".  Ws is pointer to friend_connection
	ws, err := friend_upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	c := &friend_connection{send: make(chan []byte, 256), ws:ws, userId:userId, sendUsers: make(chan map[*friend_connection]string, 256)}

	h.register <- c
	// test := []string{"Trial1"}
	// test := "Helloworld"
	// h.broadcastUsers <- test
	go c.writePump() // Write from hub to friend_connection. Goroutine. Any new message read from pump will be updated trhough here
	go c.writePumpFL()

	c.readPump()  //read data from friend_connection to hub
}


