import ApiContext from "../../ApiContext";
import AuthApiService from "../../services/auth-api-service";
import config from "../../config";
import DeactivateProfileForm from "./DeactivateProfileForm";
import Nav from "../Nav/Nav";
import React, { Component } from "react";
import TokenService from "../../services/token-service";
import "./AccountSettings.css";

export default class DeactivateProfilePage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userInfo: {},
    userProfile: {},
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

  handleDeactivate = (password) => {
    let geoData = this.context.userProfile.geolocation;

    const {
      id,
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      blocked_profiles,
      favorited_profiles,
    } = this.context.userProfile;

    const updatedProfile = {
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      geolocation: `${geoData.x}, ${geoData.y}`,
      blocked_profiles,
      favorited_profiles,
      deactivated: "true",
    };

    AuthApiService.patchUser({
      deactivated: "true",
      password: password.value,
    })
      .then(() => {
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
          .then(this.context.logOut())
          .catch((res) => {
            this.setState({ error: res.error });
          });
      })
      .catch((res) => {
        console.log(res.error);
      });
  };

  render() {
    const { error } = this.state;
    return (
      <section className="DeactivateProfilePage">
        <Nav />
        <section className="deactivateProfile">
          <h2>Deactivate Profile</h2>
          <div role="alert">{error && <p className="error">{error}</p>}</div>
          <DeactivateProfileForm onDeactivate={this.handleDeactivate} />
        </section>
      </section>
    );
  }
}
