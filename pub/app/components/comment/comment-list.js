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
      profileId: null,
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

    this.setState({
      profileId: this.props.profileId
    });
  },

  componentWillUnmount: function(){
    CommentStore.removeChangeListener(this._onChange);
    AuthStore.removeChangeListener(this._onChange);

    this.setState({
      profileId: null
    });
  },

  _onChange: function(){
    console.log('changed, changing comment list vars...',this.props.profileId);
    this.setState({
      comments: CommentStore.getComments().threadPosts,
      loggedIn: AuthStore.loggedIn(),
      profileId: this.props.profileId
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

  edit: function(id,body){
    console.log('editing comment',id,body);
    // TODO: Send Edit message.
    CommentActions.edit({
      post_id:id,
      body:body
    });
  },

  delete: function(id){
    CommentActions.delete({
      post_id: id
    });

    var comments = this.state.comments;

    var comment;
    for (var i = 0; i < comments.length; i++) {
      // find matching id
      comment = comments[i];
      if(comment.post_id === id){
        comments.splice(i,1);
        this.setState({
          comments: comments
        });
        return;
      }
    };
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
                <th></th>
              </tr>
            </thead>

            <tbody>
              {
                this.state.comments.map(function(item){
                  return (
                    <CommentItem 
                      ref = "comment" 
                      profileId = {this.state.profileId}
                      onGoThread = {this.goThread} 
                      onUpVote = {this.upVote} 
                      onDownVote = {this.downVote} 
                      key = {item.post_id}
                      onDelete = {this.delete}
                      onEdit = {this.edit}
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