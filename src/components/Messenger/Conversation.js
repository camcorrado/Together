import ApiContext from "../../ApiContext";
import config from "../../config";
import { Link } from "react-router-dom";
import React, { Component } from "react";

export default class Conversation extends Component {
  static contextType = ApiContext;
  static defaultProps = {
    userInfo: {},
    refreshProfile: () => {},
  };

  state = {
    users: [],
    displayMessage: "",
    error: null,
  };

  componentDidMount() {
    const conversationId = this.props.id;
    const otherUsers = this.props.users.filter((user) => {
      return user !== this.context.userInfo.id;
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
        .then((userInfo) => {
          this.setState((state) => {
            const users = state.users.concat(userInfo);
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
          this.setState({ displayMessage: latestMessage.content });
        }
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  }

  render() {
    const { users, displayMessage, error } = this.state;
    const url = `/conversation/${this.props.id}`;
    return (
      <Link
        to={{
          pathname: url,
          state: {
            otherUser: users[0],
          },
        }}
        className="conversationLink"
      >
        <div role="alert">{error && <p className="error">{error}</p>}</div>
        <section className="conversation">
          {users.map((profile) => (
            <img
              key={profile.id}
              src={profile.profile_pic}
              alt={profile.username + `'s profile pic`}
              className="profilePicConversations"
            />
          ))}
          {users.map((profile) => (
            <h5 key={profile.id}>{profile.username}</h5>
          ))}
          <p className="mostRecentMessage">{displayMessage}</p>
        </section>
      </Link>
    );
  }
}
