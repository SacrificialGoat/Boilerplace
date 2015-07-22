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


//TODO: handle panics/errors, as unhandled panics/errors will shut down the server
//TODO: make a checkerr function
//TODO: put duplicated code into functions


//TODO: Return correct status and message if session is invalid
//TODO: Return correct status and message if insert failed
//TODO: format retrieved datetime to javascript datetime
func createForumThread(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore) { 

  fmt.Println("Creating forum thread...")

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

  //get the user id and username from the cookie
  userid := session.Values["userid"].(int)
  //username := session.Values["username"].(string)

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
  thread_title := dat["title"].(string)
  thread_body := dat["body"].(string)

  //insert forum thread into database
  stmt, err := db.Prepare("insert into forum_threads (user_id, title, body) values (?, ?, ?)")
  if err != nil {
    log.Fatal(err)
  }
  res, err := stmt.Exec(userid, thread_title, thread_body)
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
  fmt.Printf("Inserted thread " + thread_title + " into database. Last inserted ID = %d, rows affected = %d\n", lastId, rowCnt)

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.Write([]byte("{\"thread_id\" : " + strconv.FormatInt(lastId, 10) + "}"))
}

//option: 0 - by user id, 1 - by rating, 2 - by datetime, 3 - by thread id
//TODO: Return correct status and message if session is invalid
//TODO: Return correct status and message if query failed
func getForumThread(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore, option int) {

  fmt.Println("Getting forum thread...")

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

  //parse the body of the request into a string
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    panic(err)
  }
  //fmt.Println(string(body))
  
  //parse the JSON string body
  byt := body
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    panic(err)
  }

  //variable(s) to hold the returned values from the query
  var (
    queried_thread_id int
    queried_user_id int
    queried_user_name string
    queried_title string
    queried_body string    
    queried_post_count int
    queried_rating int
    queried_creation_time time.Time
    queried_last_update_time time.Time
  )

  //change query based on option
  var dbQuery string 
  if option == 0 { //find forum threads created by the user
    //get the user from the cookie
    userid := session.Values["userid"].(int)

    //get the page number from the JSON message
    page_number := int(dat["page_number"].(float64))

    //only get 25 threads per query, and get records based on page number
    limit := 25
    offset := (page_number - 1) * limit
    

    dbQuery = "select thread_id, forum_threads.user_id, title, body, post_count, rating, forum_threads.creation_time, forum_threads.last_update_time, user_name from forum_threads inner join users on forum_threads.user_id = users.user_id where forum_threads.user_id = " + strconv.Itoa(userid) + " limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)
  } else if option == 1 { //find the most popular forum threads
    //get the page number from the JSON message
    page_number := int(dat["page_number"].(float64))

    //only get 25 threads per query, and get records based on page number
    limit := 25
    offset := (page_number - 1) * limit

    dbQuery = "select thread_id, forum_threads.user_id, title, body, post_count, rating, forum_threads.creation_time, forum_threads.last_update_time, user_name from forum_threads inner join users on forum_threads.user_id = users.user_id order by rating desc limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)
  } else if option == 2 { //find the most recent forum threads
    //get the page number from the JSON message
    page_number := int(dat["page_number"].(float64))

    //only get 25 threads per query, and get records based on page number
    limit := 25
    offset := (page_number - 1) * limit

    dbQuery = "select thread_id, forum_threads.user_id, title, body, post_count, rating, forum_threads.creation_time, forum_threads.last_update_time, user_name from forum_threads inner join users on forum_threads.user_id = users.user_id order by creation_time desc limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)
  } else { //find forum thread by the thread id
    //get the thread id from the JSON message
    thread_id := int(dat["thread_id"].(float64))

    dbQuery = "select thread_id, forum_threads.user_id, title, body, post_count, rating, forum_threads.creation_time, forum_threads.last_update_time, user_name from forum_threads inner join users on forum_threads.user_id = users.user_id where thread_id = " + strconv.Itoa(thread_id)
  }

  //perform query and check for errors
  rows, err := db.Query(dbQuery)
  if err != nil {
    panic(err)
  } 

  //outbound object containing a collection of outbound objects for each forum thread
  forumThreadCollectionOutbound := ForumThreadCollectionOutbound{ForumThreads: make([]*ForumThreadInfoOutbound, 0)}

  //iterate through results of query
  for rows.Next() {
    //get the relevant information from the query results
    err = rows.Scan(&queried_thread_id, &queried_user_id, &queried_title, &queried_body, &queried_post_count, &queried_rating, &queried_creation_time, &queried_last_update_time, &queried_user_name)
    if err != nil {
      panic(err)
    }

    //create outbound object for each row
    forumThreadInfoOutbound := ForumThreadInfoOutbound{Thread_id: queried_thread_id, User_id: queried_user_id, User_name: queried_user_name, Title: queried_title,
      Body: queried_body, Post_count: queried_post_count, Rating: queried_rating, Creation_time: queried_creation_time, Last_update_time: queried_last_update_time}

    //add each outbound object to the collection outbound object
    forumThreadCollectionOutbound.ForumThreads = append(forumThreadCollectionOutbound.ForumThreads, &forumThreadInfoOutbound)
  }

  //json stringify the data
  jsonString, err := json.Marshal(forumThreadCollectionOutbound)
  if err != nil {
    panic(err)
  }
  fmt.Println(string(jsonString))      

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.Write(jsonString)

}


//TODO: Return correct status and message if session is invalid
//TODO: Return correct status and message if query failed
func scoreForumThread(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore, option int) {

  fmt.Println("Score forum thread...")

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
    fmt.Println("Trying to vote on forum thread as an invalid user")
    fmt.Fprint(w, "No flash messages")
    return
  }
  //session.Save(r, w)

  //get the user id and username from the cookie
  userid := session.Values["userid"].(int)
  //username := session.Values["username"].(string)  

  //parse the body of the request into a string
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    panic(err)
  }
  //fmt.Println(string(body))
  
  //parse the JSON string body to get the thread to update
  byt := body
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    panic(err)
  }
  thread_id := int(dat["thread_id"].(float64))

  //variable(s) to hold the returned values from the query
  var (
    queried_score int
  )

  //query the thread_votes table for the thread id and user id
  err = db.QueryRow("select score from thread_votes where thread_id = ? and user_id = ?", thread_id, userid).Scan(&queried_score)
  switch {

    //if record doesn't exist   
    case err == sql.ErrNoRows:
      //insert a new row to indicate that the user has voted for the thread
      stmt, err := db.Prepare("insert into thread_votes (thread_id, user_id, score) values (?, ?, ?)")
      if err != nil {
        log.Fatal(err)
      }
      res, err := stmt.Exec(thread_id, userid, option)
      if err != nil {
        log.Fatal(err)
      }
      fmt.Printf("Inserted record into thread_votes table.\n")

      //update the forum thread by the score
      stmt, err = db.Prepare("update forum_threads set rating = rating + ? where thread_id = ?")
      if err != nil {
        log.Fatal(err)
      }
      res, err = stmt.Exec(option, thread_id)
      if err != nil {
        log.Fatal(err)
      }
      rowCnt, err := res.RowsAffected()
      if err != nil {
        log.Fatal(err)
      }
      fmt.Printf("Updated score of thread " + strconv.Itoa(thread_id) + ". Rows affected = %d\n", rowCnt)      

      //return 200 status to indicate success
      fmt.Println("about to write 200 header")
      w.WriteHeader(http.StatusOK)

      break

    //if error querying database  
    case err != nil:
      log.Fatal(err)
      //return 400 status to indicate error
      fmt.Println("about to write 400 header")
      w.Write([]byte(fmt.Sprintf("Error querying database")))  
      break

    //if record exists
    default:
      if queried_score == -1 && option == 1 || queried_score == 0 && option == 1 || queried_score == 0 && option == -1  || queried_score == 1 && option == -1 {
        //update thread_votes table for the thread id and user id
        stmt, err := db.Prepare("update thread_votes set score = ? where thread_id = ? and user_id = ?")
        if err != nil {
          log.Fatal(err)
        }
        _, err = stmt.Exec(queried_score + option, thread_id, userid)
        if err != nil {
          log.Fatal(err)
        }
        fmt.Printf("Updated record in thread_votes table.\n")
      } else
      {
        //return 400 status to indicate error
        fmt.Println("about to write 400 header")
        fmt.Println("Cannot upvote twice or downvote twice")     
        w.Write([]byte(fmt.Sprintf("Cannot upvote twice or downvote twice")))   
        return
      }

      //update the forum thread by the score
      stmt, err := db.Prepare("update forum_threads set rating = rating + ? where thread_id = ?")
      if err != nil {
        log.Fatal(err)
      }
      res, err := stmt.Exec(option, thread_id)
      if err != nil {
        log.Fatal(err)
      }
      rowCnt, err := res.RowsAffected()
      if err != nil {
        log.Fatal(err)
      }
      fmt.Printf("Updated score of thread " + strconv.Itoa(thread_id) + ". Rows affected = %d\n", rowCnt)

      //return 200 status to indicate success
      fmt.Println("about to write 200 header")
      w.WriteHeader(http.StatusOK)
      
      break
  }

}


