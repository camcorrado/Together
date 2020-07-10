import ApiContext from "../../ApiContext";
import config from "../../config";
import React from "react";
import TokenService from "../../services/token-service";

class UserProfile extends React.Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    conversations: [],
    refreshProfile: () => {},
    setConversations: () => {},
  };

  state = {
    profile: {},
    error: null,
  };

  async componentDidMount() {
    await this.context.refreshProfile();
    const profileId = this.props.match.params.profileId;
    fetch(`${config.API_ENDPOINT}/profiles/${profileId}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((data) => {
        this.setState({
          profile: data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleClickBack = (e) => {
    e.preventDefault();
    this.props.history.push("/Grid");
  };

  handleClickEdit = (e) => {
    e.preventDefault();
    this.props.history.push(`/EditProfile/${this.state.profile.id}`);
  };

  handleClickFavorite = async (e) => {
    e.preventDefault();

    const favoritedProfiles = [
      ...this.context.userProfile.favorited_profiles,
      this.state.profile.id,
    ];

    const {
      id,
      user_id,
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      zipcode,
      blocked_profiles,
    } = this.context.userProfile;
    const updatedProfile = {
      id,
      user_id,
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      zipcode,
      blocked_profiles,
      favorited_profiles: favoritedProfiles,
    };

    fetch(`${config.API_ENDPOINT}/profiles/${updatedProfile.id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedProfile),
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
      .then(this.context.editProfile(updatedProfile))
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  handleClickUnfavorite = async (e) => {
    e.preventDefault();

    const favoritedProfiles = this.context.userProfile.favorited_profiles.filter(
      (profileId) => profileId !== this.state.profile.id
    );
    console.log({ favoritedProfiles });
    const {
      id,
      user_id,
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      zipcode,
      blocked_profiles,
    } = this.context.userProfile;
    const updatedProfile = {
      id,
      user_id,
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      zipcode,
      blocked_profiles,
      favorited_profiles: favoritedProfiles,
    };

    fetch(`${config.API_ENDPOINT}/profiles/${updatedProfile.id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedProfile),
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
      .then(this.context.editProfile(updatedProfile))
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  handleClickBlock = async (e) => {
    e.preventDefault();
    const blockedProfiles = [
      ...this.context.userProfile.blocked_profiles,
      this.state.profile.id,
    ];

    const {
      id,
      user_id,
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      zipcode,
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
      zipcode,
      blocked_profiles: blockedProfiles,
      favorited_profiles,
    };

    fetch(`${config.API_ENDPOINT}/profiles/${updatedProfile.id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedProfile),
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
      .then(this.context.editProfile(updatedProfile))
      .then(this.props.history.push(`/grid`))
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  sendMessage = (e) => {
    console.log(`send message ran`);
    e.preventDefault();
    if (this.context.conversations !== undefined) {
      let convo = this.context.conversations.filter((conversation) =>
        conversation.users.includes(this.state.profile.id)
      );
      this.props.history.push(`/conversation/${convo.id}`);
    } else {
      const users = [this.context.userProfile.id, this.state.profile.id];
      const newConvo = { users };
      fetch(`${config.API_ENDPOINT}/conversations`, {
        method: "POST",
        body: JSON.stringify(newConvo),
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          authorization: `bearer ${TokenService.getAuthToken()}`,
        },
      })
        .then((res) => {
          !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json();
        })
        .then(async () => {
          await this.context.setConversations();
          let convo = this.context.conversations.filter((conversation) =>
            conversation.users.includes(this.state.profile.id)
          );
          this.props.history.push(`/conversation/${convo.id}`);
        })
        .catch((res) => {
          this.setState({ error: res.error });
        });
    }
  };

  render() {
    const { profile, error } = this.state;
    const { username, bio, profile_pic, interests = [], pronouns } = profile;

    if (this.state.profile.id === this.context.userProfile.id) {
      return this.state.profile.id ? (
        <section className="userProfile">
          <div role="alert">
            {error && <p className="red">{error.message}</p>}
          </div>
          <section className="username">
            <h1>{username}</h1>
          </section>
          <section className="profilePic">
            <img
              src={profile_pic}
              alt={this.props.username + `'s profile pic`}
              className="profilePic"
            />
          </section>
          <section className="interests">
            <ul>
              {interests.map((interest) => (
                <li key={interest} className="interest">
                  {interest}
                </li>
              ))}
            </ul>
          </section>
          <section className="bio">
            <p>{bio}</p>
          </section>
          <section className="buttons">
            <button className="primary" onClick={this.handleClickEdit}>
              Edit Profile
            </button>
            <button onClick={() => this.props.history.push("/grid")}>
              Back
            </button>
          </section>
        </section>
      ) : (
        <h2>Loading Profile...</h2>
      );
    } else {
      return this.state.profile.id ? (
        <section className="userProfile">
          <section className="username">
            <h1>{username}</h1>
          </section>
          <section className="profilePic">
            <img
              src={profile_pic}
              alt={this.props.username + `'s profile pic`}
              className="profilePic"
            />
          </section>
          <section className="interests">
            <ul>
              {interests.map((interest) => (
                <li key={interest} className="interest">
                  {interest}
                </li>
              ))}
            </ul>
          </section>
          <section className="bio">
            <p>{bio}</p>
          </section>
          <section className="pronouns">
            <p>{pronouns}</p>
          </section>
          <section className="buttons">
            <button className="primary" onClick={this.sendMessage}>
              Message
            </button>
            {this.context.userProfile.favorited_profiles.includes(
              this.state.profile.id
            ) === true ? (
              <button
                className="unfavorite"
                onClick={this.handleClickUnfavorite}
              >
                Unfavorite
              </button>
            ) : (
              <button className="favorite" onClick={this.handleClickFavorite}>
                Favorite
              </button>
            )}

            <button className="block" onClick={this.handleClickBlock}>
              Block
            </button>
            <button onClick={() => this.props.history.push("/grid")}>
              Back
            </button>
          </section>
        </section>
      ) : (
        <h2>Loading Profile...</h2>
      );
    }
  }
}

export default UserProfile;
