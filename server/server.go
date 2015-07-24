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
  "net/url"
  "strconv"
  "strings"
)

//"constant" variables to be used throughout the program
const (
  //database configuration information
  DB_USER = "root"
  DB_PASSWORD = ""
  DB_NAME = "virtual_arm"

  //int to represent an invalid selection
  INVALID_INT = -9999
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
  //var room = createGameRoom(1)
  //go room.run()


  //serve static assets
  http.Handle("/", http.FileServer(http.Dir("../pub/build")))


  //TODO: make urls more RESTful


  //routes in auth.go

//GET:
//getUserInfo                                 profile/
//POST:
//updateUserInfo                              profile                        body: {"bio" : bio, "avatar_link" : avatar_link}
  http.HandleFunc("/profile/", func(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
      case "GET":

        getUserInfoHandler(w, r, db, store)

        break 
      case "POST":

        updateUserInfoHandler(w, r, db, store)

        break  
      case "PUT":
        break  
      case "DELETE":
        break  
      default:
        break
    }
  })

//POST:
//createUser                                   users                          body: {"username" : username, "password" : password, "firstname" : firstname, "lastname" : lastname}
  http.HandleFunc("/users/", func(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
      case "GET":
        break 
      case "POST":

        createUserHandler(w, r, db)

        break  
      case "PUT":
        break  
      case "DELETE":
        break  
      default:
        break
    }
  })

//POST:
//authenticate                                 authenticate                   body: {"username" : username, "password" : password}  
  http.HandleFunc("/authenticate/", func(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
      case "GET":
        break 
      case "POST":

        loginHandler(w, r, db, store)

        break  
      case "PUT":
        break  
      case "DELETE":
        break  
      default:
        break
    }
  }) 


  //routes in forum_threads.go

//GET:
//getForumThreadByThreadId                     thread/ id
//POST:
//upvoteForumThread                            thread/XidX/?upvote=true       //id in url so don't need body
//downvoteForumThread                          thread/XidX/?downvote=true     //id in url so don't need body
  http.HandleFunc("/thread/", func(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
      case "GET":

        s := strings.Split(r.URL.Path, "/")
        if len(s) == 3 {
          threadId, err := strconv.Atoi(s[2])

          if err != nil {
            //error
          }

          getForumThread(w, r, db, 0, INVALID_INT, INVALID_INT, threadId)
        } else {
          //error
        }
        
        break 
      case "POST":

        m, _ := url.ParseQuery(r.URL.RawQuery)

        //look for userid parameter in url
        option := int(0)
        if val, ok := m["upvote"]; ok { //TODO: case insensitve match
          if(val[0] == "true") {
            option = 1
          }
        } else if val, ok := m["downvote"]; ok {
          if(val[0] == "true") {
            option = -1
          }
        }

        if option == 1 || option == -1 {

          s := strings.Split(r.URL.Path, "/")
          if len(s) == 4 {
            threadId, err := strconv.Atoi(s[2])

            if err != nil {
              //error
            }

            scoreForumThread(w, r, db, store, option, threadId)
  
          } else {
            //error
          }

        }

        break  
      case "PUT":
        break  
      case "DELETE":
        break  
      default:
        break
    }
  })

//GET:
//getForumThreadsByLoggedInUserIdByRating      profilethreads/ ? sortby = XXX & pagenumber = XXX
//getForumThreadsByLoggedInUserIdByTime        profilethreads/ ? sortby = XXX & pagenumber = XXX  
  http.HandleFunc("/profilethreads/", func(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
      case "GET":

        m, _ := url.ParseQuery(r.URL.RawQuery)

        //look for sortby parameter in url
        sortBy := 0
        if val, ok := m["sortby"]; ok {
          if val[0] == "creationtime" {
            sortBy = 1
          }
        }

        //look for pagenumber parameter in url
        pageNumber := 1
        var err error
        if val, ok := m["pagenumber"]; ok {
          pageNumber, err = strconv.Atoi(val[0])
          if err != nil {
            //error
          }
        }

        getForumThreadProtected(w, r, db, store, sortBy, pageNumber)

        break 
      case "POST":
        break  
      case "PUT":
        break  
      case "DELETE":
        break  
      default:
        break
    }
  })

//GET:  
//getForumThreadsByUserIdByRating              threads/ ? userid = XXX & sortby = XXX & pagenumber = XXX
//getForumThreadsByUserIdByTime                threads/ ? userid = XXX & sortby = XXX & pagenumber = XXX
//getForumThreadsByRating                      threads/ ? sortby = XXX & pagenumber = XXX
//getForumThreadsByTime                        threads/ ? sortby = XXX & pagenumber = XXX
//POST:
//createForumThread                            threads                        body: {"title" : title, "body" : body}
  http.HandleFunc("/threads/", func(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
      case "GET":

        m, _ := url.ParseQuery(r.URL.RawQuery)

        //look for sortby parameter in url
        sortBy := 0
        if val, ok := m["sortby"]; ok {
          if val[0] == "creationtime" {
            sortBy = 1
          }
        }

        //look for pagenumber parameter in url
        pageNumber := 1
        var err error
        if val, ok := m["pagenumber"]; ok {
          pageNumber, err = strconv.Atoi(val[0])
          if err != nil {
            //error
          }
        }

        //select what to query by
        if val, ok := m["userid"]; ok { //by userid
          userId, err := strconv.Atoi(val[0])
          if err != nil {
            //error
          }

          getForumThread(w, r, db, 1, sortBy, pageNumber, userId)

        } else { //by all

          getForumThread(w, r, db, 2, sortBy, pageNumber, INVALID_INT)

        }

        break 
      case "POST":

        createForumThread(w, r, db, store)

        break  
      case "PUT":
        break  
      case "DELETE":
        break  
      default:
        break
    }
  })


  //routes in thread_posts.go

//GET:
//getThreadPostByPostId                        post/ id
//POST:
//upvoteThreadPost                             post/XidX/?upvote=true         //id in url so don't need body
//downvoteThreadPost                           post/XidX/?downvote=true       //id in url so don't need body
  http.HandleFunc("/post/", func(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
      case "GET":

        s := strings.Split(r.URL.Path, "/")
        if len(s) == 3 {
          postId, err := strconv.Atoi(s[2])

          if err != nil {
            //error
          }

          getThreadPost(w, r, db, 0, INVALID_INT, INVALID_INT, postId)

        } else {
          //error
        }

        break 
      case "POST":

        m, _ := url.ParseQuery(r.URL.RawQuery)

        //look for userid parameter in url
        option := 0
        if val, ok := m["upvote"]; ok {
          if(val[0] == "true") {
            option = 1
          }
        } else if val, ok := m["downvote"]; ok {
          if(val[0] == "true") {
            option = -1
          }
        }

        if option == 1 || option == -1 {

          s := strings.Split(r.URL.Path, "/")
          if len(s) == 4 {
            threadId, err := strconv.Atoi(s[2])

            if err != nil {
              //error
            }

            scoreThreadPost(w, r, db, store, option, threadId)
  
          } else {
            //error
          }

        }

        break  
      case "PUT":
        break  
      case "DELETE":
        break  
      default:
        break
    }
  })

//GET:
//getThreadPostsByThreadIdByRating             posts / ? threadid = XXX & sortby = rating & pagenumber = XXX
//getThreadPostsByThreadIdByTime               posts / ? threadid = XXX & sortby = creationtime & pagenumber = XXX
//getThreadPostsByUserIdByRating               posts / ? userid = XXX & sortby = rating & pagenumber = XXX
//getThreadPostsByUserIdByTime                 posts / ? userid = XXX & sortby = creationtime & pagenumber = XXX
//getThreadPostsByRating                       posts / ? sortby = rating & pagenumber = XXX
//getThreadPostsByTime                         posts / ? sortby = creationtime & pagenumber = XXX
//POST:
//createThreadPost                             posts                          body: {"thread_id" : threadId, "contents" : contents}
  http.HandleFunc("/posts/", func(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
      case "GET":

        m, _ := url.ParseQuery(r.URL.RawQuery)

        //look for sortby parameter in url
        sortBy := 0
        if val, ok := m["sortby"]; ok {
          if val[0] == "creationtime" {
            sortBy = 1
          }
        }

        //look for pagenumber parameter in url
        pageNumber := 1
        var err error
        if val, ok := m["pagenumber"]; ok {
          pageNumber, err = strconv.Atoi(val[0])
          if err != nil {
            //error
          }
        }

        //select what to query by
        if val, ok := m["threadid"]; ok { //by threadid
          threadId, err := strconv.Atoi(val[0])
          if err != nil {
            //error
          }

          getThreadPost(w, r, db, 1, sortBy, pageNumber, threadId)
        } else if val, ok := m["userid"]; ok { //by userid
          userId, err := strconv.Atoi(val[0])
          if err != nil {
            //error
          }

          getThreadPost(w, r, db, 2, sortBy, pageNumber, userId)
        } else { //by all

          getThreadPost(w, r, db, 3, sortBy, pageNumber, INVALID_INT)
        }

        break 
      case "POST":

        createThreadPost(w, r, db, store)

        break  
      case "PUT":
        break  
      case "DELETE":
        break  
      default:
        break
    }
  })


  //routes in users.go

//GET:
//getUserInfoByUserId                          user / 1
//getUserInfoByUsername                        user / ? username = XXX
  http.HandleFunc("/user/", func(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
      case "GET":

        m, _ := url.ParseQuery(r.URL.RawQuery)

        if val, ok := m["username"]; ok { //if username can be parsed from url

          username := val[0]

          getUserInfo(w, r, db, 1, INVALID_INT, username)

        } else { //else if username cannot be parsed from url

          s := strings.Split(r.URL.Path, "/")
          if len(s) == 3 { //if path can be divided into 3 parts

            userId, err := strconv.Atoi(s[2]) //convert parsed user id into an int

            if err != nil { //if parsed user id could not be converted into an int
              //error
            }
            getUserInfo(w, r, db, 0, userId, "")
          } else {
            //error
          }
        }

        break 
      case "POST":
        break  
      case "PUT":
        break  
      case "DELETE":
        break  
      default:
        break
    }
  })

  http.HandleFunc("/friend/", func(w http.ResponseWriter, r *http.Request) {
  switch r.Method {
    case "GET":
      getFriendsList(w, r, db)
      break 
    case "POST":
      m, _ := url.ParseQuery(r.URL.RawQuery)
      if val, ok := m["action"]; ok {
        if val[0] == "add" {
          addFriend(w, r, db)
        } else if val[0] == "remove" {
          removeFriend(w, r, db)
        } else {
          //error
        }
      }
      break  
    case "PUT":
      break  
    case "DELETE":
      break  
    default:
      break
  }
})




/*
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
*/

  //routes for sockets
/*
  //listen for player connection
  http.HandleFunc("/connect", func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("trying to connect websocket")
    connect(w, r, room, store)
  })
*/


  var room = createChatRoom(1)
  go room.run()


  //listen for user chat
  http.HandleFunc("/chat/", func(w http.ResponseWriter, r *http.Request) {
    fmt.Println("trying to initiate chat")
    chat(w, r, store, room)
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

//handle the chat event which checks if the cookie corresponds to a logged in user and adds the user to the chat room
//TODO: Return correct status and message if session is invalid
func chat(w http.ResponseWriter, r *http.Request, store *sessions.CookieStore, room *ChatRoom) {

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

  fmt.Println("New user connected to chat")

  //use the id and username attached to the session to create the player
  chatterHandler := ChatterHandler{Id: session.Values["userid"].(int), Username: session.Values["username"].(string), Room: room}

  chatterHandler.createChatter(w, r)
}



/*

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
*/


