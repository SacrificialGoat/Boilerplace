var React = require('react');
var Map = require('./map');
var ThreadStore = require('../../stores/ThreadStore');
var ThreadActions = require('../../actions/ThreadActions');

var Geo = React.createClass({

  getInitialState: function(){
    return {
      threads: []
    };
  },

  componentWillMount: function(){
    ThreadActions.fetchPage({page:1});
    ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ThreadStore.removeChangeListener(this._onChange);
  },

  _onChange: function(){
    this.setState({
      threads: ThreadStore.getThreads().forumThreads
    });
    console.log(this.state.threads);
  },


  render: function() {
    return (
      <div> <Map threads={this.state.threads}/></div>
    );
  }
});

module.exports = Geo;