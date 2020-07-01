import ApiContext from "../../ApiContext";
import config from "../../config";
import { Link } from "react-router-dom";
import ProfileIcon from "./ProfileIcon";
import React, { Component } from "react";
import SortByForm from "../SortByForm";

export default class Grid extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    nearbyProfiles: [],
    logOut: () => {},
    refreshProfile: () => {},
    handleSortBy: () => {},
  };

  state = {
    profilesToDisplay: [],
    sortBy: "view all",
  };

  async componentDidMount() {
    await this.context.refreshProfile();
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
      .then(() =>
        this.setState({
          profilesToDisplay: this.context.nearbyProfiles,
        })
      )
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

  handleClickFavorites = (e, value) => {
    e.preventDefault();
    const filteredProfiles = [];
    this.context.nearbyProfiles.filter((profile) => {
      if (
        this.context.userProfile.favorited_profiles.includes(profile.id) ===
        true
      )
        filteredProfiles.push(profile);
    });
    this.setState({
      profilesToDisplay: filteredProfiles,
      favoritesClicked: value,
    });
    console.log(this.context.userProfile.favorited_profiles);
  };

  handleClickViewAll = (e, value) => {
    e.preventDefault();
    this.setState({
      profilesToDisplay: this.context.nearbyProfiles,
      favoritesClicked: value,
    });
  };

  handleClickLogOut = (e) => {
    e.preventDefault();
    this.context.logOut();
  };

  handleSortByChange = (value) => {
    console.log("handleSortByChange ran");
    this.setState({
      sortBy: value,
    });
    console.log("handleSortByChange completed");
  };

  render() {
    const url = `/userprofile/${this.context.userProfile.id}`;
    const filteredProfiles = [];
    if (
      this.state.sortBy === "view all" &&
      this.context.nearbyProfiles.length > 0 &&
      this.context.userProfile.id
    ) {
      return (
        <section className="grid">
          <nav role="navigation">
            <button onClick={this.handleClickEditProfile}>Edit Profile</button>
            <Link to="messenger">Messages</Link>
            <button onClick={this.handleClickLogOut}>Log Out</button>
            <SortByForm handleSortBy={this.handleSortByChange} />
          </nav>
          <section className="profiles">
            <ul className="gridProfiles">
              <li className="profile">
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
              {this.state.profilesToDisplay
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
      this.state.sortBy === "favorites" &&
      this.context.nearbyProfiles.length > 0 &&
      this.context.userProfile.id
    ) {
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
            <SortByForm handleSortBy={this.handleSortByChange} />
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
              {filteredProfiles
                .filter((profile) => profile.id !== this.context.userProfile.id)
                .map((profile) => (
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
      );
    } else if (
      this.state.sortBy === "shared interests" &&
      this.context.nearbyProfiles.length > 0 &&
      this.context.userProfile.id
    ) {
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
            <SortByForm handleSortBy={this.handleSortByChange} />
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
              {profilesArray
                .filter((profile) => profile.id !== this.context.userProfile.id)
                .map((profile) => (
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
      );
    } else {
      return <h2>Loading Profiles...</h2>;
    }
  }
}
