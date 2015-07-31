var TestUtils = require('react-addons').TestUtils;
var CommentConstants = require('../../../app/constants/CommentConstants')
var registeredCallback;
// var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
// this.CommentStore = require('../../../app/stores/CommentStore');


describe("CommentStore", function() {
  beforeEach(function(){
    var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
    spyOn(AppDispatcher, "register");
    this.CommentStore = require('../../../app/stores/CommentStore');
    if (AppDispatcher.register.calls.argsFor(0).length > 0) {
      registeredCallback = AppDispatcher.register.calls.argsFor(0)[0];
      console.log(registeredCallback);
    }
  });

  // afterEach(function(){
  //   AppDispatcher.register.removeAllSpies();
  // });


  it("should be an object", function() {
    expect(typeof this.CommentStore).toBe('object');
  });

  it("emitChange should be a function", function() {
    expect(typeof this.CommentStore.emitChange).toBe('function');
  });

  it('should have an addChangeListener method', function(){
    expect(this.CommentStore.addChangeListener).toBeDefined();
  });
  
  it('should have a removeChangeListener method', function(){
    expect(this.CommentStore.removeChangeListener).toBeDefined();
  });

  it('should have a getComment method', function(){
    expect(this.CommentStore.getComment).toBeDefined();
  });
  
  it('should have a getComments method', function(){
    expect(this.CommentStore.getComments).toBeDefined();
  });

  it('should have a getUserComments method', function(){
    expect(this.CommentStore.getUserComments).toBeDefined();
  });
  
  it('should have a fetchPage method', function(){
    expect(this.CommentStore.fetchPage).toBeDefined();
  });

  it('should have a fetchUserPage method', function(){
    expect(this.CommentStore.fetchUserPage).toBeDefined();
  });

  it('should have an add method', function(){
    expect(this.CommentStore.add).toBeDefined();
  });

  it('should have an upVote method', function(){
    expect(this.CommentStore.upVote).toBeDefined();
  });

  it('should have a downVote method', function(){
    expect(this.CommentStore.downVote).toBeDefined();
  });

});