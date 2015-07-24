var React = require('react');
var AppDispatcher = require('../dispatchers/AppDispatcher');
var FriendConstants = require('../constants/FriendConstants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = "change";

			// // Change this when receive server output ajax is live
			// var _serverOutput = [["3", "Jackson"], ["2", "Titto"]  ];

var _friendData = {
	friendList: null,
	isTargetFriend: "false",
}

var _fetchFriendList = function(currUser, targetUser){
	  _friendData.friendList = _serverOutput;  // on change should happen at this point
}

var FriendStore = assign({}, EventEmitter.prototype, {
	setFriendStatus: function(data){
		var currUser = data.targetUser;   // data.currUser, data.targetUser
		var targetUser = data.targetUser;
		var _userFriendList = _friendData.friendList;
		var foundFriend = false;
		if ( _userFriendList !== null ){
			// friendlist exist, check if target user is in list
			for (var i = 0; i < _userFriendList.length; i++){
				if ( _userFriendList[i][0] === targetUser ) foundFriend = true;
			}
			if (foundFriend){
				_friendData.isTargetFriend = "true"
			} else {
				_friendData.isTargetFriend = "false"
			}
			// return _friendData.isTargetFriend
			console.log("_friendData.isTargetFriend is set: ", _friendData.isTargetFriend)
		} 
	},

	addFriend: function(data){
		var currUser = data.targetUser;   // data.currUser, data.targetUser
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
			  // context.fetchFriendList(data)  // not sure if i should call this here.
			},
			error: function(err){
				console.log("error, ", err)
			}
		});
	},

	removeFriend: function(data){
		var currUser = data.targetUser;   // data.currUser, data.targetUser
		var targetUser = data.targetUser;
		var context = this;

		console.log("Remove Friend triggered")
		// send Ajax
		// $.ajax({
		// 	type: 'POST',
		// 	url: '/api/removefriend',
		// 	data: JSON.stringify({
		// 	  user_id: currUser,
		// 	  friend_id: targetUser
		// 	}),
		// 	crossDomain: true,
		// 	success: function(resp) { // receive Friend List from Server. Set variable friendlist to resp data
		// 	  console.log('success',resp);
		// 	  context.fetchFriendList(data)  // not sure if i should call this here.
		// 	}
		// })
	},

	getFriendStatus: function(){
		return _friendData.isTargetFriend
	},

	getFriendList: function(){
		return _friendData.friendList;
	},

	fetchFriendList: function(data){
		var currUser = data.currUser;   // data.currUser, data.targetUser
		var targetUser = data.targetUser;

		// send Ajax
		$.ajax({
			type: 'GET',
			url: '/get/friendlist',
			data: JSON.stringify({
			  user_id: currUser,
			}),
			crossDomain: true,
			success: function(resp) { // receive Friend List from Server. Set variable friendlist to resp data
			  console.log('success',resp);
			  // _friendData.friendList = _fakeData;
			  _friendData.friendList = resp;
	  		FriendStore.emitChange();
			},
		})

		// _fetchFriendList(currUser, targetUser)  // this is for testing


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
    	FriendStore.emitChange();
    	break;

  	case FriendConstants.REMOVE_FRIEND:
    		FriendStore.removeFriend(action.data);
  		break;

    case FriendConstants.SET_FRIENDSTATUS:  // 
    	FriendStore.setFriendStatus(action.data);
    	FriendStore.emitChange();
    	break;

    case FriendConstants.FETCH_FRIENDLIST:
    	FriendStore.fetchFriendList(action.data)
    	break;

  	default:
  		return true;
	}

	// need emit chagne?
	FriendStore.emitChange();
  return true;
});

module.exports = FriendStore;