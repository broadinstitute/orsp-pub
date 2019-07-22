import axios from 'axios';
import "regenerator-runtime/runtime";

export const Search = {

  getMatchingQuery(url, query) {
    return axios.get(url + '?term=' + query);
  }

};

export const SampleCollections = {

  getSampleCollections(url, query) {
    return axios.get(url + '?term=' + query);
  },

  getCollectionsCGLinked(url, consentKey) {
    return axios.get(url + '?consentKey=' + consentKey);
  }
};

export const ConsentGroup = {
  getConsentGroupNames(url) {
    return axios.get(url);
  },

  create(url, dataProject, dataConsentCollection, files, displayName, userName) {
    let data = new FormData();

    files.forEach(file => {
      if (file.file != null) {
        data.append(file.fileKey, file.file, file.file.name);
      }
    });

    data.append('displayName', displayName);
    data.append('userName', userName);
    data.append('dataProject', JSON.stringify(dataProject));
    data.append('dataConsentCollection', JSON.stringify(dataConsentCollection))
    const config = {
      headers: { 'content-type': 'multipart/form-data' }
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
  },

  unlinkSampleCollection(url, consentCollectionId) {
    const data = { consentCollectionId };
    return axios.put(url + '/api/consent-group/unlinkAssociatedSampleCollection', data);
  }
};

export const ClarificationRequest = {

  sendNewClarification(url, comment, issueId, pm, consentKey) {
    let data= new FormData();
    data.append('comment', comment);
    data.append('id', issueId);
    data.append('pm', pm)
    data.append('consentKey', consentKey)
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

    return axios.post(url +'/api/files-helper/attach-document', data, config);
  },

  downloadFillable(pdfUrl) {
    return axios({ url: pdfUrl, method: 'GET', responseType: 'blob' });
  }

};

export const Project = {

  createProject(url, dataProject, files, displayName, userName) {
    let data = new FormData();
    files.forEach(file => {
      if (file.file != null) {
        data.append(file.fileKey, file.file, file.file.name);
      }
    });
    data.append('displayName', displayName);
    data.append('userName', userName);
    data.append('dataProject', JSON.stringify(dataProject));
    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };
    return axios.post(url, data, config);
  },

  getProject(url, projectkey) {
    return axios.get(url + '?id=' + projectkey);
  },

  addExtraProperties(url, projectKey, data) {
    return axios.post(url + '/project/modifyExtraProperties?id=' + projectKey, data);
  },

  rejectProject(url, projectKey) {
    return axios.delete(url + '?projectKey=' + projectKey);
  },

  updateProject(url, data, projectKey) {
    return axios.put(url + '?projectKey=' + projectKey, data);
  },

  updateAdminOnlyProps(url, data, projectKey) {
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
    return axios.put(`${url}/api/files-helper/reject-document?uuid=${uuid}`);
  },

   attachedDocuments(url, issueKey) {
    return axios.get(`${url}?issueKey=${issueKey}`);
  },

  delete(url, documentId) {
    return axios.delete(`${url}?documentId=${documentId}`);
  }
};

export const User = {

  getUserSession(url) {
    return axios.get(url)
  },

  getAllUsers(serverUrl, query) {
    return axios.get(serverUrl + '/api/get-users', {
      params: {
        draw: 1,
        start: query.start,
        length: query.length,
        orderColumn: query.orderColumn,
        sortDirection: query.sortDirection,
        searchValue: query.searchValue
      }
    })
  },

  editUserRole(serverUrl, userId, roles) {
    return axios.put(`${serverUrl}/api/edit-user-role`, {userId: userId, roles: roles});
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
  },

  addComments(id, comment) {
    return axios.post(component.serverURL + '/api/addComment?id=' + id, { comment:comment })
  },

  getComments(id) {
    return axios.get(component.serverURL + '/api/commentsList?id=' + id)
  }
};

export const DUL = {
  generateRedirectLink(data, serverURL) {
    return axios.post(serverURL + '/api/dataUseLetter', data);
  },

  updateDUL(data, serverURL) {
    return axios.put(serverURL + '/api/dataUseLetter', data);
  },

  createDulPdf(uid, serverURL) {
    return axios.post(serverURL + '/api/dataUseLetter/pdf', uid)
  }
};

export const DataUse = {
  createRestriction(serverURL, restriction) {
    return axios.post(serverURL + '/api/dataUseLetter/restriction', restriction);
  }  
};

export const ProjectInfoLink = {
  getProjectSampleCollections(cclId, serverURL) {
    return axios.get(serverURL + '/api/infoLink?cclId=' + cclId);
  }
};

export const ConsentCollectionLink = {
  create(serverUrl, dataConsentCollection, files) {
    let data = new FormData();

    files.forEach(file => {
      if (file.file != null) {
        data.append(file.fileKey, file.file, file.file.name);
      }
    });
    data.append('dataConsentCollection', JSON.stringify(dataConsentCollection))
    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };
    return axios.post(serverUrl + '/api/sample-consent-link', data, config);
  },

  breakLink(projectKey, consentKey, actionKey) {
    return axios.post(component.serverURL + '/api/break-link?projectKey='+ projectKey +"&consentKey=" + consentKey + "&type=" + actionKey);
  },

  approveLink(projectKey, consentKey) {
    return axios.put(component.serverURL + '/api/approve-link?projectKey='+ projectKey +"&consentKey=" + consentKey);
  }
};

export const ProjectMigration = {

  getConsentGroups(url, id) {
    return axios.get(url + "/api/consent-groups?id=" + id);
  },

  getHistory(url, id) {
    return axios.get(url + "/api/history?id=" + id);
  },

  getSubmissions(url, id) {
    return axios.get(url + "/api/submissions?id=" + id);
  }
};

export const Report = {
  getReviewCategory(id) {
    return axios.get(component.serverURL + "/api/report/review-categories");
  }
};
