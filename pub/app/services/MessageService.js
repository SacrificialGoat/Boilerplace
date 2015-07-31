var sendMessage = function(userId, title,body,callback) {

  return $.ajax({
    type: 'POST',
    url: '/messages/',
    data: JSON.stringify({
      "recipient_id": userId,
      "title": title,
      "contents": body
    }),
    crossDomain: true,
    success: function(resp) {
      console.log('success',resp);
      return callback(resp);
    },
    error: function(resp) {
      // TODO: Fix this, this always goes to error - not sure.
      // Found out - jQuery 1.4.2 works with current go server, but breaks with newer ver.
      console.log('error',resp);
      if(resp.responseText === ""){ // if no error msg
        callback(resp);
      }else{         // if error msg
        callback(null);
      }
    }
  });
};

var fetchMessage = function(id,callback) {
  $.ajax({
    type: 'GET',
    url: '/message/'+id,
    crossDomain: true,
    success: function(resp) {
      console.log('success',resp);
      return callback(resp);
    },
    error: function(resp) {
      // TODO: Fix this, this always goes to error - not sure.
      // Found out - jQuery 1.4.2 works with current go server, but breaks with newer ver.
      console.log('error',resp);
      if(resp.responseText === ""){ // if no error msg
        callback(resp);
      }else{         // if error msg
        callback(null);
      }
    }
  });
};

// Grabs threads for page number
var fetchPage = function(page, callback) {

  $.ajax({
    type: 'GET',
    url: 'messages/?q=recipient&sortby=desc&pagenumber='+page,
    crossDomain: true,
    success: function(resp) { // WORKING for fetchuser?
      // console.log('success',resp);
      callback(resp);
    },
    error: function(resp) {
      // TODO: Fix this, this always goes to error - not sure.
      // Found out - jQuery 1.4.2 works with current go server, but breaks with newer ver.
      console.log('error',resp);
      callback(null);
    }
  });
};

var deleteMessage = function(id,callback) {
  return $.ajax({
    type: 'DELETE',
    url: '/message/'+ id,
    crossDomain: true,
    success: function(resp) {
      console.log('success',resp);
      return callback(resp);
    },
    error: function(resp) {
      // TODO: Fix this, this always goes to error - not sure.
      // Found out - jQuery 1.4.2 works with current go server, but breaks with newer ver.
      console.log('error',resp);
      if(resp.responseText === ""){ // if no error msg
        callback(resp);
      }else{         // if error msg
        callback(null);
      }
    }
  });
};



var Message = {
  fetchMessage: function(id,callback) {
    var that = this;
    fetchMessage(id,function(res) {
        if (callback) {
          callback(res);
        }
        that.onChange(res);
    });
  },

  fetchPage: function(page,callback) {
    var that = this;
    fetchPage(page,function(res) {
        if (callback) {
          callback(res);
        }
        that.onChange(res);
    });
  },

  send: function(userId, title, body, callback) {
    var that = this;

    sendMessage(userId, title, body, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });

  },

  delete: function(id,callback) {
    var that = this;
    deleteMessage(id,function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });
  },

  onChange: function() {}
};

module.exports = Message;