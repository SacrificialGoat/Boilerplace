var AppDispatcher = require('../dispatchers/AppDispatcher');
var MessageConstants = require('../constants/MessageConstants');

var MessageActions = {
  send: function(data){
    console.log('sending,...',data);
    AppDispatcher.handleAction({
      actionType: MessageConstants.MSG_SEND,
      data: data
    });
  },

  delete: function(data){
    AppDispatcher.handleAction({
      actionType: MessageConstants.MSG_DELETE,
      data: data
    });
  },

  // Fetches a page of messages
  fetchPage: function(data){
    AppDispatcher.handleAction({
      actionType: MessageConstants.MSG_FETCHPAGE,
      data: data
    });
  },

  // Fetches one message only
  fetchMessage: function(data){
    AppDispatcher.handleAction({
      actionType: MessageConstants.MSG_FETCHMESSAGE,
      data: data
    });
  },


};

module.exports = MessageActions;