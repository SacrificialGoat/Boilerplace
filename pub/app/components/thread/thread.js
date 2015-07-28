var React = require('react');
var ThreadStore = require('../../stores/ThreadStore');
var ThreadActions = require('../../actions/ThreadActions');

var CommentList = require('../comment/comment-list');
var CommentInput = require('../comment/comment-input');

// User profile is needed to fetch user id to make thread edit/deletable
// TODO: Profile fetching should be in main app
var ProfileStore = require('../../stores/ProfileStore');
var ProfileActions = require('../../actions/ProfileActions');

// Relative Time
var ReactIntl = require('react-intl');
var FormattedRelative = ReactIntl.FormattedRelative;
var FormattedDate = ReactIntl.FormattedDate;

// MySQL Date -> JS Date
var formatDate = function(str){
  var dateParts = str.split("-");
  var times = dateParts[2].split(":");
  var hour = times[0].substr(3);
  var minutes = times[1];
  var seconds = times[2].substr(0,2);

  return new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2),hour,minutes,seconds);
};


var Thread = React.createClass({

  getInitialState: function(){
    return {
      id:this.props.params.id,
      title: '',
      body: '',
      userId: null,
      tag: null,
      profileId: null,
      user_name: null,
      link: null,
      creation_time: null,
      last_update_time: null,
      last_post_time: null,
      post_count: null,
      rating: null,
      editable: false, // when user Id and profile Id match
      editMode: false // when in edit mode
    };
  },

  componentDidMount: function(){
    ThreadActions.fetchThread({id:this.state.id});
    ProfileActions.fetch();

    ProfileStore.addChangeListener(this._onProfileChange);
    ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ProfileStore.removeChangeListener(this._onProfileChange);
    ThreadStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    // ThreadActions.fetchThread({id:this.state.id}); // Fetch so the edited data shows up.

    this.setState({
      title: ThreadStore.getThread().forumThreads[0].title,
      body: ThreadStore.getThread().forumThreads[0].body,
      rating: ThreadStore.getThread().forumThreads[0].rating,
      userId: ThreadStore.getThread().forumThreads[0].user_id,
      user_name: ThreadStore.getThread().forumThreads[0].user_name,
      link: ThreadStore.getThread().forumThreads[0].link,
      tag: ThreadStore.getThread().forumThreads[0].tag,
      creation_time: formatDate(ThreadStore.getThread().forumThreads[0].creation_time),
      last_update_time: formatDate(ThreadStore.getThread().forumThreads[0].last_update_time),
      last_post_time: formatDate(ThreadStore.getThread().forumThreads[0].last_post_time),
      post_count: ThreadStore.getThread().forumThreads[0].post_count
    });
    // Run this twice because we don't know which fetch will complete first
    // TODO: Profile fetching should be in main app
    if(this.state.userId === this.state.profileId){
      this.setState({
        editable: true
      });
    }
  },

  _onProfileChange: function(){
    this.setState({
      profileId: ProfileStore.getBio().user_id
    });

    // Run this twice because we don't know which fetch will complete first
    // TODO: Profile fetching should be in main app
    if(this.state.userId === this.state.profileId){
      this.setState({
        editable: true
      });
    }
  },

  editThread: function(e){
    e.preventDefault();
    this.setState({
      editMode:true
    });
  },

  saveEdit: function(e){
    e.preventDefault();
    this.setState({
      editMode:false
    });
    // TODO: Send PUT request with all info.
    ThreadActions.edit({
      threadId: this.state.id,
      title: this.state.title,
      body: this.state.body,
      link: this.state.link,
      tag: this.state.tag
    });
  },

  deleteThread: function(e){
    e.preventDefault();
    // TODO: Send DELETE request for this thread.
    // TODO: Redirect to front page
    ThreadActions.delete({
      threadId: this.state.id
    });
    location.hash = '/';
  },

  render: function() {
    return (
      <div className="col-md-12 thread">
        { this.state.editable ? (
          <a href="#" onClick={this.deleteThread}><i className="glyphicon glyphicon-remove delete-icon"></i></a>
          ):(
            null
          )
        }
        { this.state.editable ? (
          <a href="#" onClick={this.editThread}><i className="glyphicon glyphicon-pencil edit-icon"></i></a>
          ):(
            null
          )
        }
        { this.state.editMode ? (
          <p>Title: <input type="text" ref="title" ></input></p>
          ):(
          <h3> {this.state.title} </h3>
        ) }
        { this.state.editMode ? (
          <p>Link: <input type="text" ref="link" value={this.state.link}></input></p>
          ):(
          <a href={this.state.link}> {this.state.link} </a>
        ) }
        { this.state.editMode ? (
          <p>Body: <input type="text" ref="body" value={this.state.body}></input></p>
          ):(
          <p> {this.state.body} </p>
        ) }
        <p> Rating: {this.state.rating} </p>
        { this.state.editMode ? (
          <p>Tag: <input type="text" ref="tag" value={this.state.tag}></input></p>
          ):(
          <p>Tag: {this.state.tag} </p>
        ) }
        { this.state.editMode ? (
            null
          ) : (
          <div className="meta-info">
            <p>Created: <FormattedRelative value={this.state.creation_time} /> </p>
            <p>Updated: <FormattedRelative value={this.state.last_update_time} /> </p>
            <p>Last comment: <FormattedRelative value={this.state.last_post_time} /></p>
            <p>Posts: {this.state.post_count}</p>
          </div>
          )}
        { this.state.editMode ? (
          <a href="#" className="btn btn-info" onClick={this.saveEdit}> Save </a>
          ):(
          null
        ) }
        <CommentList threadId={this.state.id}/>
      </div>
    );
  }
});

module.exports = Thread;