var AppDispatcher = require('../dispatchers/AppDispatcher');
var ChatConstants = require('../constants/ChatConstants');

var ChatActions = {
  send: function(data){
    AppDispatcher.handleAction({
      actionType: ChatConstants.SEND,
      data: data
    });
  },

  sendDm: function(data){
    AppDispatcher.handleAction({
      actionType: ChatConstants.SENDDM,
      data: data
    });
  },

  receive: function(){
    AppDispatcher.handleAction({
      actionType: ChatConstants.RECEIVE
    });
  },

  connect: function(){
    AppDispatcher.handleAction({
      actionType: ChatConstants.CONNECT
    }); 
  }

};

module.exports = ChatActions;