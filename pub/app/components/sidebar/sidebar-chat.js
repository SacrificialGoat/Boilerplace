var React = require('react');

var GlobalChat = React.createClass({

  getInitialState: function(){
    return {
    };
  },

  componentDidMount: function(){
    this.props.onChat(); // joins the chat
  },

  componentWillUnmount: function(){

  },

  handleSubmit: function(e){
    e.preventDefault();
    var text = React.findDOMNode(this.refs.message).value;
    React.findDOMNode(this.refs.message).value = '';
    this.props.onSend(text);
  },

  render: function() {
    return (
      <div className="globalChat">
        <ul ref="chatList">
          { 
          this.props.messages.map(function(item){
            return (
              <li>{item.username}: {item.message}</li>
            );
          },this)
          }
        </ul>
        <form onSubmit={this.handleSubmit}>
          <input ref="message" type="text" placeholder="type a message..."/>
        </form>
      </div>
    );
  }

});

module.exports = GlobalChat;