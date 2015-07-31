var React = require('react');
var InboxItem = require('./inbox-item');
// var ThreadStore = require('../../stores/ThreadStore');
// var ThreadActions = require('../../actions/ThreadActions');
// var ProfileThreadItem = require('./profile-threaditem');

var Inbox = React.createClass({
  // TODO: Incorporate Later when Auth is in.

  getInitialState: function(){
    return {
      page: 1,
      messages: []
    };
  },

  componentDidMount: function(){
    // ThreadActions.fetchUserPage({page:this.state.page});
    // ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    // ThreadStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    // this.setState({
    //   threads: ThreadStore.getUserThreads().forumThreads
    // });
    // console.log(this.state.threads);
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