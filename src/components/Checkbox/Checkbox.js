import React, { Component } from "react";

class Checkbox extends Component {
  state = {
    isChecked: false,
  };

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label } = this.props;

    this.setState(({ isChecked }) => ({
      isChecked: !isChecked,
    }));

    handleCheckboxChange(label);
  };

  render() {
    const { label, checked } = this.props;
    const { isChecked } = this.state;

    console.log({ label, checked, isChecked });

    if (checked === true) {
      return (
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              value={label}
              checked="true"
              onChange={this.toggleCheckboxChange}
            />

            {label}
          </label>
        </div>
      );
    } else {
      return (
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              value={label}
              checked={isChecked}
              onChange={this.toggleCheckboxChange}
            />

            {label}
          </label>
        </div>
      );
    }
  }
}

export default Checkbox;
