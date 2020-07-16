import ApiContext from "../../ApiContext";
import Checkbox from "../Checkbox/Checkbox";
import React, { Component } from "react";

export default class EditProfileForm extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    interestOptions: [],
    onEditSuccess: () => {},
  };

  state = {
    interests: [],
    error: null,
  };

  componentDidMount = () => {
    this.selectedCheckboxes = new Set();
    this.props.profile.interests.forEach((interest) =>
      this.selectedCheckboxes.add(interest)
    );
  };

  toggleCheckbox = (label) => {
    if (this.selectedCheckboxes.has(label)) {
      this.selectedCheckboxes.delete(label);
    } else {
      this.selectedCheckboxes.add(label);
    }
  };

  createCheckbox = (label) => {
    return (
      <Checkbox
        label={label}
        handleCheckboxChange={this.toggleCheckbox}
        key={label}
        isChecked={this.context.userProfile.interests.includes(label)}
      />
    );
  };

  createCheckboxes = () => {
    return this.context.interestOptions.map(this.createCheckbox);
  };

  onUsernameChange = async (e) => {
    await this.props.onUsernameChange(e.target.value);
  };

  onBioChange = async (e) => {
    await this.props.onBioChange(e.target.value);
  };

  onProfilePicChange = async (e) => {
    await this.props.onProfilePicChange(e.target.value);
  };

  onPronounsChange = async (e) => {
    await this.props.onPronounsChange(e.target.value);
  };

  onZipcodeChange = async (e) => {
    await this.props.onZipcodeChange(e.target.value);
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const zipcode = this.props.profile.zipcode;
    console.log({ zipcode });
    const interests = [];
    for (const checkbox of this.selectedCheckboxes) {
      await interests.push(checkbox);
    }
    const sortedInterests = interests.sort();
    if (zipcode.toString().length === 5) {
      this.setState({ error: null });
      const url = `https://cors-anywhere.herokuapp.com/https://phzmapi.org/${zipcode}.json`;
      fetch(url)
        .then((res) =>
          !res.ok ? res.json().then((e) => Promise.reject(e)) : true
        )
        .then(this.props.onEditSuccess)
        .catch((res) => {
          this.setState({ error: "Could not find that zipcode" });
        });

      this.props.onInterestsChange(sortedInterests);
    } else {
      this.setState({ error: `Invalid zipcode` });
    }
  };

  render() {
    const {
      username,
      bio,
      profile_pic,
      pronouns,
      zipcode,
    } = this.props.profile;
    const { error } = this.state;
    return (
      <form className="EditProfileForm" onSubmit={this.handleSubmit}>
        <div className="usernameInput">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder={username || ""}
            value={username || ""}
            onChange={this.onUsernameChange}
            aria-required="true"
            maxLength="12"
            required
          />
        </div>
        <div className="profilePicInput">
          <label htmlFor="profile_pic">Profile Picture:</label>
          <input
            type="text"
            name="profile_pic"
            id="profile_pic"
            placeholder={profile_pic || ""}
            value={profile_pic || ""}
            onChange={this.onProfilePicChange}
            aria-required="true"
            required
          />
        </div>
        <div className="bioInput">
          <label htmlFor="bio">About:</label>
          <textarea
            name="bio"
            id="bio"
            rows="15"
            placeholder={bio || ""}
            value={bio || ""}
            onChange={this.onBioChange}
            aria-required="true"
            maxLength="120"
            required
          ></textarea>
        </div>
        <div className="interestsInput">
          <label htmlFor="interests">Interests:</label>
          <div className="interestCheckboxes">{this.createCheckboxes()}</div>
        </div>
        <div className="pronounsInput">
          <label htmlFor="pronouns">Pronouns:</label>
          <input
            type="text"
            list="pronouns"
            value={pronouns || ""}
            onChange={this.onPronounsChange}
            aria-required="true"
            maxLength="12"
            required
          />
          <datalist name="pronouns" id="pronouns">
            <option value="She/Her">She/Her</option>
            <option value="He/Him">He/Him</option>
            <option value="They/Them">They/Them</option>
          </datalist>
        </div>
        <div className="zipcodeInput">
          <label htmlFor="zipcode">Zipcode:</label>
          <input
            type="number"
            name="zipcode"
            id="zipcode"
            placeholder={zipcode || ""}
            value={zipcode || ""}
            onChange={this.onZipcodeChange}
            aria-required="true"
            required
          />
        </div>
        <div role="alert">{error && <p className="error">{error}</p>}</div>
        <div className="buttons">
          <button className="primary" type="submit" onClick={this.handleSubmit}>
            Submit
          </button>
          <button onClick={this.props.onClickCancel}>Cancel</button>
        </div>
      </form>
    );
  }
}
