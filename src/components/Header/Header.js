import React from "react";
import { Link } from "react-router-dom";

class Title extends React.Component {
  render() {
    return (
      <header role="banner">
        <section className="appTitle">
          <div className="L">
            <h1>L</h1>
          </div>
          <div className="G">
            <h1>G</h1>
          </div>
          <div className="B">
            <h1>B</h1>
          </div>
          <Link to="/" className="Together">
            <div className="T">
              <h1>T</h1>
            </div>
            <div className="ogether">
              <h1>ogether</h1>
            </div>
          </Link>
          <div className="Q">
            <h1>Q</h1>
          </div>
          <div className="plus">
            <h1>+</h1>
          </div>
        </section>
        <h2>Meet your neighbors</h2>
      </header>
    );
  }
}

export default Title;
