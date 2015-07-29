var React = require('react');

var FriendStore = require("../../stores/FriendStore");
var FriendAction = require("../../actions/FriendActions");
var AuthStore = require('../../stores/AuthStore');


var FriendList = React.createClass({
	getInitialState: function(){
		return {
			loggedIn: AuthStore.loggedIn(),
			friendOnline: []
		}
	},

	componentWillMount: function(){
		console.log("Mounting FriendStore.connectFriendOnline")
		FriendStore.connectFriendOnline();
	},

	componentDidMount: function(){
		FriendStore.addChangeListenerOnline(this._onChange)
	},

	componentWillUnmount: function(){
		FriendStore.removeChangeListenerOnline(this._onChange)
	},	

	_onChange: function(){ 
	  this.setState({
	  	loggedIn: AuthStore.loggedIn(),
	    friendOnline: FriendStore.getFriendOnline(),   
	  })

	},

	render: function(){
		console.log()

		var listItems = this.state.friendOnline.map(function(item, index){
		  return (
		    <li key={index}  >
		      <span>
		        {item.username}
		      </span>
		    </li>
		  )
		}.bind(this));
		return (
			<div className="friend-list" >
				{this.state.loggedIn ? <ul>{listItems}</ul> : "not logged in"}
			</div>
		)

	},

});

module.exports = FriendList;