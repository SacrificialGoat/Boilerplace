window.$ = window.jQuery = require('jquery');

var React = require('react');
var Router = require('react-router');

var Navbar = require('./components/navbar/navbar');
var Profile = require('./components/profile/profile');
var Front = require('./components/front/front');
var Login = require('./components/login/login');
var Logout = require('./components/logout/logout');
var Signup = require('./components/signup/signup');
var NewThread = require('./components/thread/new');
var Thread = require('./components/thread/thread');
var User = require('./components/user/user');

var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var RouteHandler = Router.RouteHandler;
var Navigation = Router.Navigation;
var Link = Router.Link;

var App = React.createClass({

  getInitialState: function(){
    return {
      // loggedIn: Auth.loggedIn()
    };
  },

  setStateOnAuth: function(loggedIn){
    // this.setState({
    //   loggedIn: loggedIn
    // });
  },

  componentWillMount: function(){
    // Auth.onChange = this.setStateOnAuth;
  },
  
  render: function(){
    return (
      <div className="container-fluid">
        <Navbar/>
        <RouteHandler/>
      </div>
    );
  }
});

// TODO: Setup thread routes
var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute handler={Front}/>
    <Route path="profile" handler={Profile}/>
    <Route path="login" handler={Login}/>
    <Route path="logout" handler={Logout}/>
    <Route path="signup" handler={Signup}/>
    <Route path="new" handler={NewThread}/>
    <Route path="thread/:id" handler={Thread}/>
    <Route path="user/:id" handler={User}/>
  </Route>
);


Router.run(routes, Router.HashLocation, function(Root){
  React.render(
    <Root locales={['en-US']}/>,
    document.getElementById('app')
  );
});
	
module.exports = App;
