var React = require('react');

var FriendStore = require("../../stores/FriendStore");
var FriendAction = require("../../actions/FriendActions");

var FriendList = React.createClass({
	getInitialState: function(){
		return {
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
			<div className="friend-list">
				<ul>
				  {listItems}
				</ul>
			</div>
		)
	},

});

module.exports = FriendList;