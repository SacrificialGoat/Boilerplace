jest.dontMock('../../app/stores/AuthStore');
jest.dontMock('../../node_modules/object-assign');

describe('AuthStore', function() {
  var AuthConstants = require('../../app/constants/AuthConstants')
  var AppDispatcher, AuthStore, callback, data;

  var actionSignup = {
    actionType: AuthConstants.SIGNUP,
    data: data
  };
  var actionLogin = {
    actionType: AuthConstants.LOGIN,
    data: data
  };
  var logout = {
    actionType: AuthConstants.LOGOUT,
    data: null
  };

  beforeEach(function() {
    AppDispatcher = require('../../app/dispatchers/AppDispatcher.js');
    ProfileStore = require('../../app/stores/AuthStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });
  
});
  