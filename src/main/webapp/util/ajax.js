import axios from 'axios';

export const Search = {

  getMatchingUsers(url, query) {
    return axios.get(url + '?term=' + query);
  }
  
};

export const Files = {

  upload(url, files, projectKey) {
    let data = new FormData();

    files.forEach(file => {
      data.append(file.fileKey, file.fileData, file.fileData.name);
    });
    data.append('id', 'DEV-IRB-5164');

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };

    return axios.post(url, data, config);
  }
};

export const Project = {
  createProject(data) { }
};
