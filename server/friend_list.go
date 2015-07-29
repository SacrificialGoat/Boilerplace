// package main

// import (
// 	// "flag"
// 	// "log"
// 	// "net/http"
// 	// "text/template"
// 	"fmt"
// )

// // var addr = flag.String("addr", ":8080", "http service address")  //
// // var homeTempl = template.Must(template.ParseFiles("home.html"))  // change this out

// // func serveHome(w http.ResponseWriter, r *http.Request) {
// // 	if r.URL.Path != "/" {
// // 		http.Error(w, "Not found", 404)
// // 		return
// // 	}
// // 	if r.Method != "GET" {
// // 		http.Error(w, "Method not allowed", 405)
// // 		return
// // 	}

// // 	w.Header().Set("Content-Type", "text/html; charset=utf-8")
// // 	homeTempl.Execute(w, r.Host)
// // }

// func friend_list() {
// 	// flag.Parse()

// 	go h.run()  // run hub. Won't stop?


// 	// http.HandleFunc("/friendws", serveWs)  // at route /ws, use serveWs

// 	// err := http.ListenAndServe(*addr, nil)
// 	// if err != nil {
// 	// 	log.Fatal("ListenAndServe: ", err)
// 	// } else {
// 	// 	fmt.Println("ListenAndServing...")
// 	// }
// }

