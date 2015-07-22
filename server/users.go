package main

import (
  //"crypto/md5"
  "fmt"
  //"io"
  "log"
  "net/http"
  //"strings"
  "encoding/json"
  "io/ioutil"
  "database/sql"
  _ "github.com/go-sql-driver/mysql"
  "strconv"
)


//TODO: handle panics/errors, as unhandled panics/errors will shut down the server


//function to get user info
//TODO: Return correct status and message if update failed
func getUserInfo(w http.ResponseWriter, r *http.Request, db *sql.DB, option int) {

  fmt.Println("Getting user info...")

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
    userid := int(dat["user_id"].(float64))

    dbQuery = "select user_id, user_name, first_name, last_name, bio, rep, avatar_link from users where user_id = " + strconv.Itoa(userid)
  } else { //get the user info by username
    username := dat["user_name"].(string)

    dbQuery = "select user_id, user_name, first_name, last_name, bio, rep, avatar_link from users where user_name = '" + username + "'"
  }

  //query the database for the user info
  err = db.QueryRow(dbQuery).Scan(&queried_user_id, &queried_user_name, &queried_first_name, &queried_last_name, &queried_bio, &queried_rep, &queried_avatar_link)
  switch {

    //if user doesn't exist 
    case err == sql.ErrNoRows:
      //return 400 status to indicate error
      fmt.Println("about to write 400 header")
      fmt.Println("User cannot be found")     
      w.Write([]byte(fmt.Sprintf("User cannot be found"))) 
      break

    //if error querying database  
    case err != nil:
      log.Fatal(err)
      //return 400 status to indicate error
      fmt.Println("about to write 400 header")
      w.Write([]byte(fmt.Sprintf("Error querying database")))  
      break

    //if user exists  
    default:

      //create outbound object
      userInfoOutbound := UserInfoOutbound{User_id: queried_user_id, User_name: queried_user_name, First_name: queried_first_name, Last_name: queried_last_name, 
        Bio: queried_bio, Rep: queried_rep, Avatar_link: queried_avatar_link}

      //json stringify the data
      jsonString, err := json.Marshal(userInfoOutbound)
      if err != nil {
        panic(err)
      }
      fmt.Println(string(jsonString))      

      //return 200 status to indicate success
      fmt.Println("about to write 200 header")
      w.Write(jsonString)
      break

  }  

}

