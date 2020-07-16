import React from "react";

export default React.createContext({
  userInfo: {},
  userProfile: {},
  nearbyProfiles: [],
  conversations: [],
  interestOptions: [],
  sortBy: "",
  location: {},
  refreshProfile: () => {},
  setUserInfo: () => {},
  setProfileInfo: () => {},
  setNearbyProfiles: () => {},
  setConversations: () => {},
  handleSortBy: () => {},
  editProfile: () => {},
  logOut: () => {},
});
