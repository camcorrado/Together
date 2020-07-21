import ApiContext from "../../ApiContext";
import config from "../../config";
import EditProfileForm from "./EditProfileForm";
import React, { Component } from "react";
import TokenService from "../../services/token-service";

export default class EditProfilepage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    history: {
      push: () => {},
    },
    refreshProfile: () => {},
    editProfile: () => {},
  };

  state = {
    id: null,
    user_id: null,
    username: null,
    bio: null,
    profile_pic: null,
    interests: null,
    pronouns: null,
    geolocation: null,
    blocked_profiles: null,
    favorited_profiles: null,
    error: null,
  };

  async componentDidMount() {
    await this.context.refreshProfile();
    this.setState({
      ...this.context.userProfile,
    });
  }

  handleChangeUsername = (value) => {
    this.setState({ username: value });
  };

  handleChangeBio = (value) => {
    this.setState({ bio: value });
  };

  handleChangeInterests = (value) => {
    this.setState({ interests: value });
  };

  handleChangeProfilePic = (value) => {
    this.setState({ profile_pic: value });
  };

  handleChangePronouns = (value) => {
    this.setState({ pronouns: value });
  };

  handleEditSuccess = () => {
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
    } = this.state;
    const newProfile = {
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
    };
    this.setState({ error: null });
    fetch(`${config.API_ENDPOINT}/profiles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(newProfile),
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : true
      )
      .then(() => {
        this.context.editProfile(newProfile, () => {
          this.props.history.push(
            `/userprofile/${this.context.userProfile.id}`
          );
        });
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  handleClickCancel = (e) => {
    e.preventDefault();
    this.props.history.push(`/userprofile/${this.context.userProfile.id}`);
  };

  render() {
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
      error,
    } = this.state;
    const profile = {
      id,
      user_id,
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      blocked_profiles,
      favorited_profiles,
    };

    return this.state.id ? (
      <section className="EditProfilePage">
        <header>
          <h1>Edit Your Profile</h1>
        </header>
        <div role="alert">{error && <p className="error">{error}</p>}</div>
        <EditProfileForm
          profile={profile}
          onEditSuccess={this.handleEditSuccess}
          onUsernameChange={this.handleChangeUsername}
          onBioChange={this.handleChangeBio}
          onInterestsChange={this.handleChangeInterests}
          onProfilePicChange={this.handleChangeProfilePic}
          onPronounsChange={this.handleChangePronouns}
          onClickCancel={this.handleClickCancel}
        />
      </section>
    ) : (
      <h2>Loading Profile Information...</h2>
    );
  }
}
