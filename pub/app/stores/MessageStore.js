var AppDispatcher = require('../dispatchers/AppDispatcher');
var MessageConstants = require('../constants/MessageConstants');
var Message = require('../services/MessageService');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _messages = [];
var _message = null;

var MessageStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
     this.emit(CHANGE_EVENT);
   },

  getMessage: function(){
    return _message;
  },

  getMessages: function(){
    return _messages;
  },

  fetchMessage: function(id){
    var that = this;
    // Message.fetchThread(id, function(data){
    //   _message = data;
    //   that.emitChange();
    // });
  },

  fetchPage: function(page){
    var that = this;
    Message.fetchPage(page, function(data){
      _messages = data.messages;
      that.emitChange();
    });
  },

  send: function(userId,title,body){
    console.log('sending message in the store...',userId,title,body);
    var that = this;
    Message.send(userId,title,body,function(data){
      that.emitChange();
    });
  },

  delete: function(id){
    var that = this;
    Message.delete(id,function(data){
      that.emitChange();
    });
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
    case MessageConstants.MSG_FETCHPAGE:
      MessageStore.fetchPage(action.data.page);
      break;
    case MessageConstants.MSG_SEND:
      MessageStore.send(action.data.userId, action.data.title, action.data.body);
      break;
    case MessageConstants.MSG_DELETE:
      // MessageStore.delete(action.data.threadId);
      break;
    default:
      return true;
  }

  MessageStore.emitChange();
  return true;
});

module.exports = MessageStore;