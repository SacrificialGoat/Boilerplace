var React = require('react');
var Threads = require('./front-threads');
var Link = require('react-router').Link;
var AuthStore = require('../../stores/AuthStore');

var Front = React.createClass({

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
  },

  render: function() {
    return (
      <div className="col-md-12"> 
        {this.state.loggedIn ? (
        <Link className="btn btn-info" to="/new">New</Link>
        ): null }
        <Threads />
      </div>
    );
  }
});

module.exports = Front;