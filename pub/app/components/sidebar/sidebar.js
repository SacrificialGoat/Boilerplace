var React = require('react');

// TODO - factor out navbar login form

var Sidebar = React.createClass({

  render: function(){
    setTimeout(function(){
        var map = new GMaps({
              el: '#map',
              lat: -12.043333,
              lng: -77.028333
        });
    },1000);
    return (
    <div id="sidebar-wrapper">
        <ul className="sidebar-nav">
            <li className="sidebar-brand">
                <a href="#">
                    Current Location
                </a>
            </li>
            <li id="map">Map goes here.</li>
            <li>
                <a href="#">Trending</a>
            </li>
        </ul>
    </div>
    );
  }
});

module.exports = Sidebar;
    
