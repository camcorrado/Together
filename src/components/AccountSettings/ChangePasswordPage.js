import ApiContext from "../../ApiContext";
import ChangePasswordForm from "./ChangePasswordForm";
import Nav from "../Nav/Nav";
import React, { Component } from "react";
import "./AccountSettings.css";

export default class ChangePasswordPage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userInfo: {},
    refreshProfile: () => {},
  };

  state = {
    error: null,
  };

  async componentDidMount() {
    await this.context.refreshProfile();
    if (Object.keys(this.context.userProfile).length === 0) {
      this.props.history.push("/createprofile");
    }
  }

  render() {
    const { error } = this.state;
    return (
      <section className="ChangePasswordPage">
        <Nav />
        <section className="changePassword">
          <h2>Change Password</h2>
          <section role="alert">
            {error && <p className="error">{error}</p>}
          </section>
          <ChangePasswordForm />
        </section>
      </section>
    );
  }
}
