package main

import (
  "fmt"
  "log"
  "net/http"
  "encoding/json"
  "io/ioutil"
  "database/sql"
  _ "github.com/go-sql-driver/mysql"
  "github.com/gorilla/sessions"  
  "strconv"  
  "time"
)


//TODO: Return correct status and message if session is invalid
//TODO: Return correct status and message if insert failed
func createMessage(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore) { 

  fmt.Println("Sending messages...")

  //add headers to response
  w.Header()["access-control-allow-origin"] = []string{"http://localhost:8080"} //TODO: fix this?                                                           
  w.Header()["access-control-allow-methods"] = []string{"GET, POST, OPTIONS"}
  w.Header()["Content-Type"] = []string{"application/json"}

  //ignore options requests
  if r.Method == "OPTIONS" {
    fmt.Println("options request received")
    w.WriteHeader(http.StatusTemporaryRedirect)
    return
  }

  //check for session to see if client is authenticated
  session, err := store.Get(r, "flash-session")
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
  }
  fm := session.Flashes("message")
  if fm == nil {
    fmt.Println("Trying to create a thread as an invalid user")
    fmt.Fprint(w, "No flash messages")
    return
  }
  //session.Save(r, w)

  //get the user/sender id from the cookie
  message_sender_id := session.Values["userid"].(int)

  //parse the body of the request into a string
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    panic(err)
  }
  //fmt.Println(string(body))
  
  //parse the JSON string body to get the forum thread info
  byt := body
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    panic(err)
  }
  message_recipient_id := int(dat["recipient_id"].(float64))
  message_title := dat["title"].(string)
  message_contents := dat["contents"].(string)

  //insert forum thread into database
  stmt, err := db.Prepare("insert into messages (sender_id, recipient_id, title, contents) values (?, ?, ?, ?)")
  if err != nil {
    log.Fatal(err)
  }
  res, err := stmt.Exec(message_sender_id, message_recipient_id, message_title, message_contents)
  if err != nil {
    log.Fatal(err)
  }
  lastId, err := res.LastInsertId()
  if err != nil {
    log.Fatal(err)
  }
  rowCnt, err := res.RowsAffected()
  if err != nil {
    log.Fatal(err)
  }
  fmt.Printf("Inserted message " + message_title + " into database. Last inserted ID = %d, rows affected = %d\n", lastId, rowCnt)

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.Write([]byte("{\"message_id\" : " + strconv.FormatInt(lastId, 10) + "}"))
}


//option: query by - 0) message id, 1) sender id, 2) recipient id
//sortBy: sort by (does not apply to by message id since by message id is unique) - 0) rating, 1) datetime
//TODO: Return correct status and message if session is invalid
//TODO: Return correct status and message if query failed
func recvMessages(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore, option int, sortBy int, pageNumber int, id int) {

  fmt.Println("Getting messages...")

  //add headers to response
  w.Header()["access-control-allow-origin"] = []string{"http://localhost:8080"} //TODO: fix this?                                                           
  w.Header()["access-control-allow-methods"] = []string{"GET, POST, OPTIONS"}
  w.Header()["Content-Type"] = []string{"application/json"}

  //ignore options requests
  if r.Method == "OPTIONS" {
    fmt.Println("options request received")
    w.WriteHeader(http.StatusTemporaryRedirect)
    return
  }

  //check for session to see if client is authenticated
  session, err := store.Get(r, "flash-session")
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
  }
  fm := session.Flashes("message")
  if fm == nil {
    fmt.Println("Trying to get forum thread info as an invalid user")
    fmt.Fprint(w, "No flash messages")
    return
  }
  //session.Save(r, w)

  //variable(s) to hold the returned values from the query
  var (
    queried_message_id int
    queried_sender_id int
    queried_sender_name string
    queried_recipient_id int
    queried_recipient_name string
    queried_title string
    queried_contents string    
    queried_creation_time time.Time
    queried_last_update_time time.Time
  )

  //change query based on option
  var dbQuery string 

  if option == 0 { //query by message id

    dbQuery = "select message_id, sender_id, u1.user_name as sender_name, recipient_id, u2.user_name as recipient_name, title, contents, messages.creation_time, messages.last_update_time from messages inner join users as u1 on messages.sender_id = u1.user_id inner join users as u2 on messages.recipient_id = u2.user_id where message_id = " + strconv.Itoa(id)   
 
  } else if option == 1 { //query by sender id

    //get the user id from the cookie
    id = session.Values["userid"].(int)  

    if sortBy == 0 { //get by rating

      dbQuery = "select message_id, sender_id, u1.user_name as sender_name, recipient_id, u2.user_name as recipient_name, title, contents, messages.creation_time, messages.last_update_time from messages inner join users as u1 on messages.sender_id = u1.user_id inner join users as u2 on messages.recipient_id = u2.user_id where sender_id = " + strconv.Itoa(id) + " order by creation_time desc"

    } else { //get by creation time

      dbQuery = "select message_id, sender_id, u1.user_name as sender_name, recipient_id, u2.user_name as recipient_name, title, contents, messages.creation_time, messages.last_update_time from messages inner join users as u1 on messages.sender_id = u1.user_id inner join users as u2 on messages.recipient_id = u2.user_id where sender_id = " + strconv.Itoa(id) + " order by creation_time asc"

    }

    if pageNumber >= 1 {
      //only get 25 threads per query, and get records based on page number
      limit := 25
      offset := (pageNumber - 1) * limit 

      dbQuery += " limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)
    }    

  } else { //query by recipient id

    //get the user id from the cookie
    id = session.Values["userid"].(int)  

    if sortBy == 0 { //get by rating

      dbQuery = "select message_id, sender_id, u1.user_name as sender_name, recipient_id, u2.user_name as recipient_name, title, contents, messages.creation_time, messages.last_update_time from messages inner join users as u1 on messages.sender_id = u1.user_id inner join users as u2 on messages.recipient_id = u2.user_id where recipient_id = " + strconv.Itoa(id) + " order by creation_time desc"

    } else { //get by creation time

      dbQuery = "select message_id, sender_id, u1.user_name as sender_name, recipient_id, u2.user_name as recipient_name, title, contents, messages.creation_time, messages.last_update_time from messages inner join users as u1 on messages.sender_id = u1.user_id inner join users as u2 on messages.recipient_id = u2.user_id where recipient_id = " + strconv.Itoa(id) + " order by creation_time asc"

    }

    if pageNumber >= 1 {
      //only get 25 threads per query, and get records based on page number
      limit := 25
      offset := (pageNumber - 1) * limit 

      dbQuery += " limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)
    }    

  }

  //perform query and check for errors
  rows, err := db.Query(dbQuery)
  if err != nil {
    panic(err)
  } 

  //outbound object containing a collection of outbound objects for each forum thread
  messageCollectionOutbound := MessageCollectionOutbound{Messages: make([]*MessageOutbound, 0)}

  //iterate through results of query
  for rows.Next() {
    //get the relevant information from the query results
    err = rows.Scan(&queried_message_id, &queried_sender_id, &queried_sender_name, &queried_recipient_id, &queried_recipient_name, &queried_title, &queried_contents, &queried_creation_time, &queried_last_update_time)
    if err != nil {
      panic(err)
    }

    //create outbound object for each row
    messageOutbound := MessageOutbound{Message_id: queried_message_id, Sender_id: queried_sender_id, Sender_name: queried_sender_name, 
      Recipient_id: queried_recipient_id, Recipient_name: queried_recipient_name, Title: queried_title, 
      Contents: queried_contents, Creation_time: queried_creation_time, Last_update_time: queried_last_update_time}

    //add each outbound object to the collection outbound object
    messageCollectionOutbound.Messages = append(messageCollectionOutbound.Messages, &messageOutbound)
  }

  //json stringify the data
  jsonString, err := json.Marshal(messageCollectionOutbound)
  if err != nil {
    panic(err)
  }
  fmt.Println(string(jsonString))      

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.Write(jsonString)

}


