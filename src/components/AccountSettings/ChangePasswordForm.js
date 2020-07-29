import ApiContext from "../../ApiContext";
import AuthApiService from "../../services/auth-api-service";
import config from "../../config";
import React, { Component } from "react";
import "./AccountSettings.css";

export default class ChangePasswordForm extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userInfo: {},
  };

  state = {
    error: null,
    success: null,
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
    this.setState({ success: null, error: null });
    const { oldPassword, firstNewPassword, secondNewPassword } = ev.target;
    if (firstNewPassword.value !== secondNewPassword.value) {
      this.setState({ error: `New password does not match verification.` });
    } else {
      const credentials = {
        email: this.context.userInfo.email,
        password: oldPassword.value,
      };
      fetch(`${config.API_ENDPOINT}/auth/login`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(credentials),
      })
        .then((res) =>
          !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
        )
        .then(() => {
          AuthApiService.patchUser({
            email: this.context.userInfo.email,
            password: secondNewPassword.value,
            full_name: this.context.userInfo.full_name,
            id: this.context.userInfo.id,
            deactivated: this.context.userInfo.deactivated,
          })
            .then(() => {
              this.setState({ success: `Password successfully changed!` });
              oldPassword.value = "";
              firstNewPassword.value = "";
              secondNewPassword.value = "";
            })
            .catch((res) => {
              this.setState({ error: res.error });
            });
        })
        .catch(() => {
          this.setState({ error: `Incorrect old password.` });
        });
    }
  };

  render() {
    const { success, error } = this.state;
    return (
      <form className="ChangePasswordForm" onSubmit={this.handleSubmit}>
        <div role="alert">
          {error && <p className="error">{error.message}</p>}
          {success && <p className="success">{success}</p>}
        </div>
        <section className="formInputs">
          <div className="oldPasswordInput">
            <label htmlFor="oldPassword">Old Password:</label>
            <input
              type="password"
              name="oldPassword"
              id="oldPassword"
              required
            />
          </div>
          <div className="newPasswordInput">
            <label htmlFor="firstNewPassword">New Password:</label>
            <input
              type="password"
              name="firstNewPassword"
              id="firstNewPassword"
              required
            />
          </div>
          <div className="verifyNewPasswordInput">
            <label htmlFor="secondNewPassword">Confirm Password:</label>
            <input
              type="password"
              name="secondNewPassword"
              id="secondNewPassword"
              required
            />
          </div>
        </section>
        <section className="buttons">
          <button type="submit" className="primary">
            Submit
          </button>
        </section>
      </form>
    );
  }
}
