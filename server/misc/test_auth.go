package main

import (
        //auth "github.com/abbot/go-http-auth"
        "fmt"
        "net/http"
        "flag"
        "text/template"     
        "encoding/json"
        "log"
        "io/ioutil"
        "database/sql"
        _ "github.com/go-sql-driver/mysql"
)


const (
    DB_USER = "root"
    DB_PASSWORD = ""
    DB_NAME = "virtual_arm"
)



var (
    addr      = flag.String("addr", ":8000", "http service address")
    homeTempl *template.Template 
)


func initializeDB() *sql.DB {
        db, err := sql.Open("mysql",  DB_USER + ":" + DB_PASSWORD + "@/" + DB_NAME)
        if err != nil {
          panic(err)
        } 

        return db
}

func homeHandler(c http.ResponseWriter, req *http.Request) {
    homeTempl.Execute(c, req.Host)
}

func connect(c http.ResponseWriter, req *http.Request) {
    fmt.Println("New user connected")
}

func authenticate(c http.ResponseWriter, req *http.Request, db *sql.DB) {
    fmt.Println("User authenticated")
    fmt.Println(req.Body)

    body, err := ioutil.ReadAll(req.Body)
    if err != nil {
        panic(err)
    }
    //fmt.Println(string(body))

    byt := body
    var dat map[string]interface{}
    if err := json.Unmarshal(byt, &dat); err != nil {
      panic(err)
    }

    fmt.Println(dat["username"])
    fmt.Println(dat["password"])

    username := dat["username"]
    //password := dat["password"]


   var (
      queried_id int
      queried_password_hash string
    )

    err = db.QueryRow("select id, password_hash from users where user_name = ?", username).Scan(&queried_id, &queried_password_hash)
    switch {
    case err == sql.ErrNoRows:
            log.Printf("No user with that username.")
    case err != nil:
            log.Fatal(err)
    default:
            fmt.Printf("Id is %d\n", queried_id)
            fmt.Printf("Password is %s\n", queried_password_hash)
    }

}

func Secret(user, realm string) string {
        if user == "john" {
                // password is "hello"
                return "$1$dlPL2MqE$oQmn16q49SqdmhenQuNgs1"
        }
        return ""
}

func main() {
        //authenticator := auth.NewBasicAuthenticator("example.com", Secret)

        flag.Parse()

        var db = initializeDB()
        defer db.Close()

        //serve the home page
        homeTempl = template.Must(template.ParseFiles("home.html"))
        http.HandleFunc("/", homeHandler)

        //authenticate user
        http.HandleFunc("/authenticate", func(w http.ResponseWriter, r *http.Request) {
                authenticate(w, r, db)
        })

        //listen for player connection
        http.HandleFunc("/connect", func(w http.ResponseWriter, r *http.Request) {
                connect(w, r)
        })       

        http.ListenAndServe(":8000", nil)
}
