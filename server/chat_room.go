package main


//struct needed to help broadcast a message to selected clients
type BroadcastStruct struct {

  //targets to send the message to
  //0 - "targeted" - send message to everyone in the TargetChatters map
  //1 - "allInRoom" - send message to everyone in the room
  //2 - "allInRoomExcept" - send message to everyone in the room except for the people in the TargetChatters map
  BroadcastType int

  //chatters in the room to send/not send to
  //map/hash table used for constant time lookup
  TargetChatters map[int]*Chatter //use the chatter id as the key, and store a pointer to the chatter as the value

  //message to send
  Message []byte

}

//struct for a chat room
type ChatRoom struct {
  //id of the room
  Id int

  //registered connections
  Chatters map[int]*Chatter //use the chatter id as the key, and store a pointer to the chatter as the value

  //inbound messages from the connections
  Broadcast chan *BroadcastStruct

  //register requests from the connections
  Register chan *Chatter

  //unregister requests from connections
  Unregister chan *Chatter
}

//function to create a room with the passed in id
func createChatRoom(id int) *ChatRoom {
  return &ChatRoom{
    Id: id,
    Broadcast:   make(chan *BroadcastStruct),
    Register:    make(chan *Chatter),
    Unregister:  make(chan *Chatter),
    Chatters: make(map[int]*Chatter),
  }
}

//function that monitors channels
func (room *ChatRoom) run() {
  //run indefinitely and look for values in the channels
  for {
    select {

      //put chatter in chat room
      case p := <-room.Register:
        room.Chatters[p.Id] = p

      //remove chatter from chat room and close the socket
      case p := <-room.Unregister:
        if _, ok := room.Chatters[p.Id]; ok {
            delete(room.Chatters, p.Id)
            close(p.Send)
        }

      //send messages to selected clients
      case m := <-room.Broadcast:

        //send to specified targets
        if m.BroadcastType == 0 { 

          //loop through the TargetChatters map/hash table to get the chatters to send to
          for _, p := range m.TargetChatters {
            select {
            case p.Send <- m.Message:
            default:
                delete(room.Chatters, p.Id)
                close(p.Send)
            }
          }   

        //send to everyone in the room
        } else if m.BroadcastType == 1 { 

          //loop through the chatters map/hash table of the room to get the chatters to send to
          for _, p := range room.Chatters {
            select {
            case p.Send <- m.Message:
            default:
              delete(room.Chatters, p.Id)
              close(p.Send)
            }
          }  

        //send to everyone in the room except for the specified targets
        } else if(m.BroadcastType == 2) {

          //loop through the chatters map/hash table of the room to get the chatters to send to
          for _, p := range room.Chatters {
            _, ok := m.TargetChatters[p.Id]
            if ok {
              //don't do anything if chatter is in the TargetChatters map/hash table
            } else {
              //else send a message to the chatter
              select {
              case p.Send <- m.Message:
              default:
                delete(room.Chatters, p.Id)
                close(p.Send)
              }
            }
          }   

        }

    } //end select statement
  } //end for loop
} //end run function
