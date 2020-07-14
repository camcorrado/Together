import ApiContext from "../../ApiContext";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import SortByForm from "../SortByForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faDoorOpen,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

export default class Nav extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    logOut: () => {},
  };

  handleClickLogOut = (e) => {
    e.preventDefault();
    this.context.logOut();
  };

  render() {
    const url = `/editprofile/${this.context.userProfile.id}`;
    return (
      <nav role="navigation">
        <div className="buttons">
          <Link to={url} aira-label="edit profile button">
            <FontAwesomeIcon icon={faCog} className="faIcon" />
          </Link>
          <Link to="messenger" aria-label="messages button">
            <FontAwesomeIcon icon={faComments} className="faIcon" />
          </Link>
          <button onClick={this.handleClickLogOut} aria-label="logout button">
            <FontAwesomeIcon icon={faDoorOpen} className="faIcon" />
          </button>
        </div>
        <SortByForm />
      </nav>
    );
  }
}
