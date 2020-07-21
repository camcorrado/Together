import ApiContext from "../../ApiContext";
import config from "../../config";
import Nav from "../Nav/Nav";
import React, { Component } from "react";
import ProfileIcon from "../Grid/ProfileIcon";

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
  };

  async componentDidMount() {
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
          this.setState({ blockedProfiles: blockedProfiles });
        })
        .catch((res) => {
          this.setState({ error: res.error });
        });
    }
  }

  render() {
    const { error } = this.state;

    return (
      <section className="blockedProfilesGrid">
        <Nav />
        <div role="alert">{error && <p className="error">{error}</p>}</div>
        <section className="profiles">
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
            <h2>You don't have any profiles blocked!</h2>
          )}
        </section>
      </section>
    );
  }
}
