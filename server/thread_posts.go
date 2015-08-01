package main

import (
  "fmt"
  "net/http"
  "encoding/json"
  "database/sql"
  _ "github.com/go-sql-driver/mysql"
  "github.com/gorilla/sessions"  
  "strconv"  
  "time"
)


//function to create a thread post
//TODO: format retrieved datetime to javascript datetime
func createThreadPost(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore) { 

  fmt.Println("Creating forum thread post...")

  //add headers to response
  addWriteHeaders(&w, r)

  //ignore options requests
  if handleOptionsRequests(w, r) == true {
    return
  }

  //check for session to see if client is authenticated
  ok, session := confirmSession(store, "Trying to perform action as an invalid user", w, r)
  if ok == false {
    return
  }

  //get the user id and username from the cookie
  userid := session.Values["userid"].(int)
  //username := session.Values["username"].(string)

  //parse the request body into a map
  var dat map[string]interface{}
  dat, ok = parseJsonRequest(w, r)
  if ok == false {
    return
  }

  //get thread post info
  thread_id := int(dat["thread_id"].(float64))
  post_contents := dat["contents"].(string)

  //insert forum thread post into database
  stmt, err := db.Prepare("insert into thread_posts (thread_id, user_id, contents) values (?, ?, ?)")
  if err != nil {
    handleError(err, "Error preparing query", w)
    return
  }
  res, err := stmt.Exec(thread_id, userid, post_contents)
  if err != nil {
    handleError(err, "Error executing query", w)
    return
  }
  lastId, err := res.LastInsertId()
  if err != nil {
    handleError(err, "Error getting last insert id", w)
    return
  }
  rowCnt, err := res.RowsAffected()
  if err != nil {
    handleError(err, "Error getting rows affected", w)
    return
  }
  fmt.Printf("Inserted forum post into forum thread %d. Last inserted ID = %d, rows affected = %d\n", thread_id, lastId, rowCnt)

  //update post count and last post time for the forum thread
  stmt, err = db.Prepare("update forum_threads set post_count = post_count + 1, last_post_time = NOW() where thread_id = ?")
  if err != nil {
    handleError(err, "Error preparing query", w)
    return
  }
  res, err = stmt.Exec(thread_id)
  if err != nil {
    handleError(err, "Error executing query", w)
    return
  }
  rowCnt, err = res.RowsAffected()
  if err != nil {
    handleError(err, "Error getting rows affected", w)
    return
  }
  fmt.Printf("Updated thread %d in forum_threads table. Rows affected = %d\n", thread_id, rowCnt)

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.Write([]byte("{\"post_id\" : " + strconv.FormatInt(lastId, 10) + "}"))
}

//function to retrieve thread posts
//option: query by - 0) post id, 1) thread id, 2) user id, 3) all
//sortBy: sort by (does not apply to by post id since by post id is unique) - 0) rating, 1) datetime
func getThreadPost(w http.ResponseWriter, r *http.Request, db *sql.DB, option int, sortBy int, pageNumber int, id int) {

  fmt.Println("Getting forum thread post...")

  //add headers to response
  addWriteHeaders(&w, r)

  //ignore options requests
  if handleOptionsRequests(w, r) == true {
    return
  }

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

    if sortBy == 0 { //get by rating

      dbQuery = "select post_id, thread_id, thread_posts.user_id, contents, rating, thread_posts.creation_time, thread_posts.last_update_time, user_name from thread_posts inner join users on thread_posts.user_id = users.user_id where thread_id = " + strconv.Itoa(id) + " order by rating desc"

    } else { //get by creation time

      dbQuery = "select post_id, thread_id, thread_posts.user_id, contents, rating, thread_posts.creation_time, thread_posts.last_update_time, user_name from thread_posts inner join users on thread_posts.user_id = users.user_id where thread_id = " + strconv.Itoa(id)  + " order by creation_time desc"

    }

    if pageNumber >= 1 {
      //only get 25 threads per query, and get records based on page number
      limit := 25
      offset := (pageNumber - 1) * limit 

      dbQuery += " limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)
    }       

  } else if option == 2 { //query by user id 

    if sortBy == 0 { //get by rating

      dbQuery = "select post_id, thread_id, thread_posts.user_id, contents, rating, thread_posts.creation_time, thread_posts.last_update_time, user_name from thread_posts inner join users on thread_posts.user_id = users.user_id where thread_posts.user_id = " + strconv.Itoa(id) + " order by rating desc"

    } else { //get by creation time

      dbQuery = "select post_id, thread_id, thread_posts.user_id, contents, rating, thread_posts.creation_time, thread_posts.last_update_time, user_name from thread_posts inner join users on thread_posts.user_id = users.user_id where thread_posts.user_id = " + strconv.Itoa(id)  + " order by creation_time desc"

    }

    if pageNumber >= 1 {
      //only get 25 threads per query, and get records based on page number
      limit := 25
      offset := (pageNumber - 1) * limit 

      dbQuery += " limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)
    }      

  } else { //query all

    if sortBy == 0 { //get by rating

      dbQuery = "select post_id, thread_id, thread_posts.user_id, contents, rating, thread_posts.creation_time, thread_posts.last_update_time, user_name from thread_posts inner join users on thread_posts.user_id = users.user_id order by rating desc"

    } else { //get by creation time

      dbQuery = "select post_id, thread_id, thread_posts.user_id, contents, rating, thread_posts.creation_time, thread_posts.last_update_time, user_name from thread_posts inner join users on thread_posts.user_id = users.user_id order by creation_time desc"

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
    handleError(err, "Error performing query", w)
    return
  } 

  //outbound object containing a collection of outbound objects for each forum thread
  threadPostCollectionOutbound := ThreadPostCollectionOutbound{ThreadPosts: make([]*ThreadPostInfoOutbound, 0)}

  //iterate through results of query
  for rows.Next() {
    //get the relevant information from the query results
    err = rows.Scan(&queried_post_id, &queried_thread_id, &queried_user_id, &queried_contents, &queried_rating, &queried_creation_time, &queried_last_update_time, &queried_user_name)
    if err != nil {
      handleError(err, "Error while getting results of query", w)
      return
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
    handleError(err, "Error performing json stringify on object", w)
    return
  }
  fmt.Println(string(jsonString))      

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.Write(jsonString)

}

//function to score a thread post
func scoreThreadPost(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore, option int, post_id int) {

  fmt.Println("Score thread post...")

  //add headers to response
  addWriteHeaders(&w, r)

  //ignore options requests
  if handleOptionsRequests(w, r) == true {
    return
  }

  //check for session to see if client is authenticated
  ok, session := confirmSession(store, "Trying to perform action as an invalid user", w, r)
  if ok == false {
    return
  }

  //get the user id and username from the cookie
  userid := session.Values["userid"].(int)
  //username := session.Values["username"].(string)  

  //variable(s) to hold the returned values from the query
  var (
    queried_score int
  )

  //query the post_votes table for the post id and user id
  err := db.QueryRow("select score from post_votes where post_id = ? and user_id = ?", post_id, userid).Scan(&queried_score)
  switch {

    //if record doesn't exist   
    case err == sql.ErrNoRows:
      //insert a new row to indicate that the user has voted for the post
      stmt, err := db.Prepare("insert into post_votes (post_id, user_id, score) values (?, ?, ?)")
      if err != nil {
        handleError(err, "Error preparing query", w)
        return
      }
      res, err := stmt.Exec(post_id, userid, option)
      if err != nil {
        handleError(err, "Error executing query", w)
        return
      }
      fmt.Printf("Inserted record into post_votes table.\n")

      //update the forum post by the score
      stmt, err = db.Prepare("update thread_posts set rating = rating + ? where post_id = ?")
      if err != nil {
        handleError(err, "Error preparing query", w)
        return
      }
      res, err = stmt.Exec(option, post_id)
      if err != nil {
        handleError(err, "Error executing query", w)
        return
      }
      rowCnt, err := res.RowsAffected()
      if err != nil {
        handleError(err, "Error getting rows affected", w)
        return
      }
      fmt.Printf("Updated score of thread post %d. Rows affected = %d\n", post_id, rowCnt)     

      //update rep of user who created post
      stmt, err = db.Prepare("update users inner join thread_posts on users.user_id = thread_posts.user_id set rep = rep + ? where thread_posts.post_id = ?")
      if err != nil {
        handleError(err, "Error preparing query", w)
        return
      }
      res, err = stmt.Exec(option, post_id)
      if err != nil {
        handleError(err, "Error executing query", w)
        return
      }
      rowCnt, err = res.RowsAffected()
      if err != nil {
        handleError(err, "Error getting rows affected", w)
        return
      }
      fmt.Printf("Updated rep of thread post creator. Rows affected = %d\n", rowCnt)       

      //return 200 status to indicate success
      fmt.Println("about to write 200 header")
      w.WriteHeader(http.StatusOK)

      break

    //if error querying database  
    case err != nil:
      handleError(err, "Error querying database", w)
      break

    //if record exists
    default:
      if queried_score == -1 && option == 1 || queried_score == 0 && option == 1 || queried_score == 0 && option == -1  || queried_score == 1 && option == -1 {
        //update post_votes table for the post id and user id
        stmt, err := db.Prepare("update post_votes set score = ? where post_id = ? and user_id = ?")
        if err != nil {
          handleError(err, "Error preparing query", w)
          return
        }
        _, err = stmt.Exec(queried_score + option, post_id, userid)
        if err != nil {
          handleError(err, "Error executing query", w)
          return
        }
        fmt.Printf("Updated record in post_votes table.\n")
      } else
      {
        handleError(err, "Cannot upvote twice or downvote twice", w)
        return
      }

      //update the forum thread post by the score
      stmt, err := db.Prepare("update thread_posts set rating = rating + ? where post_id = ?")
      if err != nil {
        handleError(err, "Error preparing query", w)
        return
      }
      res, err := stmt.Exec(option, post_id)
      if err != nil {
        handleError(err, "Error executing query", w)
        return
      }
      rowCnt, err := res.RowsAffected()
      if err != nil {
        handleError(err, "Error getting rows affected", w)
        return
      }
      fmt.Printf("Updated score of thread post " + strconv.Itoa(post_id) + ". Rows affected = %d\n", rowCnt)

      //update rep of user who created post
      stmt, err = db.Prepare("update users inner join thread_posts on users.user_id = thread_posts.user_id set rep = rep + ? where thread_posts.post_id = ?")
      if err != nil {
        handleError(err, "Error preparing query", w)
        return
      }
      res, err = stmt.Exec(option, post_id)
      if err != nil {
        handleError(err, "Error executing query", w)
        return
      }
      rowCnt, err = res.RowsAffected()
      if err != nil {
        handleError(err, "Error getting rows affected", w)
        return
      }
      fmt.Printf("Updated rep of thread post creator. Rows affected = %d\n", rowCnt)  

      //return 200 status to indicate success
      fmt.Println("about to write 200 header")
      w.WriteHeader(http.StatusOK)
      
      break
  }

}

//function to edit a thread post
func editThreadPost(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore) {

  fmt.Println("Edit thread post...")

  //add headers to response
  addWriteHeaders(&w, r)

  //ignore options requests
  if handleOptionsRequests(w, r) == true {
    return
  }

  //check for session to see if client is authenticated
  ok, session := confirmSession(store, "Trying to perform action as an invalid user", w, r)
  if ok == false {
    return
  }

  //get the user id and username from the cookie
  userid := session.Values["userid"].(int)     

  //parse the request body into a map
  var dat map[string]interface{}
  dat, ok = parseJsonRequest(w, r)
  if ok == false {
    return
  }

  //get info to update post with
  post_id := int(dat["post_id"].(float64))
  post_contents := dat["contents"].(string)

  var (
    queried_user_id int
  )  

  //don't edit the post if the user was not the one who created it
  err := db.QueryRow("select user_id from thread_posts where post_id = ?", post_id).Scan(&queried_user_id)
  switch {

    //if post doesn't exist 
    case err == sql.ErrNoRows:
      handleError(err, "Post cannot be found", w)
      return

    //if error querying database  
    case err != nil:
      handleError(err, "Error querying database", w)
      return

    //if post exists
    default:
      if queried_user_id != userid {
        handleError(err, "Cannot edit another user's post", w)
        return
      }
      break

  }     

  //update the forum thread post
  stmt, err := db.Prepare("update thread_posts set contents = ? where post_id = ?")
  if err != nil {
    handleError(err, "Error preparing query", w)
    return
  }
  res, err := stmt.Exec(post_contents, post_id)
  if err != nil {
    handleError(err, "Error executing query", w)
    return
  }
  rowCnt, err := res.RowsAffected()
  if err != nil {
    handleError(err, "Error getting rows affected", w)
    return
  }
  fmt.Printf("Updated contents of thread post " + strconv.Itoa(post_id) + ". Rows affected = %d\n", rowCnt)      

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.WriteHeader(http.StatusOK)

}

//function to delete a thread post
func deleteThreadPost(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore, id int) {

  fmt.Println("Delete thread post...")

  //add headers to response
  addWriteHeaders(&w, r)

  //ignore options requests
  if handleOptionsRequests(w, r) == true {
    return
  }

  //check for session to see if client is authenticated
  ok, session := confirmSession(store, "Trying to perform action as an invalid user", w, r)
  if ok == false {
    return
  }

  //get the user id and username from the cookie
  userid := session.Values["userid"].(int)   

  var (
    queried_user_id int
  )  

  //don't delete the post if the user was not the one who created it
  err := db.QueryRow("select user_id from thread_posts where post_id = ?", id).Scan(&queried_user_id)
  switch {

    //if post doesn't exist 
    case err == sql.ErrNoRows:
      handleError(err, "Post cannot be found", w)
      return

    //if error querying database  
    case err != nil:
      handleError(err, "Error querying database", w)
      return

    //if post exists
    default:
      if queried_user_id != userid {
        handleError(err, "Cannot delete another user's post", w)
        return
      }
      break

  }       

  //delete all votes related to the thread post
  stmt, err := db.Prepare("delete from post_votes where post_id = ?")

  if err != nil {
    handleError(err, "Error with query", w)
    return
  }
  res, err := stmt.Exec(id)
  if err != nil {
    handleError(err, "Error with query", w)
    return
  }
  rowCnt, err := res.RowsAffected()
  if err != nil {
    handleError(err, "Error with query", w)
    return
  }
  fmt.Printf("Deleted votes for forum thread post with id %d. Rows affected = %d\n", id, rowCnt)   

  //update post count for the forum thread
  stmt, err = db.Prepare("update forum_threads inner join thread_posts on forum_threads.thread_id = thread_posts.thread_id set post_count = post_count - 1 where thread_posts.post_id = ?")
  if err != nil {
    handleError(err, "Error with query", w)
    return
  }
  res, err = stmt.Exec(id)
  if err != nil {
    handleError(err, "Error with query", w)
    return
  }
  rowCnt, err = res.RowsAffected()
  if err != nil {
    handleError(err, "Error with query", w)
    return
  }
  fmt.Printf("Decremented post count in forum_threads table. Rows affected = %d\n", rowCnt)  

  //delete the forum thread post
  stmt, err = db.Prepare("delete from thread_posts where post_id = ?")
  if err != nil {
    handleError(err, "Error with query", w)
    return
  }
  res, err = stmt.Exec(id)
  if err != nil {
    handleError(err, "Error with query", w)
    return
  }
  rowCnt, err = res.RowsAffected()
  if err != nil {
    handleError(err, "Error with query", w)
    return
  }
  fmt.Printf("Deleted thread post %d. Rows affected = %d\n", id, rowCnt)  

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.WriteHeader(http.StatusOK)

}

