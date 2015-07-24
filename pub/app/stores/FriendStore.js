var React = require('react');
var AppDispatcher = require('../dispatchers/AppDispatcher');
var FriendConstants = require('../constants/FriendConstants');
var FriendService = require('../services/FriendService');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";


/*
set friendList:  
	[{"id":1,"username":"bryan","first":"bryan","last":"liu"},
	{"id":2,"username":"alex","first":"alex","last":"alex"},
	{"id":5,"username":"eee","first":"eee","last":"eee"}]
*/

var _friendData = {
	friendList: null,  
	isTargetFriend: false,
}


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


var FriendStore = assign({}, EventEmitter.prototype, {
	updateFriendStatus: function(targetUser){
		var targetUser = targetUser;
		_searchFriendInList(targetUser);

		console.log("updateFriendStatusis set: ", _friendData.isTargetFriend)
	}, 

	addFriend: function(data){
		var targetUser = data.targetUser;
		var context = this;
		console.log("add friend tirggered")
		// send Ajax
		$.ajax({
			type: 'POST',
			url: '/friend/?action=add',
			data: JSON.stringify({
			  // user_id: currUser,
			  "friend_id": parseInt(targetUser)
			}),
			crossDomain: true,
			success: function(resp) { // receive Friend List from Server. Set variable friendlist to resp data
			  console.log('success',resp);
			  context.fetchFriendList()

			},
			error: function(err){
				console.log("error, ", err)
			}
		});
	},

	removeFriend: function(data){
		var targetUser = data.targetUser;
		var context = this;

		console.log("Remove Friend triggered")
		// send Ajax
		$.ajax({
			type: 'POST',
			url: '/friend/?action=remove',
			data: JSON.stringify({
			  // user_id: currUser,
			  "friend_id": parseInt(targetUser)
			}),
			crossDomain: true,
			success: function(resp) { // receive Friend List from Server. Set variable friendlist to resp data
			  console.log('success',resp);
			  context.fetchFriendList()
			},
			error: function(err){
				console.log("error, ", err)
			}
		});
	},

	getFriendStatus: function(targetUser){
		this.updateFriendStatus(targetUser)
		return _friendData.isTargetFriend
	},

	getFriendList: function(){
		return _friendData.friendList;
	},

	fetchFriendList: function(){
		console.log("Triggering fetchFriendList")

		// send Ajax
		$.ajax({
			type: 'GET',
			url: '/friend/',
			// data: JSON.stringify({
			//   // user_id: currUser,
			// }),
			crossDomain: true,
			success: function(resp) { // receive Friend List from Server. Set variable friendlist to resp data
			  console.log('fetchFriendList ajax success',resp);
			  // update friendList with server resp
			  _friendData.friendList = JSON.parse(resp).friends;
			  console.log("fetchfriend list, set _friendData.friendList", _friendData.friendList)
	  		FriendStore.emitChange();
			},
			error: function(err){
				console.log("fetchFriendList ajax err, ", err)
			}
		})

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
});

AppDispatcher.register(function(payload){
  var action = payload.action;
  switch(action.actionType){   // action.actionType, action.data

    case FriendConstants.ADD_FRIEND:
    	FriendStore.addFriend(action.data);
    	// FriendStore.emitChange();
    	break;

  	case FriendConstants.REMOVE_FRIEND:
    		FriendStore.removeFriend(action.data);
    		// FriendStore.emitChange();
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