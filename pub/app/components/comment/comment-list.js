var React = require('react');
var AuthStore = require('../../stores/AuthStore');
var CommentStore = require('../../stores/CommentStore');
var CommentActions = require('../../actions/CommentActions');
var CommentItem = require('./comment-item');
var NewComment = require('./comment-input');

// Front page Comments
// Fetch Comments by rating by page

var CommentList = React.createClass({
  getInitialState: function(){
    return {
      page: 1,
      comments: [{
        body: 'fake body',
        rating: 5,
        creation_time: "2015-07-19T10:31:04Z",
        last_update_time: "2015-07-20T12:31:00Z",
        comment_id: 4,
        user_id: 1,
        user_name: '',
        loggedIn: AuthStore.loggedIn()
      }]
    };
  },

  componentDidMount: function(){
    CommentActions.fetchPage({threadId: this.props.threadId, page:this.state.page});
    CommentStore.addChangeListener(this._onChange);
    AuthStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    CommentStore.removeChangeListener(this._onChange);
    AuthStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState({
      comments: CommentStore.getComments().threadPosts,
      loggedIn: AuthStore.loggedIn()
    });
  },

  addComment: function(body){
    CommentActions.add({threadId:this.props.threadId, body:body});
    CommentActions.fetchPage({threadId: this.props.threadId, page:this.state.page});
  },

  upVote: function(id){
    // TODO: call Comment action to upvote
    console.log('upvoting...',id);
    CommentActions.upVote({post_id:id});
  },

  downVote: function(id){
    // TODO: call Comment action to downvote
    CommentActions.downVote({post_id:id});
  },

  render: function() {
    return (
      <div className="Comments">
        
        {this.state.loggedIn ? (
          <NewComment onAddComment={this.addComment}/>
          ) : <p> Please log in to comment. </p> }

          <h3>Comments</h3>
          <table className="table table-hover">
          
            <thead>
              <tr>
                <th>Rating</th>
                <th>Body</th>
                <th>Submitted</th>
                <th>Created</th>
                <th>Updated</th>
              </tr>
            </thead>

            <tbody>
              {
                this.state.comments.map(function(item){
                  return (
                    <CommentItem 
                      ref = "comment" 
                      onGoThread = {this.goThread} 
                      onUpVote = {this.upVote} 
                      onDownVote = {this.downVote} 
                      key = {item.post_id} 
                      item = {item} />
                  );
                },this)
              }
            </tbody>

          </table>
          
      </div>
    );
  }
});

module.exports = CommentList;