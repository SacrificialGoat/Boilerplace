var React = require('react');

var FriendStore = require("../../stores/FriendStore");
var FriendAction = require("../../actions/FriendActions");

var FriendList = React.createClass({
	getInitialState: function(){
		return {
			friendList: 123
		}
	},

	componentWillMount: function(){
		console.log("Mounting FriendStore.connectFriendOnline")
		FriendStore.connectFriendOnline();
	},

	componentDidMount: function(){

	},

	render: function(){
		return (
			<div className="friend-list">{this.state.friendList}
			</div>
		)
	}

});

module.exports = FriendList;