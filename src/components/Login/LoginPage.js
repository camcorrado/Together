import ApiContext from "../../ApiContext";
import config from "../../config";
import Header from "../Header/Header";
import LoginForm from "./LoginForm";
import React, { Component } from "react";
import TokenService from "../../services/token-service";

export default class LoginPage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
  };

  state = {
    geolocationData: "",
    error: null,
    editProfile: () => {},
  };

  componentDidMount() {
    this.findLocation();
    const authToken = TokenService.getAuthToken();
    if (authToken) {
      this.props.history.push("/grid");
    }
  }

  findLocation = async () => {
    await navigator.geolocation.getCurrentPosition(
      this.locationSuccess,
      this.locationError
    );
  };

  locationSuccess = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    this.setState({
      geolocationData: `${latitude}, ${longitude}`,
    });
  };

  locationError = (err) => {
    this.setState({ error: err.message });
  };

  handleLoginSuccess = () => {
    this.setState({ error: null });
    if (this.state.geolocationData !== this.context.userProfile.geolocation) {
      const {
        id,
        user_id,
        username,
        bio,
        profile_pic,
        interests,
        pronouns,
        blocked_profiles,
        favorited_profiles,
      } = this.context.userProfile;
      const updatedProfile = {
        id,
        user_id,
        username,
        bio,
        profile_pic,
        interests,
        pronouns,
        blocked_profiles,
        favorited_profiles,
        geolocation: this.state.geolocationData,
      };

      fetch(`${config.API_ENDPOINT}/profiles/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedProfile),
        headers: {
          "content-type": "application/json",
          authorization: `bearer ${TokenService.getAuthToken()}`,
        },
      })
        .then((res) =>
          !res.ok ? res.json().then((e) => Promise.reject(e)) : true
        )
        .then(() => {
          this.context.editProfile(updatedProfile, () => {
            this.props.history.push("/grid");
          });
        })
        .catch((res) => {
          this.setState({ error: res.error });
        });
    } else {
      this.props.history.push("/grid");
    }
  };

  handleNoProfile = async () => {
    this.props.history.push("/createprofile");
  };

  render() {
    const { error } = this.state;
    return (
      <section className="LoginPage">
        <header className="App_Header">
          <Header />
        </header>
        <h2>Login</h2>{" "}
        <div role="alert">
          {error && <p className="error">{error.message}</p>}
        </div>
        <LoginForm
          onLoginSuccess={this.handleLoginSuccess}
          onNoProfile={this.handleNoProfile}
        />
      </section>
    );
  }
}
