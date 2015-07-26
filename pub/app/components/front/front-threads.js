var React = require('react');
var ThreadStore = require('../../stores/ThreadStore');
var ThreadActions = require('../../actions/ThreadActions');
var ThreadItem = require('./front-threaditem');

// Front page threads
// Fetch threads by rating by page

var Threads = React.createClass({
  getInitialState: function(){
    return {
      page: 1,
      threads: [],
      alert: false
    };
  },

  componentDidMount: function(){
    ThreadActions.fetchPage({page:this.state.page});
    ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ThreadStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState({
      threads: ThreadStore.getThreads().forumThreads
    });
    console.log(this.state.threads);
  },

  upVote: function(id){
    // TODO: call thread action to upvote
    ThreadActions.upVote({thread_id:id});
  },

  downVote: function(id){
    // TODO: call thread action to downvote
    ThreadActions.downVote({thread_id:id});
  },

  goThread: function(id){
    console.log('transitioning to...thread',id);
  },

  showAlert: function(){
    this.props.onAlert();
  },

  render: function() {
    return (
      <div className="threads">
        <p className="showing">showing {this.state.threads.length} threads out of {this.state.threads.length} </p>
          {
            this.state.threads.map(function(item){
              return (
                <ThreadItem 
                  ref = "thread"
                  onAlert = {this.showAlert}
                  loggedIn = {this.props.loggedIn}
                  onGoThread = {this.goThread} 
                  onUpVote = {this.upVote} 
                  onDownVote = {this.downVote} 
                  key = {item.thread_id} 
                  item = {item} />
              );
            },this)
          }
      </div>
    );
  }
});

module.exports = Threads;