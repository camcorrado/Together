import React from "react";
import { Link } from "react-router-dom";

class Title extends React.Component {
  render() {
    return (
      <header role="banner">
        <h1>
          <Link to="/">Together</Link>
        </h1>
        <h2>Meet your neighbors</h2>
      </header>
    );
  }
}

export default Title;
