import ApiContext from "../../ApiContext";
import CreateProfileForm from "./CreateProfileForm";
import React, { Component } from "react";

export default class CreateProfilePage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userInfo: {},
    userProfile: {},
    refreshProfile: () => {},
    history: {
      push: () => {},
    },
  };

  handleCreateSuccess = () => {
    this.props.history.push("/grid");
  };
  /*
  async componentDidMount() {
    await this.context.refreshProfile();
    if (this.context.userProfile.id) {
      console.log("true");
      this.props.history.push("/editprofile");
    }
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
