import axios from 'axios';

export const Search = {

  getMatchingUsers(url, query) {
    return axios.get(url + '?term=' + query);
  }

};

export const SampleCollections = {

  getSampleCollections(url, query) {
    return axios.get(url + '?term=' + query);
  }
};

export const ConsentGroup = {
  getConsentGroupNames(url) {
    return axios.get(url);
  },
  
  create(url, data) {
    const config = {
      headers: { 'content-type': 'application/json' }
    };
    return axios.post(url, data, config);
  },

  getConsentGroup(url, consentKey) {
      console.log("url ", url, "consentKey ", consentKey);
      return axios.get(url+ '?id=' + consentKey );
  }
};

export const Files = {

  upload(url, files, projectKey, displayName, userName) {
    let data = new FormData();

    files.forEach(file => {
      if (file.file != null) {
        data.append(file.fileKey, file.file, file.file.name);
      }
    });

    data.append('id', projectKey);
    data.append('displayName', displayName);
    data.append('userName', userName);

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };

    return axios.post(url, data, config);
  },

  downloadFillable(pdfUrl) {
    return axios({url: pdfUrl, method: 'GET', responseType: 'blob'});
  }


};

export const Project = {

  createProject(url, data) {
    const config = {
      headers: { 'content-type': 'application/json' }
    };
    return axios.post(url, data, config);
  }

};
