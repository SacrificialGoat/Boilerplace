var React = require('react');
var FriendButton = require('../friend/friendbutton');

var Bio = React.createClass({

  chat: function(e){
    e.preventDefault();
    //TODO: Open chat box.
    console.log('chatbox clicked');
    this.props.onChat();
  },

  message: function(e){
    e.preventDefault();
    console.log('message clicked');
  },

  render: function() {
    return (
      <div className="col-md-3">
        <h3>{this.props.item.user_name}</h3>
        <h3>{this.props.item.first_name} {this.props.item.last_name}</h3>

          <img src={this.props.item.avatar_link} className="img-thumbnail"></img>


        <p>Rep: {this.props.item.rep}</p>
        <p>Id: {this.props.item.user_id}</p>
        <p>Bio: {this.props.item.bio}</p>

        <i className="glyphicon glyphicon-comment chatIcon" onClick={this.chat}>&nbsp;</i>
        <i className="glyphicon glyphicon-envelope messageBox" onClick={this.message}></i>
        <FriendButton targetuser={this.props.item}/>

      </div>
    );
  }
});

module.exports = Bio;