import React from "react";

export default React.createContext({
  userInfo: {},
  userProfile: {},
  nearbyProfiles: [],
  interestOptions: [],
  sortBy: "",
  refreshProfile: () => {},
  setUserInfo: () => {},
  setProfileInfo: () => {},
  setNearbyProfiles: () => {},
  handleSortBy: () => {},
  editProfile: () => {},
  logOut: () => {},
});
