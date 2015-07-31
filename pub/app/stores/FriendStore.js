var React = require('react');
var AppDispatcher = require('../dispatchers/AppDispatcher');
var FriendConstants = require('../constants/FriendConstants');
var FriendService = require('../services/FriendService');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";
var ONLINE_STATUS = 'friendonlinestatus'

var _friendData = {
	friendList: null,  
	isTargetFriend: false,
	onlineFriendList: []
}

// ========= Private Methods =========

var _searchFriendInList = function(targetUser){
	var targetUser = targetUser;
	var _userFriendList = _friendData.friendList;
	var foundFriend = false;
	if ( _userFriendList !== null ){
		// friendlist exist, check if target user is in list
		for (var i = 0; i < _userFriendList.length; i++){
			if ( _userFriendList[i].id === parseInt(targetUser) ) foundFriend = true;
		}
		if (foundFriend){
			_friendData.isTargetFriend = true
		} else {
			_friendData.isTargetFriend = false
		}
	}
};

var conn;

var _clientSocket = {
  connect: function(){
    console.log('connecting to Friend Online Status...');
    conn = new WebSocket("ws://"+window.location.host+"/friendlist/");
    _ws =  conn;
    conn.onclose = function(evt) {
        console.log("WS closing")
    }

    conn.onmessage = function(evt) {   // listen to broadcast
        _friendData.onlineFriendList = JSON.parse(evt.data).friends
        FriendStore.emitChangeOnline()
    }
  },

  disconnect: function(){
    console.log("closing ws....")
    conn.close()
  }
}


// ============= Friend Store ===============


var FriendStore = assign({}, EventEmitter.prototype, {
	connectWs: function(){
		_clientSocket.connect()
	},

    disconnectWs: function(){
        _clientSocket.disconnect()
    },

	updateFriendOnline: function(){

	},

	updateFriendStatus: function(targetUser){
		var targetUser = targetUser;
		_searchFriendInList(targetUser);
	}, 

	addFriend: function(data){
		var targetUser = data.targetUser;
		FriendService.addFriend(targetUser, this);
	},

	removeFriend: function(data){
		var targetUser = data.targetUser;
		FriendService.removeFriend(targetUser, this);
	},

	getFriendStatus: function(targetUser){
		this.updateFriendStatus(targetUser)
		return _friendData.isTargetFriend
	},

	getFriendList: function(){
		return _friendData.friendList;
	},

	fetchFriendList: function(){
		FriendService.fetchFriendList(_friendData,this)

	  return _friendData.friendList;
	},

	emitChange: function(){
		this.emit(CHANGE_EVENT);
	}, 

  addChangeListener: function(cb){
      this.on(CHANGE_EVENT, cb);
  }, 

  removeChangeListener: function(cb){
      this.removeListener(CHANGE_EVENT, cb)
  },

  getFriendOnline: function(){
      return _friendData.onlineFriendList;
  },

  emitChangeOnline: function(){
      this.emit(ONLINE_STATUS);
  }, 

  addChangeListenerOnline: function(cb){
      this.on(ONLINE_STATUS, cb);
  }, 

  removeChangeListenerOnline: function(cb){
      this.removeListener(ONLINE_STATUS, cb)
  },


});

AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){   // action.actionType, action.data

  	// For Add, Remove, Fetch, emitting change oocurs in AJAX calls fetch (FriendService.fetchFriendList(_friendData,this))

    case FriendConstants.ADD_FRIEND:
    	FriendStore.addFriend(action.data);

    	break;

  	case FriendConstants.REMOVE_FRIEND:
    		FriendStore.removeFriend(action.data);

  		break;

    case FriendConstants.FETCH_FRIENDLIST:
    	FriendStore.fetchFriendList(action.data)
    	break;

  	default:
  		return true;
	}

	// need emit chagne?
	// FriendStore.emitChange();
  return true;
});

module.exports = FriendStore;


/*
TODO:
Websocket friend status:
	Frontend: receive websocket push of friends who are online.  Once receive latest update, change state for rendering
	Backend: check target user's friendlist. Build "connect" map to track all users who are connected to service. 
	 Check user friendlist against current connections.  Push results to user

*/

