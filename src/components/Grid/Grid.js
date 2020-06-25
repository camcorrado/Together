import ApiContext from "../../ApiContext";
import config from "../../config";
import IdleService from "../../services/idle-service";
import ProfileIcon from "./ProfileIcon";
import React, { Component } from "react";
import TokenService from "../../services/token-service";

export default class Grid extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: [],
    nearbyProfiles: [],
  };

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/profiles`, {
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
      .then((data) => this.context.setNearbyProfiles(data))
      .catch((error) => {
        console.error(error);
      });
  }

  handleClickEditProfile = (e) => {
    e.preventDefault();
    const profile_id = this.context.userProfile.id;
    this.props.history.push(`/editprofile/${profile_id}`);
  };

  handleClickLogOut = (e) => {
    e.preventDefault();
    TokenService.clearAuthToken();
    /* when logging out, clear the callbacks to the refresh api and idle auto logout */
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.props.history.push("/");
  };

  handleClickProfile = (e) => {
    e.preventDefault();
    this.props.history.push("/userprofile");
  };

  render() {
    return (
      <section className="grid">
        <section className="nav">
          <nav role="navigation">
            <button onClick={this.handleClickEditProfile}>Edit Profile</button>
            <button onClick={this.handleClickLogOut}>Log Out</button>
          </nav>
        </section>
        <section className="profiles">
          <ul>
            {this.context.nearbyProfiles.map((profile) => (
              <li key={profile.id}>
                <ProfileIcon
                  id={profile.id}
                  user_id={profile.user_id}
                  profile_pic={profile.profile_pic}
                  username={profile.username}
                  interests={profile.interests}
                />
              </li>
            ))}
          </ul>
          <p>
            Grid of profiles, displaying profile pics and emoji overlay to show
            interests
          </p>
        </section>
        <button onClick={this.handleClickProfile}>View Profile Test</button>
      </section>
    );
  }
}
