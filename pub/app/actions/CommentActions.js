var AppDispatcher = require('../dispatchers/AppDispatcher');
var CommentConstants = require('../constants/CommentConstants');

var CommentActions = {
  add: function(data){
    AppDispatcher.handleAction({
      actionType: CommentConstants.POST_ADD,
      data: data
    });
  },

  delete: function(data){
    AppDispatcher.handleAction({
      actionType: CommentConstants.POST_DELETE,
      data: data
    });
  },

  edit: function(data){
    AppDispatcher.handleAction({
      actionType: CommentConstants.POST_EDIT,
      data: data
    });
  },

  // Fetches a page of Comments
  fetchPage: function(data){
    AppDispatcher.handleAction({
      actionType: CommentConstants.POST_FETCHPAGE,
      data: data
    });
  },

  fetchUserPage: function(data){
    AppDispatcher.handleAction({
      actionType: CommentConstants.POST_FETCHUSERPAGE,
      data: data
    });
  },

  // Fetches one Comment only
  fetchComment: function(data){
    AppDispatcher.handleAction({
      actionType: CommentConstants.POST_FETCHCOMMENT,
      data: data
    });
  },
  // Rate a Comment up or down
  upVote: function(data){
    AppDispatcher.handleAction({
      actionType: CommentConstants.POST_UPVOTE,
      data: data
    });
  },

  downVote: function(data){
    AppDispatcher.handleAction({
      actionType: CommentConstants.POST_DOWNVOTE,
      data: data
    });
  }

};

module.exports = CommentActions;