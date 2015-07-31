package main

import (
  "time"
)


//structs to be json stringified and sent as outbound messages to the client(s)


/*
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
*/

//struct containing an array of chatters
type ChatterIdentifierListOutbound struct {
  Chatters []*ChatterIdentifierOutbound `json:"chatters"`
}

//struct containing a chatter's identifiers
type ChatterIdentifierOutbound struct {
  Id int `json:"id"`
  Username string `json:"username"`
}

//struct containing a chatter's message and identifiers
type ChatterMessageOutbound struct {
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
  Link string `json:"link"` 
  Tag string `json:"tag"` 
  Post_count int `json:"post_count"`
  Rating int `json:"rating"`
  Longitude float64 `json:"lng"`
  Latitude float64 `json:"lat"`    
  Creation_time time.Time `json:"creation_time"`
  Last_update_time time.Time `json:"last_update_time"`
  Last_post_time time.Time `json:"last_post_time"`
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

//struct containing popular topics
type PopularTopicCollectionOutbound struct {
  PopularTopics []*PopularTopicOutbound `json:"topics"`
}

//struct containing a popular tag and its count
type PopularTopicOutbound struct {
  Tag string `json:"tag"`
  Count int `json:"count"`
}

//struct containing messages
type MessageCollectionOutbound struct {
  Messages []*MessageOutbound `json:"messages"`
}

//struct containing message info
type MessageOutbound struct {
  Message_id int `json:"message_id"`
  Sender_id int `json:"sender_id"`
  Sender_name string `json:"sender_name"`
  Recipient_id int `json:"recipient_id"`
  Recipient_name string `json:"recipient_name"`
  Title string `json:"title"`
  Contents string `json:"contents"`
  Creation_time time.Time `json:"creation_time"`
  Last_update_time time.Time `json:"last_update_time"`  
}



type FriendInfoOutbound struct {
  User_id int `json:"id"`
  User_name string `json:"username"`
  First_name string `json:"first"`
  Last_name string `json:"last"`
}

type FriendsListOutbound struct {
  Friends []*FriendInfoOutbound `json:"friends"`
}

