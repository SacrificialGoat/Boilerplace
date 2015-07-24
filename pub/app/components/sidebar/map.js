var React = require('react');

// TODO - factor out navbar login form

var Map = React.createClass({

    getInitialState: function(){
      return {

      };
    },

    componentWillMount: function(){
        setTimeout(function(){
            var map = new GMaps({
                  el: '#map',
                  lat: -12.043333,
                  lng: -77.028333
            });

            GMaps.geolocate({
              success: function(position) {
                map.setCenter(position.coords.latitude, position.coords.longitude);
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

        },1000);
    },

  render: function(){

    return (
      <li id="map">Map goes here.</li>
    );
  }
});

module.exports = Map;
    
