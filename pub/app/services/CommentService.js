var addComment = function(threadId,body,callback) {
  return $.ajax({
    type: 'POST',
    url: '/createThreadPost',
    data: JSON.stringify({
      "thread_id": parseInt(threadId),
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


var fetchComment = function(id,callback) {
  $.ajax({
    type: 'GET',
    url: '/getUserInfo',
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

// Grabs Comments for page number
var fetchPage = function(threadId, page, callback) {
  $.ajax({
    type: 'POST',
    url: '/getThreadPostsByRating',
    data: JSON.stringify({"thread_id": parseInt(threadId), "page_number" : parseInt(page)}),
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

var fetchUserPage = function(page, callback) {
  
  $.ajax({
    type: 'POST',
    url: '/getForumThreadsByUserId',
    data: JSON.stringify({"page_number" : page}),
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

var updateComment = function(bio,avatar,callback) {
  return $.ajax({
    type: 'POST',
    url: '/updateUserInfo',
    data: JSON.stringify({
      "bio": bio,
      "avatar_link": avatar
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

var upVote = function(post_id, callback) {
  console.log('upvoting...',post_id);
  $.ajax({
    type: 'POST',
    url: '/upvoteThreadPost',
    data: JSON.stringify({"post_id" : parseInt(post_id)}),
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

var downVote = function(post_id, callback) {
  console.log('downvoting...',post_id);
  $.ajax({
    type: 'POST',
    url: '/downvoteThreadPost',
    data: JSON.stringify({"post_id" : parseInt(post_id)}),
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

var Comment = {

  fetchPage: function(threadId, page, callback) {
    var that = this;
    fetchPage(threadId, page ,function(res) {
        if (callback) {
          callback(res);
        }
        that.onChange(res);
    });
  },

  fetchUserPage: function(page,callback) {
    var that = this;
    fetchUserPage(page,function(res) {
        if (callback) {
          callback(res);
        }
        that.onChange(res);
    });
  },

  add: function(threadId, body, callback) {
    var that = this;

    addComment(threadId, body, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });

  },
  
  update: function(bio, avatar, callback) {
    var that = this;
    updateComment(bio, avatar, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });
  },

  delete: function(callback) {
    if (callback) {
      callback();
    }
    this.onChange(false);
  },

  upVote: function(post_id,callback){
    var that = this;

    upVote(post_id, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });

  },

  downVote: function(post_id,callback){
    var that = this;

    downVote(post_id, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });

  },


  onChange: function() {}
};

module.exports = Comment;