var React = require('react');
var ThreadStore = require('../../stores/ThreadStore');
var ThreadActions = require('../../actions/ThreadActions');
var AuthStore = require('../../stores/AuthStore');

var NewThread = React.createClass({
  getInitialState: function(){
    if(!AuthStore.loggedIn()){
      location.hash = '/login';
    }
    return {
      success: false,
      shared: false
    };
  },

  getLocation: function(){
    if(this.state.shared){ // already shared
      // clear it out
      this.setState({
        shared: false
      });
      React.findDOMNode(this.refs.lat).value = '';
      React.findDOMNode(this.refs.lng).value = '';
    }else{
      React.findDOMNode(this.refs.spinner).className = "";
      var that = this;
      console.log(React.findDOMNode(that.refs.share));

      if(React.findDOMNode(that.refs.share).value){
        // Geolocation to find current latitude and longitude
        GMaps.geolocate({
          success: function(position) {
            React.findDOMNode(that.refs.spinner).className = "hidden";
            React.findDOMNode(that.refs.lat).value = position.coords.latitude;
            React.findDOMNode(that.refs.lng).value = position.coords.longitude;
          },
          error: function(error) {
            alert('Geolocation failed: '+error.message);
          },
          not_supported: function() {
            alert("Your browser does not support geolocation");
          },
          always: function() {
            console.log('now at current location');
          }
        });      
      }
      this.setState({
        shared: true
      });
    }
  },

  componentDidMount: function(){
    ThreadStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function(){
    ThreadStore.removeChangeListener(this._onChange);
  },

  addThread: function(){
    // Send action to update user information
    var title = React.findDOMNode(this.refs.title).value.trim();
    var body = React.findDOMNode(this.refs.body).value.trim();
    var link = React.findDOMNode(this.refs.link).value.trim();
    var tag = React.findDOMNode(this.refs.tag).value.trim();
    var lat = React.findDOMNode(this.refs.lat).value.trim();
    var lng = React.findDOMNode(this.refs.lng).value.trim();

    if(!title || !body){
      return;
    }

    if(!lat || !lng){
      lat = parseFloat(0);
      lng = parseFloat(0);
    }

    ThreadActions.add({
      title: title,
      body: body,
      link: link,
      tag: tag,
      lat: lat,
      lng: lng
    });

  },

  _onChange: function(){
    location.hash = '/';
  },


  render: function() {
    return (
      <div className="col-md-12">
        <h3>New Thread</h3>
        <div className="newThread center-block">
            <form onSubmit={this.addThread}>
              <input type="text" className="form-control" placeholder="Title" ref="title" />
              <input type="text" className="form-control" placeholder="Link" ref="link" />
              <input type="textarea" className="form-control" placeholder="Body" ref="body" />
              <input type="text" className="form-control" placeholder="Tag" ref="tag" />
              <p> Share your location? </p>
              <input type="checkbox" ref="share" onClick={this.getLocation}/>
              <img className="hidden" ref="spinner" src="/assets/spinner.gif"></img>
              <input type="text" className="form-control" placeholder="Latitude" ref="lat" />
              <input type="text" className="form-control" placeholder="Longitude" ref="lng" />
              <button type="submit" className="btn btn-success" value="Submit">Submit</button>
            </form>
        </div>
      </div>
    );
  }
});

module.exports = NewThread;