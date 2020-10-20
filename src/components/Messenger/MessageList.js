import ApiContext from "../../ApiContext";
import Conversation from "./Conversation";
import Nav from "../Nav/Nav";
import React, { Component } from "react";
import "./Messenger.css";

class MessageList extends Component {
  static contextType = ApiContext;
  static defaultProps = {
    conversations: [],
    refreshProfile: () => {},
  };

  state = {
    loading: null,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    await this.context.refreshProfile();
    if (Object.keys(this.context.userProfile).length === 0) {
      this.props.history.push("/createprofile");
    }
    this.setState({ loading: false });
  }

  render() {
    const { loading } = this.state;
    const { conversations } = this.context;
    return (
      <section className="MessageList">
        <Nav />
        <section className="conversations">
          {conversations.length > 0 ? (
            <ul>
              {conversations.map((conversation) => (
                <li key={conversation.id}>
                  <Conversation
                    id={conversation.id}
                    users={conversation.users}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <section className="loaderMessage">
              {loading ? (
                <div className="loader"></div>
              ) : (
                <p className="temp">
                  You haven't sent or received any messages yet!
                </p>
              )}
            </section>
          )}
        </section>
      </section>
    );
  }
}

export default MessageList;
