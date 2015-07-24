package main

import (
  "encoding/json"
  "fmt"  
  "strings"  
  "strconv"
)


//TODO: handle panics/errors, as one badly formatted message will shut down the server


//function that will handle events sent by the client(s)
func handleEvent(eventName string, messageContents string, chatter *Chatter) {
  switch {
    case eventName == "cc": //createChatter
      evt_createChatter(chatter)
      break
    case eventName == "nc": //newChatter
      evt_newChatter(chatter)
      break
    case eventName == "sdm": //sendDirectMessage
      evt_sendDirectMessage(messageContents, chatter)
      break     
    case eventName == "sgm": //sendGlobalMessage
      evt_sendGlobalMessage(messageContents, chatter)
      break  
    default:
      break 
  } 
}

//function that sends the data of existing chatters to the new chatter
//inbound message example - cc:
//outbound message example - cc:{"chatters":[{"id":5,"username":"user5"}]}
func evt_createChatter(chatter *Chatter) {
  //send coordinates of other chatters to the new chatter
  chatterIdentifierListOutbound := ChatterIdentifierListOutbound{Chatters: make([]*ChatterIdentifierOutbound, 0)}
  for _, c := range chatter.Room.Chatters { //only send data of chatters in the same room as the chatter
    if c.Id != chatter.Id { //only send the data of other chatters and not the data of the new chatter itself
      chatterIdentifierOutbound := ChatterIdentifierOutbound{Id: c.Id, Username: c.Username}
      chatterIdentifierListOutbound.Chatters = append(chatterIdentifierListOutbound.Chatters, &chatterIdentifierOutbound)
    }
  }  

  //json stringify the data
  jsonString, err := json.Marshal(chatterIdentifierListOutbound)
  if err != nil {
    panic(err)
  }
  fmt.Println(string(jsonString))

  //send the data to the new chatter
  m := make(map[int]*Chatter)
  m[chatter.Id] = chatter
  broadcastStruct := BroadcastStruct{BroadcastType: 0, TargetChatters: m, Message: []byte("cc:" + string(jsonString))}
  chatter.Room.Broadcast <- &broadcastStruct
}

//function that tells other chatters that a new chatter has been created
//inbound message example - nc:
//outbound message example - nc:{"id":1,"username":"user1"}
func evt_newChatter(chatter *Chatter) {
  //get data of the new chatter
  chatterIdentifierOutbound := ChatterIdentifierOutbound{Id: chatter.Id, Username: chatter.Username}

  //json stringify the data
  jsonString, err := json.Marshal(chatterIdentifierOutbound)
  if err != nil {
    panic(err)
  }
  fmt.Println(string(jsonString))

  //send the data of the new chatter to all other chatters in the same room
  m := make(map[int]*Chatter)
  m[chatter.Id] = chatter
  broadcastStruct := BroadcastStruct{BroadcastType: 2, TargetChatters: m, Message: []byte("nc:" + string(jsonString))}
  chatter.Room.Broadcast <- &broadcastStruct
}

//function that will send a chat message to all other clients
//inbound message example - sgm:test
//outbound message example - sgm:{"id":1,"username":"user1","message":"test"}
func evt_sendGlobalMessage(message string, chatter *Chatter) {
  //create outbound object
  chatterMessageOutbound := ChatterMessageOutbound{Id: chatter.Id, Username: chatter.Username, Message: message}

  //json stringify the data
  jsonString, err := json.Marshal(chatterMessageOutbound)
  if err != nil {
    panic(err)
  }
  fmt.Println(string(jsonString))

  //send the message to all chatters in the same room
  broadcastStruct := BroadcastStruct{BroadcastType: 1, Message: []byte("sgm:" + string(jsonString))}
  chatter.Room.Broadcast <- &broadcastStruct  
}

//function that will send a chat message to all other clients
//inbound message example - sgm:test
//outbound message example - sgm:{"id":1,"username":"user1","message":"test"}
func evt_sendDirectMessage(message string, chatter *Chatter) {

  //split the message to get the recipient and message contents
  splitMessage := strings.SplitN(message, ":", 2)
  recipientIdString := splitMessage[0]
  messageContents := splitMessage[1]

  //convert the recipient id from string to int
  recipientId, err := strconv.Atoi(recipientIdString)
  if err != nil {
    //error
    fmt.Println("Error converting recipient id string to int")
    return
  }

  //get the recipient socket using the recipient id
  recipient, ok := chatter.Room.Chatters[recipientId]; 
  if !ok {
    //error
    fmt.Println("Recipient is offline")
    return
  }

  //create outbound object
  chatterMessageOutbound := ChatterMessageOutbound{Id: chatter.Id, Username: chatter.Username, Message: messageContents}

  //json stringify the data
  jsonString, err := json.Marshal(chatterMessageOutbound)
  if err != nil {
    panic(err)
  }
  fmt.Println(string(jsonString))

  //send the message to the recipient
  m := make(map[int]*Chatter)
  m[chatter.Id] = chatter  
  m[recipientId] = recipient 
  broadcastStruct := BroadcastStruct{BroadcastType: 0, TargetChatters: m, Message: []byte("sdm:" + string(jsonString))}
  chatter.Room.Broadcast <- &broadcastStruct  
}

