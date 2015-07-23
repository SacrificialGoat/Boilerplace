var React = require('react');
var Chat = require('../../services/ChatService');

var Chatbox = React.createClass({

  getInitialState: function(){
    return {
      messages: []
    };
  },

  componentDidMount: function(){
    //TODO: Move to action -> dispatcher -> store
    Chat.connect();
  },

  componentWillUnmount: function(){

  },

  handleSubmit: function(e){
    e.preventDefault();
    //TODO: Move to action -> dispatcher -> store

    Chat.sendMessage(React.findDOMNode(this.refs.message).value);
    // var msgs = this.state.messages;
    // msgs.push(React.findDOMNode(this.refs.message).value);
    // this.setState({
    //   messages:msgs
    // });
    React.findDOMNode(this.refs.message).value = '';

  },

  render: function() {
    return (
      <div className="chatbox">
        <ul ref="chatList">
          { 
          this.state.messages.map(function(item){
            return (
              <li>{item}</li>
            );
          },this)
          }
        </ul>
        <form onSubmit={this.handleSubmit}>
          <input ref="message" type="text" className="form-control" placeholder="type a message..."/>
        </form>
      </div>
    );
  }
});

module.exports = Chatbox;