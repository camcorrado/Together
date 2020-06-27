import ApiContext from "../../ApiContext";
import config from "../../config";
import { Link } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";
import React, { Component } from "react";

export default class Grid extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    nearbyProfiles: [],
    logOut: () => {},
    refreshProfile: () => {},
  };

  componentDidMount() {
    this.context.refreshProfile();
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
    console.log(this.context.userProfile);
    const profile_id = this.context.userProfile.id;
    this.props.history.push(`/editprofile/${profile_id}`);
  };

  handleClickLogOut = (e) => {
    e.preventDefault();
    this.context.logOut();
  };

  render() {
    const url = `/userprofile/${this.context.userProfile.id}`;
    return this.context.nearbyProfiles.length > 0 &&
      this.context.userProfile.id ? (
      <section className="grid">
        <nav role="navigation">
          <button onClick={this.handleClickEditProfile}>Edit Profile</button>
          <button onClick={this.handleClickLogOut}>Log Out</button>
        </nav>
        <section className="profiles">
          <ul className="gridProfiles">
            <li>
              <Link to={url}>
                <section className="profileIcon">
                  <img
                    src={this.context.userProfile.profile_pic}
                    alt={this.context.userProfile.username + `'s profile pic`}
                    className="profilePicGrid"
                  />
                  <h4 className="username">
                    {this.context.userProfile.username}
                  </h4>
                  <h4 className="interests">
                    {this.context.userProfile.interests.join(", ")}
                  </h4>
                </section>
              </Link>
            </li>
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
        </section>
      </section>
    ) : (
      <h2>Loading Profiles...</h2>
    );
  }
}
