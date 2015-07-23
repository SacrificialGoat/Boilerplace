var authenticateUser = function(username, password, callback) {
  $.ajax({
    type: 'POST',
    url: '/authenticate/',
    data: JSON.stringify({
      username: username,
      password: password
    }),
    crossDomain: true,
    success: function(resp) { // NOT WORKING
      console.log('success',resp);
      callback({
        authenticated: true,
        token: resp.auth_token
      });
    },
    error: function(resp) {
      // TODO: Fix this, this always goes to error - not sure.
      // Found out - jQuery 1.4.2 works with current go server, but breaks with newer ver.
      console.log('error',resp);
      if(resp.responseText === ""){
        callback({
          authenticated: true,
          token: resp.auth_token
        });
      }else{
        callback({
          authenticated: false
        });
      }
    }
  });
};

var createUser = function(username, password, firstname, lastname, callback) {
  return $.ajax({
    type: 'POST',
    url: '/users/',
    data: JSON.stringify({
      "username": username,
      "password": password,
      "firstname": firstname,
      "lastname": lastname
    }),
    crossDomain: true,
    success: function(resp) {
      console.log('success',resp);
      return callback({
        authenticated: true,
        token: resp.auth_token
      });
    },
    error: function(resp) {
      // TODO: Fix this, this always goes to error - not sure.
      // Found out - jQuery 1.4.2 works with current go server, but breaks with newer ver.
      console.log('error',resp);
      if(resp.responseText === ""){ // if no error msg
        callback({
          authenticated: true,
          token: resp.auth_token
        });
      }else{         // if error msg
        callback({
          authenticated: false
        });
      }
    }
  });
};

var Auth = {
  login: function(username, pass, callback) {
    var that = this;

    if (this.loggedIn()) {
      // console.log('already logged in');
      // if (callback) {
      //   callback(true);
      // }
      // this.onChange(true);
      // return;
    }
    authenticateUser(username, pass, (function(res) {
        var authenticated = false;
        if (res.authenticated) {
          console.log('login successful');
          authenticated = true;
        }
        if (callback) {
          callback(authenticated);
        }
        that.onChange(authenticated);
    }));
  },
  signup: function(username, password, firstname, lastname, callback) {
    var that = this;
    
    if (this.loggedIn()) {
      // if (callback) {
      //   callback(true);
      // }
      // this.onChange(true);
      // return;
    }
    createUser(username, password, firstname, lastname, function(res) {
        var authenticated = false;
        if (res.authenticated) {
          console.log('signup and login successful!');
          authenticated = true;
        }
        if (callback) {
          callback(authenticated);
        }
        that.onChange(authenticated);
    });
  },

  logout: function(callback) {
    deleteAllCookies();

    function deleteAllCookies() {
      var cookies = document.cookie.split(";");

      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    };

    if (callback) {
      callback();
    }
    this.onChange(false);
  },

  loggedIn: function() {
    // check the flash session cookie
    var good = false;
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("flash-session=");
      if(eqPos > -1) good = true;
    }

    return good;
  },

  onChange: function() {}
};

module.exports = Auth;