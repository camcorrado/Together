import ApiContext from "../../ApiContext";
import config from "../../config";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import SortByForm from "../SortByForm";
import TokenService from "../../services/token-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import icons from "../Icons";
import "./Nav.css";

export default class Nav extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    nearbyProfiles: [],
    conversations: [],
    blockedBy: [],
    messageBadge: null,
    editProfile: () => {},
    setConversations: () => {},
    setMessageBadge: () => {},
    refreshProfile: () => {},
    logOut: () => {},
  };

  state = {
    pathname: "",
    pathnameId: 0,
    loading: null,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const pathname = window.location.pathname;
    const pathnameId = Number(pathname.split("/").pop());
    this.setState({
      loading: false,
      pathname: pathname,
      pathnameId: pathnameId,
    });
  }

  handleClickEdit = (e) => {
    e.preventDefault();
    let { pathnameId } = this.state;
    this.props.history.push(`/EditProfile/${pathnameId}`);
  };

  handleClickFavorite = async (e) => {
    e.preventDefault();
    this.setState({ error: null });
    let { pathnameId } = this.state;

    const favoritedProfiles = [
      ...this.context.userProfile.favorited_profiles,
      pathnameId,
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
      blocked_profiles,
      favorited_profiles: favoritedProfiles,
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
    let { pathnameId } = this.state;

    const favoritedProfiles = this.context.userProfile.favorited_profiles.filter(
      (profileId) => profileId !== pathnameId
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
      blocked_profiles,
      favorited_profiles: favoritedProfiles,
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
        this.context.editProfile(updatedProfile),
        this.context.refreshProfile()
      )
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  handleClickBlock = (e) => {
    e.preventDefault();
    this.props.onClickBlock();
  };

  handleClickUnblock = (e) => {
    e.preventDefault();
    this.props.onClickUnblock();
  };

  handleClickLogOut = (e) => {
    e.preventDefault();
    this.context.logOut();
  };

  sendMessage = (e) => {
    e.preventDefault();
    this.props.onClickSendMessage();
  };

  handleClickViewProfile = (e) => {
    e.preventDefault();
    this.props.onClickViewProfile();
  };

  render() {
    const {
      id,
      username,
      profile_pic,
      favorited_profiles,
      blocked_profiles,
    } = this.context.userProfile;
    const { blockedBy, messageBadge, nearbyProfiles } = this.context;
    const { pathname, pathnameId, loading } = this.state;
    const { buttonDict } = icons;
    const url = `/userprofile/${id}`;
    const editUrl = `/editprofile/${id}`;
    if (loading || !this.context.userProfile.id || pathnameId === 0) {
      return (
        <nav role="navigation">
          <section className="buttons"></section>
        </nav>
      );
    } else {
      if (pathname === "/grid") {
        return (
          <nav role="navigation">
            <section className="buttons">
              <Link
                to={url}
                aria-label="view profile button"
                id="viewProfileButton"
              >
                {profile_pic ? (
                  <img
                    src={profile_pic}
                    alt={username + `'s profile pic`}
                    className="profilePicButton"
                  />
                ) : (
                  <></>
                )}
              </Link>
              <Link
                to="messenger"
                aria-label="messages button"
                className="primary"
              >
                <FontAwesomeIcon
                  icon={buttonDict.faComments}
                  className="faIcon"
                />
                {messageBadge === 0 ? (
                  <> </>
                ) : (
                  <div className="messageBadge">{messageBadge}</div>
                )}
              </Link>
              <button
                onClick={this.handleClickLogOut}
                aria-label="logout button"
              >
                <FontAwesomeIcon
                  icon={buttonDict.faDoorOpen}
                  className="faIcon"
                />
              </button>
            </section>
            <SortByForm />
          </nav>
        );
      } else if (
        pathname === "/messenger" ||
        pathname.includes("/conversation")
      ) {
        return (
          <nav role="navigation">
            <section className="buttons">
              <Link
                to={url}
                aria-label="view profile button"
                id="viewProfileButton"
              >
                {profile_pic ? (
                  <img
                    src={profile_pic}
                    alt={username + `'s profile pic`}
                    className="profilePicButton"
                  />
                ) : (
                  <></>
                )}
              </Link>
              <Link to="/grid" aria-label="back button" className="primary">
                <FontAwesomeIcon icon={buttonDict.faTh} className="faIcon" />
              </Link>
              <button
                onClick={this.handleClickLogOut}
                aria-label="logout button"
              >
                <FontAwesomeIcon
                  icon={buttonDict.faDoorOpen}
                  className="faIcon"
                />
              </button>
            </section>
          </nav>
        );
      } else if (
        pathname === "/blockedprofiles" ||
        pathname === "/changepassword" ||
        pathname === "/deactivate"
      ) {
        return (
          <nav role="navigation">
            <section className="buttons">
              <Link
                to={editUrl}
                aria-label="edit profile button"
                className="primary"
              >
                <FontAwesomeIcon icon={buttonDict.faUndo} className="faIcon" />
              </Link>
            </section>
          </nav>
        );
      } else if (pathname.includes(`/userprofile/`)) {
        return (
          <nav role="navigation">
            {pathnameId === id ? (
              <section className="buttons">
                <Link to={editUrl} aria-label="edit profile button">
                  <FontAwesomeIcon icon={buttonDict.faCog} className="faIcon" />
                </Link>
                <Link to="/grid" aria-label="back button" className="primary">
                  <FontAwesomeIcon icon={buttonDict.faTh} className="faIcon" />
                </Link>
                <button
                  onClick={this.handleClickLogOut}
                  aria-label="logout button"
                >
                  <FontAwesomeIcon
                    icon={buttonDict.faDoorOpen}
                    className="faIcon"
                  />
                </button>
              </section>
            ) : blockedBy.includes(pathnameId) ||
              (nearbyProfiles.filter((profile) => profile.id === pathnameId)
                .length === 0 &&
                pathnameId !== id &&
                !blocked_profiles.includes(pathnameId)) ? (
              <section className="buttons">
                <Link
                  to="/grid"
                  aria-label="back button"
                  className="primary"
                  id="gridButton"
                >
                  <FontAwesomeIcon icon={buttonDict.faTh} className="faIcon" />
                </Link>
                <button
                  onClick={this.handleClickLogOut}
                  aria-label="logout button"
                >
                  <FontAwesomeIcon
                    icon={buttonDict.faDoorOpen}
                    className="faIcon"
                  />
                </button>
              </section>
            ) : blocked_profiles.includes(pathnameId) ? (
              <section className="buttons">
                <button
                  className="primary"
                  aria-label="unblock button"
                  onClick={this.handleClickUnblock}
                >
                  <FontAwesomeIcon
                    icon={buttonDict.faCheck}
                    className="faIcon"
                  />
                </button>
                <Link to="/blockedprofiles" aria-label="back button">
                  <FontAwesomeIcon
                    icon={buttonDict.faUndo}
                    className="faIcon"
                  />
                </Link>
              </section>
            ) : (
              <section className="buttons">
                <button
                  id="messageButton"
                  aria-label="message button"
                  onClick={this.sendMessage}
                >
                  <FontAwesomeIcon
                    icon={buttonDict.faEnvelope}
                    className="faIcon"
                  />
                </button>
                {favorited_profiles.includes(pathnameId) === true ? (
                  <button
                    className="unfavorite"
                    aria-label="unfavorite button"
                    onClick={this.handleClickUnfavorite}
                  >
                    <FontAwesomeIcon
                      icon={buttonDict.faStar}
                      className="faIcon"
                    />
                  </button>
                ) : (
                  <button
                    id="favorite"
                    aria-label="favorite button"
                    onClick={this.handleClickFavorite}
                  >
                    <FontAwesomeIcon
                      icon={buttonDict.faStar}
                      className="faIcon"
                    />
                  </button>
                )}
                <button
                  id="block"
                  aria-label="block button"
                  onClick={this.handleClickBlock}
                >
                  <FontAwesomeIcon
                    icon={buttonDict.faTimes}
                    className="faIcon"
                  />
                </button>
                <Link
                  to="/grid"
                  aria-label="back button"
                  className="primary"
                  id="gridButton"
                >
                  <FontAwesomeIcon icon={buttonDict.faTh} className="faIcon" />
                </Link>
              </section>
            )}
          </nav>
        );
      }
    }
  }
}
