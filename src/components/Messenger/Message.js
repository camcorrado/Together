import ApiContext from "../../ApiContext";
import config from "../../config";
import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import React, { Component } from "react";
import TokenService from "../../services/token-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import icons from "../Icons";
import "./Messenger.css";

class Message extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    nearbyProfiles: [],
    conversations: [],
    setMessageBadge: () => {},
    refreshProfile: () => {},
  };

  state = {
    messageHistory: [],
    otherUser: {},
    loading: null,
    error: null,
  };

  async componentDidMount() {
    this.setState({ error: null, loading: true });
    await this.context.refreshProfile();
    if (Object.keys(this.context.userProfile).length === 0) {
      this.props.history.push("/createprofile");
    } else {
      const conversationId = Number(this.props.match.params.conversationId);
      const conversationIds = [];
      this.context.conversations.forEach((convo) =>
        conversationIds.push(convo.id)
      );
      if (!conversationIds.includes(conversationId)) {
        this.setState({ error: `Invalid Conversation` });
      } else {
        fetch(`${config.API_ENDPOINT}/conversations/${conversationId}`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        })
          .then((res) =>
            !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
          )
          .then((messages) => {
            const convo = this.context.conversations
              .filter((convo) => convo.id === conversationId)
              .pop();
            const otherUser = convo.users.filter(
              (user) => user !== this.context.userProfile.id
            );
            const otherProfile = this.context.nearbyProfiles.filter(
              (profile) => profile.id === otherUser[0]
            );
            this.setState({
              messageHistory: messages.sort((a, b) => b.id - a.id),
              otherUser: otherProfile.pop(),
              loading: false,
            });

            messages.forEach((message) => {
              if (
                message.msg_read === "false" &&
                message.user_id !== this.context.userProfile.id
              ) {
                const { content } = message;
                const newMessage = {
                  content,
                  msg_read: "true",
                };
                fetch(`${config.API_ENDPOINT}/messages/${message.id}`, {
                  method: "PATCH",
                  body: JSON.stringify(newMessage),
                  headers: {
                    "content-type": "application/json",
                    authorization: `bearer ${TokenService.getAuthToken()}`,
                  },
                })
                  .then((res) =>
                    !res.ok ? res.json().then((e) => Promise.reject(e)) : true
                  )
                  .then(this.context.setMessageBadge(conversationId))
                  .catch((res) => {
                    this.setState({ error: res.error });
                  });
              }
            });
          })
          .catch((res) => {
            this.setState({ error: res.error });
          });
      }
    }
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
      msg_read: "false",
    };

    fetch(`${config.API_ENDPOINT}/messages`, {
      method: "POST",
      body: JSON.stringify(newMessage),
      headers: {
        "content-type": "application/json",
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
          },
        })
          .then((res) =>
            !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
          )
          .then((data) => {
            this.setState({
              messageHistory: data.sort((a, b) => b.id - a.id),
            });
          })
          .catch((res) => {
            this.setState({ error: res.error });
          });
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });

    const updatedConvo = {
      users: [this.state.otherUser.id, this.context.userProfile.id],
      new_msg: new Date(),
    };

    fetch(`${config.API_ENDPOINT}/conversations/${conversationId}`, {
      method: "PATCH",
      body: JSON.stringify(updatedConvo),
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then(() => {
        this.context.setConversations();
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
    const { messageHistory, error, loading } = this.state;
    const { id, username, profile_pic } = this.state.otherUser;
    const { userProfile } = this.context;
    const { buttonDict } = icons;
    const url = `/userprofile/${id}`;
    return (
      <section className="Messenger">
        {loading ? (
          <section className="loaderMessage">
            <div className="loader"></div>
          </section>
        ) : error !== null ? (
          <>
            <Nav />
            <div role="alert" className="alert">
              {error && <p className="error">{error}</p>}
            </div>
          </>
        ) : (
          <>
            <section className="profilePicMessageContainer">
              <Link to={url} className="profilePicMessage">
                {profile_pic ? (
                  <img
                    src={profile_pic}
                    alt={username + `'s profile pic`}
                    className="profilePicMessage"
                  />
                ) : (
                  <></>
                )}
              </Link>
            </section>
            <section className="messageHistory">
              {messageHistory.length === 0 ? (
                <p className="noMessages">
                  You two haven't messaged each other yet!
                </p>
              ) : (
                <>
                  {messageHistory.map((message) =>
                    message.user_id === userProfile.id ? (
                      <p className="userMessage" key={message.id}>
                        {message.content}
                      </p>
                    ) : (
                      <p className="otherMessage" key={message.id}>
                        {message.content}
                      </p>
                    )
                  )}
                </>
              )}
            </section>
            <section className="messageFormContainer">
              <form className="MessageForm" onSubmit={this.handleSubmit}>
                <div className="messageInput">
                  <textarea
                    name="message"
                    id="message"
                    rows="15"
                    aria-required="true"
                    maxLength="120"
                    required
                  ></textarea>
                </div>
                <section className="buttons">
                  <button type="submit" className="primary">
                    Send
                  </button>
                  <button onClick={this.handleBack} aria-label="back button">
                    <FontAwesomeIcon
                      icon={buttonDict.faUndo}
                      className="faIcon"
                    />
                  </button>
                </section>
              </form>
            </section>
          </>
        )}
      </section>
    );
  }
}

export default Message;
