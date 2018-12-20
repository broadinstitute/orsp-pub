import axios from 'axios';

export const Search = {

  getMatchingUsers(url, query) {
    return axios.get(url + '?term=' + query);
  }
  
};

export const Files = {

  upload(url, files, projectKey, displayName, userName) {
    let data = new FormData();

    files.forEach(file => {
      data.append(file.fileKey, file.fileData, file.fileData.name);
    });

    data.append('id', projectKey);
    data.append('displayName', displayName);
    data.append('userName', userName);

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };

    return axios.post(url, data, config);
  }
};

export const Project = {

  createProject(url, data) {
    console.log(data);

    const config = {
      headers: { 'content-type': 'application/json' }
    };

    return axios.post(url, data, config);
  }

};
