import ApiContext from "../../ApiContext";
import { Link } from "react-router-dom";
import React, { Component } from "react";
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

export default class UserProfileIcon extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
  };

  render() {
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
      "Hiking/Camping/Outdoors": faCampground,
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
    const { id, username, profile_pic, interests } = this.context.userProfile;
    const url = `/userprofile/${id}`;
    return (
      <Link to={url} className="profileIconLink">
        <section className="profileIcon">
          <img
            src={profile_pic}
            alt={username + `'s profile pic`}
            className="profilePicGrid"
          />
          <h4 className="username">{username}</h4>
          <section className="interests">
            {interests.map((interest) => (
              <div key={interest} className="wrapper">
                <FontAwesomeIcon
                  icon={interestDict[interest]}
                  className="faIcon"
                />
                <p className="text">{interest}</p>
              </div>
            ))}
          </section>
        </section>
      </Link>
    );
  }
}
