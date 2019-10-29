const CurrentUser = "CurrentUser";
const UserIsLogged = "isLogged";
const URLFrom = "URLFrom";
const SubmissionNumbers = "SubmissionNumbers";

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

  setSubmissionNumbers: value => {
    localStorage.setItem(SubmissionNumbers, JSON.stringify(value));
  },

  getSubmissionNumbers: () => {
    return localStorage.getItem(SubmissionNumbers);
  },

  removeSubmissionNumbers: () => {
    return localStorage.removeItem(SubmissionNumbers);
  }
};
