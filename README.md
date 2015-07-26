![ScreenShot](http://i.imgur.com/F0m8twX.png)

Fast, responsive boilerplate application to create your own Reddit.
Combines a quick & reliable Go web server with React/Flux client.

###[See Example](http://54.69.153.183:8080/)

##Features
* Threads / Comments
* Searching
* Upvotes & Downvotes
* Direct / Global Chat System using WebSockets
* Profile Page & Editing
* Adding / Removing Friends
* Signup / Login
* Authentication

##To Develop:

1. Go to /server in terminal.
2. Start mySQL server by typing 'mysql.server start'
3. Set up schema by typing 'mysql -u root < schema.sql'
4. Start the server by running the below command (include more server files as they're added).

  go run auth.go forum_threads.go chatter.go chat_events.go outbound.go chat_room.go server.go thread_posts.go users.go friends.go

5. Go to /pub folder
6. npm install
7. Run 'gulp'
8. Edit the files in /app folder.


##To Deploy:

1. In the /pub, run 'gulp deploy'.
2. Dist files will be built in /dist


##To Test:

1. In /pub, run 'gulp test'.
2. Spec files are inside /specs.


[Link to original repo](https://github.com/mikemsrk/go-flux)
