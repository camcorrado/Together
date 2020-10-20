import ApiContext from "../ApiContext";
import React, { Component } from "react";

export default class SortByForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "View All",
    };
  }

  static contextType = ApiContext;

  static defaultProps = {
    sortBy: "",
  };

  async handleChange(event) {
    await this.setState({ value: event.target.value });
    this.context.handleSortBy(this.state.value);
  }

  render() {
    return (
      <form className="SortByForm">
        <label htmlFor="sortBy" id="sortBy" aria-label="sort by options">
          <select
            value={this.context.sortBy}
            onChange={(e) => this.handleChange(e)}
          >
            <option value="View All">View All</option>
            <option value="Favorites">Favorites</option>
            <option value="Mutual Interests">Mutual Interests</option>
          </select>
        </label>
      </form>
    );
  }
}
