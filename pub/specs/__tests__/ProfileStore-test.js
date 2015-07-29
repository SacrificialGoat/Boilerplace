jest.dontMock('../../app/stores/ProfileStore');
jest.dontMock('../../node_modules/object-assign');

describe('ProfileStore', function() {
  var ProfileConstants = require('../../app/constants/ProfileConstants')
  var AppDispatcher, ProfileStore, callback;

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

  var profileFetch = {
      actionType: ProfileConstants.FETCH
  };
  var profileFetchById = {
      actionType: ProfileConstants.FETCHBYID,
      data: fakeUser
  };
  var profileUpdate = {
      actionType: ProfileConstants.UPDATE,
      data: fakeUser
  };
  var profileDelete = {
      actionType: ProfileConstants.DELETE,
      data: null
  };

  beforeEach(function() {
    AppDispatcher = require('../../app/dispatchers/AppDispatcher.js');
    ProfileStore = require('../../app/stores/ProfileStore');
    callback = AppDispatcher.register.mock.calls[0][0];
  });

  it('registers a callback with the dispatcher', function() {
    expect(AppDispatcher.register.mock.calls.length).toBe(1);
  });

  it('initializes with no users', function() {
    var empty = ProfileStore.getBio();
    console.log("empty is: ", empty);
    expect(empty).toEqual(emptyUser);
    empty = ProfileStore.getOtherBio();
    expect(empty).toEqual(emptyUser);
  });

  it('stores the current user', function() {
    callback(profileFetch);
    var prof = ProfileStore.getBio();
    expect(prof).toBe({});
    // expect(all[keys[0]].text).toEqual('foo');
  });

  // it('destroys a to-do item', function() {
  //   callback(actionTodoCreate);
  //   var all = TodoStore.getAll();
  //   var keys = Object.keys(all);
  //   expect(keys.length).toBe(1);
  //   actionTodoDestroy.id = keys[0];
  //   callback(actionTodoDestroy);
  //   expect(all[keys[0]]).toBeUndefined();
  // });



});
