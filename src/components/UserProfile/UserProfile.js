import ApiContext from "../../ApiContext";
import config from "../../config";
import Nav from "../Nav/Nav";
import React, { Component } from "react";
import TokenService from "../../services/token-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import icons from "../Icons";
import "./UserProfile.css";

export default class UserProfile extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    nearbyProfiles: [],
    refreshProfile: () => {},
  };

  state = {
    profile: {},
    error: null,
    loading: null,
  };

  _isMounted = false;

  async componentDidMount() {
    this._isMounted = true;
    this.setState({ error: null, loading: true });
    await this.context.refreshProfile();
    const profileId = Number(this.props.match.params.profileId);
    const profile = this.context.nearbyProfiles.filter(
      (profile) => profile.id === profileId
    );
    if (Object.keys(this.context.userProfile).length === 0) {
      this.props.history.push("/createprofile");
    } else if (
      this.context.blockedBy.includes(profileId) ||
      (profile.length === 0 &&
        profileId !== this.context.userProfile.id &&
        !this.context.userProfile.blocked_profiles.includes(profileId))
    ) {
      if (this._isMounted) {
        this.setState({ error: `Invalid profile`, loading: false });
      }
    } else {
      if (this._isMounted) {
        fetch(`${config.API_ENDPOINT}/profiles/${profileId}`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
        })
          .then((res) =>
            !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
          )
          .then((data) => {
            if (data.deactivated === "true" && this._isMounted) {
              this.setState({ error: `Invalid profile`, loading: false });
            } else if (data.deactivated === "false" && this._isMounted) {
              this.setState({
                profile: data,
                loading: false,
              });
            }
          })
          .catch((res) => {
            this.setState({ error: res.error });
          });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleClickBlock = () => {
    this.setState({ error: null });
    const blockedProfiles = [
      ...this.context.userProfile.blocked_profiles,
      this.state.profile.id,
    ];

    let geoData = this.context.userProfile.geolocation;

    const {
      id,
      user_id,
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      favorited_profiles,
      deactivated,
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
      blocked_profiles: blockedProfiles,
      favorited_profiles,
      deactivated,
    };

    fetch(`${config.API_ENDPOINT}/profiles/${updatedProfile.id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedProfile),
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then(() => {
        console.log(this._isMounted);
        if (this._isMounted) {
          console.log("ran");
          this.context.editProfile(updatedProfile, () => {
            this.props.history.push(`/grid`);
          });
        }
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  handleClickUnblock = () => {
    this.setState({ error: null });
    const blockedProfiles = this.context.userProfile.blocked_profiles.filter(
      (profileId) => profileId !== this.state.profile.id
    );

    let geoData = this.context.userProfile.geolocation;

    const {
      id,
      user_id,
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      favorited_profiles,
      deactivated,
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
      blocked_profiles: blockedProfiles,
      favorited_profiles,
      deactivated,
    };

    fetch(`${config.API_ENDPOINT}/profiles/${updatedProfile.id}`, {
      method: "PATCH",
      body: JSON.stringify(updatedProfile),
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then(
        this.context.editProfile(updatedProfile, () => {
          this.props.history.push(`/blockedprofiles`);
        })
      )
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  sendMessage = () => {
    let convo = this.context.conversations
      .filter((conversation) =>
        conversation.users.includes(this.state.profile.id)
      )
      .pop();
    if (convo) {
      this.props.history.push(`/conversation/${convo.id}`);
    } else {
      this.setState({ error: null });
      const users = [this.context.userProfile.id, this.state.profile.id];
      const newConvo = { users };
      fetch(`${config.API_ENDPOINT}/conversations`, {
        method: "POST",
        body: JSON.stringify(newConvo),
        headers: {
          "content-type": "application/json",
          authorization: `bearer ${TokenService.getAuthToken()}`,
        },
      })
        .then((res) =>
          !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
        )
        .then(async () => {
          await this.context.setConversations();
          convo = this.context.conversations
            .filter((conversation) =>
              conversation.users.includes(this.state.profile.id)
            )
            .pop();
          return convo;
        })
        .then((convo) => {
          this.props.history.push(`/conversation/${convo.id}`);
        })
        .catch((res) => {
          this.setState({ error: res.error });
        });
    }
  };

  viewProfile = () => {
    this.props.history.push(`/userprofile/${this.context.userProfile.id}`);
  };

  render() {
    const { profile, error, loading } = this.state;
    const { userProfile } = this.context;

    const {
      id,
      username,
      bio,
      profile_pic,
      interests = [],
      pronouns,
    } = profile;

    const { interestDict } = icons;
    return (
      <section className="UserProfile">
        <Nav
          onClickBlock={this.handleClickBlock}
          onClickUnblock={this.handleClickUnblock}
          onClickSendMessage={this.sendMessage}
          onClickViewProfile={this.viewProfile}
        />
        {profile.id === userProfile.id ? (
          <>
            <section className="username">
              <h2>{username}</h2>
            </section>
            <section className="profilePicUserProfile">
              {profile_pic ? (
                <img
                  src={profile_pic}
                  alt={username + `'s profile pic`}
                  className="profilePic"
                />
              ) : (
                <></>
              )}
            </section>
            <section className="interestsProfile">
              <ul>
                {interests.map((interest) => (
                  <li key={interest} className="interestWrapper">
                    <FontAwesomeIcon
                      icon={interestDict[interest]}
                      className="faIconProfile"
                    />
                    <p className="interestTextProfile">{interest}</p>
                  </li>
                ))}
              </ul>
            </section>
            <section className="bio">
              <p>{bio}</p>
            </section>
          </>
        ) : (
          <>
            {userProfile.blocked_profiles.includes(id) ? (
              <>
                <section className="username">
                  <h2>{username}</h2>
                </section>
                <section className="profilePicUserProfile">
                  {profile_pic ? (
                    <img
                      src={profile_pic}
                      alt={username + `'s profile pic`}
                      className="profilePic"
                    />
                  ) : (
                    <></>
                  )}
                </section>
                <section className="interestsProfile">
                  <ul>
                    {interests.map((interest) => (
                      <li key={interest} className="interestWrapper">
                        <FontAwesomeIcon
                          icon={interestDict[interest]}
                          className="faIconProfile"
                        />
                        <p className="interestTextProfile">{interest}</p>
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
              </>
            ) : (
              <>
                <section className="username">
                  <h2>{username}</h2>
                </section>
                <section className="profilePicUserProfile">
                  {profile_pic ? (
                    <img
                      src={profile_pic}
                      alt={username + `'s profile pic`}
                      className="profilePic"
                    />
                  ) : (
                    <></>
                  )}
                </section>
                <section className="interestsProfile">
                  <ul>
                    {interests.map((interest) => (
                      <li key={interest} className="interestWrapper">
                        <FontAwesomeIcon
                          icon={interestDict[interest]}
                          className="faIconProfile"
                        />
                        <p className="interestTextProfile">{interest}</p>
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
              </>
            )}
          </>
        )}
        {loading ? (
          <section className="loaderMessage">
            <div className="loader"></div>
          </section>
        ) : error !== null && error !== undefined ? (
          <div role="alert" className="alert">
            {error && <p className="error">Invalid Profile</p>}
          </div>
        ) : (
          <div role="alert" className="alert">
            {error && <p className="error">{error}</p>}
          </div>
        )}
      </section>
    );
  }
}
