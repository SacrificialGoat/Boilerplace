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
var ThreadItem = React.createClass({

  getInitialState: function(){
    return {
      voted: 0
    };
  },

  upVote: function(e){
    e.preventDefault();

    // Disable voting when already voted
    if(this.state.voted <= 0){
      this.props.onUpVote(this.props.item.thread_id);
      this.setState({
        voted: this.state.voted+1
      });
      this.props.item.rating++;
    }

  },

  downVote: function(e){
    e.preventDefault();

    // Disable voting when already voted
    if(this.state.voted >= 0){
      this.props.onDownVote(this.props.item.thread_id);
      this.setState({
        voted: this.state.voted-1
      });
      this.props.item.rating--;
    }
  },

  redirect: function(){
    this.props.onAlert();
  },

  render: function() {
    // TODO: Clicking on title takes you to individual thread page
    var created = formatDate(this.props.item.creation_time);
    var updated = formatDate(this.props.item.last_update_time);
    var body = formatBody(this.props.item.body);

    return (
      <div className="frontPage">
        <img src="assets/thread_icon.png"></img>

        <div className="title">
          <h2><a href={"#/thread/"+this.props.item.thread_id}>{this.props.item.title}</a></h2>
          <p>{body}</p>
        </div>

        {this.props.loggedIn ? (
          <div className="votes">
            <a href="#" ref="down" className="glyphicon glyphicon-chevron-down" aria-hidden="true" onClick={this.downVote}></a> {this.props.item.rating} <a href="#" ref="up" className="glyphicon glyphicon-chevron-up" aria-hidden="true" onClick={this.upVote}></a>
          </div>
          ) : (
          <div className="votes">
            <a href="#" ref="down" className="glyphicon glyphicon-chevron-down" aria-hidden="true" onClick={this.redirect}></a> {this.props.item.rating} <a href="#" ref="up" className="glyphicon glyphicon-chevron-up" aria-hidden="true" onClick={this.redirect}></a>
          </div>
        )}
        <p className="created">created <FormattedRelative value={created} /> by <a href={"#/user/"+this.props.item.user_id}> {this.props.item.user_name} </a></p>
        <p className="created">comments: {this.props.item.post_count} </p>

        <div className="info">
          <p className="tag">{this.props.item.tag} </p>
          <p>updated&nbsp;<FormattedRelative value= {updated} /></p>
        </div>
        
        
      </div>
    );
  }
});

module.exports = ThreadItem;