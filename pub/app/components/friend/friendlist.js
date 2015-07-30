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
		AuthStore.addChangeListenerStatus(this._onChange);
		FriendStore.addChangeListenerOnline(this._onChange)
		FriendStore.connectWs();
	},

	componentWillUnmount: function(){
		FriendStore.removeChangeListenerOnline(this._onChange)
		AuthStore.removeChangeListenerStatus(this._onChange);

	},	

	_onChange: function(){ 
		if (this.state.loggedIn === true && AuthStore.loggedIn() === false){
			FriendStore.disconnectWs()
		}
		if (this.state.loggedIn === false && AuthStore.loggedIn() === true){
			FriendStore.connectWs()
		}

	  this.setState({
	  	loggedIn: AuthStore.loggedIn(),
	    friendOnline: FriendStore.getFriendOnline(),   
	  })

	},

	render: function(){
		console.log()

		var listItems = this.state.friendOnline.map(function(item, index){
		  return (
		    <div key={index} className="friend-online-status">
		        {item.username}
		    </div>
		  )
		}.bind(this));
		return (
			<div className="friend-list" >
				{this.state.loggedIn ? <div className="friend-online-list">{listItems}</div> : "not logged in"}
			</div>
		)

	},

});

module.exports = FriendList;