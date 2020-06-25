import ApiContext from "../../ApiContext";
import config from "../../config";
import EditProfileForm from "./EditProfileForm";
import React, { Component } from "react";
import TokenService from "../../services/token-service";

export default class EditProfilepage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: [],
    history: {
      push: () => {},
    },
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
    zipcode: null,
  };

  handleChangeUsername = (value) => {
    this.setState({
      username: value,
    });
  };

  handleChangeBio = (value) => {
    this.setState({
      bio: value,
    });
  };

  handleChangeProfilePic = (value) => {
    this.setState({
      profile_pic: value,
    });
  };

  handleChangePronouns = (value) => {
    this.setState({
      pronouns: value,
    });
  };

  handleChangeZipcode = (value) => {
    this.setState({
      zipcode: value,
    });
  };

  handleClickCancel = () => {
    this.props.history.push("/userprofile");
  };

  handleEditSuccess = () => {
    const {
      id,
      user_id,
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      zipcode,
    } = this.state;
    const newProfile = {
      id,
      user_id,
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      zipcode,
    };
    this.setState({ error: null });
    console.log(newProfile);
    fetch(`${config.API_ENDPOINT}/profiles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(newProfile),
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
      })
      .then(this.context.editProfile(newProfile))
      .then(this.props.history.push("/UserProfile"))
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  componentDidUpdate() {
    if (this.state.id === null && this.context.userProfile.id) {
      this.setState({
        ...this.context.userProfile,
      });
    }
  }

  componentDidMount() {
    this.context.refreshProfile();
  }

  render() {
    const {
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      zipcode,
    } = this.state;
    const profile = {
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      zipcode,
    };
    return (
      <section className="EditProfilePage">
        <header>
          <h1>Edit Your Profile</h1>
        </header>
        <EditProfileForm
          profile={profile}
          onEditSuccess={this.handleEditSuccess}
          onUsernameChange={this.handleChangeUsername}
          onBioChange={this.handleChangeBio}
          onProfilePicChange={this.handleChangeProfilePic}
          onPronounsChange={this.handleChangePronouns}
          onZipcodeChange={this.handleChangeZipcode}
          onClickCancel={this.handleClickCancel}
        />
      </section>
    );
  }
}