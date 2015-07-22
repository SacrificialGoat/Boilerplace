package main

import (
  "encoding/json"
  "fmt"    
)


//TODO: handle panics/errors, as one badly formatted message will shut down the server


//function that will handle events sent by the client(s)
func handleEvent(eventName string, messageContents string, player *Player) {
  switch {
    case eventName == "cp": //createPlayer
      evt_createPlayer(player)
      break
    case eventName == "np": //newPlayer
      evt_newPlayer(player)
      break
    case eventName == "ubp": //updateBodyPosition
      evt_updatePlayerBodyPosition(messageContents, player)
      break
    case eventName == "uhp": //updateHeadPosition
      evt_updatePlayerHeadPosition(messageContents, player)
      break
    case eventName == "sm": //sendMessage
      evt_sendMessage(messageContents, player)
      break  
    default:
      break 
  } 
}

//function that sends the data of existing players to the new player
//inbound message example - cp:
//outbound message example - cp:{"players":[{"id":5,"username":"user5","bodyPosition":{"x":0,"y":0,"z":0,"r":0},"headPosition":{"x":0,"y":0,"z":0,"w":0}},{"id":4,"username":"user4","bodyPosition":{"x":0,"y":0,"z":0,"r":0},"headPosition":{"x":0,"y":0,"z":0,"w":0}}]}
func evt_createPlayer(player *Player) {
  //send coordinates of other players to the new player
  playerPositionListOutbound := PlayerPositionListOutbound{Players: make([]*PlayerPositionOutbound, 0)}
  for p := range player.Room.Players { //only send data of players in the same room as the player
    if p.Id != player.Id { //only send the data of other players and not the data of the new player itself
      playerPositionOutbound := PlayerPositionOutbound{Id: p.Id, Username: p.Username, BodyPosition: p.BodyPosition, HeadPosition: p.HeadPosition}
      playerPositionListOutbound.Players = append(playerPositionListOutbound.Players, &playerPositionOutbound)
    }
  }  

  //json stringify the data
  jsonString, err := json.Marshal(playerPositionListOutbound)
  if err != nil {
    panic(err)
  }
  fmt.Println(string(jsonString))

  //send the data to the new player
  m := make(map[*Player]bool)
  m[player] = true
  broadcastStruct := BroadcastStruct{BroadcastType: 0, TargetPlayers: m, Message: []byte("cp:" + string(jsonString))}
  player.Room.Broadcast <- &broadcastStruct
}

//function that tells other players that a new player has been created
//inbound message example - np:
//outbound message example - np:{"id":1,"username":"user1","bodyPosition":{"x":0,"y":0,"z":0,"r":0},"headPosition":{"x":0,"y":0,"z":0,"w":0}}
func evt_newPlayer(player *Player) {
  //get data of the new player
  playerPositionOutbound := PlayerPositionOutbound{Id: player.Id, Username: player.Username, BodyPosition: player.BodyPosition, HeadPosition: player.HeadPosition}

  //json stringify the data
  jsonString, err := json.Marshal(playerPositionOutbound)
  if err != nil {
    panic(err)
  }
  fmt.Println(string(jsonString))

  //send the data of the new player to all other players in the same room
  m := make(map[*Player]bool)
  m[player] = true
  broadcastStruct := BroadcastStruct{BroadcastType: 2, TargetPlayers: m, Message: []byte("np:" + string(jsonString))}
  player.Room.Broadcast <- &broadcastStruct
}

//function that will update the player's body position and send the data to all other clients
//inbound message example - ubp:{"x": 1.0, "y": 2.0, "z": 3.0, "r": 4.0}
//outbound message example - ubp:{"id":1,"username":"user1","bodyPosition":{"x":1,"y":2,"z":3,"r":4}}
func evt_updatePlayerBodyPosition(message string, player *Player) {
  //json parse the message to get the new position and update the position
  byt := []byte(message)
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    panic(err)
  }
  x := float32(dat["x"].(float64))
  y := float32(dat["y"].(float64))
  z := float32(dat["z"].(float64))
  r := float32(dat["r"].(float64)) 
  player.updateBodyPosition(x, y, z, r)

  //create outbound object
  playerBodyPositionOutbound := PlayerBodyPositionOutbound{Id: player.Id, Username: player.Username, BodyPosition: player.BodyPosition}

  //json stringify the data
  jsonString, err := json.Marshal(playerBodyPositionOutbound)
  if err != nil {
    panic(err)
  }
  fmt.Println(string(jsonString))

  //send the data of the new player to all other players in the same room
  m := make(map[*Player]bool)
  m[player] = true
  broadcastStruct := BroadcastStruct{BroadcastType: 2, TargetPlayers: m, Message: []byte("ubp:" + string(jsonString))}
  player.Room.Broadcast <- &broadcastStruct
}

//function that will update the player's head position and send the data to all other clients
//inbound message example - uhp:{"x": 1.0, "y": 2.0, "z": 3.0, "w": 4.0}
//outbound message example - uhp:{"id":1,"username":"user1","headPosition":{"x":1,"y":2,"z":3,"w":4}}
func evt_updatePlayerHeadPosition(message string, player *Player) {
  //json parse the message to get the new position and update the position  
  byt := []byte(message)
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    panic(err)
  }
  x := float32(dat["x"].(float64))
  y := float32(dat["y"].(float64))
  z := float32(dat["z"].(float64))
  w := float32(dat["w"].(float64))    
  player.updateHeadPosition(x, y, z, w)

  //create outbound object
  playerHeadPositionOutbound := PlayerHeadPositionOutbound{Id: player.Id, Username: player.Username, HeadPosition: player.HeadPosition}

  //json stringify the data
  jsonString, err := json.Marshal(playerHeadPositionOutbound)
  if err != nil {
    panic(err)
  }
  fmt.Println(string(jsonString))

  //send the data of the new player to all other players in the same room
  m := make(map[*Player]bool)
  m[player] = true
  broadcastStruct := BroadcastStruct{BroadcastType: 2, TargetPlayers: m, Message: []byte("uhp:" + string(jsonString))}
  player.Room.Broadcast <- &broadcastStruct   
}

//function that will send a player message to all other clients
//inbound message example - sm:test
//outbound message example - sm:{"id":1,"username":"user1","message":"test"}
func evt_sendMessage(message string, player *Player) {
  //create outbound object
  playerMessageOutbound := PlayerMessageOutbound{Id: player.Id, Username: player.Username, Message: message}

  //json stringify the data
  jsonString, err := json.Marshal(playerMessageOutbound)
  if err != nil {
    panic(err)
  }
  fmt.Println(string(jsonString))

  //send the data of the new player to all other players in the same room
  m := make(map[*Player]bool)
  m[player] = true
  broadcastStruct := BroadcastStruct{BroadcastType: 2, TargetPlayers: m, Message: []byte("sm:" + string(jsonString))}
  player.Room.Broadcast <- &broadcastStruct  
}
