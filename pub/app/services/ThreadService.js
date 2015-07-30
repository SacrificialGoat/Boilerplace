var addThread = function(title,body,link,tag,lat,lng,callback) {
  return $.ajax({
    type: 'POST',
    url: '/threads/',
    data: JSON.stringify({
      "title": title,
      "body": body,
      "link": link,
      "tag": tag,
      "lat": parseFloat(lat),
      "lng": parseFloat(lng)
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

var search = function(query,callback){
  $.ajax({
    type: 'GET',
    url: '/search/?title='+query+'&sortby=rating&pagenumber=1',
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
}


var fetchThread = function(id,callback) {
  $.ajax({
    type: 'GET',
    url: '/thread/'+id,
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
    url: '/threads/?sortby=rating&pagenumber='+page,
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
    type: 'GET',
    url: '/profilethreads/?sortby=rating&pagenumber='+page,
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

var fetchOtherPage = function(id, page, callback) {
  
  $.ajax({
    type: 'GET',
    url: '/threads/?userid='+ id +'&sortby=rating&pagenumber=' + page,
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

var editThread = function(threadId,title,body,link,tag,callback) {
  console.log(JSON.stringify({
      "thread_id": parseInt(threadId),
      "title":title,
      "body":body,
      "link":link,
      "tag":tag
    }));
  return $.ajax({
    type: 'PUT',
    url: '/thread/',
    data: JSON.stringify({
      "thread_id": parseInt(threadId),
      "title":title,
      "body":body,
      "link":link,
      "tag":tag
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

var deleteThread = function(threadId,callback) {
  return $.ajax({
    type: 'DELETE',
    url: '/thread/'+ threadId,
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

var upVote = function(thread_id, callback) {
  
  $.ajax({
    type: 'POST',
    url: '/thread/'+ thread_id + '/?upvote=true',
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

var downVote = function(thread_id, callback) {
  
  $.ajax({
    type: 'POST',
    url: '/thread/'+ thread_id + '/?downvote=true',
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

var Thread = {
  fetchThread: function(id,callback) {
    var that = this;
    fetchThread(id,function(res) {
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

  search: function(query,callback) {
    var that = this;
    search(query,function(res) {
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

  fetchOtherPage: function(id,page,callback) {
    var that = this;
    fetchOtherPage(id,page,function(res) {
        if (callback) {
          callback(res);
        }
        that.onChange(res);
    });
  },

  add: function(title, body, link, tag, lat, lng, callback) {
    var that = this;

    addThread(title, body, link, tag, lat, lng, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });

  },
  
  edit: function(threadId,title,body,link,tag,callback) {
    var that = this;
    editThread(threadId,title,body,link,tag, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });
  },

  delete: function(threadId,callback) {
    var that = this;
    deleteThread(threadId,function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });
  },

  upVote: function(thread_id,callback){
    var that = this;
    upVote(thread_id, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });
  },

  downVote: function(thread_id,callback){
    var that = this;

    downVote(thread_id, function(res) {
      if (callback) {
        callback(res);
      }
      that.onChange(res);
    });
  },

  onChange: function() {}
};

module.exports = Thread;