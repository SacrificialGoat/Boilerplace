package main
  
import (
  "net/http"
  "fmt"    
  "encoding/json"
  "io/ioutil"
  "database/sql"
  _ "github.com/go-sql-driver/mysql"
  "log"
  // "strconv"
)

func getFriendData(w http.ResponseWriter, r *http.Request, db *sql.DB) (string, map[string]interface{}) {

  w.Header()["access-control-allow-origin"] = []string{"http://localhost:8080"} //TODO: fix this?                                                           
  w.Header()["access-control-allow-methods"] = []string{"GET, POST, OPTIONS"}
  w.Header()["Content-Type"] = []string{"application/json"}

  //ignore options requests
  if r.Method == "OPTIONS" {
    fmt.Println("options request received")
    w.WriteHeader(http.StatusTemporaryRedirect)
    // return "", nil
  }

  //check for session to see if client is authenticated
  session, err := store.Get(r, "flash-session")
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
  }
  fm := session.Flashes("message")
  if fm == nil {
    fmt.Println("Trying to vote on forum thread as an invalid user")
    fmt.Fprint(w, "No flash messages")
    // w.WriteHeader(http.StatusUnauthorized)
    return "", nil
  }

  //get the user id and username from the cookie
  userId := session.Values["userid"].(string) 

  //parse the body of the request into a []byte
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    panic(err)
  }
  
  //parse the JSON string body to get the thread to update
  byt := body
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    panic(err)
  }

  return userId, dat
}


func addFriend(w http.ResponseWriter, r *http.Request, db *sql.DB) {
  
  userId, dat := getFriendData(w, r, db)
  if dat == nil {
    log.Fatal("addFriend not authorized")
  }
  
  // for testing:
  // body, err := ioutil.ReadAll(r.Body)
  // if err != nil {
  //   panic(err)
  // }
  // byt := body
  // var dat map[string]interface{}
  // if err := json.Unmarshal(byt, &dat); err != nil {
  //   panic(err)
  // }
  // userId := 1
  // end testing


  friend_id := int(dat["friend_id"].(float64))

  stmt, err := db.Prepare("insert into friends (user_id, friend_id) values (?, ?)")
  if err != nil {
    log.Fatal(err)
  }
  res, err := stmt.Exec(userId, friend_id)
  if err != nil {
    log.Fatal(err)
  }
  fmt.Println(res)
  fmt.Println("friend added")

  fmt.Println("about to write 200 header")
  w.WriteHeader(http.StatusOK)
}

func removeFriend(w http.ResponseWriter, r *http.Request, db *sql.DB) {

  userId, dat := getFriendData(w, r, db)
  if dat == nil {
    log.Fatal("removeFriend not authorized")
  }

  // for testing:
  // body, err := ioutil.ReadAll(r.Body)
  // if err != nil {
  //   panic(err)
  // }
  // byt := body
  // var dat map[string]interface{}
  // if err := json.Unmarshal(byt, &dat); err != nil {
  //   panic(err)
  // }
  // userId := 1
  // end testing

  
  friend_id := int(dat["friend_id"].(float64))

  stmt, err := db.Prepare("delete from friends where (user_id = ? AND friend_id = ?)")
  if err != nil {
    log.Fatal(err)
  }
  res, err := stmt.Exec(userId, friend_id)
  if err != nil {
    log.Fatal(err)
  }
  fmt.Println(res)

  fmt.Println("Friend removed")

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.WriteHeader(http.StatusOK)
}

func getFriendsList(w http.ResponseWriter, r *http.Request, db *sql.DB) {

  userId, _ := getFriendData(w, r, db)

  rows, err := db.Query("select users.user_id, users.user_name, users.first_name, users.last_name from friends right join users on friends.friend_id = users.user_id where friends.user_id = " + userId + ")")
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

  jsonString, err := json.Marshal(friendsList)
  if err != nil {
    panic(err)
  }    

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.Write(jsonString)
}




