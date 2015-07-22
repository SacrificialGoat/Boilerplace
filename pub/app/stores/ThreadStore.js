var AppDispatcher = require('../dispatchers/AppDispatcher');
var ThreadConstants = require('../constants/ThreadConstants');
var Thread = require('../services/ThreadService');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _threads = [];
var _userThreads = [];
var _thread = null;

var ThreadStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
     this.emit(CHANGE_EVENT);
   },

  getThread: function(){
    return _thread;
  },

  getThreads: function(){
    return _threads;
  },

  getUserThreads: function(){
    return _userThreads;
  },

  fetchThread: function(id){
    var that = this;
    Thread.fetchThread(id, function(data){
      _thread = data;
      that.emitChange();
    });
  },

  fetchPage: function(page){
    var that = this;
    Thread.fetchPage(page, function(data){
      _threads = data;
      that.emitChange();
    });
  },

  fetchUserPage: function(page){
    var that = this;
    Thread.fetchUserPage(page, function(data){
      _userThreads = data;
      that.emitChange();
    });
  },

  add: function(title,body){
    var that = this;
    Thread.add(title,body,function(data){
      that.emitChange();
    });
  },

  upVote: function(thread_id){
    var that = this;
    Thread.upVote(thread_id,function(data){
      that.emitChange();
    });
  },

  downVote: function(thread_id){
    var that = this;
    Thread.downVote(thread_id,function(data){
      that.emitChange();
    });
  },

  update: function(bio,avatar){
    // var that = this;
    // Thread.update(bio,avatar,function(data){
    //   console.log('update successful');
    //   that.fetch();
    // });
  },

  delete: function(){


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
    case ThreadConstants.FETCHPAGE:
      ThreadStore.fetchPage(action.data.page);
      ThreadStore.emitChange();
      break;
    case ThreadConstants.FETCHUSERPAGE:
      ThreadStore.fetchUserPage(action.data.page);
      ThreadStore.emitChange();
      break;
    case ThreadConstants.FETCHTHREAD:
      ThreadStore.fetchThread(action.data.id);
      ThreadStore.emitChange();
      break;
    case ThreadConstants.ADD:
      ThreadStore.add(action.data.title,action.data.body);
      break;
    case ThreadConstants.UPDATE:
      // TODO: Updating a thread

      break;
    case ThreadConstants.DELETE:
      // TODO: Deleting a thread

      break;
    case ThreadConstants.UPVOTE:
      ThreadStore.upVote(action.data.thread_id);
      break;
    case ThreadConstants.DOWNVOTE:
      ThreadStore.downVote(action.data.thread_id);
      break;
    default:
      return true;
  }

  ThreadStore.emitChange();
  return true;
});

module.exports = ThreadStore;