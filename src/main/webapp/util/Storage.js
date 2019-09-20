const CurrentUser = "CurrentUser";
const UserIsLogged = "isLogged";
const URLFrom = "URLFrom";
const UnauthorizedFrom = "UnauthorizedFrom";


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
  },

  setLocationFrom: urlFrom => {
    localStorage.setItem(URLFrom, JSON.stringify(urlFrom));
  },

  getLocationFrom: () => {
    return localStorage.getItem(URLFrom) ? JSON.parse(localStorage.getItem(URLFrom)) : null;
  },

  removeLocationFrom: () => {
    return localStorage.removeItem(URLFrom);
  },

  setUnauthorizedLocationFrom: unauthorizedFrom => {
    localStorage.setItem(UnauthorizedFrom, JSON.stringify(unauthorizedFrom));
  },

  getUnauthorizedLocationFrom: () => {
    return localStorage.getItem(UnauthorizedFrom) ? JSON.parse(localStorage.getItem(UnauthorizedFrom)) : null;
  },

  removeUnauthorizedLocationFrom: () => {
    return localStorage.removeItem(UnauthorizedFrom);
  }
};
