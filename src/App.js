import ApiContext from "./ApiContext";
import AuthApiService from "./services/auth-api-service";
import config from "./config";
import CreateProfilePage from "./components/CreateProfile/CreateProfilePage";
import EditProfilePage from "./components/EditProfile/EditProfilePage";
import ErrorBoundary from "./components/ErrorBoundary";
import Grid from "./components/Grid/Grid";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import IdleService from "./services/idle-service";
import LoginPage from "./components/Login/LoginPage";
import Message from "./components/Messenger/Message";
import Messenger from "./components/Messenger/MessageList";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage";
import PublicOnlyRoute from "./components/Utils/PublicOnlyRoute";
import PrivateRoute from "./components/Utils/PrivateRoute";
import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import SignUpPage from "./components/SignUp/SignUpPage";
import TokenService from "./services/token-service";
import UserProfile from "./components/UserProfile/UserProfile";

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
    interestOptions: [
      "Activism",
      "Anime",
      "Art",
      "Cooking",
      "Crafting",
      "Drag",
      "Fashion",
      "Fitness",
      "Food",
      "Gaming",
      "Gardening",
      "Hiking/Camping/Outdoors",
      "Movies",
      "Music",
      "Nightlife",
      "Pets/Animals",
      "Reading",
      "Spirituality",
      "Sports",
      "Tech",
      "Theater",
      "Travel",
    ],
    sortBy: "View All",
  };

  componentDidMount() {
    console.log(`componentDidMount App ran`);
    this.refreshProfile();
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
    console.log(`componentDidMount App completed`);
  }

  componentWillUnmount() {
    console.log(`componentWillUnmount ran`);
    /*
      when the app unmounts,
      stop the event listeners that auto logout (clear the token from storage)
    */
    IdleService.unRegisterIdleResets();
    /*
      and remove the refresh endpoint request
    */
    TokenService.clearCallbackBeforeExpiry();
    console.log(`componentWillUnmount completed`);
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

  refreshProfile = async () => {
    console.log(`refreshProfile ran`);

    const authToken = TokenService.getAuthToken();
    if (authToken) {
      await fetch(`${config.API_ENDPOINT}/users`, {
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
        .then(async (user) => {
          await this.handleSetUserInfo(user);
          await this.handleSetProfileInfo(user.id);
        });
    }
    console.log(`refreshProfile completed`);
  };

  handleSetUserInfo = async () => {
    console.log(`handleSetUserInfo ran`);

    const authToken = TokenService.getAuthToken();
    await fetch(`${config.API_ENDPOINT}/users`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then((user) => {
        this.setState({
          userInfo: user,
        });
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
    console.log(`handleSetUserInfo completed`);
  };

  handleSetProfileInfo = async (id) => {
    console.log(`handleSetProfileInfo ran`);

    await fetch(`${config.API_ENDPOINT}/profiles`, {
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
      .then(async (data) => {
        const profileInfo = await data.filter((profile) => {
          return profile.user_id === id;
        });
        this.setState({
          userProfile: profileInfo.pop(),
        });
        this.handleSetNearbyProfiles(data);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log(`handleSetProfileInfo completed`);
  };

  handleSetNearbyProfiles = (data) => {
    console.log(`handleSetNearbyProfiles ran`);
    console.log(data);
    let filteredProfiles = data.filter((profile) => {
      if (
        this.state.userProfile.blocked_profiles.includes(profile.id) === false
      ) {
        return profile;
      }
    });
    this.setState({
      nearbyProfiles: filteredProfiles,
    });
    console.log(`handleSetNearbyProfiles completed`);
  };

  handleSortBy = (value) => {
    this.setState({ sortBy: value });
  };

  handleEditProfile = (data) => {
    console.log(`handleEditProfile ran`);

    this.setState({
      userProfile: data,
    });
    console.log(`handleEditProfile completed`);
  };

  handleLogOut = async () => {
    console.log(`handleLogOut ran`);

    TokenService.clearAuthToken();
    /* when logging out, clear the callbacks to the refresh api and idle auto logout */
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    await this.setState({
      userInfo: {},
      userProfile: {},
      nearbyProfiles: [],
    });

    this.props.history.push("/");
    console.log(`handleLogOut completed`);
  };

  render() {
    const value = {
      userInfo: this.state.userInfo,
      userProfile: this.state.userProfile,
      nearbyProfiles: this.state.nearbyProfiles,
      interestOptions: this.state.interestOptions,
      sortBy: this.state.sortBy,
      refreshProfile: this.refreshProfile,
      setUserInfo: this.handleSetUserInfo,
      setProfileInfo: this.handleSetProfileInfo,
      setNearbyProfiles: this.handleSetNearbyProfiles,
      handleSortBy: this.handleSortBy,
      editProfile: this.handleEditProfile,
      logOut: this.handleLogOut,
    };
    return (
      <ApiContext.Provider value={value}>
        <main className="App">
          <header className="App_Header">
            <Header />
          </header>
          <ErrorBoundary>
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
              <PrivateRoute
                path={"/userprofile/:profileId"}
                component={UserProfile}
              />
              <PrivateRoute path={"/messenger"} component={Messenger} />
              <PrivateRoute path={"/message"} component={Message} />
              <Route component={NotFoundPage} />
            </Switch>
          </ErrorBoundary>
        </main>
      </ApiContext.Provider>
    );
  }
}

export default App;
