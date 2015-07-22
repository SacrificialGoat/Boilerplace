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

// Front page thread list
var ProfileThreadItem = React.createClass({

  render: function() {
    // TODO: Clicking on title takes you to individual thread.
    var created = formatDate(this.props.item.creation_time);
    var updated = formatDate(this.props.item.last_update_time);
    var body = formatBody(this.props.item.body);

    return (
      <tr>
        <td>{this.props.item.rating}</td>
        <td><a href={"#/thread/"+this.props.item.thread_id}>{this.props.item.title}</a></td>
        <td>{body}</td>
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
            value={updated} />
        </td>

      </tr>
    );
  }
});

module.exports = ProfileThreadItem;