package main

import (
  "fmt"
  "net/http"
  "flag"    
  "log"
  //"strings"
  //"go/build"
  //"path/filepath"
  //"html/template"   
  "database/sql"
  _ "github.com/go-sql-driver/mysql" 
  "github.com/gorilla/sessions"   
)

//"constant" variables to be used throughout the program
const (
  //database configuration information
  DB_USER = "root"
  DB_PASSWORD = ""
  DB_NAME = "virtual_arm"
)

//variables to be used throughout the program
var (
  //cookie information
  store = sessions.NewCookieStore([]byte("a-secret-string"))

  //server address information
  addr = flag.String("addr", ":8080", "http service address")  
)

func main() {
  flag.Parse()

  //open the database connection
  var db = initializeDB()
  defer db.Close() //defer closing the connection

  //create the game room
  var room = createGameRoom(1)
  go room.run()

  //serve static assets
  http.Handle("/", http.FileServer(http.Dir("../pub/build")))

  //TODO: make urls more RESTful


  //routes in auth.go

  //allow user to sign up
  http.HandleFunc("/createUser", func(w http.ResponseWriter, r *http.Request) {
    createUserHandler(w, r, db)
  })    

  //update user info
  http.HandleFunc("/updateUserInfo", func(w http.ResponseWriter, r *http.Request) {
    updateUserInfoHandler(w, r, db, store)
  })

  //get user info
  http.HandleFunc("/getUserInfo", func(w http.ResponseWriter, r *http.Request) {
    getUserInfoHandler(w, r, db, store)
  })

  //authenticate user
  http.HandleFunc("/authenticate", func(w http.ResponseWriter, r *http.Request) {
    loginHandler(w, r, db, store)
  })


  //routes in forum_threads.go

  //create forum thread
  http.HandleFunc("/createForumThread", func(w http.ResponseWriter, r *http.Request) {
    createForumThread(w, r, db, store)
  })

  //get forum threads by logged in user id sort by rating
  http.HandleFunc("/getForumThreadsByLoggedInUserIdByRating", func(w http.ResponseWriter, r *http.Request) {
    getForumThreadProtected(w, r, db, store, 0)
  })

  //get forum threads by logged in user id sort by time
  http.HandleFunc("/getForumThreadsByLoggedInUserIdByTime", func(w http.ResponseWriter, r *http.Request) {
    getForumThreadProtected(w, r, db, store, 1)
  })  

  //get forum threads by thread id
  http.HandleFunc("/getForumThreadsByThreadId", func(w http.ResponseWriter, r *http.Request) {
    getForumThread(w, r, db, 0, 0)
  })     

  //get forum threads by user id sort by rating
  http.HandleFunc("/getForumThreadsByUserIdByRating", func(w http.ResponseWriter, r *http.Request) {
    getForumThread(w, r, db, 1, 0)
  })

  //get forum threads by user id sort by datetime
  http.HandleFunc("/getForumThreadsByUserIdByTime", func(w http.ResponseWriter, r *http.Request) {
    getForumThread(w, r, db, 1, 1)
  })   

  //get all forum threads by rating
  http.HandleFunc("/getForumThreadsByRating", func(w http.ResponseWriter, r *http.Request) {
    getForumThread(w, r, db, 2, 0)
  })   

  //get all forum threads by datetime
  http.HandleFunc("/getForumThreadsByTime", func(w http.ResponseWriter, r *http.Request) {
    getForumThread(w, r, db, 2, 1)
  })      

  //upvote forum thread
  http.HandleFunc("/upvoteForumThread", func(w http.ResponseWriter, r *http.Request) {
    scoreForumThread(w, r, db, store, 1)
  })      

  //downvote forum thread
  http.HandleFunc("/downvoteForumThread", func(w http.ResponseWriter, r *http.Request) {
    scoreForumThread(w, r, db, store, -1)
  })


  //routes in thread_posts.go

  //create forum thread post
  http.HandleFunc("/createThreadPost", func(w http.ResponseWriter, r *http.Request) {
    createThreadPost(w, r, db, store)
  })

  //get posts by thread id sort by rating
  http.HandleFunc("/getThreadPostsByRating", func(w http.ResponseWriter, r *http.Request) {
    getThreadPost(w, r, db, 1, 0)
  })

  //get posts by thread id sort by datetime
  http.HandleFunc("/getThreadPostsByDatetime", func(w http.ResponseWriter, r *http.Request) {
    getThreadPost(w, r, db, 1, 1)
  })   

  //upvote thread post
  http.HandleFunc("/upvoteThreadPost", func(w http.ResponseWriter, r *http.Request) {
    scoreThreadPost(w, r, db, store, 1)
  })      

  //downvote thread post
  http.HandleFunc("/downvoteThreadPost", func(w http.ResponseWriter, r *http.Request) {
    scoreThreadPost(w, r, db, store, -1)
  })  


  //routes in users.go

  //get user info by user id
  http.HandleFunc("/getUserInfoByUserId", func(w http.ResponseWriter, r *http.Request) {
    getUserInfo(w, r, db, 0)
  })

  //get user info by username
  http.HandleFunc("/getUserInfoByUsername", func(w http.ResponseWriter, r *http.Request) {
    getUserInfo(w, r, db, 1)
  })


  //routes for sockets

  //listen for player connection
  http.HandleFunc("/connect", func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("trying to connect websocket")
    connect(w, r, room, store)
  })



  //listen on specified port
  fmt.Println("Server starting")
  err := http.ListenAndServe(*addr, nil)
  if err != nil {
    log.Fatal("ListenAndServe:", err)
  }
}

//function to open connection with database
func initializeDB() *sql.DB {
  db, err := sql.Open("mysql",  DB_USER + ":" + DB_PASSWORD + "@/" + DB_NAME + "?parseTime=true")
  if err != nil {
    panic(err)
  } 

  return db
}

//handle the connect event which checks if the cookie corresponds to a logged in user
//and creates the player in the game
//TODO: Return correct status and message if session is invalid
func connect(w http.ResponseWriter, r *http.Request, room *GameRoom, store *sessions.CookieStore) {

  //check for session to see if client is authenticated
  session, err := store.Get(r, "flash-session")
  if err != nil {
    http.Error(w, err.Error(), http.StatusInternalServerError)
  }
  fm := session.Flashes("message")
  if fm == nil {
    fmt.Println("Trying to log in as invalid user")
    fmt.Fprint(w, "No flash messages")
    return
  }
  //session.Save(r, w)

  fmt.Println("New user connected")

  //use the id and username attached to the session to create the player
  playerHandler := PlayerHandler{Id: session.Values["userid"].(int), Username: session.Values["username"].(string), Room: room}

  playerHandler.createPlayer(w, r)
}
