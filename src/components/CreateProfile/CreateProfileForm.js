import ApiContext from "../../ApiContext";
import Checkbox from "../Checkbox/Checkbox";
import config from "../../config";
import React, { Component } from "react";
import TokenService from "../../services/token-service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import icons from "../Icons";
import "./CreateProfile.css";

export default class CreateProfileForm extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userInfo: {},
    interestOptions: [],
    setProfileInfo: () => {},
  };

  state = {
    geolocationData: "",
    profile_pic: null,
    profile_pic_loading: false,
    error: null,
  };

  componentDidMount() {
    this.findLocation();
    this.selectedCheckboxes = new Set();
  }

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
    this.setState({
      geolocationData: `${latitude}, ${longitude}`,
    });
  };

  locationError = () => {
    this.setState({ error: `Please allow Geolocation` });
  };

  uploadImage = async (e) => {
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "together");
    this.setState({ profile_pic_loading: true });

    await fetch(process.env.REACT_APP_CLOUDINARY_URL, {
      method: "POST",
      body: data,
    })
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then((picData) =>
        this.setState({
          profile_pic: picData.secure_url,
          profile_pic_loading: false,
        })
      )
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ error: null });

    if (this.state.profile_pic === null) {
      this.setState({ error: `Please upload a profile picture.` });
    } else {
      const interests = [];
      const { username, bio, pronouns } = e.target;

      for (const checkbox of this.selectedCheckboxes) {
        interests.push(checkbox);
      }
      const sortedInterests = interests.sort();

      const newProfile = {
        username: username.value,
        bio: bio.value,
        profile_pic: this.state.profile_pic,
        interests: sortedInterests,
        pronouns: pronouns.value,
        geolocation: this.state.geolocationData,
        blocked_profiles: [],
        favorited_profiles: [],
        deactivated: "false",
      };

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
    }
  };

  render() {
    const { error, profile_pic_loading, profile_pic } = this.state;
    return error === `Please allow Geolocation` ? (
      <form className="CreateProfileForm" onSubmit={this.handleSubmit}>
        <section role="alert" className="alert">
          {error && (
            <p className="error">
              Together requires geolocation. Please change your location
              permission and refresh the page to continue.
            </p>
          )}
        </section>
      </form>
    ) : (
      <form className="CreateProfileForm" onSubmit={this.handleSubmit}>
        <section role="alert" className="alert">
          {error && <p className="error">{error}</p>}
        </section>
        <div className="usernameInput">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            aria-required="true"
            maxLength="12"
            required
          />
        </div>
        {profile_pic_loading ? (
          <p>Uploading...</p>
        ) : (
          <div className="profilePicInput">
            <label htmlFor="profile_pic">Profile Picture:</label>
            <input
              type="file"
              name="profile_pic"
              id="profile_pic"
              accept="image/png, image/jpeg, image/jpg"
              onChange={this.uploadImage}
            />
          </div>
        )}
        {profile_pic !== null ? (
          <div className="profilePicForm">
            <img src={profile_pic} alt="uploaded profile pic" />
          </div>
        ) : (
          <div className="profilePicForm">
            <FontAwesomeIcon
              icon={icons.faUserCircle}
              className="faIconDefaultProfilePic"
            />
          </div>
        )}
        <div className="bioInput">
          <label htmlFor="bio">About:</label>
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
          <label htmlFor="interests">Interests:</label>
          <div className="interestCheckboxes">{this.createCheckboxes()}</div>
        </div>
        <div className="pronounsInput">
          <label htmlFor="pronouns">Pronouns:</label>
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
        <section className="buttons">
          <button type="submit" className="primary">
            Submit
          </button>
        </section>
      </form>
    );
  }
}
