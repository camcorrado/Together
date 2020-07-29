import ApiContext from "../../ApiContext";
import AuthApiService from "../../services/auth-api-service";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import TokenService from "../../services/token-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import icons from "../Icons";
import "./Login.css";

export default class LoginForm extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userInfo: {},
    userProfile: {},
    setProfileInfo: () => {},
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
    console.log("find ran");
    await navigator.geolocation.getCurrentPosition(
      this.locationSuccess,
      this.locationError
    );
  };

  locationSuccess = () => {
    console.log("success");

    this.setState({ error: null });
  };

  locationError = () => {
    console.log("error");
    this.setState({ error: "geolocation error" });
  };

  handleSubmit = (ev) => {
    ev.preventDefault();
    this.setState({ error: null });
    const { email, password } = ev.target;
    this.handleSubmitJwtAuth(email, password);
  };

  handleSubmitJwtAuth = (email, password) => {
    AuthApiService.postLogin({
      email: email.value,
      password: password.value,
    })
      .then(async (res) => {
        TokenService.saveAuthToken(res.authToken);
        await this.context.setUserInfo();
      })
      .then(async () => {
        await this.context.setProfileInfo(this.context.userInfo.id);
        if (Object.keys(this.context.userProfile).length > 0) {
          this.props.onLoginSuccess(password);
        } else {
          this.props.onNoProfile();
        }
        email.value = "";
        password.value = "";
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  render() {
    const { error, loading } = this.state;
    const { buttonDict } = icons;

    return loading ? (
      <section className="loaderMessage">
        <div className="loader"></div>
      </section>
    ) : (
      <form className="LoginForm" onSubmit={this.handleSubmit}>
        {this.state.error === "geolocation error" ? (
          <>
            <div role="alert" className="alert">
              {error && (
                <p className="error">
                  Together requires geolocation. Please change your location
                  permission and refresh the page to continue.
                </p>
              )}
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
            <div className="emailInput">
              <label htmlFor="email">Email:</label>
              <input type="email" name="email" id="email" required />
            </div>
            <div className="passwordInput">
              <label htmlFor="password">Password:</label>
              <input type="password" name="password" id="password" required />
            </div>
            <section className="buttons">
              <button type="submit" className="primary">
                Login
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
