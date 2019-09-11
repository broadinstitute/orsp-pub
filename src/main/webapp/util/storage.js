
// Storage Variables

const CurrentUser = "CurrentUser"; // System user
const UserIsLogged = "isLogged"; // User log status flag

export const Storage = {

  clearStorage: () => {
    sessionStorage.clear();
  },

  setCurrentUser: data => {
    sessionStorage.setItem(CurrentUser, JSON.stringify(data));
  },

  getCurrentUser: () => {
    return sessionStorage.getItem(CurrentUser) ? JSON.parse(sessionStorage.getItem(CurrentUser)) : null;
  },

  userIsLogged: () => {
    return sessionStorage.getItem(UserIsLogged) === 'true';
  },

  setUserIsLogged: value => {
    sessionStorage.setItem(UserIsLogged, value);
  }

};
