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
    await this.findLocation();
    this.setState({ loading: false });
  }

  findLocation = async () => {
    await navigator.geolocation.getCurrentPosition(
      this.locationSuccess,
      this.locationError
    );
  };

  locationSuccess = () => {
    this.setState({ error: null });
  };

  locationError = () => {
    this.setState({ error: "geolocation error" });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      firstPassword,
      secondPassword,
    } = e.target;
    this.setState({ error: null });
    if (firstPassword.value !== secondPassword.value) {
      this.setState({ error: `Passwords do not match.` });
    } else {
      AuthApiService.postUser({
        email: email.value,
        password: firstPassword.value,
        full_name: `${firstName.value} ${lastName.value}`,
        deactivated: "false",
      })
        .then(() => {
          AuthApiService.postLogin({
            email: email.value,
            password: firstPassword.value,
          })
            .then((res) => {
              TokenService.saveAuthToken(res.authToken);
            })
            .then(() => {
              this.context.refreshProfile();
            })
            .then(() => {
              firstName.value = "";
              lastName.value = "";
              email.value = "";
              firstPassword.value = "";
              secondPassword.value = "";
              this.props.onSignUpSuccess();
            })
            .catch((res) => {
              this.setState({ error: res.error });
            });
        })
        .catch((res) => {
          this.setState({ error: res.error });
        });
    }
  };

  render() {
    const { error, loading } = this.state;
    const { buttonDict } = icons;
    return loading ? (
      <section className="loaderMessage">
        <div className="loader"></div>
      </section>
    ) : (
      <form className="SignUpForm" onSubmit={this.handleSubmit}>
        {this.state.error === "geolocation error" ? (
          <>
            <div role="alert" className="alert">
              <p className="error">
                Together requires geolocation. Please change your location
                permission and refresh the page to continue.
              </p>
            </div>
            <section className="buttons">
              <Link to="/" aria-label="back button">
                <FontAwesomeIcon icon={buttonDict.faUndo} className="faIcon" />
              </Link>
            </section>
          </>
        ) : (
          <>
            <div role="alert" className="alert">
              {error && <p className="error">{error}</p>}
            </div>
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
            <div className="firstPasswordInput">
              <label htmlFor="firstPassword">Password:</label>
              <input
                type="password"
                name="firstPassword"
                id="firstPassword"
                maxLength="20"
                required
              />
            </div>
            <div className="secondPasswordInput">
              <label htmlFor="secondPassword">Confirm Password:</label>
              <input
                type="password"
                name="secondPassword"
                id="secondPassword"
                maxLength="20"
                required
              />
            </div>
            <div className="termsOfService">
              <label htmlFor="terms of service">
                I have read &amp; agree to the &nbsp;
                <Link to="/terms" className="termsLink">
                  terms of service:
                </Link>
              </label>
              <input type="checkbox" name="terms" id="terms" required />
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
