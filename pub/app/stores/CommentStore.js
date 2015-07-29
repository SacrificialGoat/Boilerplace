var AppDispatcher = require('../dispatchers/AppDispatcher');
var CommentConstants = require('../constants/CommentConstants');
var Comment = require('../services/CommentService');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _comments = [];
var _userComments = [];
var _comment = null;

var CommentStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
     this.emit(CHANGE_EVENT);
   },

  getComment: function(){
    return _comment;
  },

  getComments: function(){
    return _comments;
  },

  getUserComments: function(){
    return _userComments;
  },

  fetchPage: function(threadId, page){
    var that = this;
    Comment.fetchPage(threadId, page, function(data){
      _comments = data;
      console.log(data);
      that.emitChange();
    });
  },

  fetchUserPage: function(page){
    var that = this;
    Comment.fetchUserPage(page, function(data){
      _userComments = data;
      that.emitChange();
    });
  },

  add: function(threadId,body){
    var that = this;
    Comment.add(threadId,body,function(data){
      that.emitChange();
    });
  },

  delete: function(post_id){
    var that = this;
    Comment.delete(post_id,function(data){
      that.emitChange();
    });
  },

  upVote: function(post_id){
    var that = this;
    Comment.upVote(post_id,function(data){
      that.emitChange();
    });
  },

  downVote: function(post_id){
    var that = this;
    Comment.downVote(post_id,function(data){
      that.emitChange();
    });
  },

  edit: function(post_id,body){
    var that = this;
    Comment.edit(post_id,body,function(data){
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
    case CommentConstants.POST_FETCHPAGE:
      CommentStore.fetchPage(action.data.threadId, action.data.page);
      CommentStore.emitChange();
      break;
    case CommentConstants.POST_FETCHUSERPAGE:
      CommentStore.fetchUserPage(action.data.page);
      CommentStore.emitChange();
      break;
    case CommentConstants.POST_ADD:
      CommentStore.add(action.data.threadId,action.data.body);
      break;
    case CommentConstants.POST_EDIT:
      // TODO: Updating a Comment
      CommentStore.edit(action.data.post_id,action.data.body);
      break;
    case CommentConstants.POST_DELETE:
      // TODO: Deleting a Comment
      CommentStore.delete(action.data.post_id);
      break;
    case CommentConstants.POST_UPVOTE:
      CommentStore.upVote(action.data.post_id);
      break;
    case CommentConstants.POST_DOWNVOTE:
      CommentStore.downVote(action.data.post_id);
      break;

    default:
      return true;
  }

  CommentStore.emitChange();
  return true;
});

module.exports = CommentStore;