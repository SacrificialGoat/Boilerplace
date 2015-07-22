var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var LoginForm = React.createClass({
  handleSubmit: function(e){
    e.preventDefault();
    var username = React.findDOMNode(this.refs.username).value.trim();
    var password = React.findDOMNode(this.refs.password).value.trim();
    if(!username || !password){
      return;
    }
    // Send request back up to Login
    this.props.onLoginSubmit({username: username, password: password});
    
    React.findDOMNode(this.refs.username).value = '';
    React.findDOMNode(this.refs.password).value = '';
    return;
  },
  render: function(){
    return (
      <form className="loginForm" onSubmit={this.handleSubmit}>
        <input type="text" className="form-control" placeholder="Username" ref="username" />
        <input type="password" className="form-control" placeholder="Password" ref="password" />
        <Link className="btn btn-info" to="/signup">Register</Link>
        <button type="submit" className="btn btn-success" value="Submit">Submit</button>
      </form>
    );
  }
});

module.exports = LoginForm;