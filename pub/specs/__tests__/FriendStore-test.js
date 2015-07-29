jest.dontMock('../../app/stores/FriendStore');
jest.dontMock('../../node_modules/object-assign');

describe('FriendStore', function() {
  var FriendConstants = require('../../app/constants/FriendConstants')
  var AppDispatcher, FriendStore, callback, targetUser;

  var actionAddFriend = {
    actionType: FriendConstants.ADD_FRIEND,
    data: {
      targetUser: targetUser
    }
  };
  var actionRemoveFriend = {
    actionType: FriendConstants.REMOVE_FRIEND,
    data: {
      targetUser: targetUser
    }
  };
  var actionFetchFriendList = {
    actionType: FriendConstants.FETCH_FRIENDLIST,
    data: {
      targetUser: targetUser
    }
  };

  beforeEach(function() {
    AppDispatcher = require('../../app/dispatchers/AppDispatcher.js');
    FriendStore = require('../../app/stores/FriendStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });
  
});
  