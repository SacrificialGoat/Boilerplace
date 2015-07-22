var TestUtils = require('react-addons').TestUtils;
var AuthStore = require('../../../app/stores/AuthStore');
var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');

describe("AuthStore", function() {

  beforeEach(function(){
    

  });

  afterEach(function(){
    

  });

  it("should be an object", function() {
    expect(typeof AuthStore).toBe('object');
  });

  it("emitChange should be a function", function() {
    expect(typeof AuthStore.emitChange).toBe('function');
  });

  it("should have null values on initialize", function() {
    expect(AuthStore.error()).toBe(null);
  });

  it('should have a addChangeListener method', function(){
    expect(AuthStore.addChangeListener).toBeDefined();
  });
  
  it('should have a removeChangeListener method', function(){
    expect(AuthStore.removeChangeListener).toBeDefined();
  });

  it('should have a login method', function(){
    expect(AuthStore.login).toBeDefined();
  });
  
  it('should have a logout method', function(){
    expect(AuthStore.logout).toBeDefined();
  });

  it('should have a loggedin method', function(){
    expect(AuthStore.loggedIn).toBeDefined();
  });
  
  it('should have a signup method', function(){
    expect(AuthStore.signup).toBeDefined();
  });



});