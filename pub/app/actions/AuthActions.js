var AppDispatcher = require('../dispatchers/AppDispatcher');
var AuthConstants = require('../constants/AuthConstants');

var AuthActions = {
  signup: function(data){
    AppDispatcher.handleAction({
      actionType: AuthConstants.SIGNUP,
      data: data
    });
  },
  login: function(data){
    AppDispatcher.handleAction({
      actionType: AuthConstants.LOGIN,
      data: data
    });
  },
  logout: function(){
    AppDispatcher.handleAction({
      actionType: AuthConstants.LOGOUT,
      data: null
    });
  }
};

module.exports = AuthActions;