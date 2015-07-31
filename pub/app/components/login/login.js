var React = require('react');
var LoginForm = require('./login-form');
var AuthActions = require('../../actions/AuthActions');
var AuthStore = require('../../stores/AuthStore');

var Router = require('react-router');

var Login = React.createClass({
  mixins : [Router.Navigation],

  getInitialState: function(){
    return {
      loggedIn: AuthStore.loggedIn()
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
      loggedIn: AuthStore.loggedIn()
    });
    if(this.state.loggedIn){
      // location.hash = '/';
      this.transitionTo("front");
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
      </div>
    );
  }
});

module.exports = Login;