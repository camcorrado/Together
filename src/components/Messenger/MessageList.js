import ApiContext from "../../ApiContext";
import Conversation from "./Conversation";
import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faTh } from "@fortawesome/free-solid-svg-icons";

class MessageList extends Component {
  static contextType = ApiContext;
  static defaultProps = {
    conversations: [],
    refreshProfile: () => {},
  };

  async componentDidMount() {
    await this.context.refreshProfile();
    if (Object.keys(this.context.userProfile).length === 0) {
      this.props.history.push("/createprofile");
    }
  }

  render() {
    if (this.context.conversations.length === 0) {
      return (
        <section className="messageList">
          <Nav />
          <section className="conversations">
            <p>You haven't sent or recieved any messages yet!</p>
          </section>
        </section>
      );
    } else {
      return (
        <section className="messageList">
          <Nav />
          <section className="conversations">
            <ul>
              {this.context.conversations.map((conversation) => (
                <li key={conversation.id}>
                  <Conversation
                    id={conversation.id}
                    users={conversation.users}
                  />
                </li>
              ))}
            </ul>
          </section>
        </section>
      );
    }
  }
}

export default MessageList;
