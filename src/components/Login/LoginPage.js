import ApiContext from "../../ApiContext";
import AuthApiService from "../../services/auth-api-service";
import config from "../../config";
import Header from "../Header/Header";
import LoginForm from "./LoginForm";
import React, { Component } from "react";
import TokenService from "../../services/token-service";
import "./Login.css";

export default class LoginPage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userInfo: {},
    userProfile: {},
    editUser: () => {},
  };

  state = {
    geolocationData: "",
    error: null,
    editProfile: () => {},
  };

  componentDidMount() {
    this.findLocation();
    if (TokenService.getAuthToken()) {
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

  locationError = () => {
    this.setState({ error: `Please allow Geolocation` });
  };

  handleLoginSuccess = async (password) => {
    this.setState({ error: null });
    if (this.state.geolocationData === "") {
      await this.findLocation();
    } else {
      if (this.context.userInfo.deactivated === "true") {
        let geoData = this.context.userProfile.geolocation;

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
          geolocation: `${geoData.x}, ${geoData.y}`,
          blocked_profiles,
          favorited_profiles,
          deactivated: "false",
        };

        AuthApiService.patchUser({
          deactivated: "false",
          password: password.value,
        })
          .then(this.context.editUser({ deactivated: "false" }))
          .catch((res) => {
            this.setState({ error: res.error });
          });

        fetch(
          `${config.API_ENDPOINT}/profiles/${this.context.userProfile.id}`,
          {
            method: "PATCH",
            body: JSON.stringify(updatedProfile),
            headers: {
              "content-type": "application/json",
              authorization: `bearer ${TokenService.getAuthToken()}`,
            },
          }
        )
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
      }

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
          deactivated: "false",
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
    }
  };

  handleNoProfile = async () => {
    this.props.history.push("/createprofile");
  };

  render() {
    const { error } = this.state;
    return (
      <section className="LoginPage">
        <header className="appHeader">
          <Header />
        </header>
        <h3 id="loginTitle">Login</h3>

        <LoginForm
          onLoginSuccess={this.handleLoginSuccess}
          onNoProfile={this.handleNoProfile}
        />
        <div role="alert" id="loginAlert" className="alert">
          {error && <p className="error">{error}</p>}
        </div>
      </section>
    );
  }
}
