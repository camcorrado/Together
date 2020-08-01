import ApiContext from "../../ApiContext";
import ChangePasswordForm from "./ChangePasswordForm";
import Nav from "../Nav/Nav";
import React, { Component } from "react";
import "./AccountSettings.css";

export default class ChangePasswordPage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userInfo: {},
    userProfile: {},
    refreshProfile: () => {},
  };

  state = {
    error: null,
    loading: null,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    await this.context.refreshProfile();
    if (Object.keys(this.context.userProfile).length === 0) {
      this.setState({ loading: false });
      this.props.history.push("/createprofile");
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    const { error, loading } = this.state;
    return loading ? (
      <section className="loaderMessage">
        <div className="loader"></div>
      </section>
    ) : (
      <section className="ChangePasswordPage">
        <Nav />
        <section className="changePassword">
          <h2>Change Password</h2>
          <div role="alert">{error && <p className="error">{error}</p>}</div>
          <ChangePasswordForm />
          <section className="note">
            {this.context.userInfo.email === "test@email.com" ? (
              <p>
                If you're using the test account, please change the password
                back to "Test123!"
              </p>
            ) : (
              <></>
            )}
          </section>
        </section>
      </section>
    );
  }
}
