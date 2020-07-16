import ApiContext from "../../ApiContext";
import Header from "../Header/Header";
import React from "react";
import TokenService from "../../services/token-service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faTh } from "@fortawesome/free-solid-svg-icons";

class Hero extends React.Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    logOut: () => {},
    refreshProfile: () => {},
  };

  componentDidMount() {
    this.context.refreshProfile();
  }

  handleClickLogOut = (e) => {
    e.preventDefault();
    this.context.logOut();
  };

  render() {
    if (TokenService.getAuthToken()) {
      return (
        <section className="hero">
          <header className="App_Header">
            <Header />
          </header>
          <section className="appDescription">
            <h3>LGBTQ+ Locals</h3>
            <p>
              Find and befriend local LGBTQ+ persons based on distance and
              mutual interests.
            </p>
          </section>
          <section className="buttons">
            {Object.keys(this.context.userProfile).length > 0 ? (
              <>
                <Link to="/grid" className="primary" aria-label="grid button">
                  <FontAwesomeIcon icon={faTh} className="faIcon" />
                </Link>
                <button
                  onClick={this.handleClickLogOut}
                  aria-label="logout button"
                >
                  <FontAwesomeIcon icon={faDoorOpen} className="faIcon" />
                </button>
              </>
            ) : (
              <>
                <Link to="/createprofile" className="primary">
                  Create Your Profile
                </Link>
                <button onClick={this.handleClickLogOut}>Log Out</button>
              </>
            )}
          </section>
        </section>
      );
    } else {
      return (
        <section className="hero">
          <header className="App_Header">
            <Header />
          </header>
          <section className="appDescription">
            <h3>LGBTQ+ Locals</h3>
            <p>
              Find and befriend local LGBTQ+ persons based on distance and
              mutual interests.
            </p>
          </section>
          <section className="buttons">
            <>
              <Link to="/signup">Sign Up</Link>
              <Link to="/login" className="primary">
                Login
              </Link>
            </>
          </section>
        </section>
      );
    }
  }
}

export default Hero;
