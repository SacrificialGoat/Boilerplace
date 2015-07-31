var React = require('react');
var ProfileStore = require('../../stores/ProfileStore');
var ProfileActions = require('../../actions/ProfileActions');
var Bio = require('./user-bio');
var BioThreads = require('./user-threads');
var Chatbox = require('./user-chatbox');
var ChatActions = require('../../actions/ChatActions');
var ChatStore = require('../../stores/ChatStore');

var AuthStore = require('../../stores/AuthStore');

var MessageActions = require('../../actions/MessageActions');
var MessageStore = require('../../stores/MessageStore');

var User = React.createClass({
  // TODO: Incorporate Later when Auth is in.

  getInitialState: function(){
    return {
      avatar_link: "",
      bio: "",
      first_name: "",
      last_name: "",
      user_name: "",
      user_id: this.props.params.id,
      rep: 0,
      loggedIn: AuthStore.loggedIn(),
      chatbox: false,
      directMsgs: [],
      from_user: 0 // user id used for direct messaging
    };
  },

  componentDidMount: function(){
    // TODO: fetch by user ID
    ProfileActions.fetch();
    ProfileActions.fetchById({id:this.props.params.id});
    ProfileStore.addChangeListener(this._onChange);
    AuthStore.addChangeListener(this._onChange);
    ChatStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ProfileStore.removeChangeListener(this._onChange);
    ChatStore.removeChangeListener(this._onChange);
    AuthStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    // TODO: Set by getUser()
    if(ProfileStore.getBio()){
      this.setState({
        from_user: ProfileStore.getBio().user_id
      });
    }
      this.setState({
        first_name: ProfileStore.getOtherBio().first_name,
        last_name: ProfileStore.getOtherBio().last_name,
        user_name: ProfileStore.getOtherBio().user_name,
        user_id: ProfileStore.getOtherBio().user_id,
        bio: ProfileStore.getOtherBio().bio,
        avatar_link: ProfileStore.getOtherBio().avatar_link,
        rep: ProfileStore.getOtherBio().rep,
        directMsgs: ChatStore.getDirectMessages(),
        loggedIn: AuthStore.loggedIn()
      });
  },

  chat: function(){
    this.setState({
      chatbox: !this.state.chatbox
    });
  },

  joinChat: function(){
    // ChatActions.connect();
  },

  sendMessage: function(msg){
    ChatActions.sendDm({ userId:this.state.user_id, message:msg });
  },

  sendPM: function(title,body){
    console.log('sending...',this.state.user_id,title,body);
    MessageActions.send({ userId:this.state.user_id, title:title, body:body });
  },

  render: function() {
    return (
      <div className="profile">
        <Bio loggedIn={this.state.loggedIn} onSendPM={this.sendPM} onChat={this.chat} item={this.state} />
        <BioThreads id={this.props.params.id}/>
        {this.state.chatbox ? (
          <Chatbox messages={this.state.directMsgs} onSend={this.sendMessage} onChat={this.joinChat}/>
        ) : (
          null
        )}
      </div>
    );
  }
});

module.exports = User;