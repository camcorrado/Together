import ApiContext from "./ApiContext";
import AuthApiService from "./services/auth-api-service";
import BlockedProfiles from "./components/AccountSettings/BlockedProfiles";
import ChangePasswordPage from "./components/AccountSettings/ChangePasswordPage";
import config from "./config";
import CreateProfilePage from "./components/CreateProfile/CreateProfilePage";
import EditProfilePage from "./components/EditProfile/EditProfilePage";
import ErrorBoundary from "./components/ErrorBoundary";
import Grid from "./components/Grid/Grid";
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
    conversations: [],
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
      "Movies",
      "Music",
      "Nightlife",
      "Pets/Animals",
      "Reading",
      "Spirituality",
      "Sports",
      "Tech",
      "The Outdoors",
      "Theater",
      "Travel",
    ],
    sortBy: "View All",
    messageBadge: 0,
    error: null,
  };

  componentDidMount() {
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

  refreshProfile = async () => {
    this.setState({ error: null });
    const authToken = TokenService.getAuthToken();
    if (authToken) {
      await fetch(`${config.API_ENDPOINT}/users`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((res) =>
          !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
        )
        .then(async (user) => {
          await this.handleSetUserInfo(user);
          await this.handleSetProfileInfo(user.id);
        });
    }
  };

  handleSetUserInfo = async () => {
    this.setState({ error: null });
    const authToken = TokenService.getAuthToken();
    await fetch(`${config.API_ENDPOINT}/users`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
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
  };

  handleSetProfileInfo = async (id) => {
    this.setState({ error: null });
    await fetch(`${config.API_ENDPOINT}/profiles`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then(async (data) => {
        const profileInfo = await data.filter((profile) => {
          return profile.user_id === id;
        });
        if (profileInfo.length > 0) {
          this.setState({
            userProfile: profileInfo.pop(),
          });
          await this.handleSetNearbyProfiles(data);
          await this.handleSetConverations();
        }
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  handleSetNearbyProfiles = (data) => {
    let filteredProfiles = data.filter((profile) => {
      if (
        !this.state.userProfile.blocked_profiles.includes(profile.id) &&
        profile.user_id !== this.state.userProfile.user_id
      ) {
        return profile;
      } else {
        return false;
      }
    });

    filteredProfiles.forEach((profile) => {
      const distance = this.distance(
        this.state.userProfile.geolocation.x,
        this.state.userProfile.geolocation.y,
        profile.geolocation.x,
        profile.geolocation.y,
        "M"
      );
      profile.geolocation = distance;
    });

    this.setState({
      nearbyProfiles: filteredProfiles.sort(
        (a, b) => a.geolocation - b.geolocation
      ),
    });
  };

  distance = (lat1, lon1, lat2, lon2, unit) => {
    if (lat1 === lat2 && lon1 === lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === "K") {
        dist = dist * 1.609344;
      }
      if (unit === "N") {
        dist = dist * 0.8684;
      }
    }
    return dist;
  };

  handleSetConverations = async () => {
    this.setState({ error: null });
    await fetch(`${config.API_ENDPOINT}/conversations`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) =>
        !res.ok ? res.json().then((e) => Promise.reject(e)) : res.json()
      )
      .then((conversations) => {
        let filteredConvos = [];
        conversations.forEach((convo) => {
          let id = convo.users
            .filter((user) => user !== this.state.userProfile.id)
            .pop();
          if (!this.state.userProfile.blocked_profiles.includes(id)) {
            filteredConvos.push(convo);
          }
        });

        this.setState({
          conversations: filteredConvos,
        });
      })
      .catch((res) => {
        this.setState({ error: res.error });
      });
  };

  handle;

  handleSortBy = (value) => {
    this.setState({ sortBy: value });
  };

  handleEditProfile = (data, cb) => {
    let geoData = data.geolocation;

    this.setState(
      {
        userProfile: { ...data, geolocation: `${geoData.x}, ${geoData.y}` },
      },
      cb
    );
  };

  handleLogOut = () => {
    TokenService.clearAuthToken();
    /* when logging out, clear the callbacks to the refresh api and idle auto logout */
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.setState({
      userInfo: {},
      userProfile: {},
      nearbyProfiles: [],
    });
  };

  render() {
    const value = {
      userInfo: this.state.userInfo,
      userProfile: this.state.userProfile,
      nearbyProfiles: this.state.nearbyProfiles,
      conversations: this.state.conversations,
      interestOptions: this.state.interestOptions,
      sortBy: this.state.sortBy,
      refreshProfile: this.refreshProfile,
      setUserInfo: this.handleSetUserInfo,
      setProfileInfo: this.handleSetProfileInfo,
      setNearbyProfiles: this.handleSetNearbyProfiles,
      setConversations: this.handleSetConverations,
      handleSortBy: this.handleSortBy,
      editProfile: this.handleEditProfile,
      logOut: this.handleLogOut,
    };
    return (
      <ApiContext.Provider value={value}>
        <main className="App">
          <ErrorBoundary>
            <Switch>
              <Route exact path={"/"} component={Hero} />
              <PublicOnlyRoute path={"/login"} component={LoginPage} />
              <PublicOnlyRoute path={"/signup"} component={SignUpPage} />
              <PrivateRoute
                path={"/blockedprofiles"}
                component={BlockedProfiles}
              />
              <PrivateRoute
                path={"/changepassword"}
                component={ChangePasswordPage}
              />
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
              <PrivateRoute
                path={"/conversation/:conversationId"}
                component={Message}
              />
              <Route component={NotFoundPage} />
            </Switch>
          </ErrorBoundary>
        </main>
      </ApiContext.Provider>
    );
  }
}

export default App;
