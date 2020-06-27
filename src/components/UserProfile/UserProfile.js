import ApiContext from "../../ApiContext";
import config from "../../config";
import React from "react";

class UserProfile extends React.Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
  };

  state = {
    profile: {},
  };

  componentDidMount() {
    const profileId = this.props.match.params.profileId;
    fetch(`${config.API_ENDPOINT}/profiles/${profileId}`, {
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
      .then((data) => {
        this.setState({
          profile: data,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleClickBack = (e) => {
    e.preventDefault();
    this.props.history.push("/Grid");
  };

  handleClickEdit = (e) => {
    e.preventDefault();
    this.props.history.push(`/EditProfile/${this.state.profile.id}`);
  };

  render() {
    const {
      username,
      bio,
      profile_pic,
      interests = [],
      pronouns,
      zipcode,
    } = this.state.profile;

    if (this.state.profile.id === this.context.userProfile.id) {
      return this.state.profile.id ? (
        <section className="userProfile">
          <section className="username">
            <h1>{username}</h1>
          </section>
          <section className="profilePic">
            <p>{profile_pic}</p>
          </section>
          <section className="interests">
            <ul>
              {interests.map((interest) => (
                <li key={interest} className="interest">
                  {interest}
                </li>
              ))}
            </ul>
          </section>
          <section className="bio">
            <p>{bio}</p>
          </section>
          <section className="buttons">
            <button className="primary" onClick={this.handleClickEdit}>
              Edit Profile
            </button>
            <button onClick={() => this.props.history.push("/grid")}>
              Back
            </button>
          </section>
        </section>
      ) : (
        <h2>Loading Profile...</h2>
      );
    } else {
      return this.state.profile.id ? (
        <section className="userProfile">
          <section className="username">
            <h1>{username}</h1>
          </section>
          <section className="profilePic">
            <p>{profile_pic}</p>
          </section>
          <section className="interests">
            <ul>
              {interests.map((interest) => (
                <li key={interest} className="interest">
                  {interest}
                </li>
              ))}
            </ul>
          </section>
          <section className="bio">
            <p>{bio}</p>
          </section>
          <section className="buttons">
            <button
              className="primary"
              onClick={() => this.props.history.push("/messenger")}
            >
              Message
            </button>
            <button onClick={() => this.props.history.push("/grid")}>
              Back
            </button>
          </section>
        </section>
      ) : (
        <h2>Loading Profile...</h2>
      );
    }
  }
}

export default UserProfile;
