var React = require('react');
var CommentStore = require('../../stores/CommentStore');
var CommentActions = require('../../actions/CommentActions');
var AuthStore = require('../../stores/AuthStore');

var NewComment = React.createClass({

  addComment: function(e){

    e.preventDefault();
    // Send action to update user information
    var body = React.findDOMNode(this.refs.body).value.trim();

    if(!body){
      return;
    }

    this.props.onAddComment(body);
    React.findDOMNode(this.refs.body).value = '';

  },

  render: function() {
    return (
      <div className="newComment">
        <form onSubmit={this.addComment}>
          <input type="textarea" className="form-control" placeholder="comment..." ref="body" />
          <button type="submit" className="btn btn-success" value="Submit">Submit</button>
        </form>
      </div>
    );
  }
});

module.exports = NewComment;