
// Storage Variables

const CurrentUser = "CurrentUser";
const UserIsLogged = "isLogged"; 

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
