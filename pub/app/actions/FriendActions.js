var AppDispatcher = require('../dispatchers/AppDispatcher');
var FriendConstants = require('../constants/FriendConstants');

var FriendActions = {
	addFriend: function(targetUser){
		AppDispatcher.handleAction({
			actionType: FriendConstants.ADD_FRIEND,
			data: {
				targetUser: targetUser
			}
		})	
	},

	removeFriend: function(targetUser){
		AppDispatcher.handleAction({
			actionType: FriendConstants.REMOVE_FRIEND,
			data: {
				targetUser: targetUser
			}
		})	
	},

	fetchFriendList: function(targetUser){
		AppDispatcher.handleAction({
			actionType: FriendConstants.FETCH_FRIENDLIST,
			data: {
				targetUser: targetUser
			}
		})
	},

}

module.exports = FriendActions;
