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
func createThreadPost(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore) { 

  fmt.Println("Creating forum thread post...")

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
  thread_id := int(dat["thread_id"].(float64))
  post_contents := dat["contents"].(string)

  //insert forum thread post into database
  stmt, err := db.Prepare("insert into thread_posts (thread_id, user_id, contents) values (?, ?, ?)")
  if err != nil {
    log.Fatal(err)
  }
  res, err := stmt.Exec(thread_id, userid, post_contents)
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
  fmt.Printf("Inserted forum post into forum thread " + strconv.Itoa(thread_id) + ". Last inserted ID = %d, rows affected = %d\n", lastId, rowCnt)

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.Write([]byte("{\"post_id\" : " + strconv.FormatInt(lastId, 10) + "}"))
}


//option: query by - 0) post id, 1) thread id, 2) user id, 3) all
//sortBy: sort by (does not apply to by post id since by post id is unique) - 0) rating, 1) datetime
//TODO: Return correct status and message if query failed
func getThreadPost(w http.ResponseWriter, r *http.Request, db *sql.DB, option int, sortBy int, pageNumber int, id int) {

  fmt.Println("Getting forum thread post...")

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
    queried_post_id int
    queried_thread_id int
    queried_user_id int
    queried_user_name string
    queried_contents string
    queried_rating int
    queried_creation_time time.Time
    queried_last_update_time time.Time
  )

  //change query based on option
  var dbQuery string 

  if option == 0 { //query by post id

    dbQuery = "select post_id, thread_id, thread_posts.user_id, contents, rating, thread_posts.creation_time, thread_posts.last_update_time, user_name from thread_posts inner join users on thread_posts.user_id = users.user_id where post_id = " + strconv.Itoa(id)
  
  } else if option == 1 { //query by thread id

    //only get 25 threads per query, and get records based on page number
    limit := 25
    offset := (pageNumber - 1) * limit  

    if sortBy == 0 { //get by rating

      dbQuery = "select post_id, thread_id, thread_posts.user_id, contents, rating, thread_posts.creation_time, thread_posts.last_update_time, user_name from thread_posts inner join users on thread_posts.user_id = users.user_id where thread_id = " + strconv.Itoa(id) + " order by rating desc limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)

    } else { //get by creation time

      dbQuery = "select post_id, thread_id, thread_posts.user_id, contents, rating, thread_posts.creation_time, thread_posts.last_update_time, user_name from thread_posts inner join users on thread_posts.user_id = users.user_id where thread_id = " + strconv.Itoa(id)  + " order by creation_time desc limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)

    }

  } else if option == 2 { //query by user id

    //only get 25 threads per query, and get records based on page number
    limit := 25
    offset := (pageNumber - 1) * limit   

    if sortBy == 0 { //get by rating

      dbQuery = "select post_id, thread_id, thread_posts.user_id, contents, rating, thread_posts.creation_time, thread_posts.last_update_time, user_name from thread_posts inner join users on thread_posts.user_id = users.user_id where thread_posts.user_id = " + strconv.Itoa(id) + " order by rating desc limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)

    } else { //get by creation time

      dbQuery = "select post_id, thread_id, thread_posts.user_id, contents, rating, thread_posts.creation_time, thread_posts.last_update_time, user_name from thread_posts inner join users on thread_posts.user_id = users.user_id where thread_posts.user_id = " + strconv.Itoa(id)  + " order by creation_time desc limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)

    }

  } else { //query all

    //only get 25 threads per query, and get records based on page number
    limit := 25
    offset := (pageNumber - 1) * limit  

    if sortBy == 0 { //get by rating

      dbQuery = "select post_id, thread_id, thread_posts.user_id, contents, rating, thread_posts.creation_time, thread_posts.last_update_time, user_name from thread_posts inner join users on thread_posts.user_id = users.user_id order by rating desc limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)

    } else { //get by creation time

      dbQuery = "select post_id, thread_id, thread_posts.user_id, contents, rating, thread_posts.creation_time, thread_posts.last_update_time, user_name from thread_posts inner join users on thread_posts.user_id = users.user_id order by creation_time desc limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)

    }

  }

  //perform query and check for errors
  //TODO: ignore norows error??
  rows, err := db.Query(dbQuery)
  if err != nil {
    panic(err)
  } 

  //outbound object containing a collection of outbound objects for each forum thread
  threadPostCollectionOutbound := ThreadPostCollectionOutbound{ThreadPosts: make([]*ThreadPostInfoOutbound, 0)}

  //iterate through results of query
  for rows.Next() {
    //get the relevant information from the query results
    err = rows.Scan(&queried_post_id, &queried_thread_id, &queried_user_id, &queried_contents, &queried_rating, &queried_creation_time, &queried_last_update_time, &queried_user_name)
    if err != nil {
      panic(err)
    }

    //create outbound object for each row
    threadPostInfoOutbound := ThreadPostInfoOutbound{Post_id: queried_post_id, Thread_id: queried_thread_id, User_id: queried_user_id, User_name: queried_user_name, 
      Contents: queried_contents, Rating: queried_rating, Creation_time: queried_creation_time, Last_update_time: queried_last_update_time}

    //add each outbound object to the collection outbound object
    threadPostCollectionOutbound.ThreadPosts = append(threadPostCollectionOutbound.ThreadPosts, &threadPostInfoOutbound)
  }

  //json stringify the data
  jsonString, err := json.Marshal(threadPostCollectionOutbound)
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
func scoreThreadPost(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore, option int, post_id int) {

  fmt.Println("Score thread post...")

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
    fmt.Println("Trying to vote on forum thread post as an invalid user")
    fmt.Fprint(w, "No flash messages")
    return
  }
  //session.Save(r, w)

  //get the user id and username from the cookie
  userid := session.Values["userid"].(int)
  //username := session.Values["username"].(string)  

  //variable(s) to hold the returned values from the query
  var (
    queried_score int
  )

  //query the post_votes table for the post id and user id
  err = db.QueryRow("select score from post_votes where post_id = ? and user_id = ?", post_id, userid).Scan(&queried_score)
  switch {

    //if record doesn't exist   
    case err == sql.ErrNoRows:
      //insert a new row to indicate that the user has voted for the post
      stmt, err := db.Prepare("insert into post_votes (post_id, user_id, score) values (?, ?, ?)")
      if err != nil {
        log.Fatal(err)
      }
      res, err := stmt.Exec(post_id, userid, option)
      if err != nil {
        log.Fatal(err)
      }
      fmt.Printf("Inserted record into post_votes table.\n")

      //update the forum post by the score
      stmt, err = db.Prepare("update thread_posts set rating = rating + ? where post_id = ?")
      if err != nil {
        log.Fatal(err)
      }
      res, err = stmt.Exec(option, post_id)
      if err != nil {
        log.Fatal(err)
      }
      rowCnt, err := res.RowsAffected()
      if err != nil {
        log.Fatal(err)
      }
      fmt.Printf("Updated score of thread post " + strconv.Itoa(post_id) + ". Rows affected = %d\n", rowCnt)      

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
        //update post_votes table for the post id and user id
        stmt, err := db.Prepare("update post_votes set score = ? where post_id = ? and user_id = ?")
        if err != nil {
          log.Fatal(err)
        }
        _, err = stmt.Exec(queried_score + option, post_id, userid)
        if err != nil {
          log.Fatal(err)
        }
        fmt.Printf("Updated record in post_votes table.\n")
      } else
      {
        //return 400 status to indicate error
        fmt.Println("about to write 400 header")
        fmt.Println("Cannot upvote twice or downvote twice")     
        w.Write([]byte(fmt.Sprintf("Cannot upvote twice or downvote twice")))   
        return
      }

      //update the forum thread post by the score
      stmt, err := db.Prepare("update thread_posts set rating = rating + ? where post_id = ?")
      if err != nil {
        log.Fatal(err)
      }
      res, err := stmt.Exec(option, post_id)
      if err != nil {
        log.Fatal(err)
      }
      rowCnt, err := res.RowsAffected()
      if err != nil {
        log.Fatal(err)
      }
      fmt.Printf("Updated score of thread post " + strconv.Itoa(post_id) + ". Rows affected = %d\n", rowCnt)

      //return 200 status to indicate success
      fmt.Println("about to write 200 header")
      w.WriteHeader(http.StatusOK)
      
      break
  }

}

