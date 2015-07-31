var TestUtils = require('react-addons').TestUtils;
var ChatConstants = require('../../../app/constants/ChatConstants')
var registeredCallback;
// var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
// this.ChatStore = require('../../../app/stores/ChatStore');


describe("ClientSocket", function() {
  beforeEach(function(){
    var AppDispatcher = require('../../../app/dispatchers/AppDispatcher');
    spyOn(AppDispatcher, "register");
    this.ChatStore = require('../../../app/stores/ChatStore');
    if (AppDispatcher.register.calls.argsFor(0).length > 0) {
      registeredCallback = AppDispatcher.register.calls.argsFor(0)[0];
      console.log(registeredCallback);
    }
  });

  // afterEach(function(){
  //   AppDispatcher.register.removeAllSpies();
  // });


  it("should be an object", function() {
    expect(typeof this.ChatStore).toBe('object');
  });

  it("emitChange should be a function", function() {
    expect(typeof this.ChatStore.emitChange).toBe('function');
  });

  it('should have a getMessages method', function(){
    expect(this.ChatStore.getMessages).toBeDefined();
  });
  
  it('should have a getDirectMessages method', function(){
    expect(this.ChatStore.getDirectMessages).toBeDefined();
  });

  it('should have a getReceived method', function(){
    expect(this.ChatStore.getReceived).toBeDefined();
  });
  
  it('should have an error method', function(){
    expect(this.ChatStore.error).toBeDefined();
  });

  it('should have a connect method', function(){
    expect(this.ChatStore.connect).toBeDefined();
  });
  
  it('should have a send method', function(){
    expect(this.ChatStore.send).toBeDefined();
  });

  it('should have a sendDM method', function(){
    expect(this.ChatStore.sendDM).toBeDefined();
  });

  it('should have a receive method', function(){
    expect(this.ChatStore.receive).toBeDefined();
  });

  it('should have a receiveDM method', function(){
    expect(this.ChatStore.receiveDM).toBeDefined();
  });

  it('should have an addChangeListener method', function(){
    expect(this.ChatStore.addChangeListener).toBeDefined();
  });

  it('should have a removeChangeListener method', function(){
    expect(this.ChatStore.removeChangeListener).toBeDefined();
  });

});