var TestUtils = require('react-addons').TestUtils;
var ThreadConstants = require('../../../app/constants/ChatConstants')
var registeredCallback;
// var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
// this.AuthStore = require('../../../app/stores/AuthStore');



describe("AuthStore", function() {
  beforeEach(function(){
    var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
    spyOn(AppDispatcher, "register");
    this.AuthStore = require('../../../app/stores/AuthStore');
    if (AppDispatcher.register.calls.argsFor(0).length > 0) {
      registeredCallback = AppDispatcher.register.calls.argsFor(0)[0];
      console.log(registeredCallback);
    }
  });

  // afterEach(function(){
  //   AppDispatcher.register.removeAllSpies();
  // });


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



});