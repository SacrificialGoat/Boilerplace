##To Develop:

1. Go to /server in terminal.
2. Start mySQL server by typing 'mysql.server start'
3. Set up schema by typing 'mysql -u root < schema.sql'
4. Start the server by running the below command (include more server files as they're added).

  go run events.go room.go player.go auth.go server.go outbound.go forum_threads.go thread_posts.go users.go

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
