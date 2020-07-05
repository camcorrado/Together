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
    console.log("handleChange began");
    await this.setState({ value: event.target.value });
    this.context.handleSortBy(this.state.value);
    console.log("handleChange completed");
  }

  render() {
    return (
      <form>
        <label>
          Sort Profiles By:
          <select
            value={this.state.value}
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
