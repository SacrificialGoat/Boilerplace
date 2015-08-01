package main

import (
  "fmt"
  "net/http"
  "encoding/json"
  "database/sql"
  _ "github.com/go-sql-driver/mysql"
  "golang.org/x/crypto/bcrypt"
  "github.com/gorilla/sessions"   
)


//function that adds a user to the database
func createUserHandler (w http.ResponseWriter, r *http.Request, db *sql.DB) {

  fmt.Println("Signing up user...")

  //add headers to response
  addWriteHeaders(&w, r)

  //ignore options requests
  if handleOptionsRequests(w, r) == true {
    return
  }

  //parse the request body into a map
  dat, ok := parseJsonRequest(w, r)
  if ok == false {
    return
  }

  //get user info
  username := dat["username"].(string)
  password := dat["password"].(string)
  first := dat["firstname"].(string)
  last := dat["lastname"].(string)

  //if any of the above fields are blank, return an error saying so
  for key, value := range dat {
    if value == "" {
      fmt.Println("Missing information for " + key)
      w.Header()["Content-Type"] = []string{"text/html"}
      w.Write([]byte(fmt.Sprintf("Missing information for " + key)))     
      return   
    }
  }

  //variable(s) to hold the returned values from the query
  var (
    queried_username string
  )

  //query the database for the username
  err := db.QueryRow("select user_name from users where user_name = ?", username).Scan(&queried_username)
  switch {

    //if username doesn't exist
    case err == sql.ErrNoRows:
      //hash the password
      hash, err := bcrypt.GenerateFromPassword([]byte(password), 10)
      if err != nil {
        handleError(err, "Error hashing password", w)
        return 
      }
      fmt.Println("hash is ", string(hash))

      //add username, password, firstname, and lastname to database
      stmt, err := db.Prepare("insert into users (user_name, first_name, last_name, password_hash) values (?, ?, ?, ?)")
      if err != nil {
        handleError(err, "Error preparing query", w)
        return   
      }
      res, err := stmt.Exec(username, first, last, string(hash))
      if err != nil {
        handleError(err, "Error executing query", w)
        return 
      }
      lastId, err := res.LastInsertId()
      if err != nil {
        handleError(err, "Error getting last inserted id", w)
        return 
      }
      rowCnt, err := res.RowsAffected()
      if err != nil {
        handleError(err, "Error getting rows affected", w)
        return 
      }
      fmt.Printf("Inserted user %s into database. Last inserted ID = %d, rows affected = %d\n", username, lastId, rowCnt)

      //create session for signed up player
      session, err := store.Get(r, "flash-session")
      if err != nil {
        handleError(err, "Error creating session", w)
        return 
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
      handleError(err, "Error querying database", w)
      break
    
    //if username exists
    default:
      handleError(err, "Username is already taken", w)
      break

  } 

}

//function that updates info for a user
func updateUserInfoHandler(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore) { 

  fmt.Println("Updating user info...")

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
  username := session.Values["username"].(string)

  //parse the request body into a map
  var dat map[string]interface{}
  dat, ok = parseJsonRequest(w, r)
  if ok == false {
    return
  }

  //get user info to update
  bio := dat["bio"].(string)
  avatar_link := dat["avatar_link"].(string)

  //update user's bio and avatar_link
  stmt, err := db.Prepare("update users set bio = ?, avatar_link = ? where user_id = ?")
  if err != nil {
    handleError(err, "Error preparing query", w)
    return
  }
  res, err := stmt.Exec(bio, avatar_link, userid)
  if err != nil {
    handleError(err, "Error executing query", w)
    return
  }
  rowCnt, err := res.RowsAffected()
  if err != nil {
    handleError(err, "Error getting rows affected", w)
    return
  }
  fmt.Printf("Updated user " + username + " in users table. Rows affected = %d\n", rowCnt)

  //return 200 status to indicate success
  fmt.Println("about to write 200 header")
  w.WriteHeader(http.StatusOK)

}

//function to get user info
func getUserInfoHandler(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore) {

  fmt.Println("Getting user info...")

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
  err := db.QueryRow("select first_name, last_name, bio, rep, avatar_link from users where user_id = ?", userid).Scan(&queried_first_name, &queried_last_name, &queried_bio, &queried_rep, &queried_avatar_link)
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
      userInfoOutbound := UserInfoOutbound{User_id: userid, User_name: username, First_name: queried_first_name, Last_name: queried_last_name, 
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

//function that authenticates/signs in user
func loginHandler(w http.ResponseWriter, r *http.Request, db *sql.DB, store *sessions.CookieStore) {

  fmt.Println("Authenticating user...")

  //add headers to response
  addWriteHeaders(&w, r)

  //ignore options requests
  if handleOptionsRequests(w, r) == true {
    return
  }

  //parse the request body into a map
  dat, ok := parseJsonRequest(w, r)
  if ok == false {
    return
  }

  //get username and password
  username := dat["username"].(string)
  password := dat["password"].(string)

  //variable(s) to hold the returned values from the query
  var (
    queried_user_id int
    queried_password_hash string
  )

  //query the database for the username
  err := db.QueryRow("select user_id, password_hash from users where user_name = ?", username).Scan(&queried_user_id, &queried_password_hash)
  switch {

    //if username doesn't exist   
    case err == sql.ErrNoRows:
      handleError(err, "Username cannot be found", w)
      break

    //if error querying database  
    case err != nil:
      handleError(err, "Error querying database", w)
      break

    //if username exists  
    default:
      //fmt.Println("Retrieved User Id is %d\n", queried_user_id)
      //fmt.Println("Retrieved Password is %s\n", queried_password_hash)

      //compare the retrieved password to the password sent by the client
      err := bcrypt.CompareHashAndPassword([]byte(queried_password_hash), []byte(password))
      if err != nil { 
        //password not a match
        handleError(err, "Password incorrect", w)
      } else { 
        //user is authorized

        //create session
        session, err := store.Get(r, "flash-session")
        if err != nil {
          handleError(err, "Error creating session", w)
          return 
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

