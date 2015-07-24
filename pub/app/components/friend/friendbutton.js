var React = require('react');
var Button = require('react-bootstrap').Button;
var FriendStore = require("../../stores/FriendStore");
var FriendAction = require("../../actions/FriendActions");
var ProfileStore = require('../../stores/ProfileStore');

		// TESTING
			var _userBio = 2;
			var userId = function(){
				_userBio = user_id;  // dont know where to get user ID.  Temp set to window.user_id
			}

var FriendButton = React.createClass({
	getInitialState: function(){
		return {
			showFriendStatus: 'nil',
			friendList: null,
		}
	},

	componentWillMount: function(){
		FriendStore.addChangeListener(this._onChange)
		FriendAction.setFriendStatus(_userBio, this.props.targetuser.user_id)
	},

	componentDidMount: function(){
		FriendStore.addChangeListener(this._onChange)

	},

	componentWillUnmount: function(){
		FriendStore.removeChangeListener(this._onChange)
	},	

	// showFriendStatus: function(){  // this will check target_user against FriendList
	// 	// FriendAction.showFriendStatus(currUser, targetUser)
	// 	// console.log("--- get friend status -- ", FriendStore.getFriendStatus())
	// 	// this.setState({
	// 	// 	showFriendStatus: FriendStore.getFriendStatus()
	// 	// })
	// },

	getFriendList: function(currUser, targetUser){
		FriendAction.fetchFriendList(currUser, targetUser)

	},

	handleAddFriend: function(){
		FriendAction.addFriend(_userBio, this.props.targetuser.user_id)
	},

	handleRemoveFriend: function(){
		// FriendAction.removeFriend(_userBio, this.props.targetuser.user_id)
	},	

	_onChange: function(){ // When target friend list state change, reset state here.
	  this.setState({
	    // friendList: FriendStore.fetchFriendList(_userBio),   // Pass in target_user and current_user?
	    showFriendStatus: FriendStore.getFriendStatus()
	  })


	},

	render: function() {
	  return (
	  	<div>
		  	<div>Friend Status:{this.state.showFriendStatus}</div>
	  		<Button onClick={this.handleAddFriend}>Friend</Button>
	  		<Button onClick={this.handleRemoveFriend}>Unfriend</Button>
	  	</div>
	  );
	}


});

module.exports = FriendButton;



/*  Notes:
<Button onClick={this.handleRemoveFriend}>Unfriend</Button>:<Button onClick={this.handleAddFriend}>Friend</Button>

input:   <FriendButton targetuser={this.props.item}/>


Inserted: user bio

Need:
currentuser
check if "target_user" friendstate

button handle Add/Remove

*/