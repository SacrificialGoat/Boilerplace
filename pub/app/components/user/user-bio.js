var React = require('react');
var Modal = require('react-modal');

var FriendButton = require('../friend/friendbutton');


var appElement = document.getElementById('app');

Modal.setAppElement(appElement);
Modal.injectCSS();


var Bio = React.createClass({

  getInitialState: function() {
    return { modalIsOpen: false };
  },

  openModal: function() {
    this.setState({modalIsOpen: true});
  },

  closeModal: function() {
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
    console.log('message clicked');
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
        <FriendButton targetuser={this.props.item}/>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
        >
          <form className="sendMsg">
            <h2>Send Message</h2>
            <button className="form-control close" onClick={this.closeModal}>X</button>
            <input className="form-control" type="textarea"></input>
            <br/>
            <button className="form-control submit" type="submit">Send</button>
          </form>
        </Modal>


      </div>
    );
  }
});

module.exports = Bio;