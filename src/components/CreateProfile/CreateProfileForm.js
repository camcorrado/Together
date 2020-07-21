import ApiContext from "../../ApiContext";
import Checkbox from "../Checkbox/Checkbox";
import config from "../../config";
import React, { Component } from "react";
import TokenService from "../../services/token-service";

export default class CreateProfileForm extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userInfo: {},
    interestOptions: [],
    setProfileInfo: () => {},
    onCreateSuccess: () => {},
  };

  state = {
    geolocationData: "",
    error: null,
  };

  componentDidMount = () => {
    this.selectedCheckboxes = new Set();
    this.findLocation();
  };

  toggleCheckbox = (label) => {
    if (this.selectedCheckboxes.has(label)) {
      this.selectedCheckboxes.delete(label);
    } else {
      this.selectedCheckboxes.add(label);
    }
  };

  createCheckbox = (label) => (
    <Checkbox
      label={label}
      handleCheckboxChange={this.toggleCheckbox}
      key={label}
    />
  );

  createCheckboxes = () =>
    this.context.interestOptions.map(this.createCheckbox);

  findLocation = async () => {
    await navigator.geolocation.getCurrentPosition(
      this.locationSuccess,
      this.locationError
    );
  };

  locationSuccess = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    this.setState({ geolocationData: `${latitude}, ${longitude}` });
  };

  locationError = (err) => {
    this.setState({ error: err.message });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const interests = [];
    const { username, bio, profile_pic, pronouns } = e.target;
    for (const checkbox of this.selectedCheckboxes) {
      interests.push(checkbox);
    }
    const sortedInterests = interests.sort();

    const newProfile = {
      username: username.value,
      bio: bio.value,
      profile_pic: profile_pic.value,
      interests: sortedInterests,
      pronouns: pronouns.value,
      geolocation: this.state.geolocationData,
      blocked_profiles: [],
      favorited_profiles: [],
    };

    this.setState({ error: null });

    await fetch(`${config.API_ENDPOINT}/profiles`, {
      method: "POST",
      body: JSON.stringify(newProfile),
      headers: {
        "content-type": "application/json",
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .catch((res) => {
        this.setState({ error: res.error });
      });
    await this.context.setProfileInfo(this.context.userInfo.id);
    this.props.onCreateSuccess();
  };

  render() {
    const { error } = this.state;
    return (
      <form className="CreateProfileForm" onSubmit={this.handleSubmit}>
        <div role="alert">
          {error && <p className="error">{error.message}</p>}
        </div>
        <div className="usernameInput">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            aria-required="true"
            maxLength="12"
            required
          />
        </div>
        <div className="profilePicInput">
          <label htmlFor="profile_pic">Profile Picture</label>
          <input
            type="text"
            name="profile_pic"
            id="profile_pic"
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
            aria-required="true"
            maxLength="120"
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
            aria-required="true"
            required
            maxLength="12"
            name="pronouns"
          />
          <datalist name="pronouns" id="pronouns">
            <option value="She/Her">She/Her</option>
            <option value="He/Him">He/Him</option>
            <option value="They/Them">They/Them</option>
          </datalist>
        </div>
        <div className="buttons">
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}
