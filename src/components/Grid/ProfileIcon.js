import React, { Component } from "react";

export default class Grid extends Component {
  render() {
    return (
      <section className="profileIcon">
        <img
          src={this.props.profilePic}
          alt={this.props.username + `'s profile pic`}
        />
        <h4 className="username">{this.props.username}</h4>
        <h4 className="interests">{this.props.interests.join(", ")}</h4>
      </section>
    );
  }
}
