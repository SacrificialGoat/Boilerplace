var AppDispatcher = require('../dispatchers/AppDispatcher');
var ThreadConstants = require('../constants/ThreadConstants');
var Thread = require('../services/ThreadService');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _threads = [];
var _userThreads = [];
var _otherUserThreads = [];
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

  getOtherUserThreads: function(){
    return _otherUserThreads;
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

  fetchOtherPage: function(id,page){
    var that = this;
    Thread.fetchOtherPage(id, page, function(data){
      _otherUserThreads = data;
      that.emitChange();
    });
  },

  add: function(title,body,link,tag,lat,lng){
    var that = this;
    Thread.add(title,body,link,tag,lat,lng,function(data){
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

  edit: function(threadId,title,body,link,tag){
    var that = this;
    Thread.edit(threadId,title,body,link,tag,function(data){
      console.log('edit complete');
      that.emitChange();
    });
  },

  delete: function(threadId){
    var that = this;
    Thread.delete(threadId,function(data){
      that.emitChange();
    });
  },

  search: function(query){
    var that = this;
    Thread.search(query,function(data){
      _threads = data;
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
    case ThreadConstants.SEARCH:
      ThreadStore.search(action.data.query);
      break;
    case ThreadConstants.FETCHPAGE: // Front page threads
      ThreadStore.fetchPage(action.data.page);
      break;
    case ThreadConstants.FETCHUSERPAGE: // User profile threads
      ThreadStore.fetchUserPage(action.data.page);
      break;
    case ThreadConstants.FETCHOTHERPAGE: // Other user profile threads
      ThreadStore.fetchOtherPage(action.data.id, action.data.page);
      break;
    case ThreadConstants.FETCHTHREAD: // Fetch individual thread
      ThreadStore.fetchThread(action.data.id);
      break;
    case ThreadConstants.ADD:
      ThreadStore.add(action.data.title,action.data.body,action.data.link,action.data.tag,action.data.lat,action.data.lng);
      break;
    case ThreadConstants.EDIT:
      // TODO: Updating a thread
      ThreadStore.edit(action.data.threadId,action.data.title,action.data.body,action.data.link,action.data.tag);
      break;
    case ThreadConstants.DELETE:
      // TODO: Deleting a thread
      ThreadStore.delete(action.data.threadId);
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