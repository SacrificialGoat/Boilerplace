var React = require('react');
var ReactIntl = require('react-intl');
var FormattedRelative = ReactIntl.FormattedRelative;
var FormattedDate = ReactIntl.FormattedDate;

// MySQL Date -> JS Date
var formatDate = function(str){
  var dateParts = str.split("-");
  var times = dateParts[2].split(":");
  var hour = times[0].substr(3);
  var minutes = times[1];
  var seconds = times[2].substr(0,2);

  return new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0,2),hour,minutes,seconds);
};

// Shortens the body to fit in the table
var formatBody = function(str){
  var shortStr = str.substr(0,40);
  if(str.length >= 40){
    shortStr += '...';
  }
  return shortStr;
};

//  Thread comment item
var CommentItem = React.createClass({

  getInitialState: function(){
    return {
      editable: false,
      editMode: false
    };
  },

  componentDidMount: function(){
    if(this.props.item.user_id === this.props.profileId){
      this.setState({
        editable: true
      });
    }else{
      this.setState({
        editable: false
      });
    }
  },

  componentWillUnmount: function(){
    this.setState({
      editable: false
    });
  },

  upVote: function(e){
    e.preventDefault();
    this.props.onUpVote(this.props.item.post_id);
    React.findDOMNode(this.refs.up).className = '';
    React.findDOMNode(this.refs.down).className="glyphicon glyphicon-chevron-down"
    this.props.item.rating++;
  },

  downVote: function(e){
    e.preventDefault();
    this.props.onDownVote(this.props.item.post_id);
    React.findDOMNode(this.refs.down).className = '';
    React.findDOMNode(this.refs.up).className = "glyphicon glyphicon-chevron-up";
    this.props.item.rating--;
  },

  deletePost: function(e){
    e.preventDefault(); 
    this.props.onDelete(this.props.item.post_id);
  },

  editPost: function(e){
    e.preventDefault();
    this.setState({
      editMode:true
    });
    // Set the input fields to the fetched values

    var that = this;
    setTimeout(function(){
      React.findDOMNode(that.refs.body).value = that.props.item.contents;
    },10);

  },

  saveEdit: function(e){
    e.preventDefault();
    this.props.onEdit(this.props.item.post_id , React.findDOMNode(this.refs.body).value);
    this.props.item.contents = React.findDOMNode(this.refs.body).value;
    this.setState({
      editMode:false
    });
  },

  render: function() {
    var created = formatDate(this.props.item.creation_time);
    var updated = formatDate(this.props.item.last_update_time);
    var contents = this.props.item.contents;
    return (
      <tr>
        <td>
          <a href="#" ref="down" className="glyphicon glyphicon-chevron-down" aria-hidden="true" onClick={this.downVote}></a> {this.props.item.rating} <a href="#" ref="up" className="glyphicon glyphicon-chevron-up" aria-hidden="true" onClick={this.upVote}></a></td>
        <td>
        { this.state.editMode ? (
          <form onSubmit={this.saveEdit}>
            <input type="text" ref="body"></input>
          </form>
          ):(
          contents
        )}
        </td>
        <td><a href={"#/user/"+this.props.item.user_id}> {this.props.item.user_name} </a> </td>

        <td>
          <FormattedDate
            value={created}
            day="numeric"
            month="long"
            year="numeric" />
        </td>

        <td>
        <FormattedRelative 
            value= {updated} />
        </td>

        <td>
        { this.state.editable ? (
          <a href="#" onClick={this.deletePost}><i className="glyphicon glyphicon-remove delete-icon"></i></a>
          ):(
            null
          )
        }
        { this.state.editable ? (
          <a href="#" onClick={this.editPost}><i className="glyphicon glyphicon-pencil edit-icon"></i></a>
          ):(
            null
          )
        }
        </td>

      </tr>
    );
  }
});

module.exports = CommentItem;