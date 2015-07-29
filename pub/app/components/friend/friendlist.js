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
		FriendStore.addChangeListenerOnline(this._onChange)
		FriendStore.connectWs();
		AuthStore.addChangeListener(this._onChange);
	},

	componentDidMount: function(){
		AuthStore.addChangeListener(this._onChange);
	},

	componentWillUnmount: function(){
		FriendStore.removeChangeListenerOnline(this._onChange)
		AuthStore.removeChangeListener(this._onChange);

	},	

	_onChange: function(){ 
		console.log("triggering onChange FriendList. state.loggedin / Auth.loggedin", this.state.loggedIn, AuthStore.loggedIn())
		if (this.state.loggedIn === true && AuthStore.loggedIn() === false){
			console.log("onChange User Loggedout")
			FriendStore.disconnectWs()
		}
		if (this.state.loggedIn === false && AuthStore.loggedIn() === true){
			console.log("onChange User Loggedin")
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