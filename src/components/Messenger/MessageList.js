import ApiContext from "../../ApiContext";
import Conversation from "./Conversation";
import React from "react";

class MessageList extends React.Component {
  static contextType = ApiContext;
  static defaultProps = {
    conversations: [],
  };

  render() {
    if (this.context.conversations.length === 0) {
      return (
        <section className="messageList">
          <p>You haven't sent or recieved any messages yet!</p>
        </section>
      );
    } else {
      return (
        <section className="messageList">
          <ul>
            {this.context.conversations.map((conversation) => (
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
