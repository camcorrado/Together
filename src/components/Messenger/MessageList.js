import ApiContext from "../../ApiContext";
import config from "../../config";
import Conversation from "./Conversation";
import React from "react";
import TokenService from "../../services/token-service";

class MessageList extends React.Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    refreshProfile: () => {},
  };

  state = {
    conversations: [],
  };

  componentDidMount() {
    this.context.refreshProfile();
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
        let filteredConversations = [];
        conversations.filter(
          (conversation) =>
            conversation.users.includes(this.context.userProfile.id) === true
        );
        this.setState({
          conversations: filteredConversations,
        });
        console.log(this.state.conversations);
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  }

  render() {
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

export default MessageList;
