import ApiContext from "../../ApiContext";
import AuthApiService from "../../services/auth-api-service";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import TokenService from "../../services/token-service";

export default class SignUpForm extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    onSignUpSuccess: () => {},
    setUserInfo: () => {},
  };

  state = {
    error: null,
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = e.target;
    this.setState({ error: null });

    AuthApiService.postUser({
      email: email.value,
      password: password.value,
      full_name: `${firstName.value} ${lastName.value}`,
    })
      .then(() => {
        AuthApiService.postLogin({
          email: email.value,
          password: password.value,
        })
          .then((res) => {
            TokenService.saveAuthToken(res.authToken);
          })
          .then(() => {
            this.context.setUserInfo();
          })
          .then(() => {
            email.value = "";
            password.value = "";
            this.props.onSignUpSuccess();
          })
          .catch((res) => {
            this.setState({ error: res.error });
          });
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  render() {
    const { error } = this.state;
    return (
      <form className="SignUpForm" onSubmit={this.handleSubmit}>
        <div role="alert">{error && <p className="red">{error}</p>}</div>
        <div className="firstNameInput">
          <label htmlFor="firstName">First name</label>
          <input type="text" name="firstName" id="firstName" />
        </div>
        <div className="lastNameInput">
          <label htmlFor="lastName">Last name</label>
          <input type="text" name="lastName" id="lastName" />
        </div>
        <div className="emailInput">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" />
        </div>
        <div className="passwordInput">
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" />
        </div>
        <div className="buttons">
          <button type="submit" className="primary">
            Sign Up
          </button>
          <Link to="/">Back</Link>
        </div>
      </form>
    );
  }
}
