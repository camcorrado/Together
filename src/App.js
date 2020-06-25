import ApiContext from "./ApiContext";
import AuthApiService from "./services/auth-api-service";
import config from "./config";
import CreateProfilePage from "./components/CreateProfile/CreateProfilePage";
import EditProfilePage from "./components/EditProfile/EditProfilePage";
import Grid from "./components/Grid/Grid";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import IdleService from "./services/idle-service";
import LoginPage from "./components/Login/LoginPage";
import Messenger from "./components/Messenger/Messenger";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import PublicOnlyRoute from "./components/Utils/PublicOnlyRoute";
import PrivateRoute from "./components/Utils/PrivateRoute";
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import SignUpPage from "./components/SignUp/SignUpPage";
import UserProfile from "./components/UserProfile/UserProfile";
import TokenService from "./services/token-service";

class App extends Component {
  static defaultProps = {
    history: {
      push: () => {},
    },
  };

  state = {
    userInfo: {},
    userProfile: {},
    nearbyProfiles: [],
    hasError: false,
    interestOptions: [
      "Activism",
      "Drag",
      "Gaming",
      "Reading",
      "Sports",
      "Nightlife",
    ],
  };

  static getDerivedStateFromError(error) {
    console.error(error);
    return { hasError: true };
  }

  componentDidMount() {
    /*
      set the function (callback) to call when a user goes idle
      we'll set this to logout a user when they're idle
    */
    IdleService.setIdleCallback(this.logoutFromIdle);

    /* if a user is logged in */
    if (TokenService.hasAuthToken()) {
      /*
        tell the idle service to register event listeners
        the event listeners are fired when a user does something, e.g. move their mouse
        if the user doesn't trigger one of these event listeners,
          the idleCallback (logout) will be invoked
      */
      IdleService.regiserIdleTimerResets();

      /*
        Tell the token service to read the JWT, looking at the exp value
        and queue a timeout just before the token expires
      */
      TokenService.queueCallbackBeforeExpiry(() => {
        /* the timoue will call this callback just before the token expires */
        AuthApiService.postRefreshToken();
      });
    }
  }

  componentWillUnmount() {
    /*
      when the app unmounts,
      stop the event listeners that auto logout (clear the token from storage)
    */
    IdleService.unRegisterIdleResets();
    /*
      and remove the refresh endpoint request
    */
    TokenService.clearCallbackBeforeExpiry();
  }

  logoutFromIdle = () => {
    /* remove the token from localStorage */
    TokenService.clearAuthToken();
    /* remove any queued calls to the refresh endpoint */
    TokenService.clearCallbackBeforeExpiry();
    /* remove the timeouts that auto logout when idle */
    IdleService.unRegisterIdleResets();
    /*
      react won't know the token has been removed from local storage,
      so we need to tell React to rerender
    */
    this.forceUpdate();
  };

  handleSetUserInfo = () => {
    const authToken = TokenService.getAuthToken();
    fetch(`${config.API_ENDPOINT}/users`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((user) => {
        this.setState({
          userInfo: user,
        });
        console.log(this.state.userInfo);
      });
  };

  handleSetProfileInfo = (id) => {
    fetch(`${config.API_ENDPOINT}/profiles`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.status);
        }
        return res.json();
      })
      .then((data) => {
        const profileInfo = data.filter((profile) => profile.user_id === id);
        this.setState({
          userProfile: profileInfo[0],
        });
        console.log(this.state.userProfile);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleSetNearbyProfiles = (data) => {
    this.setState({
      nearbyProfiles: data,
    });
  };

  handleEditProfile = (data) => {
    this.setState({
      userProfile: data,
    });
  };

  /*
  refreshProfile = () => {
    const authToken = TokenService.getAuthToken();
    if (authToken) {
      fetch(`${config.API_ENDPOINT}/users`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(res.status);
          }
          return res.json();
        })
        .then((user) => {
          this.handleSetUserInfo(user);
          this.handleSetProfileInfo(user.id);
        });
    }
  };
*/
  render() {
    const value = {
      userInfo: this.state.userInfo,
      userProfile: this.state.userProfile,
      nearbyProfiles: this.state.nearbyProfiles,
      interestOptions: this.state.interestOptions,
      setUserInfo: this.handleSetUserInfo,
      setProfileInfo: this.handleSetProfileInfo,
      setNearbyProfiles: this.handleSetNearbyProfiles,
      editProfile: this.handleEditProfile,
      //refreshProfile: this.refreshProfile,
    };
    return (
      <ApiContext.Provider value={value}>
        <main className="App">
          <header className="App_Header">
            <Header />
          </header>
          {this.state.hasError && (
            <p className="red">There was an error! Oh no!</p>
          )}
          <Switch>
            <Route exact path={"/"} component={Hero} />
            <PublicOnlyRoute path={"/login"} component={LoginPage} />
            <PublicOnlyRoute path={"/signup"} component={SignUpPage} />
            <PrivateRoute
              path={"/createprofile"}
              component={CreateProfilePage}
            />
            <PrivateRoute path={"/editprofile"} component={EditProfilePage} />
            <PrivateRoute path={"/grid"} component={Grid} />
            <PrivateRoute path={"/messenger"} component={Messenger} />
            <PrivateRoute path={"/userprofile"} component={UserProfile} />
            <Route component={NotFoundPage} />
          </Switch>
        </main>
      </ApiContext.Provider>
    );
  }
}

export default App;
