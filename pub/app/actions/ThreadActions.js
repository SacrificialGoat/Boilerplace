var AppDispatcher = require('../dispatchers/AppDispatcher');
var ThreadConstants = require('../constants/ThreadConstants');

var ThreadActions = {
  add: function(data){
    AppDispatcher.handleAction({
      actionType: ThreadConstants.ADD,
      data: data
    });
  },

  edit: function(data){
    AppDispatcher.handleAction({
      actionType: ThreadConstants.EDIT,
      data: data
    });
  },

  delete: function(data){
    AppDispatcher.handleAction({
      actionType: ThreadConstants.DELETE,
      data: data
    });
  },

  search: function(data){
    AppDispatcher.handleAction({
      actionType: ThreadConstants.SEARCH,
      data: data
    });
  },

  // Fetches a page of threads
  fetchPage: function(data){
    AppDispatcher.handleAction({
      actionType: ThreadConstants.FETCHPAGE,
      data: data
    });
  },

  // Fetch profile threads
  fetchUserPage: function(data){
    AppDispatcher.handleAction({
      actionType: ThreadConstants.FETCHUSERPAGE,
      data: data
    });
  },

  // Fetch other people's profile threads
  fetchOtherPage: function(data){
    AppDispatcher.handleAction({
      actionType: ThreadConstants.FETCHOTHERPAGE,
      data: data
    });
  },

  // Fetches one thread only
  fetchThread: function(data){
    AppDispatcher.handleAction({
      actionType: ThreadConstants.FETCHTHREAD,
      data: data
    });
  },

  // Rate a thread up or down
  upVote: function(data){
    AppDispatcher.handleAction({
      actionType: ThreadConstants.UPVOTE,
      data: data
    });
  },

  downVote: function(data){
    AppDispatcher.handleAction({
      actionType: ThreadConstants.DOWNVOTE,
      data: data
    });
  }

};

module.exports = ThreadActions;