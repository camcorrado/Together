import React from "react";

export default React.createContext({
  userInfo: {},
  userProfile: {},
  nearbyProfiles: [],
  blockedBy: [],
  conversations: [],
  interestOptions: [],
  sortBy: "",
  refreshProfile: () => {},
  setUserInfo: () => {},
  setProfileInfo: () => {},
  setNearbyProfiles: () => {},
  setConversations: () => {},
  handleSortBy: () => {},
  editProfile: () => {},
  logOut: () => {},
});
