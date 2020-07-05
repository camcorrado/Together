import ApiContext from "../../ApiContext";
import { Link } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";
import React, { Component } from "react";
import SortByForm from "../SortByForm";
import UserProfileIcon from "./UserProfileIcon";

export default class Grid extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    nearbyProfiles: [],
    sortBy: "",
    refreshProfile: () => {},
    logOut: () => {},
  };

  state = {
    profilesToDisplay: [],
  };

  componentDidMount() {
    this.setState({
      profilesToDisplay: this.context.nearbyProfiles,
    });
  }

  handleClickEditProfile = (e) => {
    e.preventDefault();
    const profile_id = this.context.userProfile.id;
    this.props.history.push(`/editprofile/${profile_id}`);
  };

  handleClickLogOut = (e) => {
    e.preventDefault();
    this.context.logOut();
  };

  render() {
    if (
      this.context.sortBy === "View All" &&
      this.context.nearbyProfiles.length > 0 &&
      this.context.userProfile.id
    ) {
      return (
        <section className="grid">
          <nav role="navigation">
            <button onClick={this.handleClickEditProfile}>Edit Profile</button>
            <Link to="messenger">Messages</Link>
            <button onClick={this.handleClickLogOut}>Log Out</button>
            <SortByForm />
          </nav>
          <section className="profiles">
            <ul className="gridProfiles">
              <li key={this.context.userProfile.id} className="profile">
                <UserProfileIcon />
              </li>
              {this.context.nearbyProfiles
                .filter((profile) => profile.id !== this.context.userProfile.id)
                .map((profile) => (
                  <li key={profile.id} className="profile">
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
      );
    } else if (
      this.context.sortBy === "Favorites" &&
      this.context.nearbyProfiles.length > 0 &&
      this.context.userProfile.id
    ) {
      const filteredProfiles = [];
      this.context.nearbyProfiles.filter((profile) => {
        if (
          this.context.userProfile.favorited_profiles.includes(profile.id) ===
          true
        )
          filteredProfiles.push(profile);
      });
      return (
        <section className="grid">
          <nav role="navigation">
            <button onClick={this.handleClickEditProfile}>Edit Profile</button>
            <Link to="messenger">Messages</Link>
            <button onClick={this.handleClickLogOut}>Log Out</button>
            <SortByForm />
          </nav>
          <section className="profiles">
            <ul className="gridProfiles">
              <li key={this.context.userProfile.id} className="profile">
                <UserProfileIcon />
              </li>
              {filteredProfiles
                .filter((profile) => profile.id !== this.context.userProfile.id)
                .map((profile) => (
                  <li className="profile" key={profile.id}>
                    <ProfileIcon
                      key={profile.id}
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
      );
    } else if (
      this.context.sortBy === "Shared Interests" &&
      this.context.nearbyProfiles.length > 0 &&
      this.context.userProfile.id
    ) {
      const filteredProfiles = [];
      this.context.nearbyProfiles.filter((profile) => {
        profile.count = 0;
        profile.interests.forEach((interest) => {
          if (this.context.userProfile.interests.includes(interest) === true) {
            profile.count++;
            filteredProfiles.push(profile);
          }
        });
      });
      const uniqueSet = new Set(filteredProfiles);
      const profilesArray = [...uniqueSet];
      profilesArray.sort((a, b) => b.count - a.count);
      return (
        <section className="grid">
          <nav role="navigation">
            <button onClick={this.handleClickEditProfile}>Edit Profile</button>
            <Link to="messenger">Messages</Link>
            <button onClick={this.handleClickLogOut}>Log Out</button>
            <SortByForm />
          </nav>
          <section className="profiles">
            <ul className="gridProfiles">
              <li key={this.context.userProfile.id} className="profile">
                <UserProfileIcon />
              </li>
              {profilesArray
                .filter((profile) => profile.id !== this.context.userProfile.id)
                .map((profile) => (
                  <li key={profile.id} className="profile">
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
      );
    } else {
      return <h2>Loading Profiles...</h2>;
    }
  }
}
