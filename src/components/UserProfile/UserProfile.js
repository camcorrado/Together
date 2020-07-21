import ApiContext from "../../ApiContext";
import config from "../../config";
import { Link } from "react-router-dom";
import Nav from "../Nav/Nav";
import React from "react";
import TokenService from "../../services/token-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFistRaised,
  faDragon,
  faPaintBrush,
  faUtensilSpoon,
  faHammer,
  faFemale,
  faTshirt,
  faDumbbell,
  faPizzaSlice,
  faGamepad,
  faSeedling,
  faCampground,
  faFilm,
  faMusic,
  faMoon,
  faCat,
  faBookOpen,
  faPrayingHands,
  faFutbol,
  faMicrochip,
  faTheaterMasks,
  faPlane,
  faTimes,
  faStar,
  faComments,
  faTh,
  faUndo,
  faCheck,
  faDoorOpen,
} from "@fortawesome/free-solid-svg-icons";

class UserProfile extends React.Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    conversations: [],
    nearbyProfiles: [],
    blockedBy: [],
    refreshProfile: () => {},
    setConversations: () => {},
  };

  state = {
    profile: {},
    error: null,
  };

  async componentDidMount() {
    this.setState({ error: null });
    await this.context.refreshProfile();

    const profileId = Number(this.props.match.params.profileId);
    if (Object.keys(this.context.userProfile).length === 0) {
      this.props.history.push("/createprofile");
    } else if (this.context.blockedBy.includes(profileId)) {
      this.setState({ error: `Invalid profile` });
    } else {
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
          this.setState({
            profile: data,
          });
        })
        .catch((res) => {
          this.setState({ error: res.error });
        });
    }
  }

  handleClickEdit = (e) => {
    e.preventDefault();
    this.props.history.push(`/EditProfile/${this.state.profile.id}`);
  };

  handleClickFavorite = async (e) => {
    e.preventDefault();
    this.setState({ error: null });
    const favoritedProfiles = [
      ...this.context.userProfile.favorited_profiles,
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
      geolocation: `${geoData.x}, ${geoData.y}`,
      blocked_profiles,
      favorited_profiles: favoritedProfiles,
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
        this.context.editProfile(updatedProfile),
        this.context.refreshProfile()
      )
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  handleClickUnfavorite = async (e) => {
    e.preventDefault();
    this.setState({ error: null });
    const favoritedProfiles = this.context.userProfile.favorited_profiles.filter(
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
      geolocation: `${geoData.x}, ${geoData.y}`,
      blocked_profiles,
      favorited_profiles: favoritedProfiles,
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
        this.context.editProfile(updatedProfile),
        this.context.refreshProfile()
      )
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  handleClickBlock = async (e) => {
    e.preventDefault();
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
      .then(this.context.editProfile(updatedProfile))
      .then(this.props.history.push(`/grid`))
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  handleClickUnblock = async (e) => {
    e.preventDefault();
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

  sendMessage = (e) => {
    e.preventDefault();
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
        .then((res) => {
          !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json();
        })
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

  render() {
    const { profile, error } = this.state;
    const {
      id,
      username,
      bio,
      profile_pic,
      interests = [],
      pronouns,
    } = profile;
    let interestDict = {
      Activism: faFistRaised,
      Anime: faDragon,
      Art: faPaintBrush,
      Cooking: faUtensilSpoon,
      Crafting: faHammer,
      Drag: faFemale,
      Fashion: faTshirt,
      Fitness: faDumbbell,
      Food: faPizzaSlice,
      Gaming: faGamepad,
      Gardening: faSeedling,
      "The Outdoors": faCampground,
      Movies: faFilm,
      Music: faMusic,
      Nightlife: faMoon,
      "Pets/Animals": faCat,
      Reading: faBookOpen,
      Spirituality: faPrayingHands,
      Sports: faFutbol,
      Tech: faMicrochip,
      Theater: faTheaterMasks,
      Travel: faPlane,
    };
    if (this.state.error !== null) {
      return (
        <section className="userProfile">
          <nav role="navigation">
            <section className="buttons">
              <Link
                to={`/userprofile/${this.context.userProfile.id}`}
                aira-label="view profile button"
                id="viewProfileButton"
              >
                {this.context.userProfile.profile_pic ? (
                  <img
                    src={this.context.userProfile.profile_pic}
                    alt={this.context.userProfile.username + `'s profile pic`}
                    className="profilePicButton"
                  />
                ) : (
                  <></>
                )}
              </Link>
              <Link to="/grid" aria-label="back button" className="primary">
                <FontAwesomeIcon icon={faTh} className="faIcon" />
              </Link>
              <button
                onClick={this.handleClickLogOut}
                aria-label="logout button"
              >
                <FontAwesomeIcon icon={faDoorOpen} className="faIcon" />
              </button>
            </section>
          </nav>
          <div role="alert">
            {error && <p className="error">Invalid Profile</p>}
          </div>
        </section>
      );
    } else if (this.state.profile.id === this.context.userProfile.id) {
      return this.state.profile.id ? (
        <section className="userProfile">
          <Nav />
          <div role="alert">{error && <p className="error">{error}</p>}</div>
          <section className="username">
            <h2>{username}</h2>
          </section>
          <section className="profilePic">
            <img
              src={profile_pic}
              alt={this.props.username + `'s profile pic`}
              className="profilePic"
            />
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
        </section>
      ) : (
        <h2>Loading Profile...</h2>
      );
    } else if (this.context.userProfile.blocked_profiles.includes(id)) {
      return this.state.profile.id ? (
        <section className="userProfile">
          <nav role="navigation">
            <section className="buttons">
              <button
                className="unblock"
                aria-label="unblock button"
                onClick={this.handleClickUnblock}
              >
                <FontAwesomeIcon icon={faCheck} className="faIcon" />
              </button>
              <Link
                to="/blockedprofiles"
                aria-label="back button"
                className="primary"
              >
                <FontAwesomeIcon icon={faUndo} className="faIcon" />
              </Link>
            </section>
          </nav>
          <section className="username">
            <h2>{username}</h2>
          </section>
          <section className="profilePic">
            <img
              src={profile_pic}
              alt={this.props.username + `'s profile pic`}
              className="profilePic"
            />
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
        </section>
      ) : (
        <h2>Loading Profile...</h2>
      );
    } else {
      return this.state.profile.id ? (
        <section className="userProfile">
          <nav role="navigation">
            <section className="buttons">
              <section className="buttons">
                <button
                  className="primary"
                  aria-label="message button"
                  onClick={this.sendMessage}
                >
                  <FontAwesomeIcon icon={faComments} className="faIcon" />
                </button>
                {this.context.userProfile.favorited_profiles.includes(
                  this.state.profile.id
                ) === true ? (
                  <button
                    className="unfavorite"
                    aria-label="unfavorite button"
                    onClick={this.handleClickUnfavorite}
                  >
                    <FontAwesomeIcon
                      icon={["far", "star"]}
                      className="faIcon"
                    />
                  </button>
                ) : (
                  <button
                    className="favorite"
                    aria-label="favorite button"
                    onClick={this.handleClickFavorite}
                  >
                    <FontAwesomeIcon icon={faStar} className="faIcon" />
                  </button>
                )}

                <button
                  className="block"
                  aria-label="block button"
                  onClick={this.handleClickBlock}
                >
                  <FontAwesomeIcon icon={faTimes} className="faIcon" />
                </button>
                <Link to="/grid" aria-label="back button" className="primary">
                  <FontAwesomeIcon icon={faTh} className="faIcon" />
                </Link>
              </section>
            </section>
          </nav>
          <section className="username">
            <h2>{username}</h2>
          </section>
          <section className="profilePic">
            <img
              src={profile_pic}
              alt={this.props.username + `'s profile pic`}
              className="profilePic"
            />
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
        </section>
      ) : (
        <h2>Loading Profile...</h2>
      );
    }
  }
}

export default UserProfile;
