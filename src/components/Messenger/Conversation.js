import ApiContext from "../../ApiContext";
import config from "../../config";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import "./Messenger.css";

export default class Conversation extends Component {
  static contextType = ApiContext;
  static defaultProps = {
    userProfile: {},
    refreshProfile: () => {},
  };

  state = {
    users: [],
    displayMessage: {},
    read: "",
    error: null,
  };

  componentDidMount() {
    const conversationId = this.props.id;
    const otherUsers = this.props.users.filter((user) => {
      return user !== this.context.userProfile.id;
    });
    this.setState({ error: null });
    otherUsers.forEach((user) => {
      fetch(`${config.API_ENDPOINT}/profiles/${user}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) =>
          !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
        )
        .then((userData) => {
          this.setState((state) => {
            const users = state.users.concat(userData);
            return {
              users,
            };
          });
        })
        .catch((res) => {
          this.setState({ error: res.error });
        });
    });
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
        if (messages.length === 0) {
          fetch(`${config.API_ENDPOINT}/conversations/${conversationId}`, {
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
        } else {
          let latestMessage = messages.pop();
          this.setState({
            displayMessage: latestMessage,
            read: latestMessage.msg_read,
          });
        }
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  }

  render() {
    const { users, displayMessage, read, error } = this.state;
    const { userProfile } = this.context;
    const url = `/conversation/${this.props.id}`;
    return (
      <Link
        to={{
          pathname: url,
          state: {
            otherUser: users[0],
          },
        }}
        className="ConversationLink"
      >
        <div role="alert">{error && <p className="error">{error}</p>}</div>
        <section className="conversation">
          {users
            .filter((profile) => profile.id !== userProfile.id)
            .map((profile) =>
              profile.profile_pic ? (
                <img
                  key={profile.id}
                  src={profile.profile_pic}
                  alt={profile.username + `'s profile pic`}
                  className="profilePicConversations"
                />
              ) : (
                <></>
              )
            )}
          <div className="messageInfo">
            {users
              .filter((profile) => profile.id !== userProfile.id)
              .map((profile) => (
                <h5 key={profile.id}>{profile.username}</h5>
              ))}
            {read === "true" ||
            displayMessage.user_id === this.context.userProfile.id ? (
              <p className="mostRecentMessageRead">{displayMessage.content}</p>
            ) : (
              <p className="mostRecentMessageUnread">
                {displayMessage.content}
              </p>
            )}
          </div>
        </section>
      </Link>
    );
  }
}
