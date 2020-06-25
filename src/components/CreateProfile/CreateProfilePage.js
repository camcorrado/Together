import ApiContext from "../../ApiContext";
import CreateProfileForm from "./CreateProfileForm";
import React, { Component } from "react";

export default class CreateProfilePage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    //refreshProfile: () => {},
    history: {
      push: () => {},
    },
  };

  handleCreateSuccess = () => {
    this.props.history.push("/grid");
  };

  /*componentDidMount() {
    this.context.refreshProfile();
  }
*/
  render() {
    return (
      <section className="CreateProfilePage">
        <header>
          <h1>Create Your Profile</h1>
        </header>
        <CreateProfileForm onCreateSuccess={this.handleCreateSuccess} />
      </section>
    );
  }
}
