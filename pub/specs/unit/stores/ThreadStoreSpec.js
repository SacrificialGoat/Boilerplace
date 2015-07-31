var TestUtils = require('react-addons').TestUtils;
var ThreadConstants = require('../../../app/constants/ThreadConstants')
// var registeredCallback;
// var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
// this.ThreadStore = require('../../../app/stores/ThreadStore');


describe("ThreadStore", function() {

  beforeAll(function(){
    var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
    spyOn(AppDispatcher, "register");
    this.ThreadStore = require('../../../app/stores/ThreadStore');
    var registeredCallback = AppDispatcher.register.calls.argsFor(0)[0];
  });

  it("should be an object", function() {
    expect(typeof this.ThreadStore).toBe('object');
  });

  it("emitChange should be a function", function() {
    expect(typeof this.ThreadStore.emitChange).toBe('function');
  });

  it('should have a getThread method', function(){
    expect(this.ThreadStore.getThread).toBeDefined();
  });
  
  it('should have a getThreads method', function(){
    expect(this.ThreadStore.getThreads).toBeDefined();
  });

  it('should have a getUserThreads method', function(){
    expect(this.ThreadStore.getUserThreads).toBeDefined();
  });
  
  it('should have a getOtherUserThreads method', function(){
    expect(this.ThreadStore.getOtherUserThreads).toBeDefined();
  });

  it('should have a fetchThread method', function(){
    expect(this.ThreadStore.fetchThread).toBeDefined();
  });
  
  it('should have a fetchPage method', function(){
    expect(this.ThreadStore.fetchPage).toBeDefined();
  });

  it('should have a fetchUserPage method', function(){
    expect(this.ThreadStore.fetchUserPage).toBeDefined();
  });

  it('should have a fetchOtherPage method', function(){
    expect(this.ThreadStore.fetchOtherPage).toBeDefined();
  });

  it('should have an add method', function(){
    expect(this.ThreadStore.add).toBeDefined();
  });

  it('should have an upVote method', function(){
    expect(this.ThreadStore.upVote).toBeDefined();
  });

  it('should have a downVote method', function(){
    expect(this.ThreadStore.downVote).toBeDefined();
  });

  it('should have an edit method', function(){
    expect(this.ThreadStore.edit).toBeDefined();
  });

  it('should have a delete method', function(){
    expect(this.ThreadStore.delete).toBeDefined();
  });

  it('should have a search method', function(){
    expect(this.ThreadStore.search).toBeDefined();
  });

  it('should have an addChangeListener method', function(){
    expect(this.ThreadStore.addChangeListener).toBeDefined();
  });

  it('should have a removeChangeListener method', function(){
    expect(this.ThreadStore.removeChangeListener).toBeDefined();
  });

});