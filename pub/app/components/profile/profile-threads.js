var React = require('react');
var ThreadStore = require('../../stores/ThreadStore');
var ThreadActions = require('../../actions/ThreadActions');
var ProfileThreadItem = require('./profile-threaditem');

var BioThreads = React.createClass({
  // TODO: Incorporate Later when Auth is in.

  getInitialState: function(){
    return {
      page: 1,
      threads: []
    };
  },

  componentDidMount: function(){
    ThreadActions.fetchUserPage({page:this.state.page});
    ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ThreadStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState({
      threads: ThreadStore.getUserThreads().forumThreads
    });
    console.log(this.state.threads);
  },

  render: function() {
    return (
      <div className="col-md-9">
        <h3>My Threads</h3>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Rating</th>
              <th>Title</th>
              <th>Body</th>
              <th>Submitted</th>
              <th>Created</th>
              <th>Updated</th>
            </tr>
          </thead>

          <tbody>
            {this.state.threads.map(function(item){
              return (
                <ProfileThreadItem key={item.thread_id} item={item}/>
              );
            })}
          </tbody>

        </table>
      </div>
    );
  }
});

module.exports = BioThreads;