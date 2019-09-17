
// Storage Variables

const CurrentUser = "CurrentUser";
const UserIsLogged = "isLogged"; 

export const Storage = {

  clearStorage: () => {
    localStorage.clear();
  },

  setCurrentUser: data => {
    localStorage.setItem(CurrentUser, JSON.stringify(data));
  },

  getCurrentUser: () => {
    return localStorage.getItem(CurrentUser) ? JSON.parse(localStorage.getItem(CurrentUser)) : null;
  },

  userIsLogged: () => {
    return localStorage.getItem(UserIsLogged) === 'true';
  },

  setUserIsLogged: value => {
    localStorage.setItem(UserIsLogged, value);
  }

};
