var React = require('react');
var Router = require('react-router');
var AuthActions = require('../../actions/AuthActions');
var AuthStore = require('../../stores/AuthStore');
// Placing direct chat listeners on nav bar
// Ideally it would be inside App component
var ChatStore = require('../../stores/ChatStore');
var ChatActions = require('../../actions/ChatActions');
var ChatBox = require('./navbar-chatbox');

// Profile fetching
var ProfileActions = require('../../actions/ProfileActions');

var ThreadActions = require('../../actions/ThreadActions');
var Link = Router.Link;

// TODO - factor out navbar login form

var Navbar = React.createClass({

  getInitialState: function(){
    return {
      loggedIn: AuthStore.loggedIn(),
      chatWindow: false,
      directMsgs: [],
      dmFrom: 0
    };
  },

  componentWillMount: function(){
    // _onChange is cb function.
    AuthStore.addChangeListener(this._onChange);
    ChatStore.addChangeListener(this._onMsgChange);
  },

  componentWillUnmount: function(){
    AuthStore.removeChangeListener(this._onChange);
    ChatStore.removeChangeListener(this._onMsgChange);
  },

  _onChange: function(){
    this.setState({
      loggedIn: AuthStore.loggedIn()
    });
    if(this.state.loggedIn){
      ProfileActions.fetch();
      location.hash = '/';
    }
  },

  _onMsgChange: function(){
    this.setState({
      directMsgs: ChatStore.getDirectMessages(),
      dmFrom: ChatStore.getReceived().from
    });

    if(!this.state.chatWindow && ChatStore.getReceived().msgReceived){
      // Open chat window
      this.setState({
        chatWindow: true
      });
    }
  },

  navlogout: function(){
    AuthActions.logout();
  },

  handleSearch: function(e){
    e.preventDefault();
    var query = React.findDOMNode(this.refs.searchQ).value.trim();
    ThreadActions.search({query:query});
    React.findDOMNode(this.refs.searchQ).value = '';
  },

  handleSubmit: function(e){
    e.preventDefault();
    var username = React.findDOMNode(this.refs.username).value.trim();
    var password = React.findDOMNode(this.refs.password).value.trim();
    if(!username || !password){
      return;
    }
    // TODO: send request to server
    this.handleLoginSubmit({username: username, password: password});
    React.findDOMNode(this.refs.username).value = '';
    React.findDOMNode(this.refs.password).value = '';
    return;
  },

  handleLoginSubmit: function(user){
    AuthActions.login({username:user.username,pass:user.password});
  },

  sendMessage: function(msg){
    ChatActions.sendDm({ userId:this.state.dmFrom, message:msg });
  },

  render: function(){
    return (
    <nav className="navbar navbar-fixed-top">
      <div className="container-fluid">

      {this.state.chatWindow? (
        <ChatBox messages={this.state.directMsgs} onSend={this.sendMessage}/>
        ):(
        null
      )}

        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="#">Boilerplace</a>
        </div>
        
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">

          <form className="navbar-form navbar-left" onSubmit={this.handleSearch}>
            <input type="text" ref="searchQ" className="form-control" placeholder="Search"/>
            <i className="glyphicon glyphicon-search search-submit" required=""></i>
          </form>

          {this.state.loggedIn ? (
            <form className="navbar-form navbar-right" role="login">
              <div className="form-group">
                <Link className="btn btn-info" to="/new">New</Link>
                <Link className="btn btn-warning" to="/logout" onClick={this.navlogout}>Log out</Link>
              </div>
            </form>
          ) : (
            <form className="navbar-form navbar-right" role="login" onSubmit={this.handleSubmit}>
              <div className="form-group">
                <input type="text" className="form-control" placeholder="Username" ref="username" />
                <input type="text" className="form-control" placeholder="Password" ref="password" />
                <button type="submit" className="btn btn-success hidden" value="Submit">Submit</button>
              </div>
            </form>
          )}
          <li><Link to="/geo">Geo</Link></li>

            {!this.state.loggedIn ? (
              null
            ) : (
              <li><Link to="/inbox">Inbox</Link></li>
            )}          

            {this.state.loggedIn ? (
              null
            ) : (
              <li><Link to="/signup">Register</Link></li>
            )}

            {this.state.loggedIn ? (
              <li><Link to="/profile">Profile</Link></li>
            ) : (
              <li><Link to="/login">Login</Link></li>
            )}

          </ul>
        </div>

      </div>
    </nav>
    )
  }
});

module.exports = Navbar;

// Dropdown Menu for Future implementation

// <li className="dropdown">
//   <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
//   <ul className="dropdown-menu">
//     <li><a href="#">Action</a></li>
//     <li><a href="#">Another action</a></li>
//     <li><a href="#">Something else here</a></li>
//     <li role="separator" className="divider"></li>
//     <li><a href="#">Separated link</a></li>
//     <li role="separator" className="divider"></li>
//     <li><a href="#">One more separated link</a></li>
//   </ul>
// </li>
