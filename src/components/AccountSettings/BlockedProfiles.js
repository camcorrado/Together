import ApiContext from "../../ApiContext";
import config from "../../config";
import Nav from "../Nav/Nav";
import React, { Component } from "react";
import ProfileIcon from "../Grid/ProfileIcon";
import "./AccountSettings.css";

export default class BlockedProfiles extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    nearbyProfiles: [],
    refreshProfile: () => {},
  };

  state = {
    blockedProfiles: [],
    error: null,
    loading: null,
  };

  async componentDidMount() {
    this.setState({ loading: true });
    await this.context.refreshProfile();
    if (Object.keys(this.context.userProfile).length === 0) {
      this.props.history.push("/createprofile");
    } else {
      this.setState({ error: null });
      await fetch(`${config.API_ENDPOINT}/profiles`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      })
        .then((res) =>
          !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
        )
        .then(async (data) => {
          const blockedProfiles = await data.filter((profile) =>
            this.context.userProfile.blocked_profiles.includes(profile.id)
          );
          this.setState({ blockedProfiles: blockedProfiles, loading: false });
        })
        .catch((res) => {
          this.setState({ error: res.error });
        });
    }
  }

  render() {
    const { error, loading } = this.state;

    return (
      <section className="blockedProfilesGrid">
        <Nav />
        <section role="alert" className="blockedError">
          {error && <p className="error">{error}</p>}
        </section>
        <section className="blockedProfiles">
          {this.state.blockedProfiles.length > 0 ? (
            <ul className="blockedProfiles">
              {this.state.blockedProfiles.map((profile) => (
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
            <section className="loaderMessage">
              {loading ? (
                <div className="loader"></div>
              ) : (
                <h2 className="temp">You don't have any profiles blocked!</h2>
              )}
            </section>
          )}
        </section>
      </section>
    );
  }
}
