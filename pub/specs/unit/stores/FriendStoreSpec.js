var TestUtils = require('react-addons').TestUtils;
var FriendConstants = require('../../../app/constants/FriendConstants')
var registeredCallback;

describe("FriendStore", function() {

  beforeAll(function(){
    var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
    spyOn(AppDispatcher, "register");
    this.FriendStore = require('../../../app/stores/FriendStore');
    registeredCallback = AppDispatcher.register.calls.argsFor(0)[0];
  });

  it("should be an object", function() {
    expect(typeof this.FriendStore).toBe('object');
  });

  it("emitChange should be a function", function() {
    expect(typeof this.FriendStore.emitChange).toBe('function');
  });

  it('should have an updateFriendStatus method', function(){
    expect(this.FriendStore.updateFriendStatus).toBeDefined();
  });
  
  it('should have an addFriend method', function(){
    expect(this.FriendStore.addFriend).toBeDefined();
  });

  it('should have a removeFriend method', function(){
    expect(this.FriendStore.removeFriend).toBeDefined();
  });
  
  it('should have a getFriendStatus method', function(){
    expect(this.FriendStore.getFriendStatus).toBeDefined();
  });

  it('should have a getFriendList method', function(){
    expect(this.FriendStore.getFriendList).toBeDefined();
  });
  
  it('should have a fetchFriendList method', function(){
    expect(this.FriendStore.fetchFriendList).toBeDefined();
  });

  it('should have an addChangeListener method', function(){
    expect(this.FriendStore.addChangeListener).toBeDefined();
  });

  it('should have a removeChangeListener method', function(){
    expect(this.FriendStore.removeChangeListener).toBeDefined();
  });

  it('should have a getFriendOnline method', function(){
    expect(this.FriendStore.getFriendOnline).toBeDefined();
  });

  it('should have a emitChangeOnline method', function(){
    expect(this.FriendStore.emitChangeOnline).toBeDefined();
  });

  it('should have a addChangeListenerOnline method', function(){
    expect(this.FriendStore.addChangeListenerOnline).toBeDefined();
  });

  it('should have a removeChangeListenerOnline method', function(){
    expect(this.FriendStore.removeChangeListenerOnline).toBeDefined();
  });

  it('should call addFriend when it receives an addFriend action', function() {
    spyOn(this.FriendStore, 'addFriend');
    var payload = {};
    payload.action = {
      actionType: FriendConstants.ADD_FRIEND,
      data: {"test": 123}
    };
    registeredCallback(payload);
    expect(this.FriendStore.addFriend).toHaveBeenCalled();
    expect(this.FriendStore.addFriend).toHaveBeenCalledWith({"test": 123});
  });

  it('should call removeFriend when it receives a removeFriend action', function() {
    spyOn(this.FriendStore, 'removeFriend');
    var payload = {};
    payload.action = {
      actionType: FriendConstants.REMOVE_FRIEND,
      data: {"test": 123}
    };
    registeredCallback(payload);
    expect(this.FriendStore.removeFriend).toHaveBeenCalled();
    expect(this.FriendStore.removeFriend).toHaveBeenCalledWith({"test": 123});
  });

  it('should call fetchFriendList when it receives a fetchFriendList action', function() {
    spyOn(this.FriendStore, 'fetchFriendList');
    var payload = {};
    payload.action = {
      actionType: FriendConstants.FETCH_FRIENDLIST,
      data: {"test": 123}
    };
    registeredCallback(payload);
    expect(this.FriendStore.fetchFriendList).toHaveBeenCalled();
    expect(this.FriendStore.fetchFriendList).toHaveBeenCalledWith({"test": 123});
  });

});