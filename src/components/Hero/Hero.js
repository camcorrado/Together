import ApiContext from "../../ApiContext";
import Header from "../Header/Header";
import React, { Component } from "react";
import TokenService from "../../services/token-service";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import icons from "../Icons";
import "./Hero.css";

export default class Hero extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    logOut: () => {},
    refreshProfile: () => {},
  };

  state = {
    loading: null,
  };

  _isMounted = false;

  async componentDidMount() {
    this._isMounted = true;
    this.setState({ loading: true });
    await this.context.refreshProfile();
    if (this._isMounted) {
      this.setState({ loading: false });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleClickLogOut = (e) => {
    e.preventDefault();
    this.context.logOut();
  };

  render() {
    const { buttonDict } = icons;
    const { loading } = this.state;
    return (
      <section className="Hero">
        <header className="appHeader">
          <Header />
        </header>
        <section className="appDescription">
          <h3>LGBTQ+ Locals</h3>
          <p>
            Find and befriend LGBTQ+ locals based on distance and mutual
            interests.
          </p>
        </section>
        <section className="buttons">
          {loading ? (
            <></>
          ) : TokenService.getAuthToken() ? (
            <>
              {Object.keys(this.context.userProfile).length > 0 ? (
                <>
                  <Link to="/grid" className="primary" aria-label="grid button">
                    <FontAwesomeIcon
                      icon={buttonDict.faTh}
                      className="faIcon"
                    />
                  </Link>
                  <button
                    onClick={this.handleClickLogOut}
                    aria-label="logout button"
                  >
                    <FontAwesomeIcon
                      icon={buttonDict.faDoorOpen}
                      className="faIcon"
                    />
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/createprofile"
                    className="primary"
                    id="createProfileButton"
                  >
                    Create Your Profile
                  </Link>
                  <button onClick={this.handleClickLogOut}>Log Out</button>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/signup" id="heroButton">
                Sign Up
              </Link>
              <Link to="/login" id="heroButton" className="primary">
                Login
              </Link>
            </>
          )}
        </section>
      </section>
    );
  }
}
