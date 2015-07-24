var FriendService = {
	addFriend: function(targetUser, context){

		var targetUser = targetUser;
		var context = context;
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

	removeFriend: function(targetUser, context){
		var targetUser = targetUser;
		var context = context;

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

	fetchFriendList: function(friendData,context){
		var context = context;
		// send Ajax
		$.ajax({
			type: 'GET',
			url: '/friend/',
			crossDomain: true,
			success: function(resp) { // receive Friend List from Server. Set variable friendlist to resp data
			  // console.log('fetchFriendList ajax success',resp);
			  // update friendList with server resp
			  friendData.friendList = JSON.parse(resp).friends;
	  		context.emitChange();
			},
			error: function(err){
				console.log("fetchFriendList ajax err, ", err)
			}
		})
	},

}

module.exports = FriendService;