var React = require('react');
var InboxItem = require('./inbox-item');

var MessageActions = require('../../actions/MessageActions');
var MessageStore = require('../../stores/MessageStore');

var Inbox = React.createClass({
  // TODO: Incorporate Later when Auth is in.

  getInitialState: function(){
    return {
      page: 1,
      messages: []
    };
  },

  componentDidMount: function(){
    MessageActions.fetchPage({page:this.state.page});
    MessageStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    MessageStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    console.log(MessageStore.getMessages());
    this.setState({
      messages: MessageStore.getMessages()
    });
    // console.log(MessageStore.getMessages());
  },

  render: function() {
    return (
      <div>
        <h3>Inbox</h3>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>From</th>
              <th>Title</th>
              <th>Body</th>
              <th>Received</th>
            </tr>
          </thead>

          <tbody>
          {this.state.messages.map(function(item){
            return (
              <InboxItem key={item.msg_id} item={item}/>
            );
          })}
          </tbody>

        </table>
      </div>
    );
  }
});

module.exports = Inbox;

// {this.state.threads.map(function(item){
//   return (
//     <ProfileThreadItem key={item.thread_id} item={item}/>
//   );
// })}