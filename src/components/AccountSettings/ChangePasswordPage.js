import ApiContext from "../../ApiContext";
import ChangePasswordForm from "./ChangePasswordForm";
import Nav from "../Nav/Nav";
import React, { Component } from "react";

export default class ChangePasswordPage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userInfo: {},
    refreshProfile: () => {},
  };

  state = {
    error: null,
  };

  componentDidMount() {
    this.context.refreshProfile();
  }

  render() {
    const { error } = this.state;
    return (
      <section className="ChangePasswordPage">
        <Nav />
        <section className="changePassword">
          <h2>Change Password</h2>{" "}
          <div role="alert">{error && <p className="error">{error}</p>}</div>
          <ChangePasswordForm onChangeSuccess={this.handleLoginSuccess} />
        </section>
      </section>
    );
  }
}
