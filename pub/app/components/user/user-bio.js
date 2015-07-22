var React = require('react');

var Bio = React.createClass({
  // TODO: Incorporate Later when Auth is in.

  render: function() {
    return (
      <div className="col-md-3">
        <h3>{this.props.item.user_name}</h3>
        <h3>{this.props.item.first_name} {this.props.item.last_name}</h3>

          <img src={this.props.item.avatar_link} className="img-thumbnail"></img>


        <p>Rep: {this.props.item.rep}</p>
        <p>Id: {this.props.item.user_id}</p>
        <p>Bio: {this.props.item.bio}</p>

      </div>
    );
  }
});

module.exports = Bio;