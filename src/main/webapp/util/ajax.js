import axios from 'axios';

export const Search = {

  getMatchingUsers(url, query) {
    return axios.get(url + '?term=' + query);
  }
  
}

export const Project = {
  createProject(data) { }
};
