import React from "react";

export default React.createContext({
  userInfo: {},
  userProfile: {},
  nearbyProfiles: [],
  interestOptions: [],
  refreshProfile: () => {},
  setUserInfo: () => {},
  setProfileInfo: () => {},
  setNearbyProfiles: () => {},
  editProfile: () => {},
  logOut: () => {},
});
