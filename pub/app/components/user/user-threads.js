var React = require('react');
var ThreadStore = require('../../stores/ThreadStore');
var ThreadActions = require('../../actions/ThreadActions');
var ProfileThreadItem = require('./user-threaditem');

var BioThreads = React.createClass({
  // TODO: Incorporate Later when Auth is in.

  getInitialState: function(){
    return {
      page: 1,
      threads: []
    };
  },

  componentDidMount: function(){
    // TODO: Fetch User Page by ID
    ThreadActions.fetchOtherPage({id: this.props.id, page:this.state.page});
    ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ThreadStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    // TODO: Get User Threads by ID
    this.setState({
      threads: ThreadStore.getOtherUserThreads().forumThreads
    });
  },

  render: function() {
    return (
      <div className="col-md-9">
        <h3>User Threads</h3>
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