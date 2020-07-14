import ApiContext from "../../ApiContext";
import AuthApiService from "../../services/auth-api-service";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import TokenService from "../../services/token-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";

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
        <div role="alert">{error && <p className="error">{error}</p>}</div>
        <div className="firstNameInput">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            maxLength="20"
            required
          />
        </div>
        <div className="lastNameInput">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            maxLength="20"
            required
          />
        </div>
        <div className="emailInput">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            maxLength="120"
            required
          />
        </div>
        <div className="passwordInput">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            maxLength="20"
            required
          />
        </div>
        <div className="buttons">
          <button type="submit" className="primary">
            Sign Up
          </button>
          <Link to="/" aria-label="back button">
            <FontAwesomeIcon icon={faUndo} className="faIcon" />
          </Link>
        </div>
      </form>
    );
  }
}
