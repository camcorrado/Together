import ApiContext from "../../ApiContext";
import Nav from "../Nav/Nav";
import ProfileIcon from "./ProfileIcon";
import React, { Component } from "react";
import "./Grid.css";

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
    const { sortBy, nearbyProfiles, userProfile } = this.context;
    if (sortBy === "View All" && userProfile.id) {
      return (
        <section className="Grid">
          <Nav />
          <section className="profiles">
            {nearbyProfiles.length > 0 ? (
              <ul className="gridProfiles">
                {nearbyProfiles
                  .filter((profile) => profile.id !== userProfile.id)
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
            ) : (
              <p>There aren't any profiles to view :(</p>
            )}
          </section>
        </section>
      );
    } else if (
      sortBy === "Favorites" &&
      nearbyProfiles.length > 0 &&
      userProfile.id
    ) {
      const filteredProfiles = nearbyProfiles.filter((profile) =>
        userProfile.favorited_profiles.includes(profile.id)
      );
      return (
        <section className="Grid">
          <Nav />
          <section className="profiles">
            {filteredProfiles.length > 0 ? (
              <ul className="gridProfiles">
                {filteredProfiles
                  .filter((profile) => profile.id !== userProfile.id)
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
            ) : (
              <p>
                You don't have any favorites! View profiles to favorite them!
              </p>
            )}
          </section>
        </section>
      );
    } else if (
      sortBy === "Shared Interests" &&
      nearbyProfiles.length > 0 &&
      userProfile.id
    ) {
      const filteredProfiles = nearbyProfiles.filter((profile) => {
        profile.count = profile.interests.filter((interest) =>
          userProfile.interests.includes(interest)
        ).length;
        return profile.count;
      });

      filteredProfiles.sort((a, b) => b.count - a.count);
      return (
        <section className="Grid">
          <Nav />
          <section className="profiles">
            {filteredProfiles.length > 0 ? (
              <ul className="gridProfiles">
                {filteredProfiles
                  .filter((profile) => profile.id !== userProfile.id)
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
            ) : (
              <p>
                You don't have any interests selected! Edit your profile to
                change your interests.
              </p>
            )}
          </section>
        </section>
      );
    } else {
      return (
        <section className="Grid">
          <Nav />
          <section className="loaderMessage">
            <div className="loader"></div>
          </section>
        </section>
      );
    }
  }
}
