package main

import (
	"fmt"
)

// hub maintains set of active connections, and "broadcasts" message to connecitons

type hub struct {
	// register conneciton
	connections map[*friend_connection]bool /// this is from friend_connection.go
	connectionsId map[*friend_connection]string  // passed from friend_conn

	// inbound message from connections
	broadcast chan []byte

	// register requests from friend_connection.  
	register chan *friend_connection

	// Unregister requestsf from friend_connection
	unregister chan *friend_connection

	broadcastUsers chan string
}

var h = hub{
	broadcast: make(chan []byte),
	register: make(chan *friend_connection),
	unregister: make(chan *friend_connection),
	connections: make(map[*friend_connection]bool),  // map of current connections?
	connectionsId: make(map[*friend_connection]string),  // change this to array?
	broadcastUsers: make(chan string,20),
}

func (h *hub) run(){
	for {
		fmt.Println("h.run running...")
		select {
		case c := <- h.register:  // Receive from conn.go at serveWs.  Receive user friend_connection
			fmt.Println("registering c.userId...", c.userId)
			h.connections[c] = true
			h.connectionsId[c] = c.userId
			// need to send updated "connections" to broadcast
			h.broadcastUsers <- c.userId

		case c := <- h.unregister:  
			if _, ok := h.connections[c]; ok {
				fmt.Println("Unregistering...", c)

				delete(h.connections, c)
				close(c.send)

				h.broadcastUsers <- c.userId
				delete(h.connectionsId, c)
				close(c.sendUsers)
			}

		case <- h.broadcastUsers:
			// when new users registers, send new "userId connection list" to all members
			for c := range h.connections {
				fmt.Println("range of h.connectionsId, ", c.userId)
				select {
				case c.sendUsers <- h.connectionsId:  // for each of connection, send in connectionId map
				default:
					// close(c.sendUsers)
					// delete(h.connectionsId, c)
				}
			}

		case m := <- h.broadcast:  // received from conn.go at readPump (read from user to hub)
			// BRYAN: might not need this since we are not getting any message from users
			fmt.Println("Broadcasting message: ", m)

			for c := range h.connections {
				select {
					case c.send <- m:   // when a message is received from a user, "send" that message to all connections. At writePump 
					default:
						close(c.send)
						delete(h.connections, c)
				}
			}
		}
	}
}

