import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFistRaised,
  faDragon,
  faPaintBrush,
  faUtensilSpoon,
  faHammer,
  faFemale,
  faTshirt,
  faDumbbell,
  faPizzaSlice,
  faGamepad,
  faSeedling,
  faCampground,
  faFilm,
  faMusic,
  faMoon,
  faCat,
  faBookOpen,
  faPrayingHands,
  faFutbol,
  faMicrochip,
  faTheaterMasks,
  faPlane,
} from "@fortawesome/free-solid-svg-icons";

import React, { Component } from "react";

class Checkbox extends Component {
  state = {
    isChecked: false,
  };

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label } = this.props;

    this.setState(({ isChecked }) => ({
      isChecked: !isChecked,
    }));

    handleCheckboxChange(label);
  };

  render() {
    const { label, checked } = this.props;
    const { isChecked } = this.state;
    let iconArtwork;

    if (label === "Activism") {
      iconArtwork = faFistRaised;
    } else if (label === "Anime") {
      iconArtwork = faDragon;
    } else if (label === "Art") {
      iconArtwork = faPaintBrush;
    } else if (label === "Cooking") {
      iconArtwork = faUtensilSpoon;
    } else if (label === "Crafting") {
      iconArtwork = faHammer;
    } else if (label === "Drag") {
      iconArtwork = faFemale;
    } else if (label === "Fashion") {
      iconArtwork = faTshirt;
    } else if (label === "Fitness") {
      iconArtwork = faDumbbell;
    } else if (label === "Food") {
      iconArtwork = faPizzaSlice;
    } else if (label === "Gaming") {
      iconArtwork = faGamepad;
    } else if (label === "Gardening") {
      iconArtwork = faSeedling;
    } else if (label === "Hiking/Camping/Outdoors") {
      iconArtwork = faCampground;
    } else if (label === "Movies") {
      iconArtwork = faFilm;
    } else if (label === "Music") {
      iconArtwork = faMusic;
    } else if (label === "Nightlife") {
      iconArtwork = faMoon;
    } else if (label === "Pets/Animals") {
      iconArtwork = faCat;
    } else if (label === "Reading") {
      iconArtwork = faBookOpen;
    } else if (label === "Spirituality") {
      iconArtwork = faPrayingHands;
    } else if (label === "Sports") {
      iconArtwork = faFutbol;
    } else if (label === "Tech") {
      iconArtwork = faMicrochip;
    } else if (label === "Theater") {
      iconArtwork = faTheaterMasks;
    } else if (label === "Travel") {
      iconArtwork = faPlane;
    }

    if (checked === true) {
      return (
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              value={label}
              checked="true"
              onChange={this.toggleCheckboxChange}
            />
            <FontAwesomeIcon icon={iconArtwork} className="faIcon" />
            {label}
          </label>
        </div>
      );
    } else {
      return (
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              value={label}
              checked={isChecked}
              onChange={this.toggleCheckboxChange}
            />
            <FontAwesomeIcon icon={iconArtwork} className="faIcon" />
            {label}
          </label>
        </div>
      );
    }
  }
}

export default Checkbox;
