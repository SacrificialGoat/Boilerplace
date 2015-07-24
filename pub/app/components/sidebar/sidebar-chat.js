var React = require('react');

var GlobalChat = React.createClass({

  getInitialState: function(){
    return {
      messages: []
    };
  },

  componentDidMount: function(){
    this.props.onChat(); // joins the chat
  },

  componentWillUnmount: function(){

  },

  handleSubmit: function(e){
    e.preventDefault();
    
    this.props.onSend(React.findDOMNode(this.refs.message).value);
    React.findDOMNode(this.refs.message).value = '';
  },

  render: function() {
    return (
      <div className="globalChat">
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
          <input ref="message" type="text" placeholder="type a message..."/>
        </form>
      </div>
    );
  }

});

module.exports = GlobalChat;