jest.dontMock('../../app/stores/ThreadStore');
jest.dontMock('../../node_modules/object-assign');

describe('ThreadStore', function() {
  var ThreadConstants = require('../../app/constants/ThreadConstants')
  var AppDispatcher, ThreadStore, callback, data;

  var actionAdd = {
    actionType: ThreadConstants.ADD,
    data: data
  };
  var actionSearch = {
    actionType: ThreadConstants.SEARCH,
    data: data
  };
  var actionFetchPage = {
    actionType: ThreadConstants.FETCHPAGE,
    data: data
  };
  var actionFetchUserPage = {
    actionType: ThreadConstants.FETCHUSERPAGE,
    data: data
  };
  var actionFetchOtherPage = {
    actionType: ThreadConstants.FETCHOTHERPAGE,
    data: data
  };
  var actionFetchThread = {
    actionType: ThreadConstants.FETCHTHREAD,
    data: data
  };
  var actionUpVote = {
    actionType: ThreadConstants.UPVOTE,
    data: data
  };
  var actionDownVote = {
    actionType: ThreadConstants.DOWNVOTE,
    data: data
  };

  beforeEach(function() {
    AppDispatcher = require('../../app/dispatchers/AppDispatcher.js');
    ThreadStore = require('../../app/stores/ThreadStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });
  
});  
  