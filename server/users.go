package main

import (
  "fmt"
  "net/http"
  "encoding/json"
  "database/sql"
  _ "github.com/go-sql-driver/mysql"
  "strconv"
)


//function to get user info
func getUserInfo(w http.ResponseWriter, r *http.Request, db *sql.DB, option int, userid int, username string) {

  fmt.Println("Getting user info...")

  //add headers to response
  addWriteHeaders(&w, r)

  //ignore options requests
  if handleOptionsRequests(w, r) == true {
    return
  }

  //variable(s) to hold the returned values from the query
  var (
    queried_user_id int
    queried_user_name string
    queried_first_name string
    queried_last_name string
    queried_bio string
    queried_rep int
    queried_avatar_link string
  )

  //change query based on option
  var dbQuery string 
  if option == 0 { //get the user info by userid
    dbQuery = "select user_id, user_name, first_name, last_name, bio, rep, avatar_link from users where user_id = " + strconv.Itoa(userid)
  } else { //get the user info by username
    dbQuery = "select user_id, user_name, first_name, last_name, bio, rep, avatar_link from users where user_name = '" + username + "'"
  }

  //query the database for the user info
  err := db.QueryRow(dbQuery).Scan(&queried_user_id, &queried_user_name, &queried_first_name, &queried_last_name, &queried_bio, &queried_rep, &queried_avatar_link)
  switch {

    //if user doesn't exist 
    case err == sql.ErrNoRows:
      handleError(err, "User cannot be found", w)
      break

    //if error querying database  
    case err != nil:
      handleError(err, "Error querying database", w)
      break

    //if user exists  
    default:

      //create outbound object
      userInfoOutbound := UserInfoOutbound{User_id: queried_user_id, User_name: queried_user_name, First_name: queried_first_name, Last_name: queried_last_name, 
        Bio: queried_bio, Rep: queried_rep, Avatar_link: queried_avatar_link}

      //json stringify the data
      jsonString, err := json.Marshal(userInfoOutbound)
      if err != nil {
        handleError(err, "Error performing json stringify on object", w)
        return
      }
      fmt.Println(string(jsonString))      

      //return 200 status to indicate success
      fmt.Println("about to write 200 header")
      w.Write(jsonString)
      break

  }  

}

