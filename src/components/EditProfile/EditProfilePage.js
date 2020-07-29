import ApiContext from "../../ApiContext";
import config from "../../config";
import EditProfileForm from "./EditProfileForm";
import React, { Component } from "react";
import TokenService from "../../services/token-service";
import "./EditProfile.css";

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
    deactivated: null,
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
      this.setState({
        ...this.context.userProfile,
        loading: false,
      });
    }
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
      deactivated,
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
      deactivated,
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
      loading,
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

    return loading ? (
      <section className="loaderMessage">
        <div className="loader"></div>
      </section>
    ) : (
      <section className="EditProfilePage">
        <header>
          <h2>Edit Your Profile</h2>
        </header>
        <div role="alert">{error && <p className="error">{error}</p>}</div>
        {this.state.id ? (
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
        ) : (
          <section className="loaderMessage">
            <div className="loader"></div>
          </section>
        )}
      </section>
    );
  }
}
