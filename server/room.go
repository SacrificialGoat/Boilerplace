package main


//struct needed to help broadcast a message to selected clients
type BroadcastStruct struct {

  //targets to send the message to
  //0 - "targeted" - send message to everyone in the TargetPlayers map
  //1 - "allInRoom" - send message to everyone in the room
  //2 - "allInRoomExcept" - send message to everyone in the room except for the people in the TargetPlayers map
  BroadcastType int

  //players in the room to send/not send to
  //map/hash table used for constant time lookup
  TargetPlayers map[*Player]bool //use a pointer to the player as the key, the actual value stored doesn't matter

  //message to send
  Message []byte

}

//struct for a game room
type GameRoom struct {
  //id of the room
  Id int

  //registered connections
  Players map[*Player]bool //use a pointer to the player as the key, the actual value stored doesn't matter

  //inbound messages from the connections
  Broadcast chan *BroadcastStruct

  //register requests from the connections
  Register chan *Player

  //unregister requests from connections
  Unregister chan *Player
}

//function to create a room with the passed in id
func createGameRoom(id int) *GameRoom {
  return &GameRoom{
    Id: id,
    Broadcast:   make(chan *BroadcastStruct),
    Register:    make(chan *Player),
    Unregister:  make(chan *Player),
    Players: make(map[*Player]bool),
  }
}

//function that monitors channels
func (room *GameRoom) run() {
  //run indefinitely and look for values in the channels
  for {
    select {

      //put player in game room
      case p := <-room.Register:
        room.Players[p] = true

      //remove player from game room and close the socket
      case p := <-room.Unregister:
        if _, ok := room.Players[p]; ok {
            delete(room.Players, p)
            close(p.Send)
        }

      //send messages to selected clients
      case m := <-room.Broadcast:

        //send to specified targets
        if m.BroadcastType == 0 { 

          //loop through the TargetPlayers map/hash table to get the players to send to
          for p := range m.TargetPlayers {
            select {
            case p.Send <- m.Message:
            default:
                delete(room.Players, p)
                close(p.Send)
            }
          }   

        //send to everyone in the room
        } else if m.BroadcastType == 1 { 

          //loop through the players map/hash table of the room to get the players to send to
          for p := range room.Players {
            select {
            case p.Send <- m.Message:
            default:
              delete(room.Players, p)
              close(p.Send)
            }
          }  

        //send to everyone in the room except for the specified targets
        } else if(m.BroadcastType == 2) {

          //loop through the players map/hash table of the room to get the players to send to
          for p := range room.Players {
            _, ok := m.TargetPlayers[p]
            if ok {
              //don't do anything if player is in the TargetPlayers map/hash table
            } else {
              //else send a message to the player
              select {
              case p.Send <- m.Message:
              default:
                delete(room.Players, p)
                close(p.Send)
              }
            }
          }   

        }

    } //end select statement
  } //end for loop
} //end run function
