import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import ApiContext from "./ApiContext";
import App from "./App";
import BlockedProfiles from "./components/AccountSettings/BlockedProfiles";
import ChangePasswordPage from "./components/AccountSettings/ChangePasswordPage";
import ChangePasswordForm from "./components/AccountSettings/ChangePasswordForm";
import Checkbox from "./components/Checkbox/Checkbox";
import CreateProfilePage from "./components/CreateProfile/CreateProfilePage";
import CreateProfileForm from "./components/CreateProfile/CreateProfileForm";
import DeactivateProfilePage from "./components/AccountSettings/DeactivateProfilePage";
import DeactivateProfileForm from "./components/AccountSettings/DeactivateProfileForm";
import EditProfilePage from "./components/EditProfile/EditProfilePage";
import EditProfileForm from "./components/EditProfile/EditProfileForm";
import ErrorBoundary from "./components/ErrorBoundary";
import Grid from "./components/Grid/Grid";
import ProfileIcon from "./components/Grid/ProfileIcon";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import LoginPage from "./components/Login/LoginPage";
import LoginForm from "./components/Login/LoginForm";
import Nav from "./components/Nav/Nav";
import MessageList from "./components/Messenger/MessageList";
import Conversation from "./components/Messenger/Conversation";
import Message from "./components/Messenger/Message";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import SignUpPage from "./components/SignUp/SignUpPage";
import SignUpForm from "./components/SignUp/SignUpForm";
import SortByForm from "./components/SortByForm";
import UserProfile from "./components/UserProfile/UserProfile";

describe("LGBTQ App Components", () => {
  it("renders the App without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Blocked Profile Page without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <BlockedProfiles />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Change Password Page without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <ChangePasswordPage />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Change Password Form without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <ChangePasswordForm />
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Checkbox without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <Checkbox />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Create Profile Page without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <CreateProfilePage />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Create Profile Form without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <CreateProfileForm />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Deactivate Profile Page without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <DeactivateProfilePage />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Deactivate Profile Form without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <DeactivateProfileForm />
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Edit Profile Page without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <EditProfilePage />
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Edit Profile Form without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <ApiContext.Provider>
            <EditProfileForm />
          </ApiContext.Provider>
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Error Boundary without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <ErrorBoundary />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Grid without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <Grid />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Profile Icon without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <ApiContext.Provider>
            <ProfileIcon />
          </ApiContext.Provider>
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Hero without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <Hero />
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Login Page without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <LoginPage />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Login Form without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <LoginForm />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Message List without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <MessageList />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Conversation without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <ApiContext.Provider>
            <Conversation />
          </ApiContext.Provider>
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Message without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <Message />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Nav without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <Nav />
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Not Found Profile Page without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Sign Up Page without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <SignUpPage />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Sign Up Form without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <SignUpForm />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Sort By Form without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <SortByForm />
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the Header without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });

  it("renders the User Profile without crashing", () => {
    const div = document.createElement("div");

    ReactDOM.render(
      <BrowserRouter>
        <App>
          <UserProfile />
        </App>
      </BrowserRouter>,
      div
    );

    ReactDOM.unmountComponentAtNode(div);
  });
});
