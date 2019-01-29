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
    return axios.get(url+ '?id=' + consentKey);
  },

  approve(url, consentKey, data) {
    return axios.post(url+ '?id=' + consentKey, data);
  },
  
  rejectConsent(url, consentKey) {
    return axios.delete(url + '?consentKey=' + consentKey);
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
    return axios({ url: pdfUrl, method: 'GET', responseType: 'blob' });
  }


};

export const Project = {

  createProject(url, data) {
    const config = {
      headers: { 'content-type': 'application/json' }
    };
    return axios.post(url, data, config);
  },

  getProject(url, projectkey) {
    return axios.get(url + '?id=' + projectkey);
  },

  addExtraProperties(url, projectKey, data) {
    return axios.post(url + '?id=' + projectKey, data);
  },

  rejectProject(url, projectKey) {
    return axios.delete(url + '?projectKey=' + projectKey);
  },

  updateProject(url, data, projectKey) {
    return axios.put(url + '?projectKey=' + projectKey, data);
  }

};

export const DocumentHandler = {
  approveDocument(url, uuid) {
    return axios.put(`${url}?uuid=${uuid}`);
  },

   rejectDocument(url, uuid) {
    return axios.put(`${url}?uuid=${uuid}`);
  },

   attachedDocuments(url, issueKey) {
    return axios.get(`${url}?issueKey=${issueKey}`);
  }
};

export const User = {

  isCurrentUserAdmin(url) {
    return axios.get(url);
  },

  addExtraProperties(url, projectKey, data) {
    return axios.post(url+ '?id=' + projectKey, data );
  },

  getUserSession(url) {
    return axios.get(url)
  }

};

export const Review = {

  deleteSuggestions(url, projectKey) {
    return axios.delete(url + '?projectKey=' + projectKey);
  }

}

