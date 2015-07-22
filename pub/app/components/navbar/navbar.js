var React = require('react');
var Router = require('react-router');
var AuthActions = require('../../actions/AuthActions');
var AuthStore = require('../../stores/AuthStore');
var Link = Router.Link;

// TODO - factor out navbar login form

var Navbar = React.createClass({

  getInitialState: function(){
    return {
      loggedIn: AuthStore.loggedIn()
    };
  },

  componentWillMount: function(){
    // _onChange is cb function.
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
      location.hash = '/';
    }
  },

  navlogout: function(){
    AuthActions.logout();
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

  render: function(){
    return (
    <nav className="navbar navbar-inverse">
      <div className="container-fluid">

        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="#">App</a>
        </div>
        
        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">

          {this.state.loggedIn ? (
            <form className="navbar-form navbar-right" role="login">
              <div className="form-group">
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

            <li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Dropdown <span className="caret"></span></a>
              <ul className="dropdown-menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="#">Separated link</a></li>
                <li role="separator" className="divider"></li>
                <li><a href="#">One more separated link</a></li>
              </ul>
            </li>
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