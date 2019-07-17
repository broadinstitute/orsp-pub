import axios from 'axios';
import "regenerator-runtime/runtime";
import  { UrlConstants }  from './UrlConstants';

export const Search = {

  getMatchingQuery(query) {
    return axios.get(UrlConstants.searchUsersURL + '?term=' + query);
  },

  getSourceDiseases(query) {
    return axios.get(UrlConstants.sourceDiseasesUrl + '?term=' + query);
  }

};

export const SampleCollections = {

  getSampleCollections(query) {
    return axios.get(UrlConstants.sampleSearchUrl + '?term=' + query);
  },

  getCollectionsCGLinked(consentKey) {
    return axios.get(UrlConstants.linkedSampleCollectionsUrl + '?consentKey=' + consentKey);
  }
};

export const ConsentGroup = {
  getConsentGroupNames() {
    return axios.get(UrlConstants.consentNamesSearchURL);
  },

  create(dataProject, dataConsentCollection, files, displayName, userName) {
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

    return axios.post(UrlConstants.createConsentGroupURL, data, config);
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

  getConsentGroupByUUID(uuid) {
    return axios.get(UrlConstants.getConsentGroupByUUID + '?uuid=' + uuid);
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

  sendNewClarification(comment, issueId, pm, consentKey) {
    let data= new FormData();
    data.append('comment', comment);
    data.append('id', issueId);
    data.append('pm', pm);
    data.append('consentKey', consentKey);
    return axios.post(UrlConstants.clarificationUrl, data);
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

    return axios.post(url + UrlConstants.attachDocuments, data, config);
  },

  downloadFillable() {
    return axios({ url: UrlConstants.fillablePdfURL, method: 'GET', responseType: 'blob' });
  }

};

export const Project = {

  createProject(dataProject, files, displayName, userName) {
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
    return axios.post(UrlConstants.createProjectUrl, data, config);
  },

  getProject(projectKey) {
    return axios.get(UrlConstants.projectInfoURl + '?id=' + projectKey);
  },

  addExtraProperties(projectKey, data) {
    return axios.post(UrlConstants.addExtraPropertiesUrl + '?id=' + projectKey, data);
  },

  rejectProject(projectKey) {
    return axios.delete(UrlConstants.rejectProjectUrl + '?projectKey=' + projectKey);
  },

  updateProject(data, projectKey) {
    return axios.put(UrlConstants.updateProjectUrl + '?projectKey=' + projectKey, data);
  },

  updateAdminOnlyProps(data, projectKey) {
    return axios.put(UrlConstants.updateAdminOnlyPropsUrl + '?projectKey=' + projectKey, data);
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
  approveDocument(uuid) {
    return axios.put(`${UrlConstants.approveDocumentUrl}?uuid=${uuid}`);
  },

   rejectDocument(uuid) {
    return axios.put(`${UrlConstants.rejectDocumentUrl}?uuid=${uuid}`);
  },

   attachedDocuments(url, issueKey) {
    return axios.get(`${UrlConstants.attachedDocumentsUrl}?issueKey=${issueKey}`);
  },

  delete(documentId) {
    return axios.delete(`${UrlConstants.rejectDocumentUrl}?documentId=${documentId}`);
  }
};

export const User = {

  getUserSession() {
    return axios.get(UrlConstants.getUserUrl)
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

  deleteSuggestions(projectKey, type) {
    return axios.delete(UrlConstants.issueReviewUrl + '?projectKey=' + projectKey + '&type=' + type);
  },

  getSuggestions(projectKey) {
    return axios.get( UrlConstants.issueReviewUrl +'?id=' + projectKey);
  },

  submitReview(data) {
    return axios.post(UrlConstants.issueReviewUrl, data);
  },

  updateReview(projectKey, data) {
    return axios.put(UrlConstants.issueReviewUrl + '?projectKey=' + projectKey, data);
  },

  addComments(id, comment) {
    return axios.post(component.serverURL + '/api/addComment?id=' + id, { comment:comment })
  },

  getComments(id) {
    return axios.get(UrlConstants.getCommentsUrl + '?id=' + id)
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
