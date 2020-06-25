import IdleService from "../../services/idle-service";
import React from "react";
import TokenService from "../../services/token-service";
import { Link } from "react-router-dom";

class Hero extends React.Component {
  handleClickLogOut = (e) => {
    e.preventDefault();
    TokenService.clearAuthToken();
    /* when logging out, clear the callbacks to the refresh api and idle auto logout */
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.props.history.push("/");
  };

  render() {
    return (
      <section className="hero">
        <section className="appDescription">
          <h3>LGBTQ+ Locals</h3>
          <p>
            Find nearby LGBTQ+ people to befriend based on similar interests!
          </p>
        </section>
        <section className="buttons">
          {TokenService.getAuthToken() ? (
            <>
              <Link to="/grid" className="primary">
                Dashboard
              </Link>
              <button onClick={this.handleClickLogOut}>Log Out</button>
            </>
          ) : (
            <>
              <Link to="/signup">Sign Up</Link>
              <Link to="/login" className="primary">
                Login
              </Link>
            </>
          )}
        </section>
      </section>
    );
  }
}

export default Hero;
