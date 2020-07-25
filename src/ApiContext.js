import React from "react";

export default React.createContext({
  userInfo: {},
  userProfile: {},
  nearbyProfiles: [],
  blockedBy: [],
  conversations: [],
  messageBadge: null,
  interestOptions: [],
  sortBy: "",
  refreshProfile: () => {},
  setUserInfo: () => {},
  setProfileInfo: () => {},
  setNearbyProfiles: () => {},
  setConversations: () => {},
  setMessageBadge: () => {},
  handleSortBy: () => {},
  editProfile: () => {},
  editUser: () => {},
  logOut: () => {},
});
