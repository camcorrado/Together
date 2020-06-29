import ApiContext from "../../ApiContext";
import AuthApiService from "../../services/auth-api-service";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import TokenService from "../../services/token-service";

export default class LoginForm extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userInfo: {},
    userProfile: {},
    onLoginSuccess: () => {},
    onNoProfile: () => {},
    setProfileInfo: () => {},
  };

  state = {
    error: null,
  };

  handleSubmitJwtAuth = (ev) => {
    ev.preventDefault();
    console.log(`handleSubmitJwtAuth began`);
    this.setState({ error: null });
    const { email, password } = ev.target;
    AuthApiService.postLogin({
      email: email.value,
      password: password.value,
    })
      .then(async (res) => {
        console.log(`handleSubmitJwtAuth pt 1`);
        TokenService.saveAuthToken(res.authToken);
        await this.context.setUserInfo();
      })
      .then(async () => {
        console.log(`handleSubmitJwtAuth pt 2`);
        await this.context.setProfileInfo(this.context.userInfo.id);
        email.value = "";
        password.value = "";
        console.log(this.context.userProfile);
        if (!this.context.userProfile) {
          this.props.onNoProfile();
        } else {
          this.props.onLoginSuccess();
        }
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
    console.log(`handleSubmitJwtAuth completed`);
  };

  render() {
    const { error } = this.state;
    return (
      <form className="LoginForm" onSubmit={this.handleSubmitJwtAuth}>
        <div role="alert">{error && <p className="red">{error}</p>}</div>
        <div className="emailInput">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue="test@gmail.com"
          />
        </div>
        <div className="passwordInput">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            defaultValue="Test123!"
          />
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
