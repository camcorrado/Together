import ApiContext from "../../ApiContext";
import Nav from "../Nav/Nav";
import ProfileIcon from "./ProfileIcon";
import React, { Component } from "react";

export default class Grid extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    nearbyProfiles: [],
    sortBy: "",
    refreshProfile: () => {},
  };

  state = {
    profilesToDisplay: [],
  };

  async componentDidMount() {
    await this.context.refreshProfile();
    if (Object.keys(this.context.userProfile).length === 0) {
      this.props.history.push("/createprofile");
    } else {
      this.setState({
        profilesToDisplay: this.context.nearbyProfiles,
      });
    }
  }

  render() {
    if (
      this.context.sortBy === "View All" &&
      this.context.nearbyProfiles.length > 0 &&
      this.context.userProfile.id
    ) {
      return (
        <section className="grid">
          <Nav />
          <section className="profiles">
            <ul className="gridProfiles">
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
      const filteredProfiles = this.context.nearbyProfiles.filter((profile) =>
        this.context.userProfile.favorited_profiles.includes(profile.id)
      );
      return (
        <section className="grid">
          <Nav />
          <section className="profiles">
            <ul className="gridProfiles">
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
      const filteredProfiles = this.context.nearbyProfiles.filter((profile) => {
        profile.count = profile.interests.filter((interest) =>
          this.context.userProfile.interests.includes(interest)
        ).length;
        return profile.count;
      });

      filteredProfiles.sort((a, b) => b.count - a.count);
      return (
        <section className="grid">
          <Nav />
          <section className="profiles">
            <ul className="gridProfiles">
              {filteredProfiles
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
