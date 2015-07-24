var AppDispatcher = require('../dispatchers/AppDispatcher');
var FriendConstants = require('../constants/FriendConstants');

var FriendActions = {
	addFriend: function(currUser, targetUser){
		AppDispatcher.handleAction({
			actionType: FriendConstants.ADD_FRIEND,
			data: {
				currUser: currUser,
				targetUser: targetUser
			}
		})	
	},

	removeFriend: function(){
		AppDispatcher.handleAction({
			actionType: FriendConstants.REMOVE_FRIEND,
			data: {
				currUser: currUser,
				targetUser: targetUser
			}
		})	
	},

	fetchFriendList: function(currUser, targetUser){
		AppDispatcher.handleAction({
			actionType: FriendConstants.FETCH_FRIENDLIST,
			data: {
				currUser: currUser,
				targetUser: targetUser
			}
		})
	},

	setFriendStatus: function(currUser, targetUser){
		AppDispatcher.handleAction({
			actionType: FriendConstants.SET_FRIENDSTATUS,
			data: {
				currUser: currUser,
				targetUser: targetUser
			}
		})
	}
}

module.exports = FriendActions;
