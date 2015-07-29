jest.dontMock('../../app/stores/ProfileStore')

describe('ProfileStore', function() {
  var ProfileConstants = require('../../app/constants/ProfileConstants')
  var AppDispatcher, ProfileStore, callback;

  var profileFetch = {
      actionType: ProfileConstants.FETCH
  };
  var profileFetchById = {
      actionType: ProfileConstants.FETCHBYID,
      data:data
  };
  var profileUpdate = {
      actionType: ProfileConstants.UPDATE,
      data: data
  };
  var profileDelete = {
      actionType: ProfileConstants.DELETE,
      data: null
  };

  beforeEach(function() {
    AppDispatcher = require('../../app/dispatchers/AppDispatcher');
    TodoStore = require('../../app/stores/ProfileStore');
    callback = AppDispatcher.register.mock.calls[0][0];
    console.log("hi");
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

})