var TestUtils = require('react-addons').TestUtils;
var ProfileConstants = require('../../../app/constants/ProfileConstants')
var registeredCallback;
var $ = require('jquery');
// var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
// this.ProfileStore = require('../../../app/stores/ProfileStore');

var fakeUser = {
  avatar_link: "http://www.image.com",
  bio: "This is a test user.",
  first_name: "Testy",
  last_name: "McTesterson",
  user_name: "notreal",
  id: 42,
  rep: 2
};

var emptyUser = {
  avatar_link: "",
  bio: "",
  first_name: "",
  last_name: "",
  user_name: "",
  id: 0,
  rep: 0
};


describe("ProfileStore", function() {

  beforeEach(function(){
    var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
    spyOn(AppDispatcher, "register");
    this.ProfileStore = require('../../../app/stores/ProfileStore');
    if (AppDispatcher.register.calls.argsFor(0).length > 0) {
      registeredCallback = AppDispatcher.register.calls.argsFor(0)[0];
      console.log(registeredCallback);
    }
  });

  // afterEach(function(){
  //   AppDispatcher.register.removeAllSpies();
  // });

  it("should be an object", function() {
    expect(typeof this.ProfileStore).toBe('object');
  });

  it("emitChange should be a function", function() {
    expect(typeof this.ProfileStore.emitChange).toBe('function');
  });

  it('should have a getBio method', function(){
    expect(this.ProfileStore.getBio).toBeDefined();
  });
  
  it('should have a getOtherBio method', function(){
    expect(this.ProfileStore.getOtherBio).toBeDefined();
  });

  it('should have a fetch method', function(){
    expect(this.ProfileStore.fetch).toBeDefined();
  });
  
  it('should have a fetchById method', function(){
    expect(this.ProfileStore.fetchById).toBeDefined();
  });

  it('should have a update method', function(){
    expect(this.ProfileStore.update).toBeDefined();
  });
  
  // it('should have a delete method', function(){
  //   expect(ProfileStore.delete).toBeDefined();
  // });

  it('should initialize with an empty user', function() {
    var empty = this.ProfileStore.getBio();
    expect(empty).toEqual(emptyUser);
    empty = this.ProfileStore.getOtherBio();
    expect(empty).toEqual(emptyUser);
  })

  it('requests user data from the profile service', function() {
    spyOn(this.ProfileStore, 'fetch');
    var payload = {};
    payload.action = {
      actionType: ProfileConstants.FETCH
    };
    registeredCallback(payload);
    expect(this.ProfileStore.fetch).toHaveBeenCalled();
  });

  it('requests user data from the profile service', function() {
    spyOn(this.ProfileStore, 'fetch');
    var payload = {};
    payload.action = {
      actionType: ProfileConstants.FETCH
    };
    registeredCallback(payload);
    expect(this.ProfileStore.fetch).toHaveBeenCalled();
    // expect(this.ProfileStore.emitChange).toHaveBeenCalled();
  });

  it('requests user data by user id', function() {
    spyOn(this.ProfileStore, 'fetchById');
    var payload = {};
    payload.action = {
      actionType: ProfileConstants.FETCHBYID
      data: {id: 1}
    };
    registeredCallback(payload);
    expect(this.ProfileStore.fetchbyId).toHaveBeenCalled();
    expect(this.ProfileStore.fetchbyId.calls.argsFor(0)[0]).toEqual(1);
  });

    // expect($.ajax).toBeCalledWith({
    //   type: 'GET',
    //   url: '/profile/',
    // });


});