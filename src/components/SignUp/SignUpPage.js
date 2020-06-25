import React, { Component } from "react";
import SignUpForm from "../../components/SignUp/SignUpForm";

export default class SignUpPage extends Component {
  static defaultProps = {
    history: {
      push: () => {},
    },
  };

  handleSignUpSuccess = () => {
    this.props.history.push("/createprofile");
  };

  render() {
    return (
      <section className="SignUpPage">
        <h2>Register</h2>
        <SignUpForm onSignUpSuccess={this.handleSignUpSuccess} />
      </section>
    );
  }
}
