import ApiContext from "../../ApiContext";
import AuthApiService from "../../services/auth-api-service";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import TokenService from "../../services/token-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import icons from "../Icons";
import "./SignUp.css";

export default class SignUpForm extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    refreshProfile: () => {},
  };

  state = {
    error: null,
    loading: null,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    await this.handlePermission();
    this.setState({ loading: false });
  }

  handlePermission = async () => {
    let locationStatus;
    await navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        if (result.state === "granted") {
          locationStatus = "granted";
        } else if (result.state === "prompt") {
          locationStatus = "prompt";
        } else if (result.state === "denied") {
          locationStatus = "denied";
        }
      });
    if (locationStatus !== "granted") {
      this.setState({
        error: "geolocation error",
      });
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password } = e.target;
    this.setState({ error: null });
    AuthApiService.postUser({
      email: email.value,
      password: password.value,
      full_name: `${firstName.value} ${lastName.value}`,
      deactivated: "false",
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
            this.context.refreshProfile();
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
    const { error, loading } = this.state;
    const { buttonDict } = icons;
    return loading ? (
      <></>
    ) : (
      <form className="SignUpForm" onSubmit={this.handleSubmit}>
        {this.state.error === "geolocation error" ? (
          <>
            <section role="alert" className="alert">
              <p className="error">
                Together requires geolocation. Please change your location
                permission and refresh the page to continue.
              </p>
            </section>
            <section className="buttons">
              <Link to="/" aria-label="back button">
                <FontAwesomeIcon icon={buttonDict.faUndo} className="faIcon" />
              </Link>
            </section>
          </>
        ) : (
          <>
            <section role="alert" className="alert">
              {error && <p className="error">{error}</p>}
            </section>
            <div className="firstNameInput">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                maxLength="20"
                defaultValue="Cam"
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
                defaultValue="Corrado"
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
                defaultValue="test100@gmail.com"
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
                defaultValue="Test123!"
                required
              />
            </div>
            <section className="buttons">
              <button type="submit" className="primary">
                Sign Up
              </button>
              <Link to="/" aria-label="back button">
                <FontAwesomeIcon icon={buttonDict.faUndo} className="faIcon" />
              </Link>
            </section>
          </>
        )}
      </form>
    );
  }
}
