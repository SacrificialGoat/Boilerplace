var AppDispatcher = require('../dispatchers/AppDispatcher');
var ChatConstants = require('../constants/ChatConstants');
var Chat = require('../services/ChatService');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _messages = '';
var _error = null;

var ChatStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
     this.emit(CHANGE_EVENT);
   },

  error: function(){
    return _error;
  },

  connect: function(msg){
    Chat.connect();
  },

  send: function(msg){
    Chat.sendMessage(msg);
  },

  receive: function(){

  },

  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb)
  },

  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  }
});


AppDispatcher.register(function(payload){
  var action = payload.action;

  switch(action.actionType){
    case ChatConstants.SEND:
      ChatStore.send(action.data.message);
      ChatStore.emitChange();
      break;
    case ChatConstants.RECEIVE:
      ChatStore.emitChange();
      break;
    case ChatConstants.CONNECT:
      ChatStore.connect();
      ChatStore.emitChange();
      break;
    default:
      return true;
  }

  ChatStore.emitChange();
  return true;
});

module.exports = ChatStore;