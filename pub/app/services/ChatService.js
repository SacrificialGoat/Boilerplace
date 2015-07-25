var clientSocket = {
  connect: function(targetId){
    console.log('connecting to chat server...');
    conn = new WebSocket("ws://127.0.0.1:8080/chat/");
    setTimeout(function(){conn.send('cp:'); conn.send('np:');},2000);
    /*----------------
      Event Listening
    -----------------*/
    conn.onmessage = function(evt) {
      console.log(evt);
      var eventName = evt.data.split(":")[0];
      var data = JSON.parse(evt.data.substring(eventName.length+1));

    // On your first join
      if(eventName === 'cc'){
        clientSocket.playerJoin(data);
      }
    // On new player join
      if(eventName === 'nc'){
        clientSocket.otherJoin(data);
      }
    // On receiving global
      if(eventName === 'sgm'){
        clientSocket.onGlobalMessage(data);
      }
    // On receiving direct
      if(eventName === 'sdm'){
        clientSocket.onDirectMessage(data);
      }

    };
  },

  /*-----------------

    Send Messages

  ------------------*/
  // Global Message
  sendMessage: function(data){
    conn.send('sgm:'+ data);

    console.log('sending message...');
  },
  // Direct Message
  sendDirectMessage: function(userId,data){
    conn.send('sdm:'+ userId + ':' + data);

    console.log('sending message...');
  },

  /*-----------------

    Receive Messages

  ------------------*/
  // When you join
  playerJoin: function(data){
    // Receive event with all users
    for (var i = 0; i < data.players.length; i++) {
      console.log('fetching all users...');
      var user = data.players[i];
      playerContainer[user.username] = new User(user.username,user.bodyPosition);
    };
  },
  // New player joins
  otherJoin: function(data){
    // Create a new model
    // var user = new User(data.name,{x:data.x,y:data.y,z:data.z});
    var user = new User(data.username,{x:0,y:0,z:0});
    // Save it into container
    playerContainer[data.username] = user;
  },

  // On receiving global messages
  onGlobalMessage: function(data){
    console.log(data);
    //data =  {username,message}
    $('.chatbox').find('ul').append('<li>'+data.username + ': ' + data.message + '</li>');
    // $para = $('<p></p>');
    // var text = data.username +': '+ data.message;
    // $para.text(text);
    // $display = $('.doms').find('.chatBox');
    // $display.append($para);
    // if($display.find('p').length/2 > 9){
    //   $('.doms').find('.chatBox').first().find('p').first().remove();
    //   $('.doms').find('.chatBox').last().find('p').first().remove();
    }


  };



module.exports = clientSocket;

