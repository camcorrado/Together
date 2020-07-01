import ApiContext from "../../ApiContext";
import Checkbox from "../Checkbox/Checkbox";
import { Link } from "react-router-dom";
import React, { Component } from "react";

export default class EditProfileForm extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    interestOptions: [],
    onEditSuccess: () => {},
  };

  state = {
    error: null,
  };

  componentDidMount = () => {
    this.selectedCheckboxes = new Set();
  };

  toggleCheckbox = (label) => {
    if (this.selectedCheckboxes.has(label)) {
      this.selectedCheckboxes.delete(label);
    } else {
      this.selectedCheckboxes.add(label);
    }
  };

  createCheckbox = (label) => {
    for (let i = 0; i < this.props.profile.interests.length; i++) {
      if (label === this.props.profile.interests[i]) {
        return (
          <Checkbox
            label={label}
            handleCheckboxChange={this.toggleCheckbox}
            key={label}
            checked={true}
          />
        );
      } else {
        return (
          <Checkbox
            label={label}
            handleCheckboxChange={this.toggleCheckbox}
            key={label}
            checked={false}
          />
        );
      }
    }
  };

  createCheckboxes = () => {
    this.context.interestOptions.map(this.createCheckbox);
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

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onEditSuccess();
  };

  render() {
    const { error } = this.state;
    const {
      username,
      bio,
      profile_pic,
      interests,
      pronouns,
      zipcode,
    } = this.props.profile;
    const url = `/userprofile/${this.context.userProfile.id}`;
    return this.props.profile.username ? (
      <form className="EditProfileForm" onSubmit={this.handleSubmit}>
        <div role="alert">
          {error && <p className="red">{error.message}</p>}
        </div>
        <div className="usernameInput">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder={username || ""}
            value={username || ""}
            onChange={this.onUsernameChange}
            aria-required="true"
            required
          />
        </div>
        <div className="profilePicInput">
          <label htmlFor="profile_pic">Profile Picture</label>
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
          <label htmlFor="bio">About</label>
          <textarea
            name="bio"
            id="bio"
            rows="15"
            placeholder={bio || ""}
            value={bio || ""}
            onChange={this.onBioChange}
            aria-required="true"
            required
          ></textarea>
        </div>
        <div className="interestsInput">
          <label htmlFor="interests">Interests</label>
          <div className="interestCheckboxes">{this.createCheckboxes()}</div>
        </div>
        <div className="pronounsInput">
          <label htmlFor="pronouns">Pronouns</label>
          <input
            type="text"
            list="pronouns"
            value={pronouns || ""}
            onChange={this.onPronounsChange}
            aria-required="true"
            required
          />
          <datalist name="pronouns" id="pronouns">
            <option value="She/Her">She/Her</option>
            <option value="He/Him">He/Him</option>
            <option value="They/Them">They/Them</option>
          </datalist>
        </div>
        <div className="zipcodeInput">
          <label htmlFor="zipcode">Zipcode</label>
          <input
            type="number"
            name="zipcode"
            id="zipcode"
            maxLength="5"
            placeholder={zipcode || ""}
            value={zipcode || ""}
            onChange={this.onZipcodeChange}
            aria-required="true"
            required
          />
        </div>
        <div className="buttons">
          <button className="primary" type="submit" onClick={this.handleSubmit}>
            Submit
          </button>
          <Link to={url}>Cancel</Link>
        </div>
      </form>
    ) : (
      <h2>Loading Profile Information...</h2>
    );
  }
}
