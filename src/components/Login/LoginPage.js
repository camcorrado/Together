import ApiContext from "../../ApiContext";
import Header from "../Header/Header";
import LoginForm from "./LoginForm";
import React, { Component } from "react";

export default class LoginPage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
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
        <header className="App_Header">
          <Header />
        </header>
        <h2>Login</h2>
        <LoginForm
          onLoginSuccess={this.handleLoginSuccess}
          onNoProfile={this.handleNoProfile}
        />
      </section>
    );
  }
}
