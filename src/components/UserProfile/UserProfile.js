import ApiContext from "../../ApiContext";
import React from "react";

class UserProfile extends React.Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: [],
  };

  handleClickBack = (e) => {
    e.preventDefault();
    this.props.history.push("/Grid");
  };

  handleClickEdit = (e) => {
    e.preventDefault();
    this.props.history.push(`/EditProfile/${this.context.userProfile.id}`);
  };

  render() {
    const {
      username,
      bio,
      profile_pic,
      interests = [],
      pronouns,
      zipcode,
    } = this.context.userProfile;
    return this.context.userProfile.id ? (
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
          <button onClick={this.handleClickEdit}>Edit Profile</button>
          <button onClick={() => this.props.history.push("/Grid")}>Grid</button>
          <button onClick={() => this.props.history.push("/Messenger")}>
            Message
          </button>
        </section>
      </section>
    ) : (
      <h2>Loading Profile...</h2>
    );
  }
}

export default UserProfile;
