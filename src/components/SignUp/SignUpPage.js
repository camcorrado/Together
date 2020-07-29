import ApiContext from "../../ApiContext";
import Header from "../Header/Header";
import React, { Component } from "react";
import SignUpForm from "../../components/SignUp/SignUpForm";
import TokenService from "../../services/token-service";
import "./SignUp.css";

export default class SignUpPage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    refreshProfile: () => {},
  };

  componentDidMount() {
    const authToken = TokenService.getAuthToken();
    if (authToken) {
      this.props.history.push("/grid");
    }
  }

  handleSignUpSuccess = async () => {
    await this.context.refreshProfile();
    this.props.history.push("/createprofile");
  };

  render() {
    return (
      <section className="SignUpPage">
        <header className="appHeader">
          <Header />
        </header>
        <h3>Register</h3>
        <SignUpForm onSignUpSuccess={this.handleSignUpSuccess} />
      </section>
    );
  }
}
