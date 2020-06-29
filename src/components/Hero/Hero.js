import ApiContext from "../../ApiContext";
import React from "react";
import TokenService from "../../services/token-service";
import { Link } from "react-router-dom";

class Hero extends React.Component {
  static contextType = ApiContext;

  static defaultProps = {
    userProfile: {},
    refreshProfile: () => {},
    logOut: () => {},
  };

  handleClickLogOut = (e) => {
    e.preventDefault();
    this.context.logOut();
  };

  componentDidMount() {
    this.context.refreshProfile();
  }

  render() {
    if (TokenService.getAuthToken()) {
      return (
        <section className="hero">
          <section className="appDescription">
            <h3>LGBTQ+ Locals</h3>
            <p>
              Find nearby LGBTQ+ people to befriend based on similar interests!
            </p>
          </section>
          <section className="buttons">
            {this.context.userProfile ? (
              <>
                <Link to="/grid" className="primary">
                  Dashboard
                </Link>
                <button onClick={this.handleClickLogOut}>Log Out</button>
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
          <section className="appDescription">
            <h3>LGBTQ+ Locals</h3>
            <p>
              Find nearby LGBTQ+ people to befriend based on similar interests!
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
