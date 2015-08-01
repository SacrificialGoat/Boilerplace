package main

import (
  "fmt"
  "net/http"
  "encoding/json"
  "database/sql"
  _ "github.com/go-sql-driver/mysql"
  "strconv"  
  "time"
)


//function to search for forum threads
//sortBy: sort by (does not apply to by thread id since by thread id is unique) - 0) rating, 1) datetime
func searchForForumThreads(w http.ResponseWriter, r *http.Request, db *sql.DB, sortBy int, pageNumber int, titleSearch string) {

  fmt.Println("Searching for forum threads...")

  //add headers to response
  addWriteHeaders(&w, r)

  //ignore options requests
  if handleOptionsRequests(w, r) == true {
    return
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

  if sortBy == 0 { //get by rating

    dbQuery = "select thread_id, forum_threads.user_id, title, body, post_count, rating, forum_threads.creation_time, forum_threads.last_update_time, user_name from forum_threads inner join users on forum_threads.user_id = users.user_id where title like '%" + titleSearch + "%' order by rating desc"

  } else { //get by creation time

    dbQuery = "select thread_id, forum_threads.user_id, title, body, post_count, rating, forum_threads.creation_time, forum_threads.last_update_time, user_name from forum_threads inner join users on forum_threads.user_id = users.user_id where title like '%" + titleSearch + "%' order by creation_time desc"

  }

  if pageNumber >= 1 {
    //only get 25 threads per query, and get records based on page number
    limit := 25
    offset := (pageNumber - 1) * limit 

    dbQuery += " limit " + strconv.Itoa(limit) + " offset " + strconv.Itoa(offset)
  }     

  //perform query and check for errors
  rows, err := db.Query(dbQuery)
  if err != nil {
    handleError(err, "Error performing query", w)
    return
  } 

  //outbound object containing a collection of outbound objects for each forum thread
  forumThreadCollectionOutbound := ForumThreadCollectionOutbound{ForumThreads: make([]*ForumThreadInfoOutbound, 0)}

  //iterate through results of query
  for rows.Next() {
    //get the relevant information from the query results
    err = rows.Scan(&queried_thread_id, &queried_user_id, &queried_title, &queried_body, &queried_post_count, &queried_rating, &queried_creation_time, &queried_last_update_time, &queried_user_name)
    if err != nil {
      handleError(err, "Error while getting results of query", w)
      return
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
    handleError(err, "Error performing json stringify on object", w)
    return
  }
  fmt.Println(string(jsonString))      

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.Write(jsonString)

}


