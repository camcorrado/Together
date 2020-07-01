import ApiContext from "../../ApiContext";
import LoginForm from "./LoginForm";
import React, { Component } from "react";

export default class LoginPage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    history: {
      push: () => {},
    },
  };

  handleLoginSuccess = () => {
    this.props.history.push("/grid");
  };

  handleNoProfile = () => {
    this.props.history.push("/createprofile");
  };

  render() {
    return (
      <section className="LoginPage">
        <h2>Login</h2>
        <LoginForm
          onLoginSuccess={this.handleLoginSuccess}
          onNoProfile={this.handleNoProfile}
        />
      </section>
    );
  }
}
