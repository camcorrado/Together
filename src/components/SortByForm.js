import React from "react";

export default class SortByForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "view all",
    };
  }

  async handleChange(event) {
    console.log("handleChange began");
    await this.setState({ value: event.target.value });
    this.props.handleSortBy(this.state.value);
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
            <option value="view all">View All</option>
            <option value="favorites">Favorites</option>
            <option value="shared interests">Shared Interests</option>
          </select>
        </label>
      </form>
    );
  }
}
