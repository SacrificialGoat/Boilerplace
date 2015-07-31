var React = require('react'); // Addons needed for input field changes
var ThreadStore = require('../../stores/ThreadStore');
var ThreadActions = require('../../actions/ThreadActions');

var CommentList = require('../comment/comment-list');
var CommentInput = require('../comment/comment-input');

// User profile is needed to fetch user id to make thread edit/deletable
var ProfileStore = require('../../stores/ProfileStore');
var ProfileActions = require('../../actions/ProfileActions');

// Auth for login/logout change
var AuthStore = require('../../stores/AuthStore');

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
  // mixins: [React.addons.LinkedStateMixin],

  getInitialState: function(){
    return {
      id:this.props.params.id,
      voted: 0,
      alert: false,
      loggedIn: false,
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
    ProfileActions.fetch();

    ThreadActions.fetchThread({id:this.state.id});

    ThreadStore.addChangeListener(this._onChange);
    ProfileStore.addChangeListener(this._onChange);
    AuthStore.addChangeListener(this._onChange);

    if(ProfileStore.getBio()){
      this.setState({
        profileId: ProfileStore.getBio().user_id
      });
    }else{
      this.setState({
        profileId: null
      });
    }
  },

  componentWillUnmount: function(){
    ThreadStore.removeChangeListener(this._onChange);
    ProfileStore.removeChangeListener(this._onChange);
    AuthStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){

    if(!this.state.voted){
      // if person didn't click vote
      this.setState({
        rating: ThreadStore.getThread().forumThreads[0].rating
      });
    }
    
    // Update states from fetch
    this.setState({
      title: ThreadStore.getThread().forumThreads[0].title,
      body: ThreadStore.getThread().forumThreads[0].body,
      userId: ThreadStore.getThread().forumThreads[0].user_id,
      user_name: ThreadStore.getThread().forumThreads[0].user_name,
      link: ThreadStore.getThread().forumThreads[0].link,
      tag: ThreadStore.getThread().forumThreads[0].tag,
      creation_time: formatDate(ThreadStore.getThread().forumThreads[0].creation_time),
      last_update_time: formatDate(ThreadStore.getThread().forumThreads[0].last_update_time),
      last_post_time: formatDate(ThreadStore.getThread().forumThreads[0].last_post_time),
      post_count: ThreadStore.getThread().forumThreads[0].post_count,
      loggedIn: AuthStore.loggedIn()
    });

    if(ProfileStore.getBio()){
      this.setState({
        profileId: ProfileStore.getBio().user_id
      });
    }else{
      this.setState({
        profileId: null
      });
    }

    if(this.state.userId === this.state.profileId){
      this.setState({
        editable: true
      });
    }else{
      this.setState({
        editable: false
      });
    }

  },

  editThread: function(e){
    e.preventDefault();
    this.setState({
      editMode:true
    });
    // Set the input fields to the fetched values

    var that = this;
    setTimeout(function(){
      React.findDOMNode(that.refs.title).value = that.state.title;
      React.findDOMNode(that.refs.body).value = that.state.body;
      React.findDOMNode(that.refs.link).value = that.state.link;
      React.findDOMNode(that.refs.tag).value = that.state.tag;
    },0);

  },

  saveEdit: function(e){
    e.preventDefault();
    this.setState({
      editMode:false
    });
    // TODO: Send PUT request with all info.
    ThreadActions.edit({
      threadId: this.state.id,
      title: React.findDOMNode(this.refs.title).value.trim(),
      body: React.findDOMNode(this.refs.body).value.trim(),
      link: React.findDOMNode(this.refs.link).value.trim(),
      tag: React.findDOMNode(this.refs.tag).value.trim()
    });

    this.setState({
      title: React.findDOMNode(this.refs.title).value.trim(),
      body: React.findDOMNode(this.refs.body).value.trim(),
      link: React.findDOMNode(this.refs.link).value.trim(),
      tag: React.findDOMNode(this.refs.tag).value.trim()
    });

    ThreadActions.fetchThread({id:this.state.id});
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

  upVote: function(e){
    e.preventDefault();
    // TODO: call thread action to upvote
    if(this.state.voted <= 0){
      ThreadActions.upVote({thread_id:this.props.params.id});
      this.setState({
        voted: this.state.voted+1,
        rating: this.state.rating+1
      });
    }
  },

  downVote: function(e){
    e.preventDefault();
    // TODO: call thread action to downvote
    // Disable voting when already voted
    if(this.state.voted >= 0){
      ThreadActions.downVote({thread_id:this.props.params.id});
      this.setState({
        voted: this.state.voted-1,
        rating: this.state.rating-1
      });
    }
  },

  // Show alert when not logged in to vote
  redirect: function(e){
    e.preventDefault();
    this.setState({
      alert: true
    });
  },

  render: function() {

    return (
      <div className="col-md-12 thread">
        {this.state.alert ? (
          <div className="alert alert-danger">
            <strong>Please Log in</strong> to use this feature.
          </div>
          ):(
          null
        )}

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
          <p>Title: <input type="text" ref="title"></input></p>
          ):(
          <h3> {this.state.title} </h3>
        ) }
        { this.state.editMode ? (
          <p>Link: <input type="text" ref="link"></input></p>
          ):(
          <a href={this.state.link}> {this.state.link} </a>
        ) }
        { this.state.editMode ? (
          <p>Body: <input type="text" ref="body"></input></p>
          ):(
          <p> {this.state.body} </p>
        ) }
        <p> Rating: {this.state.rating} </p>

        {this.state.loggedIn ? (
          <div className="votes">
            <a href="#" ref="down" className="glyphicon glyphicon-chevron-down" aria-hidden="true" onClick={this.downVote}></a> {this.state.rating} <a href="#" ref="up" className="glyphicon glyphicon-chevron-up" aria-hidden="true" onClick={this.upVote}></a>
          </div>
          ) : (
          <div className="votes">
            <a href="#" ref="down" className="glyphicon glyphicon-chevron-down" aria-hidden="true" onClick={this.redirect}></a> {this.state.rating} <a href="#" ref="up" className="glyphicon glyphicon-chevron-up" aria-hidden="true" onClick={this.redirect}></a>
          </div>
        )}

        { this.state.editMode ? (
          <p>Tag: <input type="text" ref="tag"></input></p>
          ):(
          <p className="tag">{this.state.tag} </p>
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
          <br></br>
        <CommentList profileId={this.state.profileId} threadId={this.state.id}/>
      </div>
    );
  }
});

module.exports = Thread;