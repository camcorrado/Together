import ApiContext from "../../ApiContext";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import SortByForm from "../SortByForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComments,
  faDoorOpen,
  faCog,
  faTh,
  faUndo,
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
    const { id, username, profile_pic } = this.context.userProfile;
    const url = `/userprofile/${id}`;
    const editUrl = `/editprofile/${id}`;
    if (window.location.pathname === "/grid") {
      return (
        <nav role="navigation">
          <section className="buttons">
            <Link
              to={url}
              aira-label="view profile button"
              id="viewProfileButton"
            >
              <img
                src={profile_pic}
                alt={username + `'s profile pic`}
                className="profilePicButton"
              />
            </Link>
            <Link to="messenger" aria-label="messages button">
              <FontAwesomeIcon icon={faComments} className="faIcon" />
              {this.context.messageBadge === 0 ? (
                <></>
              ) : (
                <div className="messageBadge">{this.context.messageBadge}</div>
              )}
            </Link>
            <button onClick={this.handleClickLogOut} aria-label="logout button">
              <FontAwesomeIcon icon={faDoorOpen} className="faIcon" />
            </button>
          </section>
          <SortByForm />
        </nav>
      );
    } else if (window.location.pathname === "/messenger") {
      return (
        <nav role="navigation">
          <section className="buttons">
            <Link
              to={url}
              aira-label="view profile button"
              id="viewProfileButton"
            >
              <img
                src={profile_pic}
                alt={username + `'s profile pic`}
                className="profilePicButton"
              />
            </Link>
            <Link to="/grid" aria-label="back button" className="primary">
              <FontAwesomeIcon icon={faTh} className="faIcon" />
            </Link>
            <button onClick={this.handleClickLogOut} aria-label="logout button">
              <FontAwesomeIcon icon={faDoorOpen} className="faIcon" />
            </button>
          </section>
        </nav>
      );
    } else if (
      window.location.pathname === "/blockedprofiles" ||
      window.location.pathname === "/changepassword"
    ) {
      return (
        <nav role="navigation">
          <section className="buttons">
            <Link
              to={editUrl}
              aira-label="edit profile button"
              id="editProfileButton"
            >
              <FontAwesomeIcon icon={faUndo} className="faIcon" />
            </Link>
          </section>
        </nav>
      );
    } else if (window.location.pathname.includes("/userprofile")) {
      return (
        <nav role="navigation">
          <section className="buttons">
            <Link to={editUrl} aira-label="edit profile button">
              <FontAwesomeIcon icon={faCog} className="faIcon" />
            </Link>
            <Link to="/grid" aria-label="back button" className="primary">
              <FontAwesomeIcon icon={faTh} className="faIcon" />
            </Link>
            <button onClick={this.handleClickLogOut} aria-label="logout button">
              <FontAwesomeIcon icon={faDoorOpen} className="faIcon" />
            </button>
          </section>
        </nav>
      );
    }
  }
}
