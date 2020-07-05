import config from "../../config";
import Conversation from "./Conversation";
import React from "react";
import TokenService from "../../services/token-service";

class MessageList extends React.Component {
  state = {
    conversations: [],
  };

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/conversations`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then((conversations) => {
        this.setState({
          conversations: conversations,
        });
        console.log(this.state.conversations);
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  }

  render() {
    if (this.state.conversations.length === 0) {
      return (
        <section className="messageList">
          <p>You have sent or recieved any messages yet!</p>
        </section>
      );
    } else {
      return (
        <section className="messageList">
          <ul>
            {this.state.conversations.map((conversation) => (
              <li key={conversation.id}>
                <Conversation id={conversation.id} users={conversation.users} />
              </li>
            ))}
          </ul>
        </section>
      );
    }
  }
}

export default MessageList;
