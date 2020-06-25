import ApiContext from "../../ApiContext";
import AuthApiService from "../../services/auth-api-service";
import config from "../../config";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import TokenService from "../../services/token-service";

export default class LoginForm extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    onLoginSuccess: () => {},
    onNoProfile: () => {},
    onBack: () => {},
    setUserInfo: () => {},
    setProfileInfo: () => {},
  };

  state = {
    error: null,
  };

  handleClickBack = () => {
    this.props.onBack();
  };

  handleSubmitJwtAuth = (ev) => {
    ev.preventDefault();
    this.setState({ error: null });
    const { email, password } = ev.target;
    const userEmail = email.value;
    AuthApiService.postLogin({
      email: email.value,
      password: password.value,
    })
      .then((res) => {
        fetch(`${config.API_ENDPOINT}/users`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${res.authToken}`,
          },
        })
          .then((res) => {
            if (!res.ok) {
              throw new Error(res.status);
            }
            return res.json();
          })
          .then((user) => {
            this.context.setUserInfo(user);
            this.context.setProfileInfo(user.id);
          })
          .then(() => {
            email.value = "";
            password.value = "";
            TokenService.saveAuthToken(res.authToken);
            this.props.onLoginSuccess();
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  render() {
    const { error } = this.state;
    return (
      <form className="LoginForm" onSubmit={this.handleSubmitJwtAuth}>
        <div role="alert">{error && <p className="red">{error}</p>}</div>
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
            Login
          </button>
          <Link to="/">Back</Link>
        </div>
      </form>
    );
  }
}
