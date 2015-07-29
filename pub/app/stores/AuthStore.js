var AppDispatcher = require('../dispatchers/AppDispatcher');
var AuthConstants = require('../constants/AuthConstants');
var Auth = require('../services/AuthService');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var STATUS_EVENT = 'friendstatus'

var _user = {username:'user'};
var _loggedIn = null;
var _error = null;

var AuthStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
     this.emit(STATUS_EVENT)
     this.emit(CHANGE_EVENT);
   },

  getUser: function(){
    return _user;
  },

  error: function(){
    return _error;
  },

  login: function(username,pass){
    var that = this;
    _error = false;
    Auth.login(username,pass,function(success){

      if(success){
        _loggedIn = true;
        _user = {username: username};
      }else{
        _loggedIn = false;
        _error = true;
      }
      that.emitChange();

    });
  },
  // log out user
  logout: function() {
    var that = this;
    Auth.logout(function(){
      _loggedIn = false;
      that.emitChange();

    });
  },

  loggedIn: function() {
    return Auth.loggedIn();
  },

  signup: function(username,password,firstname,lastname){
    var that = this;
    _error = false;
    Auth.signup(username, password, firstname, lastname, function(success) {

      if(success){
        _loggedIn = true;
      }else{
        _loggedIn = false;
        _error = true;
      }
      that.emitChange();

    });
  },

  addChangeListener: function(cb) {
    this.on(CHANGE_EVENT, cb)
  },

  removeChangeListener: function(cb) {
    this.removeListener(CHANGE_EVENT, cb);
  },


  addChangeListenerStatus: function(cb) {
    this.on(STATUS_EVENT, cb)
  },

  removeChangeListenerStatus: function(cb) {
    this.removeListener(STATUS_EVENT, cb);
  }


});


AppDispatcher.register(function(payload){
  var action = payload.action;

  switch(action.actionType){
    case AuthConstants.SIGNUP:
      AuthStore.signup(action.data.username,action.data.password,action.data.firstname,action.data.lastname);
      AuthStore.emitChange();
      break;
    case AuthConstants.LOGIN:
      AuthStore.login(action.data.username,action.data.pass);
      AuthStore.emitChange();
      break;
    case AuthConstants.LOGOUT:
      AuthStore.logout();
      // RouterContainer.get().transitionTo('/login');
      break;
    default:
      return true;
  }

  AuthStore.emitChange();
  return true;
});

module.exports = AuthStore;