var TestUtils = require('react-addons').TestUtils;
var CommentStore = require('../../../app/stores/CommentStore');
var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');

describe("CommentStore", function() {

  beforeEach(function(){
    

  });

  afterEach(function(){
    

  });

  it("should be an object", function() {
    expect(typeof CommentStore).toBe('object');
  });

  it("emitChange should be a function", function() {
    expect(typeof CommentStore.emitChange).toBe('function');
  });

  it('should have a addChangeListener method', function(){
    expect(CommentStore.addChangeListener).toBeDefined();
  });
  
  it('should have a removeChangeListener method', function(){
    expect(CommentStore.removeChangeListener).toBeDefined();
  });

  it('should have a getComment method', function(){
    expect(CommentStore.getComment).toBeDefined();
  });
  
  it('should have a getComments method', function(){
    expect(CommentStore.getComments).toBeDefined();
  });

  it('should have a getUserComments method', function(){
    expect(CommentStore.getUserComments).toBeDefined();
  });
  
  it('should have a fetchPage method', function(){
    expect(CommentStore.fetchPage).toBeDefined();
  });

  it('should have a fetchUserPage method', function(){
    expect(CommentStore.fetchUserPage).toBeDefined();
  });

  it('should have a add method', function(){
    expect(CommentStore.add).toBeDefined();
  });

  it('should have a upVote method', function(){
    expect(CommentStore.upVote).toBeDefined();
  });

  it('should have a downVote method', function(){
    expect(CommentStore.downVote).toBeDefined();
  });



});