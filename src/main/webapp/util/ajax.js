import axios from 'axios';
import "regenerator-runtime/runtime";

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
  },

  updateConsent(url, data, projectKey) {
    return axios.put(url + '?consentKey=' + projectKey, data);
  },

  getConsentGroupByUUID(url, uuid) {
    return axios.get(url + '?uuid=' + uuid);
  },

  sendEmailDul(url, consentKey, userName, recipients) {
   return axios.post(url + '?consentKey=' + consentKey, {'userName': userName, 'recipients': recipients });
  },

  rollbackConsentGroup(urlRollback, consentKey) {
    return axios({url: urlRollback + '?consentKey=' + consentKey, method: 'DELETE'})
  },

  getUseRestriction(url, consentKey) {
    return axios.get(url + '?consentKey=' + consentKey);
  },

  getConsentCollectionLinks(url, consentKey) {
    return axios.get(url + '/api/consent-group/associatedProjects?consentKey=' + consentKey);
  },

  unlinkProject(url, consentKey, projectKey) {
    const data = { projectKey: projectKey };
    return axios.put(url + '/api/consent-group/unlinkAssociatedProjects?consentKey=' + consentKey, data);
  }
};

export const ClarificationRequest = {

  sendNewClarification(url, comment, issueId) {
    let data= new FormData();
    data.append('comment', comment);
    data.append('id', issueId);

    return axios.post(url, data);
  }
};

export const Files = {

  upload(url, files, projectKey, displayName, userName, newIssue = false) {
    let data = new FormData();

    files.forEach(file => {
      if (file.file != null) {
        data.append(file.fileKey, file.file, file.file.name);
      }
    });

    data.append('id', projectKey);
    data.append('displayName', displayName);
    data.append('userName', userName);
    data.append('isNewIssue', newIssue);

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
  },

  async getProjectType(url, projectKey) {
    let type = '';
    await axios.get(url + '/api/project/get-type?id=' + projectKey)
      .then(resp => type = resp.data.projectType)
      .catch(err => console.error(err));
    return type;
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

  deleteSuggestions(url, projectKey, type) {
    return axios.delete(url + '?projectKey=' + projectKey + '&type=' + type);
  },

  getSuggestions(serverURL, projectKey) {
    return axios.get(serverURL + '/api/issue-review?id=' + projectKey);
  },

  submitReview(serverURL, data) {
    return axios.post(serverURL + '/api/issue-review', data);
  },

  updateReview(serverURL, projectKey, data) {
    return axios.put(serverURL + '/api/issue-review?projectKey=' + projectKey, data);
  }

};

export const DUL = {
  generateRedirectLink(data, serverURL) {
    return axios.post(serverURL + '/api/dataUseLetter', data);
  },

  updateDUL(data, serverURL) {
    return axios.put(serverURL + '/api/dataUseLetter', data);
  },

  uploadDulPdf(uid, serverURL) {
    return axios.post(serverURL + '/api/dataUseLetter/pdf', uid)
  }
};
