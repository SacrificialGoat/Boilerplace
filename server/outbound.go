package main

import (
  "time"
)


//structs to be json stringified and sent as outbound messages to the client(s)


//struct containing an array of player positions
type PlayerPositionListOutbound struct {
  Players []*PlayerPositionOutbound `json:"players"`
}

//struct containing a player's position and identifiers
type PlayerPositionOutbound struct {
  Id int `json:"id"`
  Username string `json:"username"`

  BodyPosition *BodyPosition `json:"bodyPosition"`
  HeadPosition *HeadPosition `json:"headPosition"`
}

//struct containing a player's body position and identifiers
type PlayerBodyPositionOutbound struct {
  Id int `json:"id"`
  Username string `json:"username"`

  BodyPosition *BodyPosition `json:"bodyPosition"`
}

//struct containing a player's head position and identifiers
type PlayerHeadPositionOutbound struct {
  Id int `json:"id"`
  Username string `json:"username"`

  HeadPosition *HeadPosition `json:"headPosition"`
}

//struct containing a player's message and identifiers
type PlayerMessageOutbound struct {
  Id int `json:"id"`
  Username string `json:"username"`

  Message string `json:"message"`
}

//struct containing a user's info
type UserInfoOutbound struct {
  User_id int `json:"user_id"`
  User_name string `json:"user_name"`
  First_name string `json:"first_name"`
  Last_name string `json:"last_name"`
  Bio string `json:"bio"`
  Rep int `json:"rep"`
  Avatar_link string `json:"avatar_link"`
}

//struct containing a forum thread's info
type ForumThreadInfoOutbound struct {
  Thread_id int `json:"thread_id"`
  User_id int `json:"user_id"`
  User_name string `json:"user_name"`
  Title string `json:"title"`
  Body string `json:"body"`  
  Post_count int `json:"post_count"`
  Rating int `json:"rating"`
  Creation_time time.Time `json:"creation_time"`
  Last_update_time time.Time `json:"last_update_time"`
}

//struct containing an array of forum threads
type ForumThreadCollectionOutbound struct {
  ForumThreads []*ForumThreadInfoOutbound `json:"forumThreads"`
}

//struct containing a forum thread post's info
type ThreadPostInfoOutbound struct {
  Post_id int `json:"post_id"`
  Thread_id int `json:"thread_id"`
  User_id int `json:"user_id"`
  User_name string `json:"user_name"`  
  Contents string `json:"contents"`
  Rating int `json:"rating"`
  Creation_time time.Time `json:"creation_time"`
  Last_update_time time.Time `json:"last_update_time"`
}

//struct containing an array of forum thread posts
type ThreadPostCollectionOutbound struct {
  ThreadPosts []*ThreadPostInfoOutbound `json:"threadPosts"`
}

