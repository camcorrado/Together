import { Link } from "react-router-dom";
import React, { Component } from "react";

export default class Conversation extends Component {
  render() {
    const url = `/conversation/${this.props.id}`;
    return (
      <Link to={url} className="conversationLink">
        <section className="conversation">
          <p>small profile pic of other user</p>
          <p className="username">other user's username</p>
          <p className="mostRecentMessage">most recent message sent</p>
        </section>
      </Link>
    );
  }
}
