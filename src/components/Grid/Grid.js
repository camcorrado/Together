import ApiContext from "../../ApiContext";
import config from "../../config";
import ProfileIcon from "./ProfileIcon";
import React, { Component } from "react";

export default class Grid extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    nearbyProfiles: [],
    logOut: () => {},
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
    console.log(this.context.userProfile);
    const profile_id = this.context.userProfile.id;
    this.props.history.push(`/editprofile/${profile_id}`);
  };

  handleClickLogOut = (e) => {
    e.preventDefault();
    this.context.logOut();
  };

  handleClickProfile = (e) => {
    e.preventDefault();
    this.props.history.push("/userprofile");
  };

  render() {
    return this.context.nearbyProfiles.length > 0 ? (
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
    ) : (
      <h2>Loading Profiles...</h2>
    );
  }
}
