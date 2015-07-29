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


//struct containing properties of the body position for a player
type BodyPosition struct {
  X float32 `json:"x"`
  Y float32 `json:"y"`
  Z float32 `json:"z"`
  R float32 `json:"r"`
}

//struct containing properties of the head position for a player
type HeadPosition struct {
  X float32 `json:"x"`
  Y float32 `json:"y"`
  Z float32 `json:"z"`
  W float32 `json:"w"`     
}

//player struct
type Player struct {
  //properties to identify the player
  Id int `json:"id"`
  Username string `json:"username"`

  //properties to indicate the position of the player
  BodyPosition *BodyPosition `json:"bodyPosition"`
  HeadPosition *HeadPosition `json:"headPosition"`

  //the websocket connection
  Ws *websocket.Conn `json:"ws"`

  //buffered channel of outbound messages
  Send chan []byte `json:"send"`

  //the game room that the player is in
  Room *GameRoom `json:"room"`
}

//function to parse a message that a client sends
//and call the handleEvent function to perform an action based on the parsed message
func parseMessage(message string, player *Player) {
  splitMessage := strings.SplitN(message, ":", 2)
  eventName := splitMessage[0]
  messageContents := splitMessage[1]
  handleEvent(eventName, messageContents, player)
}

//function that reads what a client sends
func (player *Player) reader() {
  for {
      _, message, err := player.Ws.ReadMessage()
      if err != nil {
          break
      }
      //fmt.Println(string(message))

      //create a goroutine to parse the message and perform an action based on the parsed message
      go parseMessage(string(message), player)
  }
  player.Ws.Close()
}

//function that writes what a client sends
func (player *Player) writer() {
  for message := range player.Send {
    err := player.Ws.WriteMessage(websocket.TextMessage, message)
    if err != nil {
        break
    }
  }
  player.Ws.Close()
}

//function to update the body position of a player
func (player *Player) updateBodyPosition(x float32, y float32, z float32, r float32) {
  player.BodyPosition.X = x
  player.BodyPosition.Y = y
  player.BodyPosition.Z = z
  player.BodyPosition.R = r
}

//function to update the head position of a player
func (player *Player) updateHeadPosition(x float32, y float32, z float32, w float32) {
  player.HeadPosition.X = x
  player.HeadPosition.Y = y 
  player.HeadPosition.Z = z  
  player.HeadPosition.W = w  
}

var upgrader = &websocket.Upgrader{ReadBufferSize: 1024, WriteBufferSize: 1024}

//struct containing properties needed to create a player
type PlayerHandler struct {
  Id int `json:"id"`
  Username string `json:"username"`
  Room *GameRoom `json:"room"`
}

//function that creates a player
//TODO: change starting position of player (ie. retrieve last position from database and use that as the position to spawn the player)
func (playerHandler PlayerHandler) createPlayer(w http.ResponseWriter, r *http.Request) {
  ws, err := upgrader.Upgrade(w, r, nil)
  if err != nil {
    log.Fatal(err)
  }
  player := &Player{Send: make(chan []byte, 256), BodyPosition: &BodyPosition{X: 0.0, Y: 0.0, Z: 0.0, R: 0.0}, HeadPosition: &HeadPosition{X: 0.0, Y: 0.0, Z: 0.0, W: 0.0}, 
    Ws: ws, Room: playerHandler.Room, Username: playerHandler.Username, Id: playerHandler.Id}
  player.Room.Register <- player

  fmt.Println("Created player " + strconv.Itoa(player.Id) + " in room " + strconv.Itoa(player.Room.Id))

  defer func() { player.Room.Unregister <- player }()
  go player.writer() //perform writes asynchronously
  player.reader()
}


