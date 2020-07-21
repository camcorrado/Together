import ApiContext from "../../ApiContext";
import Header from "../Header/Header";
import React, { Component } from "react";
import SignUpForm from "../../components/SignUp/SignUpForm";
import TokenService from "../../services/token-service";

export default class SignUpPage extends Component {
  static contextType = ApiContext;

  componentDidMount() {
    const authToken = TokenService.getAuthToken();
    if (authToken) {
      this.props.history.push("/grid");
    }
  }

  handleSignUpSuccess = async () => {
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
