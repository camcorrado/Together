import ApiContext from "../ApiContext";
import React from "react";

export default class SortByForm extends React.Component {
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
      <form className="sortByForm">
        <label htmlFor="sortBy" id="sortBy" aria-label="sort by options">
          <select
            value={this.context.sortBy}
            onChange={(e) => this.handleChange(e)}
          >
            <option value="View All">View All</option>
            <option value="Favorites">Favorites</option>
            <option value="Shared Interests">Shared Interests</option>
          </select>
        </label>
      </form>
    );
  }
}
