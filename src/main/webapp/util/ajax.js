import axios from 'axios';

export const Search = {
  searchUsers(url, query) {
    axios.get(url + '?term=' + query)
      .then(response => {
        console.log(response.data);
        return response.data;
      })
      .catch(error => {
        console.log(error);
      })
  }
};

export const Project = {
  createProject(data) {}
};
