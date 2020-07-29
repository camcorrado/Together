import { Link } from "react-router-dom";
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import icons from "../Icons";
import "./Grid.css";

export default class ProfileIcon extends Component {
  render() {
    const { id, username, profile_pic, interests } = this.props;
    const { interestDict } = icons;
    const url = `/userprofile/${id}`;

    return (
      <Link to={url} className="profileIconLink">
        <section className="ProfileIcon">
          <img
            src={profile_pic}
            alt={username + `'s profile pic`}
            className="profilePicGrid"
          />
          <section className="interestsGrid">
            <ul>
              {interests.map((interest) => (
                <li key={interest} className="interestWrapper">
                  <FontAwesomeIcon
                    icon={interestDict[interest]}
                    className="faIconGrid"
                  />
                </li>
              ))}
            </ul>
          </section>
        </section>
      </Link>
    );
  }
}
