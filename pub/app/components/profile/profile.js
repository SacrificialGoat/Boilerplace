var React = require('react');
var AuthStore = require('../../stores/AuthStore');
var ProfileStore = require('../../stores/ProfileStore');
var ProfileActions = require('../../actions/ProfileActions');
var Bio = require('./profile-bio');
var BioThreads = require('./profile-threads');

var Router = require('react-router');

var Profile = React.createClass({
  // TODO: Incorporate Later when Auth is in.
  mixins : [Router.Navigation],

  getInitialState: function(){
    if(!AuthStore.loggedIn()){
      // location.hash = '/login';
      this.transitionTo("front");
    }
    return {
      avatar_link: "",
      bio: "",
      first_name: "",
      last_name: "",
      user_name: "",
      user_id: 0,
      rep: 0
    };
  },

  componentDidMount: function(){
    ProfileActions.fetch();
    ProfileStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ProfileStore.removeChangeListener(this._onChange);
  },

  editProfile: function(data){
    // Send action to update user information
    ProfileActions.update({
      avatar_link: data.avatar_link,
      bio: data.bio
    });
  },

  _onChange: function(){
      this.setState({
        first_name: ProfileStore.getBio().first_name,
        last_name: ProfileStore.getBio().last_name,
        user_name: ProfileStore.getBio().user_name,
        user_id: ProfileStore.getBio().user_id,
        bio: ProfileStore.getBio().bio,
        avatar_link: ProfileStore.getBio().avatar_link,
        rep: ProfileStore.getBio().rep
      });

  },

  render: function() {
    return (
      <div className="profile">
        <Bio onEditSubmit={this.editProfile} item={this.state} />
        <BioThreads />
      </div>
    );
  }
});

module.exports = Profile;