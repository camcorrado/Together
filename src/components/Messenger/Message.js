import ApiContext from "../../ApiContext";
import config from "../../config";
import React, { Component } from "react";
import TokenService from "../../services/token-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";

class Message extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    conversations: [],
  };

  state = {
    messageHistory: [],
    error: null,
  };

  async componentDidMount() {
    this.setState({ error: null });
    await this.context.refreshProfile();
    const conversationId = this.props.match.params.conversationId;
    fetch(`${config.API_ENDPOINT}/conversations/${conversationId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then((data) => {
        this.setState({
          messageHistory: data,
        });
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ error: null });
    const { message } = e.target;
    const conversationId = this.props.match.params.conversationId;
    const userId = this.context.userProfile.id;
    const newMessage = {
      content: message.value,
      user_id: userId,
      conversation_id: conversationId,
    };
    fetch(`${config.API_ENDPOINT}/messages`, {
      method: "POST",
      body: JSON.stringify(newMessage),
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then(() => {
        message.value = "";
        fetch(`${config.API_ENDPOINT}/conversations/${conversationId}`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then((res) =>
            !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
          )
          .then((data) => {
            this.setState({
              messageHistory: data,
            });
          })
          .catch((res) => {
            this.setState({ error: res.error });
          });
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  handleBack = async (e) => {
    e.preventDefault();
    const conversationId = this.props.match.params.conversationId;
    if (this.state.messageHistory.length === 0) {
      this.setState({ error: null });
      await fetch(`${config.API_ENDPOINT}/conversations/${conversationId}`, {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) =>
          !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
        )
        .catch((res) => {
          this.setState({ error: res.error });
        });
    }
    this.props.history.goBack();
  };

  onChangeMessage = async (value) => {
    await this.setState({ currentMessageTouched: true });
    await this.setState({ currentMessage: value });
  };

  validateMessage(value) {
    if (value.length > 0) {
      document.getElementById("sendButton").disabled = false;
    } else if (value.length === 0) {
      document.getElementById("sendButton").disabled = true;
    } else {
      return true;
    }
  }

  render() {
    const { messageHistory, error } = this.state;
    if (this.state.messageHistory.length === 0) {
      return (
        <section className="messenger">
          <section className="messageHistory">
            <p>You two haven't messaged each other yet!</p>
          </section>
          <section>
            <form className="MessageForm" onSubmit={this.handleSubmit}>
              <div role="alert">
                {error && <p className="error">{error}</p>}
              </div>
              <div className="message">
                <textarea
                  name="message"
                  id="message"
                  rows="15"
                  aria-required="true"
                  required
                ></textarea>
              </div>
              <div className="buttons">
                <div className="buttons">
                  <button type="submit">Submit</button>
                </div>
                <button onClick={this.handleBack}>Back</button>
              </div>
            </form>
          </section>
        </section>
      );
    } else {
      return (
        <section className="messenger">
          <section className="messageHistory">
            {messageHistory.map((message) =>
              message.user_id === this.context.userProfile.id ? (
                <p className="userMessage" key={message.id}>
                  {message.content}
                </p>
              ) : (
                <p className="otherMessage" key={message.id}>
                  {message.content}
                </p>
              )
            )}
          </section>
          <section>
            <form className="MessageForm" onSubmit={this.handleSubmit}>
              <div role="alert">
                {error && <p className="red">{error.message}</p>}
              </div>
              <div className="messageInput">
                <textarea
                  name="message"
                  id="message"
                  rows="15"
                  aria-required="true"
                  required
                ></textarea>
              </div>
              <div className="buttons">
                <div className="buttons">
                  <button type="submit">Submit</button>
                </div>
                <button onClick={this.handleBack} aria-label="back button">
                  <FontAwesomeIcon icon={faUndo} className="faIcon" />
                </button>
              </div>
            </form>
          </section>
        </section>
      );
    }
  }
}

export default Message;
