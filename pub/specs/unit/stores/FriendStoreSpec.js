var TestUtils = require('react-addons').TestUtils;
var FriendConstants = require('../../../app/constants/FriendConstants')
var registeredCallback;

describe("FriendStore", function() {
  beforeEach(function(){
    var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
    spyOn(AppDispatcher, "register");
    this.FriendStore = require('../../../app/stores/FriendStore');
    if (AppDispatcher.register.calls.argsFor(0).length > 0) {
      registeredCallback = AppDispatcher.register.calls.argsFor(0)[0];
      console.log(registeredCallback);
    }
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


});