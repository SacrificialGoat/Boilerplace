var TestUtils = require('react-addons').TestUtils;
var CommentConstants = require('../../../app/constants/CommentConstants')
var registeredCallback;

var mockComment = {
  threadId: 3,
  post_id: 13,
  page: ['page test'],
  body: {'body': 'test'}
};

describe("CommentStore", function() {
  beforeAll(function(){
    var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
    spyOn(AppDispatcher, "register");
    this.CommentStore = require('../../../app/stores/CommentStore');
    registeredCallback = AppDispatcher.register.calls.argsFor(0)[0];
  });


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

  it('should call fetchPage when it receives a fetchPage action', function() {
    spyOn(this.CommentStore, 'fetchPage');
    spyOn(this.CommentStore, 'emitChange');
    var payload = {};
    payload.action = {
      actionType: CommentConstants.POST_FETCHPAGE,
      data: mockComment
    };
    registeredCallback(payload);
    expect(this.CommentStore.fetchPage).toHaveBeenCalled();
    expect(this.CommentStore.fetchPage).toHaveBeenCalledWith(3, ['page test']);
    expect(this.CommentStore.emitChange).toHaveBeenCalled();
  });

  it('should call fetchUserPage when it receives a fetchUserPage action', function() {
    spyOn(this.CommentStore, 'fetchUserPage');
    spyOn(this.CommentStore, 'emitChange');
    var payload = {};
    payload.action = {
      actionType: CommentConstants.POST_FETCHUSERPAGE,
      data: mockComment
    };
    registeredCallback(payload);
    expect(this.CommentStore.fetchUserPage).toHaveBeenCalled();
    expect(this.CommentStore.fetchUserPage).toHaveBeenCalledWith(['page test']);
    expect(this.CommentStore.emitChange).toHaveBeenCalled();
  });

  it('should call add when it receives an add action', function() {
    spyOn(this.CommentStore, 'add');
    var payload = {};
    payload.action = {
      actionType: CommentConstants.POST_ADD,
      data: mockComment
    };
    registeredCallback(payload);
    expect(this.CommentStore.add).toHaveBeenCalled();
    expect(this.CommentStore.add).toHaveBeenCalledWith(3, {'body': 'test'});
  });

  it('should call edit when it receives an edit action', function() {
    spyOn(this.CommentStore, 'edit');
    var payload = {};
    payload.action = {
      actionType: CommentConstants.POST_EDIT,
      data: mockComment
    };
    registeredCallback(payload);
    expect(this.CommentStore.edit).toHaveBeenCalled();
    expect(this.CommentStore.edit).toHaveBeenCalledWith(13, {'body': 'test'});
  });
  
  it('should call delete when it receives a delete action', function() {
    spyOn(this.CommentStore, 'delete');
    var payload = {};
    payload.action = {
      actionType: CommentConstants.POST_DELETE,
      data: mockComment
    };
    registeredCallback(payload);
    expect(this.CommentStore.delete).toHaveBeenCalled();
    expect(this.CommentStore.delete).toHaveBeenCalledWith(13);
  });

  it('should call upVote when it receives an upvote action', function() {
    spyOn(this.CommentStore, 'upVote');
    var payload = {};
    payload.action = {
      actionType: CommentConstants.POST_UPVOTE,
      data: mockComment
    };
    registeredCallback(payload);
    expect(this.CommentStore.upVote).toHaveBeenCalled();
    expect(this.CommentStore.upVote).toHaveBeenCalledWith(13);
  });

  it('should call downVote when it receives a downvote action', function() {
    spyOn(this.CommentStore, 'downVote');
    var payload = {};
    payload.action = {
      actionType: CommentConstants.POST_DOWNVOTE,
      data: mockComment
    };
    registeredCallback(payload);
    expect(this.CommentStore.downVote).toHaveBeenCalled();
    expect(this.CommentStore.downVote).toHaveBeenCalledWith(13);
  });


});