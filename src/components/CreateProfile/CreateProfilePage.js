import ApiContext from "../../ApiContext";
import CreateProfileForm from "./CreateProfileForm";
import React, { Component } from "react";

export default class CreateProfilePage extends Component {
  static contextType = ApiContext;

  static defaultProps = {
    userInfo: {},
    userProfile: {},
    refreshProfile: () => {},
  };

  async componentDidMount() {
    await this.context.refreshProfile();
    if (Object.keys(this.context.userProfile).length > 0) {
      this.props.history.push("/editprofile");
    }
  }

  handleCreateSuccess = () => {
    this.props.history.push("/grid");
  };

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
