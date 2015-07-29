jest.dontMock('../../app/stores/ChatStore');
jest.dontMock('../../node_modules/object-assign');

describe('ChatStore', function() {
  var ChatConstants = require('../../app/constants/ChatConstants')
  var AppDispatcher, ChatStore, callback, data;

  var actionSend = {
    actionType: ChatConstants.SEND,
    data: data
  };
  var actionSendDm = {
    actionType: ChatConstants.SENDDM,
    data: data
  };
  var actionReceive = {
    actionType: ChatConstants.RECEIVE
  };
  var actionConnect = {
    actionType: ChatConstants.CONNECT
  };

  beforeEach(function() {
    AppDispatcher = require('../../app/dispatchers/AppDispatcher.js');
    CommentStore = require('../../app/stores/ChatStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });
  
});  
  