var React = require('react');
var Modal = require('react-modal');

// var FriendButton = require('../friend/friendbutton');


var appElement = document.getElementById('app');

Modal.setAppElement(appElement);
Modal.injectCSS();


var Bio = React.createClass({

  getInitialState: function() {
    return { modalIsOpen: false };
  },

  openModal: function(e) {
    e.preventDefault();
    this.setState({modalIsOpen: true});
  },

  closeModal: function(e) {
    e.preventDefault();
    this.setState({modalIsOpen: false});
  },

  chat: function(e){
    e.preventDefault();
    //TODO: Open chat box.
    console.log('chatbox clicked');
    this.props.onChat();
  },

  message: function(e){
    e.preventDefault();
    var title = React.findDOMNode(this.refs.title).value
    var body = React.findDOMNode(this.refs.body).value;
    if(!title || !body){
      return;
    }
    this.props.onSendPM(title,body);
    React.findDOMNode(this.refs.title).value = '';
    React.findDOMNode(this.refs.body).value = '';
    this.closeModal();
  },

  render: function() {
    return (
      <div className="col-md-3">
        <h3>{this.props.item.user_name}</h3>
        <h3>{this.props.item.first_name} {this.props.item.last_name}</h3>

        <img src={this.props.item.avatar_link} className="img-thumbnail"></img>

        <p>Rep: {this.props.item.rep}</p>
        <p>Id: {this.props.item.user_id}</p>
        <p>Bio: {this.props.item.bio}</p>

        <i className="glyphicon glyphicon-comment chatIcon" onClick={this.chat}>&nbsp;</i>
        <i className="glyphicon glyphicon-envelope messageBox" onClick={this.openModal}></i>
        
        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal}>
          <form className="sendMsg" onSubmit={this.message}>
            <h2>Send Message</h2>
            <button className="form-control close" onClick={this.closeModal}>X</button>
            <input ref="title" className="form-control" placeholder="Title" type="text"></input>
            <input ref="body" className="form-control" placeholder="Body" type="textarea"></input>
            <br/>
            <button className="form-control submit" type="submit">Send</button>
          </form>
        </Modal>

      </div>
    );
  }
});

module.exports = Bio;

// <FriendButton targetuser={this.props.item}/>