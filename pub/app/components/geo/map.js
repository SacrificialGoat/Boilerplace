var React = require('react');

// TODO - factor out navbar login form

// Hack Reactor = 37.783814 -122.4090624

var fakeData = [
{title: 'hello',lat:37.787814,lng:-122.4090624},
{title: 'baby',lat:37.780814,lng:-122.4120624},
{title: 'bye',lat:37.778814,lng:-122.4070624}
];

var Map = React.createClass({


    getInitialState: function(){
      return {
        
      };
    },

    loadMarkers: function(data,map){
      for (var i = 0; i < data.length; i++) {
        // Add a click handler to each marker to take it to the thread
        data[i].infoWindow = {
          content: '<div class="geoThread"><a href="#/thread/'+ data[i].thread_id +'">'+ data[i].title +'</a>' + '<p class="body">' + data[i].body + '</p>' + '<p>Rating: ' + data[i].rating + '</p>' + '<p>Posts: ' + data[i].post_count + '</p>' +'<p class="tag">'+ data[i].tag  + '</p></div>'
        }
        
        map.addMarker(data[i]);
      };
    },

    componentWillMount: function(){
        var that = this;
        setTimeout(function(){
            var map = new GMaps({
                  el: '#map',
                  lat: 37.787814,
                  lng: -122.4090624,
            });

            GMaps.geolocate({
              success: function(position) {
                map.setCenter(position.coords.latitude, position.coords.longitude);
                console.log(position.coords.latitude,position.coords.longitude);

                // Load the current location marker
                // map.addMarker({title:'current', infoWindow: {content: '<p>Current Location</p>'}, lat:position.coords.latitude,lng: position.coords.longitude});
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

            // Load the markers
            that.loadMarkers(that.props.threads,map);

        },1000);
    },

  render: function(){

    return (
      <div id="map">Loading map...</div>
    );
  }
});

module.exports = Map;
    
