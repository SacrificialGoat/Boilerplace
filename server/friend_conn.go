package main

import (
	"github.com/gorilla/websocket"
	"log"
	"net/http"
	"time"
	"fmt"
	"encoding/json"
    "database/sql"
    "strconv"
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

type friendStatus struct {
	UserId string
	UserName string
}



// ======= Pumps for Friend List =========


// reads message from websocket to hub.
// the c.ws.ReadMessage is blocking, thats why function doesn't jump to "defer" automatically
func (c *friend_connection) readPumpFL(){
	defer func() {
		h.unregister <- c
		c.ws.Close()
	}()

	// c.ws.SetReadDeadline(time.Now().Add(pongWait))
	// c.ws.SetPongHandler(func(string) error { c.ws.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		fmt.Println("Blocking at reading...")
		_, message, err := c.ws.ReadMessage()
		fmt.Println("After reading...")

		if err != nil {
			break
		}

		h.broadcast <- message
	}

}


func (c *friend_connection) writeFL(mt int, payload []byte) error {
	c.ws.SetWriteDeadline(time.Now().Add(writeWait))
	return c.ws.WriteMessage(mt, payload)
}

// pumps message from hub to websocket friend_connection.  Send to friend_connections?
func (c *friend_connection) writePumpFL(db *sql.DB) {

	ticker := time.NewTicker(pingPeriod)  // NewTicker has channel
	// ?? not sure about this
	defer func() {
		ticker.Stop()
		h.unregister <- c
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


			// For TESTING
			currConn := []string{}
			for conn := range h {
					currConn = append(currConn, h[conn])
			}
			fmt.Println("Connected users: ", currConn, " -- CurrUser: ", c.userId)

			// == Getting current user friendlist from database.
			userFriendList := GetFriendsListInternal(c.userId, db) 
			onlineFriends := []string{}

			if len(userFriendList.Friends) != 0 {
				i := 0
				// for i := range userFriendList.Friends {
				for i < len(userFriendList.Friends) {

					// build an array of current connections
					found := false
					for conn := range h {
						if h[conn] == strconv.Itoa(userFriendList.Friends[i].User_id) {
							// fmt.Println("Friend is online: ", h[conn])
							onlineFriends = append(onlineFriends, h[conn])
							found = true
						}
						// fmt.Println("userFriendList.Friends[i].User_id", userFriendList.Friends[i].User_id)
					}
					// fmt.Println("Found is",found, "I:", i, " ID:", userFriendList.Friends[i].User_id )

					// cannot do this because remove element in array causes mismatch for "for condition"
		
					if found == false {
						userFriendList.Friends = append(userFriendList.Friends[:i], userFriendList.Friends[i+1:]...) 
						i--
					}
					i++
				}  
			}


			fmt.Println("Online Friends: ", userFriendList.Friends, "  -- CurrUser: ", c.userId)


			// === write to ws connection == 
			j, _ := json.Marshal( userFriendList)
			fmt.Println("JSON string: ", j)


			if err := c.writeFL(websocket.TextMessage, j); err!=nil { 
				return
			}

		case <- ticker.C:  //ticker.C is channel. So when Receiving something from ticker.C...
			if err := c.writeFL(websocket.PingMessage, []byte{}); err != nil {
				return
			}

		}

	}
}




func GetFriendsListInternal(userId string, db *sql.DB) FriendsListOutbound {
  rows, err := db.Query("select users.user_id, users.user_name, users.first_name, users.last_name from friends right join users on friends.friend_id = users.user_id where friends.user_id = " + userId)
  if err != nil {
    log.Fatal(err)
  }

  var (
    id int
    username string
    first string
    last string
  )

  friendsList := FriendsListOutbound{Friends: make([]*FriendInfoOutbound, 0)}

  for rows.Next() {
    err = rows.Scan(&id, &username, &first, &last)
    if err != nil {
      panic(err)
    }
    friendInfoOutbound := FriendInfoOutbound{User_id: id, User_name: username, First_name: first, Last_name: last}
    friendsList.Friends = append(friendsList.Friends, &friendInfoOutbound)
  }
  return friendsList
}


// handles websocket request from peer.
// a friend_connection will be re routed here. Then "ws" gets pointer to that websocket friend_connection. 
// Then "c" is instantiated with &friend_connection struct (a user's friend_connection). Then pass to h.register.
// Then call c.writePump goroutine to 1) async write stuff from hub to friend_connection.
// Sync call c.readPump
func serveWs(w http.ResponseWriter, r *http.Request, db *sql.DB ) {
	// TODO: register connection when sign in and out, not when openning page

	// go h.run()  // place this here because we took out friend_list

	userId := CheckSession(w, r)  // This is in Pete's friend.go

	if userId == "" {
		fmt.Println("User Not logged in", userId)		
		return
	}

	// ? Upgrade gets pointer to Websocket "ws".  Ws is pointer to friend_connection
	ws, err := friend_upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	c := &friend_connection{send: make(chan []byte, 256), ws:ws, userId:userId, sendUsers: make(chan map[*friend_connection]string, 256)}

	h.register <- c
	go c.writePumpFL(db)
    c.readPumpFL()
}


