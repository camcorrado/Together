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
    isChecked: this.props.isChecked ? true : false,
  };

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label } = this.props;

    this.setState(({ isChecked }) => ({
      isChecked: !isChecked,
    }));

    handleCheckboxChange(label);
  };

  render() {
    const { label } = this.props;
    const { isChecked } = this.state;
    let interestDict = {
      Activism: faFistRaised,
      Anime: faDragon,
      Art: faPaintBrush,
      Cooking: faUtensilSpoon,
      Crafting: faHammer,
      Drag: faFemale,
      Fashion: faTshirt,
      Fitness: faDumbbell,
      Food: faPizzaSlice,
      Gaming: faGamepad,
      Gardening: faSeedling,
      "The Outdoors": faCampground,
      Movies: faFilm,
      Music: faMusic,
      Nightlife: faMoon,
      "Pets/Animals": faCat,
      Reading: faBookOpen,
      Spirituality: faPrayingHands,
      Sports: faFutbol,
      Tech: faMicrochip,
      Theater: faTheaterMasks,
      Travel: faPlane,
    };

    return (
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            value={label}
            checked={isChecked}
            onChange={this.toggleCheckboxChange}
          />
          <FontAwesomeIcon icon={interestDict[label]} className="faIcon" />
          {label}
        </label>
      </div>
    );
  }
}

export default Checkbox;
