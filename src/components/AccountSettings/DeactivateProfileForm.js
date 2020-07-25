import ApiContext from "../../ApiContext";
import config from "../../config";
import React, { Component } from "react";
import "./AccountSettings.css";

export default class ChangePasswordForm extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userInfo: {},
    userProfile: {},
    logOut: () => {},
  };

  state = {
    error: null,
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
    const { password } = ev.target;
    const credentials = {
      email: this.context.userInfo.email,
      password: password.value,
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
      .then(this.props.onDeactivate(password))
      .catch(() => {
        this.setState({ error: `Incorrect old password.` });
      });
  };

  render() {
    const { error } = this.state;
    return (
      <form className="DeactivateForm" onSubmit={this.handleSubmit}>
        <section role="alert">
          {error && <p className="error">{error}</p>}
        </section>
        <section className="forward">
          <p>
            Deactivating your profile will prevent other users from seeing it on
            their grid.
          </p>
          <p>Log back in anytime to automatically reactivate your profile!</p>
        </section>
        <section className="formInputs">
          <div className="passwordInput">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              name="password"
              id="password"
              defaultValue="Test123!"
              required
            />
          </div>
        </section>
        <section className="buttons">
          <button type="submit" className="primary deactivate">
            Deactivate
          </button>
        </section>
      </form>
    );
  }
}
