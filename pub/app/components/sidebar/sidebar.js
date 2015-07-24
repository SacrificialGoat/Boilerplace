var React = require('react');
var Chat = require('./sidebar-chat');
var ChatActions = require('../../actions/ChatActions');
var AuthStore = require('../../stores/AuthStore');
var Map = require('./map');

// TODO - factor out navbar login form

var Sidebar = React.createClass({

    getInitialState: function(){
      return {
        from: null
      };
    },

    componentDidMount: function(){
      AuthStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function(){
      AuthStore.removeChangeListener(this._onChange);
    },

    _onChange: function(){
      // TODO: Set by getUser()
        this.setState({
          from: AuthStore.getUser().username
        });
    },

    joinChat: function(){
      ChatActions.connect();
    },

    sendMessage: function(msg){
      ChatActions.send({message:msg});
    },

    render: function(){

    return (
    <div id="sidebar-wrapper">
        <ul className="sidebar-nav">
            <li className="sidebar-brand">
                <a href="#">
                    Welcome
                </a>
            </li>

            <li>
                <a href="#">Trending</a>
            </li>

            <li>
                <a href="#">Friends</a>
            </li>

            <li>
                <a href="#">Chat (global)</a>
            </li>

            <Chat user={this.state.from} onSend={this.sendMessage} onChat={this.joinChat} />

        </ul>
    </div>
    );
  }
});

module.exports = Sidebar;
    
