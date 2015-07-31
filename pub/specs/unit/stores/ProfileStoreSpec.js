var TestUtils = require('react-addons').TestUtils;
var ProfileConstants = require('../../../app/constants/ProfileConstants')
var ProfileService = require('../../../app/services/ProfileService')
var registeredCallback;

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

  beforeAll(function(){
    var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
    spyOn(AppDispatcher, "register");
    this.ProfileStore = require('../../../app/stores/ProfileStore');
    registeredCallback = AppDispatcher.register.calls.argsFor(0)[0];
    // if (AppDispatcher.register.calls.argsFor(0).length > 0) {
    // }
  });

  it("should be an object", function() {
    expect(typeof this.ProfileStore).toBe('object');
  });

  it("emitChange should be a function", function() {
    expect(typeof this.ProfileStore.emitChange).toBe('function');
  });

  it('should have a getBio method', function(){
    expect(this.ProfileStore.getBio).toBeDefined();
  });

  it('should return a stored user when getBio is called', function() {
    var user = this.ProfileStore.getBio();
    expect(user).toEqual(emptyUser);
  });
  
  it('should have a getOtherBio method', function(){
    expect(this.ProfileStore.getOtherBio).toBeDefined();
  });

  it('should return a stored user when getOtherBio is called', function() {
    var other = this.ProfileStore.getOtherBio();
    expect(other).toEqual(emptyUser);
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
  
  it('should have a delete method', function(){
    expect(this.ProfileStore.delete).toBeDefined();
  });

  it('should initialize with an empty user', function() {
    var empty = this.ProfileStore.getBio();
    expect(empty).toEqual(emptyUser);
    empty = this.ProfileStore.getOtherBio();
    expect(empty).toEqual(emptyUser);
  })

  it('requests user data from the profile service when it receives a fetch action', function() {
    spyOn(this.ProfileStore, 'fetch');
    spyOn(this.ProfileStore, 'emitChange');
    var payload = {};
    payload.action = {
      actionType: ProfileConstants.FETCH
    };
    registeredCallback(payload);
    expect(this.ProfileStore.fetch).toHaveBeenCalled();
    expect(this.ProfileStore.emitChange).toHaveBeenCalled();
  });

  it('requests user data by user id when it receives an fetchById action', function() {
    spyOn(this.ProfileStore, 'fetchById');
    spyOn(this.ProfileStore, 'emitChange');
    var payload = {};
    payload.action = {
      actionType: ProfileConstants.FETCHBYID,
      data: fakeUser
    };
    registeredCallback(payload);
    expect(this.ProfileStore.fetchById).toHaveBeenCalled();
    expect(this.ProfileStore.fetchById).toHaveBeenCalledWith(42);
    expect(this.ProfileStore.emitChange).toHaveBeenCalled();
  });

  it('updates user data when it receives an update action', function() {
    spyOn(this.ProfileStore, 'update');
    var payload = {};
    payload.action = {
      actionType: ProfileConstants.UPDATE,
      data: fakeUser
    };
    registeredCallback(payload);
    expect(this.ProfileStore.update).toHaveBeenCalled();
    expect(this.ProfileStore.update).toHaveBeenCalledWith("This is a test user.", "http://www.image.com");
  });

  xit('deletes a user when it receives a delete action', function() {
    spyOn(this.ProfileStore, 'delete');
    var payload = {};
    payload.action = {
      actionType: ProfileConstants.DELETE,
    };
    registeredCallback(payload);
    expect(this.ProfileStore.delete).toHaveBeenCalled();
  });

});