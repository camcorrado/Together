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
    error: null,
  };

  componentDidMount = () => {
    console.log(`componentDidMount began`);
    this.selectedCheckboxes = new Set();
  };

  toggleCheckbox = (label) => {
    console.log(`toggleCheckbox began`);
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

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`handleSubmit began`);
    const interests = [];
    const { username, bio, profile_pic, pronouns, zipcode } = e.target;
    for (const checkbox of this.selectedCheckboxes) {
      interests.push(checkbox);
    }
    const newProfile = {
      username: username.value,
      bio: bio.value,
      profile_pic: profile_pic.value,
      interests: interests,
      pronouns: pronouns.value,
      zipcode: zipcode.value,
      blocked_profiles: [],
      favorited_profiles: [],
    };

    console.log({ newProfile });

    this.setState({ error: null });

    await fetch(`${config.API_ENDPOINT}/profiles`, {
      method: "POST",
      body: JSON.stringify(newProfile),
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
    console.log(this.context.userInfo);
    await this.context.setProfileInfo(this.context.userInfo.id);
    this.props.onCreateSuccess();
    console.log(`handleSubmit completed`);
  };

  render() {
    const { error } = this.state;
    return (
      <form className="CreateProfileForm" onSubmit={this.handleSubmit}>
        <div role="alert">
          {error && <p className="red">{error.message}</p>}
        </div>
        <div className="usernameInput">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
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
            name="pronouns"
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
            aria-required="true"
            required
          />
        </div>
        <div className="buttons">
          <button type="submit">Submit</button>
        </div>
      </form>
    );
  }
}
