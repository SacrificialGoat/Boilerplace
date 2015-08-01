package main

import (
  "fmt"
  "net/http"
  "encoding/json"
  "io/ioutil"
  "github.com/gorilla/sessions"  
)


//helper functions

//function to add headers to writer
func addWriteHeaders(w *http.ResponseWriter, r *http.Request) {
  //add headers to response
  if origin := r.Header.Get("Origin"); origin != "" {
    (*w).Header().Set("Access-Control-Allow-Origin", origin)
  }
  (*w).Header()["access-control-allow-methods"] = []string{"GET, POST, OPTIONS"}
  (*w).Header()["Content-Type"] = []string{"application/json"}
}

//function to handle an options request and return true if the request is a header
func handleOptionsRequests(w http.ResponseWriter, r *http.Request) (bool) {
  //check if request is an options request
  if r.Method == "OPTIONS" {
    fmt.Println("options request received")
    w.WriteHeader(http.StatusTemporaryRedirect)
    return true
  }
  return false
}

//function to handle errors
func handleError(err error, errorMsg string, w http.ResponseWriter) {
  //print the error msg and write the error msg to the client
  //log.Fatal(err)
  fmt.Println(errorMsg)
  w.Header()["Content-Type"] = []string{"text/html"}
  w.Write([]byte(fmt.Sprintf(errorMsg)))  
}

//function that returns true if the client is authenticated (has a valid cookie)
//also returns the session information associated with the cookie
func confirmSession(store *sessions.CookieStore, errorMsg string, w http.ResponseWriter, r *http.Request) (bool, *sessions.Session) {
  //check for session to see if client is authenticated
  session, err := store.Get(r, "flash-session")
  if err != nil {
    //http.Error(w, err.Error(), http.StatusInternalServerError)
    handleError(err, errorMsg, w)
    return false, nil
  }
  fm := session.Flashes("message")
  if fm == nil {
    //fmt.Fprint(w, "No flash messages")
    handleError(err, errorMsg, w)
    return false, nil
  }
  //session.Save(r, w)

  return true, session
}

//function to parse the request body
//the properties in the json string will get returned in a map
func parseJsonRequest(w http.ResponseWriter, r *http.Request) (map[string]interface{}, bool) {
  //parse the body of the request into a string
  body, err := ioutil.ReadAll(r.Body)
  if err != nil {
    handleError(err, "Error parsing body of request", w)
    return nil, false
  }
  //fmt.Println(string(body))
  
  //parse the JSON string body
  byt := body
  var dat map[string]interface{}
  if err := json.Unmarshal(byt, &dat); err != nil {
    handleError(err, "Error parsing body of request", w)
    return nil, false
  }

  return dat, true
}


