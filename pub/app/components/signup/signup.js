var React = require('react');
var SignupForm = require('./signup-form');
var AuthActions = require('../../actions/AuthActions');
var AuthStore = require('../../stores/AuthStore');

var Router = require('react-router');

var Signup = React.createClass({
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

  handleSignupSubmit: function(user){
    AuthActions.signup({
      firstname: user.firstname, 
      lastname: user.lastname, 
      username: user.username, 
      password: user.password, 
      error: user.error
    });
  },

  render: function() {
    return (
      <div className="Auth center-block">
        <h2>Sign up</h2>
          <SignupForm onSignupSubmit={this.handleSignupSubmit}/>
      </div>
    );
  }
});

module.exports = Signup;