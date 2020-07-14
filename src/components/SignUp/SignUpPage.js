import Header from "../Header/Header";
import React, { Component } from "react";
import SignUpForm from "../../components/SignUp/SignUpForm";

export default class SignUpPage extends Component {
  handleSignUpSuccess = () => {
    this.props.history.push("/createprofile");
  };

  render() {
    return (
      <section className="SignUpPage">
        <header className="App_Header">
          <Header />
        </header>
        <h2>Register</h2>
        <SignUpForm onSignUpSuccess={this.handleSignUpSuccess} />
      </section>
    );
  }
}
