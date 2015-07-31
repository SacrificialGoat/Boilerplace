var TestUtils = require('react-addons').TestUtils;
var ThreadConstants = require('../../../app/constants/ThreadConstants')
var registeredCallback;

var testThread = {threadId: 4, title: "first post", body: "this is a test thread", link: "www.cats.cats", tag: "feline", lat: 0.1234, lng: 5.6789};
var testQuery = {query: "SEARCH * FROM threads"};
var testPage = {id: 1, page: {"this": "is a test"}}
var testIds = {threadId: 4, thread_id: 16};


describe("ThreadStore", function() {

  beforeAll(function(){
    var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
    spyOn(AppDispatcher, "register");
    this.ThreadStore = require('../../../app/stores/ThreadStore');
    registeredCallback = AppDispatcher.register.calls.argsFor(0)[0];
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

var testIds = {threadId: 4, thread_id: 16};


  it('should call search when it receives a search action', function() {
    spyOn(this.ThreadStore, 'search');
    var payload = {};
    payload.action = {
      actionType: ThreadConstants.SEARCH,
      data: testQuery
    };
    registeredCallback(payload);
    expect(this.ThreadStore.search).toHaveBeenCalled();
    expect(this.ThreadStore.search).toHaveBeenCalledWith("SEARCH * FROM threads");
  });

  it('should call fetchPage when it receives a fetchPage action', function() {
    spyOn(this.ThreadStore, 'fetchPage');
    var payload = {};
    payload.action = {
      actionType: ThreadConstants.FETCHPAGE,
      data: testPage
    };
    registeredCallback(payload);
    expect(this.ThreadStore.fetchPage).toHaveBeenCalled();
    expect(this.ThreadStore.fetchPage).toHaveBeenCalledWith({"this": "is a test"});
  });

  it('should call fetchUserPage when it receives a fetchUserPage action', function() {
    spyOn(this.ThreadStore, 'fetchUserPage');
    var payload = {};
    payload.action = {
      actionType: ThreadConstants.FETCHUSERPAGE,
      data: testPage
    };
    registeredCallback(payload);
    expect(this.ThreadStore.fetchUserPage).toHaveBeenCalled();
    expect(this.ThreadStore.fetchUserPage).toHaveBeenCalledWith({"this": "is a test"});
  });

  it('should call fetchOtherPage when it receives a fetchOtherPage action', function() {
    spyOn(this.ThreadStore, 'fetchOtherPage');
    var payload = {};
    payload.action = {
      actionType: ThreadConstants.FETCHOTHERPAGE,
      data: testPage
    };
    registeredCallback(payload);
    expect(this.ThreadStore.fetchOtherPage).toHaveBeenCalled();
    expect(this.ThreadStore.fetchOtherPage).toHaveBeenCalledWith(1, {"this": "is a test"});
  });

  it('should call fetchThread when it receives a fetchThread action', function() {
    spyOn(this.ThreadStore, 'fetchThread');
    var payload = {};
    payload.action = {
      actionType: ThreadConstants.FETCHTHREAD,
      data: testPage
    };
    registeredCallback(payload);
    expect(this.ThreadStore.fetchThread).toHaveBeenCalled();
    expect(this.ThreadStore.fetchThread).toHaveBeenCalledWith(1);
  });

  it('should call add when it receives an add action', function() {
    spyOn(this.ThreadStore, 'add');
    var payload = {};
    payload.action = {
      actionType: ThreadConstants.ADD,
      data: testThread
    };
    registeredCallback(payload);
    expect(this.ThreadStore.add).toHaveBeenCalled();
    expect(this.ThreadStore.add).toHaveBeenCalledWith("first post", "this is a test thread", "www.cats.cats", "feline", 0.1234, 5.6789);
  });

  it('should call edit when it receives an edit action', function() {
    spyOn(this.ThreadStore, 'edit');
    var payload = {};
    payload.action = {
      actionType: ThreadConstants.EDIT,
      data: testThread
    };
    registeredCallback(payload);
    expect(this.ThreadStore.edit).toHaveBeenCalled();
    expect(this.ThreadStore.edit).toHaveBeenCalledWith(4, "first post", "this is a test thread", "www.cats.cats", "feline");
  });

  it('should call delete when it receives an delete action', function() {
    spyOn(this.ThreadStore, 'delete');
    var payload = {};
    payload.action = {
      actionType: ThreadConstants.DELETE,
      data: testIds
    };
    registeredCallback(payload);
    expect(this.ThreadStore.delete).toHaveBeenCalled();
    expect(this.ThreadStore.delete).toHaveBeenCalledWith(4);
  });

  it('should call upVote when it receives an upvote action', function() {
    spyOn(this.ThreadStore, 'upVote');
    var payload = {};
    payload.action = {
      actionType: ThreadConstants.UPVOTE,
      data: testIds
    };
    registeredCallback(payload);
    expect(this.ThreadStore.upVote).toHaveBeenCalled();
    expect(this.ThreadStore.upVote).toHaveBeenCalledWith(16);
  });

  it('should call downVote when it receives an downvote action', function() {
    spyOn(this.ThreadStore, 'downVote');
    var payload = {};
    payload.action = {
      actionType: ThreadConstants.DOWNVOTE,
      data: testIds
    };
    registeredCallback(payload);
    expect(this.ThreadStore.downVote).toHaveBeenCalled();
    expect(this.ThreadStore.downVote).toHaveBeenCalledWith(16);
  });
  

});