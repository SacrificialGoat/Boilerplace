var React = require('react');

var Logout = React.createClass({
  getInitialState: function(){
    // TODO: Move to Auth Store?
    // if(Auth.loggedIn()){
    //   Auth.logout(function(){
    //     location.hash = '/login';
    //   });
    // }
    return {
      // loggedIn: Auth.loggedIn()
    };
  },
  render: function() {
    return (
      <div className="Auth center-block">
          <p>Logout Successful.</p>
      </div>
    );
  }
});

module.exports = Logout;