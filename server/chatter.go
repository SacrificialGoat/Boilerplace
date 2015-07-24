package main

import (
  "github.com/gorilla/websocket"
  "net/http"
  "fmt"    
  "strings"
  "log"
  "strconv"
  //"encoding/json"
)


//chatter struct
type Chatter struct {
  //properties to identify the chatter
  Id int `json:"id"`
  Username string `json:"username"`

  //the websocket connection
  Ws *websocket.Conn `json:"ws"`

  //buffered channel of outbound messages
  Send chan []byte `json:"send"`

  //the game room that the chatter is in
  Room *ChatRoom `json:"room"`
}

//function to parse a message that a client sends
//and call the handleEvent function to perform an action based on the parsed message
func parseMessage(message string, chatter *Chatter) {
  splitMessage := strings.SplitN(message, ":", 2)
  eventName := splitMessage[0]
  messageContents := splitMessage[1]
  handleEvent(eventName, messageContents, chatter)
}

//function that reads what a client sends
func (chatter *Chatter) reader() {
  for {
      _, message, err := chatter.Ws.ReadMessage()
      if err != nil {
          break
      }
      //fmt.Println(string(message))

      //create a goroutine to parse the message and perform an action based on the parsed message
      go parseMessage(string(message), chatter)
  }
  chatter.Ws.Close()
}

//function that writes what a client sends
func (chatter *Chatter) writer() {
  for message := range chatter.Send {
    err := chatter.Ws.WriteMessage(websocket.TextMessage, message)
    if err != nil {
        break
    }
  }
  chatter.Ws.Close()
}

var upgrader = &websocket.Upgrader{ReadBufferSize: 1024, WriteBufferSize: 1024}

//struct containing properties needed to create a chatter
type ChatterHandler struct {
  Id int `json:"id"`
  Username string `json:"username"`
  Room *ChatRoom `json:"room"`
}

//function that creates a chatter
func (chatterHandler ChatterHandler) createChatter(w http.ResponseWriter, r *http.Request) {
  ws, err := upgrader.Upgrade(w, r, nil)
  if err != nil {
    log.Fatal(err)
  }
  chatter := &Chatter{Send: make(chan []byte, 256), Ws: ws, Room: chatterHandler.Room, Username: chatterHandler.Username, Id: chatterHandler.Id}
  chatter.Room.Register <- chatter

  fmt.Println("Created chatter " + strconv.Itoa(chatter.Id) + " in room " + strconv.Itoa(chatter.Room.Id))

  defer func() { chatter.Room.Unregister <- chatter }()
  go chatter.writer() //perform writes asynchronously
  chatter.reader()
}


