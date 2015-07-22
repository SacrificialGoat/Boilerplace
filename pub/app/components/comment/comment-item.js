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

  render: function() {
    var created = formatDate(this.props.item.creation_time);
    var updated = formatDate(this.props.item.last_update_time);

    return (
      <tr>
        <td>
          <a href="#" ref="down" className="glyphicon glyphicon-chevron-down" aria-hidden="true" onClick={this.downVote}></a> {this.props.item.rating} <a href="#" ref="up" className="glyphicon glyphicon-chevron-up" aria-hidden="true" onClick={this.upVote}></a></td>
        <td>{this.props.item.contents}</td>
        <td>{this.props.item.user_name}</td>

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

      </tr>
    );
  }
});

module.exports = CommentItem;