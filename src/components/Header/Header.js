import React from "react";
import { Link } from "react-router-dom";

class Title extends React.Component {
  render() {
    return (
      <header role="banner">
        <h1>
          <Link to="/">APP TITLE</Link>
        </h1>
        <h2>APP FLAVOR TEXT</h2>
      </header>
    );
  }
}

export default Title;
