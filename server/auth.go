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
  "golang.org/x/crypto/bcrypt"
  "github.com/gorilla/sessions"   
  //"strconv"
)


//TODO: handle panics/errors, as unhandled panics/errors will shut down the server


//function that adds a user to the database
//TODO: fix all Writes to respond to the clients with the correct status
func createUserHandler (w http.ResponseWriter, r *http.Request, db *sql.DB) {

  fmt.Println("Signing up user...")

  //add headers to response
  w.Header()["Access-Control-Allow-Origin"] = []string{"http://localhost:8080"} //TODO: fix this? refer to http://stackoverflow.com/questions/12830095/setting-http-headers-in-golang??
  w.Header()["access-control-allow-methods"] = []string{"GET, POST, OPTIONS"}
  w.Header()["content-type"] = []string{"application/json"}

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
  
  //parse the JSON string body to get the username, password, firstname, and lastname
  byt := body
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    panic(err)
  }
  username := dat["username"].(string)
  password := dat["password"].(string)
  first := dat["firstname"].(string)
  last := dat["lastname"].(string)

  //if any of the above fields are blank, return an error saying so
  for key, value := range dat {
    if value == "" {
      fmt.Println("about to write 400 header")
      w.Write([]byte(fmt.Sprintf("Enter information for ", key)))
      return
    }
  }

  //variable(s) to hold the returned values from the query
  var (
    queried_username string
  )

  //query the database for the username
  err = db.QueryRow("select user_name from users where user_name = ?", username).Scan(&queried_username)
  switch {

    //if username doesn't exist
    case err == sql.ErrNoRows:
      //hash the password
      hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
      if err != nil {
        fmt.Println(err)
      }
      fmt.Println("hash is ", string(hash))

      //add username, password, firstname, and lastname to database
      stmt, err := db.Prepare("insert into users (user_name, first_name, last_name, password_hash) values (?, ?, ?, ?)")
      if err != nil {
        log.Fatal(err)
      }
      res, err := stmt.Exec(username, first, last, string(hash))
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
      fmt.Printf("Inserted user " + username + " into database. Last inserted ID = %d, rows affected = %d\n", lastId, rowCnt)

      //create session for signed up player
      session, err := store.Get(r, "flash-session")
      if err != nil {
        http.Error(w, err.Error(), http.StatusInternalServerError)
      }
      session.Values["userid"] = int(lastId)
      session.Values["username"] = username   
      session.AddFlash("This is a flashed message!", "message")
      session.Save(r, w) 
      
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
    
    //if username exists
    default:
      //return 400 status to indicate error
      fmt.Println("about to write 400 header")
      w.Write([]byte(fmt.Sprintf("Username is already taken")))
      break

  } 

}

//function that updates info for a user
//TODO: Return correct status and message if session is invalid
//TODO: Return correct status and message if update failed
func updateUserInfoHandler(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore) { 

  fmt.Println("Updating user info...")

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
    fmt.Println("Trying to update user profile as invalid user")
    fmt.Fprint(w, "No flash messages")
    return
  }
  //session.Save(r, w)

  //get the user id and username from the cookie
  userid := session.Values["userid"].(int)
  username := session.Values["username"].(string)

  //parse the body of the request into a string
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    panic(err)
  }
  //fmt.Println(string(body))
  
  //parse the JSON string body to get the bio and avatar_link
  byt := body
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    panic(err)
  }
  bio := dat["bio"].(string)
  avatar_link := dat["avatar_link"].(string)

  //update user's bio and avatar_link
  stmt, err := db.Prepare("update users set bio = ?, avatar_link = ? where user_id = ?")
  if err != nil {
    log.Fatal(err)
  }
  res, err := stmt.Exec(bio, avatar_link, userid)
  if err != nil {
    log.Fatal(err)
  }
  rowCnt, err := res.RowsAffected()
  if err != nil {
    log.Fatal(err)
  }
  fmt.Printf("Updated user " + username + " in users table. Rows affected = %d\n", rowCnt)

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.WriteHeader(http.StatusOK)

}

//function to get user info
//TODO: Return correct status and message if session is invalid
//TODO: Return correct status and message if update failed
func getUserInfoHandler(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore) {

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

  //check for session to see if client is authenticated
  session, err := store.Get(r, "flash-session")
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
  }
  fm := session.Flashes("message")
  if fm == nil {
    fmt.Println("Trying to update user profile as invalid user")
    fmt.Fprint(w, "No flash messages")
    return
  }
  //session.Save(r, w)

  //get the user id and username from the cookie
  userid := session.Values["userid"].(int)
  username := session.Values["username"].(string)

  //variable(s) to hold the returned values from the query
  var (
    queried_first_name string
    queried_last_name string
    queried_bio string
    queried_rep int
    queried_avatar_link string
  )

  //query the database for the user info
  err = db.QueryRow("select first_name, last_name, bio, rep, avatar_link from users where user_id = ?", userid).Scan(&queried_first_name, &queried_last_name, &queried_bio, &queried_rep, &queried_avatar_link)
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
      userInfoOutbound := UserInfoOutbound{User_id: userid, User_name: username, First_name: queried_first_name, Last_name: queried_last_name, 
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

//function that authenticates/signs in user
//TODO: fix all Writes to respond to the clients with the correct status
//TODO: handle logging in when a session is already assigned to client
func loginHandler(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore) {

  fmt.Println("Authenticating user...")

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

  //parse the JSON string body to get the username and password
  byt := body
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    panic(err)
  }
  username := dat["username"].(string)
  password := dat["password"].(string)

  //variable(s) to hold the returned values from the query
  var (
    queried_user_id int
    queried_password_hash string
  )

  //query the database for the username
  err = db.QueryRow("select user_id, password_hash from users where user_name = ?", username).Scan(&queried_user_id, &queried_password_hash)
  switch {

    //if username doesn't exist   
    case err == sql.ErrNoRows:
      //return 400 status to indicate error
      fmt.Println("about to write 400 header")
      fmt.Println("Username cannot be found")     
      w.Write([]byte(fmt.Sprintf("Username cannot be found"))) 
      break

    //if error querying database  
    case err != nil:
      log.Fatal(err)
      //return 400 status to indicate error
      fmt.Println("about to write 400 header")
      w.Write([]byte(fmt.Sprintf("Error querying database")))  
      break

    //if username exists  
    default:
      //fmt.Println("Retrieved User Id is %d\n", queried_user_id)
      //fmt.Println("Retrieved Password is %s\n", queried_password_hash)

      //compare the retrieved password to the password sent by the client
      err := bcrypt.CompareHashAndPassword([]byte(queried_password_hash), []byte(password))
      if err != nil { 
        //password not a match

        //return 400 status to indicate error
        fmt.Println("about to write 400 header")
        fmt.Println("Password incorrect")     
        w.Write([]byte(fmt.Sprintf("Password incorrect")))     
      } else { 
        //user is authorized

        //create session
        session, err := store.Get(r, "flash-session")
        if err != nil {
          http.Error(w, err.Error(), http.StatusInternalServerError)
        }
        session.Values["userid"] = queried_user_id
        session.Values["username"] = username
        session.AddFlash("This is a flashed message!", "message")
        session.Save(r, w)

        //return 200 status to indicate success
        fmt.Println("about to write 200 header")
        fmt.Println("password correct") 
        w.WriteHeader(http.StatusOK)
      }
      break

  }

}

