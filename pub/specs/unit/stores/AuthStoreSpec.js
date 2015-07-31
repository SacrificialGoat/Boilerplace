var TestUtils = require('react-addons').TestUtils;
var AuthConstants = require('../../../app/constants/AuthConstants')
var registeredCallback;

describe("AuthStore", function() {

  beforeAll(function(){
    var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
    spyOn(AppDispatcher, "register");
    this.AuthStore = require('../../../app/stores/AuthStore');
    registeredCallback = AppDispatcher.register.calls.argsFor(0)[0];
  });

  it("should be an object", function() {
    expect(typeof this.AuthStore).toBe('object');
  });

  it("emitChange should be a function", function() {
    expect(typeof this.AuthStore.emitChange).toBe('function');
  });

  it("should have null values on initialize", function() {
    expect(this.AuthStore.error()).toBe(null);
  });

  it('should have an addChangeListener method', function(){
    expect(this.AuthStore.addChangeListener).toBeDefined();
  });
  
  it('should have a removeChangeListener method', function(){
    expect(this.AuthStore.removeChangeListener).toBeDefined();
  });

  it('should have a login method', function(){
    expect(this.AuthStore.login).toBeDefined();
  });
  
  it('should have a logout method', function(){
    expect(this.AuthStore.logout).toBeDefined();
  });

  it('should have a loggedin method', function(){
    expect(this.AuthStore.loggedIn).toBeDefined();
  });
  
  it('should have a signup method', function(){
    expect(this.AuthStore.signup).toBeDefined();
  });

  it('should call signup when it receives a signup action', function() {
    spyOn(this.AuthStore, 'signup');
    spyOn(this.AuthStore, 'emitChange');
    var payload = {};
    payload.action = {
      actionType: AuthConstants.SIGNUP,
      data: {username: "pegleg", password:"deathtowhales", firstname: "Captain", lastname:"Ahab"}
    };
    registeredCallback(payload);
    expect(this.AuthStore.signup).toHaveBeenCalled();
    expect(this.AuthStore.signup).toHaveBeenCalledWith("pegleg", "deathtowhales", "Captain", "Ahab");
    expect(this.AuthStore.emitChange).toHaveBeenCalled();
  });

  it('should call login when it receives a login action', function() {
    spyOn(this.AuthStore, 'login');
    spyOn(this.AuthStore, 'emitChange');
    var payload = {};
    payload.action = {
      actionType: AuthConstants.LOGIN,
      data: {username: "test", pass: "golfing123"}
    };
    registeredCallback(payload);
    expect(this.AuthStore.login).toHaveBeenCalled();
    expect(this.AuthStore.login).toHaveBeenCalledWith("test","golfing123");
    expect(this.AuthStore.emitChange).toHaveBeenCalled();
  });

  it('should call logout when it receives a logout action', function() {
    spyOn(this.AuthStore, 'logout');
    var payload = {};
    payload.action = {
      actionType: AuthConstants.LOGOUT
    };
    registeredCallback(payload);
    expect(this.AuthStore.logout).toHaveBeenCalled();
  });



});