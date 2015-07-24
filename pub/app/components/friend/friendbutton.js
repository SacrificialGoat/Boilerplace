var React = require('react');
var Button = require('react-bootstrap').Button;
var FriendStore = require("../../stores/FriendStore");
var FriendAction = require("../../actions/FriendActions");
var ProfileStore = require('../../stores/ProfileStore');

/*  Notes:
Inserted at: component/ user.bio
input:   <FriendButton targetuser={this.props.item}/>
*/

var FriendButton = React.createClass({
	getInitialState: function(){
		return {
			showFriendStatus: 'nil',
			friendList: 'nil',
		}
	},

	componentWillMount: function(){
		FriendStore.addChangeListener(this._onChange)
		FriendStore.fetchFriendList();

	},

	componentDidMount: function(){
		FriendStore.addChangeListener(this._onChange)
	},

	componentWillUnmount: function(){
		FriendStore.removeChangeListener(this._onChange)
	},	

	handleAddFriend: function(){
		FriendAction.addFriend(this.props.targetuser.user_id)
	},

	handleRemoveFriend: function(){
		FriendAction.removeFriend(this.props.targetuser.user_id)
	},	

	_onChange: function(){ 
	  targetUserId = this.props.targetuser.user_id
	  this.setState({
	    friendList: FriendStore.getFriendList(),   
	    showFriendStatus: FriendStore.getFriendStatus(targetUserId)
	  })


	},

	render: function() {
	  return (
	  	<div>
		  	<div>{this.state.showFriendStatus ? <Button onClick={this.handleRemoveFriend}>Unfriend</Button> : <Button onClick={this.handleAddFriend}>Add Friend</Button>  }</div>
	  	</div>
	  );
	}


});

module.exports = FriendButton;



