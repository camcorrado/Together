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
  };

  async componentDidMount() {
    await this.context.refreshProfile();
    const otherUsers = this.props.users.filter((user) => {
      return user !== this.context.userInfo.id;
    });
    otherUsers.forEach((user) => {
      fetch(`${config.API_ENDPOINT}/profiles/${user}`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.status);
          }
          return res.json();
        })
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
    fetch(`${config.API_ENDPOINT}/messages/`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((messages) => {
        let userMessages = messages.filter(
          (message) => message.conversation_id === this.props.id
        );
        let mostRecentMessage = userMessages.length - 1;
        this.setState({ displayMessage: messages[mostRecentMessage].content });
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  }

  render() {
    const url = `/conversation/${this.props.id}`;
    return (
      <Link to={url} className="conversationLink">
        <section className="conversation">
          {this.state.users.map((profile) => (
            <img
              key={profile.id}
              src={profile.profile_pic}
              alt={profile.username + `'s profile pic`}
              className="profilePicConversations"
            />
          ))}
          {this.state.users.map((profile) => (
            <h5 key={profile.id}>{profile.username}</h5>
          ))}
          <p className="mostRecentMessage">{this.state.displayMessage}</p>
        </section>
      </Link>
    );
  }
}
