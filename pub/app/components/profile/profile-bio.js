var React = require('react');

var Bio = React.createClass({
  // TODO: Incorporate Later when Auth is in.

  getInitialState: function(){
    return {
      editing: false
    };
  },

  // TODO: Bubble this up to profile parent
  enableEdit: function(){
    // make the bio field editable
      // replace it with a form.
    this.setState({
      editing: true
    });

    var that = this;
    setTimeout(function(){
      React.findDOMNode(that.refs.avatar).value = that.props.item.avatar_link;
      React.findDOMNode(that.refs.bio).value = that.props.item.bio;
    },100);

  },

  cancelEdit: function(){
    // make the bio field editable
      // replace it with a form.
    this.setState({
      editing: false
    });
  },

  saveEdit: function(){
    var avatar = React.findDOMNode(this.refs.avatar).value.trim();
    var bio = React.findDOMNode(this.refs.bio).value.trim();

    var data = this.props.item;
    data.avatar_link = avatar;
    data.bio = bio;

    // Bubble up request to parent
    this.props.onEditSubmit(data);

    this.setState({
      editing: false
    })
  },

  render: function() {
    return (
      <div className="col-md-3">
        <h3>{this.props.item.user_name}</h3>
        <h3>{this.props.item.first_name} {this.props.item.last_name}</h3>

        {!this.state.editing ? (
          <img src={this.props.item.avatar_link} className="img-thumbnail"></img>
        ) : (
          <p>Avatar Link: <input type="text" ref="avatar"></input></p>
        )}

        <p>Rep: {this.props.item.rep}</p>
        <p>Id: {this.props.item.user_id}</p>

        {!this.state.editing ? (
          <p>Bio: {this.props.item.bio}</p>
        ) : (
          <p>Bio: <input type="text" ref="bio"></input></p>
        )}
        
        {!this.state.editing ? (
          <a className="btn btn-warning" onClick={this.enableEdit}>Edit</a>
        ) : (
          <a className="btn btn-success" onClick={this.saveEdit}>Save</a>
        )}

        {!this.state.editing ? (
          <a className="btn btn-success hidden"></a>
        ) : (
          <a className="btn btn-info" onClick={this.cancelEdit}>Cancel</a>
        )}

      </div>
    );
  }
});

module.exports = Bio;