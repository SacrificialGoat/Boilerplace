jest.dontMock('../../app/stores/CommentStore');
jest.dontMock('../../node_modules/object-assign');

describe('CommentStore', function() {
  var CommentConstants = require('../../app/constants/CommentConstants')
  var AppDispatcher, CommentStore, callback, data;

  var actionAdd = {
    actionType: CommentConstants.POST_ADD,
    data: data
  };
  var actionFetchPage = {
    actionType: CommentConstants.POST_FETCHPAGE,
    data: data
  };
  var actionFetchUserPage = {
    actionType: CommentConstants.POST_FETCHUSERPAGE,
    data: data
  };
  var actionFetchComment = {
    actionType: CommentConstants.POST_FETCHCOMMENT,
    data: data
  };
  var actionUpVote = {
    actionType: CommentConstants.POST_UPVOTE,
    data: data
  };
  var actionDownVote = {
    actionType: CommentConstants.POST_DOWNVOTE,
    data: data
  };

  beforeEach(function() {
    AppDispatcher = require('../../app/dispatchers/AppDispatcher.js');
    CommentStore = require('../../app/stores/CommentStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });
  
});  
  