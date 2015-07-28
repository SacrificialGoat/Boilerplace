var React = require('react');
var ThreadStore = require('../../stores/ThreadStore');
var ThreadActions = require('../../actions/ThreadActions');

var CommentList = require('../comment/comment-list');
var CommentInput = require('../comment/comment-input');

// User profile is needed to fetch user id to make thread edit/deletable
// TODO: Profile fetching should be in main app
var ProfileStore = require('../../stores/ProfileStore');
var ProfileActions = require('../../actions/ProfileActions');

var Thread = React.createClass({

  getInitialState: function(){
    return {
      id:this.props.params.id,
      title: '',
      body: '',
      userId: null,
      tag: null,
      profileId: null,
      rating: null,
      editable: false, // when user Id and profile Id match
      editMode: false // when in edit mode
    };
  },

  componentDidMount: function(){
    ThreadActions.fetchThread({id:this.state.id});
    ProfileStore.fetch();

    ProfileStore.addChangeListener(this._onProfileChange);
    ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ProfileStore.removeChangeListener(this._onProfileChange);
    ThreadStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState({
      title: ThreadStore.getThread().forumThreads[0].title,
      body: ThreadStore.getThread().forumThreads[0].body,
      rating: ThreadStore.getThread().forumThreads[0].rating,
      userId: ThreadStore.getThread().forumThreads[0].user_id
    });
    console.log(this.state.userId,this.state.profileId);
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
    console.log(this.state.userId,this.state.profileId);
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
  },

  deleteThread: function(e){
    e.preventDefault();
    // TODO: Send DELETE request for this thread.
    // TODO: Redirect to front page
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
          <p>Title: <input type="text" ref="title" value={this.state.title}></input></p>
          ):(
          <h3> {this.state.title} </h3>
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