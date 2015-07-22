var React = require('react');
var ThreadStore = require('../../stores/ThreadStore');
var ThreadActions = require('../../actions/ThreadActions');

var CommentList = require('../comment/comment-list');
var CommentInput = require('../comment/comment-input');

var Thread = React.createClass({

  getInitialState: function(){
    return {
      id:this.props.params.id,
      title: '',
      body: '',
      rating: null
    };
  },

  componentDidMount: function(){
    ThreadActions.fetchThread({id:this.state.id});
    ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ThreadStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState({
      title: ThreadStore.getThread().forumThreads[0].title,
      body: ThreadStore.getThread().forumThreads[0].body,
      rating: ThreadStore.getThread().forumThreads[0].rating
    });
  },

  render: function() {
    return (
      <div className="col-md-12">
        <h3> {this.state.title} </h3>
        <div className="card">
          <p> {this.state.body} </p>
        </div> 
        <p> Rating: {this.state.rating} </p>

        <CommentList threadId={this.state.id}/>
      </div>
    );
  }
});

module.exports = Thread;