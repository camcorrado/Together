import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import icons from "../Icons";

import React, { Component } from "react";

class Checkbox extends Component {
  state = {
    isChecked: this.props.isChecked ? true : false,
  };

  toggleCheckboxChange = () => {
    const { handleCheckboxChange, label } = this.props;

    this.setState(({ isChecked }) => ({
      isChecked: !isChecked,
    }));

    handleCheckboxChange(label);
  };

  render() {
    const { label } = this.props;
    const { isChecked } = this.state;
    const { interestDict } = icons;

    return (
      <div className="checkbox">
        <label>
          <input
            type="checkbox"
            value={label}
            checked={isChecked}
            onChange={this.toggleCheckboxChange}
          />
          <FontAwesomeIcon icon={interestDict[label]} className="faIcon" />
          {label}
        </label>
      </div>
    );
  }
}

export default Checkbox;
