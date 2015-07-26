var React = require('react');
var Threads = require('./front-threads');
var Link = require('react-router').Link;
var AuthStore = require('../../stores/AuthStore');

var Front = React.createClass({

  getInitialState: function(){
    return {
      loggedIn: AuthStore.loggedIn(),
      alert: false
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
      alert: false
    });
  },

  showAlert: function(){
    this.setState({
      alert: true
    });
  },

  render: function() {
    return (
      <div className="col-md-12"> 
        {this.state.alert ? (
          <div className="alert alert-danger">
            <strong>Please Log in</strong> to use this feature.
          </div>
          ):(
          null
        )}
        <Threads onAlert={this.showAlert}loggedIn={this.state.loggedIn}/>
      </div>
    );
  }
});

module.exports = Front;