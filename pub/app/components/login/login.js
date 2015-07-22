var React = require('react');
var LoginForm = require('./login-form');
var AuthActions = require('../../actions/AuthActions');
var AuthStore = require('../../stores/AuthStore');

var Login = React.createClass({
  getInitialState: function(){
    return {
      loggedIn: AuthStore.loggedIn(),
      error: AuthStore.error()
    };
  },

  componentWillMount: function(){
    AuthStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    AuthStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState({
      loggedIn: AuthStore.loggedIn(),
      error: AuthStore.error()
    });
    if(this.state.loggedIn){
      location.hash = '/';
    }
  },

  handleLoginSubmit: function(user){
    AuthActions.login({username:user.username,pass:user.password});
  },

  render: function() {
    return (
      <div className="Auth center-block">
        <h2>Login</h2>
        {this.state.loggedIn ? (
            <p> You are already logged in </p>
          ) : (
            <LoginForm onLoginSubmit={this.handleLoginSubmit}/>
          )}
        {this.state.error && (<p className="error">Bad login information</p>)}
      </div>
    );
  }
});

module.exports = Login;