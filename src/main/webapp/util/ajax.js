import axios from 'axios';
import "regenerator-runtime/runtime";
import  { UrlConstants }  from './UrlConstants';
import isNil from 'lodash/isNil';
import fileDownload from 'js-file-download';

export const Search = {

  getMatchingQuery(query) {
    return axios.get(UrlConstants.userNameSearchUrl + '?term=' + query);
  },

  getSourceDiseases(query) {
    return axios.get(UrlConstants.sourceDiseasesUrl + '?term=' + query);
  },

  getMatchingPopulationOntologies(query) {
    return axios.get(UrlConstants.populationOntologiesUrl + '?term=' + query);
  },

  getMatchingIssues(query) {
    return axios.get(UrlConstants.matchingIssueUrl + '?term=' + query);
  },

  getMatchingUsers(query) {
    return axios.get(UrlConstants.userNameSearchUrl + '?term=' + query);
  },

  getMatchingProject(query) {
    return axios.get(UrlConstants.projectKeySearchUrl + '?term=' + query);
  },

  getORSPAdmins() {
    return axios.get(UrlConstants.orspAdminsSearchUrl);
  }
};

export const SampleCollections = {

  getSampleCollections(query) {
    return axios.get(UrlConstants.sampleSearchUrl + '?term=' + query);
  },

  getCollectionsCGLinked(consentKey) {
    return axios.get(UrlConstants.linkedSampleCollectionsUrl + '?consentKey=' + consentKey);
  },

  getMatchingCollections(query) {
    return axios.get(UrlConstants.matchingCollectionsUrl + '?term=' + query);
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
        const fileData = {
          fileName: file.file.name,
          fileDescription: file.fileDescription
        }
        data.append('fileData', JSON.stringify(fileData));
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

  getConsentGroup(consentKey) {
    return axios.get(UrlConstants.getConsentGroup + '?id=' + consentKey);
  },

  approve(consentKey, data) {
    return axios.post(UrlConstants.approveConsentGroupUrl + '?id=' + consentKey, data);
  },

  rejectConsent(consentKey) {
    return axios.delete(UrlConstants.rejectConsentUrl + '?consentKey=' + consentKey);
  },

  updateConsent(data, projectKey) {
    return axios.put(UrlConstants.updateConsentGroupUrl + '?consentKey=' + projectKey, data);
  },

  getConsentGroupByUUID(uuid) {
    return axios.get(UrlConstants.getConsentGroupByUUID + '?uuid=' + uuid);
  },

  sendEmailDul(consentKey, userName, recipients) {
    return axios.post(UrlConstants.emailDulUrl + '?consentKey=' + consentKey, {'userName': userName, 'recipients': recipients });
  },

  rollbackConsentGroup(urlRollback, consentKey) {
    return axios({url: urlRollback + '?consentKey=' + consentKey, method: 'DELETE'})
  },

  getUseRestriction(consentKey) {
    return axios.get(UrlConstants.useRestrictionUrl + '?consentKey=' + consentKey);
  },

  getExportedConsentGroup(consentKey) {
    return axios.get(UrlConstants.exportedConsentGroupUrl + '?consentKey=' + consentKey);
  },

  getConsentCollectionLinks(consentKey) {
    return axios.get(UrlConstants.associatedProjects + '?consentKey=' + consentKey);
  },

  unlinkProject(consentKey, projectKey) {
    const data = { projectKey: projectKey };
    return axios.put(UrlConstants.unlinkAssociatedProjects + '?consentKey=' + consentKey, data);
  },

  unlinkSampleCollection(consentCollectionId) {
    const data = { consentCollectionId };
    return axios.put(UrlConstants.unlinkAssociatedSampleCollection, data);
  },

  getProjectConsentGroups(projectKey) {
    return axios.get(UrlConstants.getProjectConsentGroupsUrl + '?projectKey=' + projectKey);
  },

  exportConsent(id) {
    return axios.post(UrlConstants.exportConsent + '?id=' + id);
  },

  getMatchingConsentByName(consentName) {
    return axios.get(UrlConstants.matchingName + '?consentName=' + consentName);
  },

  deleteNoReasonConsent(projectKey) {
    return axios.delete(UrlConstants.deleteNoReasonConsent + '?consentKey=' + projectKey);
  },

  hardDeleteConsentGroup(consentKey) {
    return axios.delete(UrlConstants.hardDeleteConsentGroup + '?consentKey=' + consentKey);
  }
};

export const ClarificationRequest = {

  sendNewClarification(comment, issueId, pm, consentKey) {
    let data= new FormData();
    data.append('comment', comment);
    data.append('id', issueId);
    data.append('pm', pm);
    data.append('consentKey', consentKey);
    if (consentKey !== undefined) {
      return axios.post(UrlConstants.clarificationCollectionUrl, data);
    } else {
      return axios.post(UrlConstants.clarificationUrl, data);
    }
  }
};

export const Files = {

  upload(files, projectKey, displayName, userName, newIssue = false) {
    let data = new FormData();

    files.forEach(file => {
      if (file.file != null) {
        data.append(file.fileKey, file.file, file.file.name);
        const fileData = {
          fileName: file.file.name,
          fileDescription: file.fileDescription
        }
        data.append('fileData', JSON.stringify(fileData));
      }
    });

    data.append('id', projectKey);
    data.append('displayName', displayName);
    data.append('userName', userName);
    data.append('isNewIssue', newIssue);

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };

    return axios.post(UrlConstants.attachDocuments, data, config);
  },

  getDocument(id) {
    return axios(UrlConstants.getDocumentById + '?id=' + id)
  },

  downloadFillable() {
    return axios({ url: UrlConstants.fillablePdfURL, method: 'GET', responseType: 'blob' });
  }

};

export const Project = {

  createProject(projectData, files, displayName, userName, reviewer) {
    let data = new FormData();
    files.forEach(file => {
      if (file.file != null) {
        data.append(file.fileKey, file.file, file.file.name);
        const fileData = {
          fileName: file.file.name,
          fileDescription: file.fileDescription
        };
        data.append('fileData', JSON.stringify(fileData));
      }
    });
    data.append('displayName', displayName);
    data.append('userName', userName);
    data.append('projectData', JSON.stringify(projectData));
    data.append('reviewer', reviewer)
    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };
    return axios.post(UrlConstants.createProjectUrl, data, config);
  },

  getProject(projectKey) {
    return axios.get(UrlConstants.projectInfoUrl + '?id=' + projectKey);
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

  updateProjectkey(data, projectKey) {
    return axios.put(UrlConstants.updateProjectkeyUrl + '?projectKey=' + projectKey, data);
  },

  updateAdminOnlyProps(data, projectKey) {
    return axios.put(UrlConstants.updateAdminOnlyPropsUrl + '?projectKey=' + projectKey, data);
  },

  async getProjectType(projectKey) {
    let type = '';
    await axios.get(UrlConstants.projectTypeUrl + '?id=' + projectKey)
      .then(resp => type = resp.data.projectType)
      .catch(err => console.error(err));
    return type;
  },

  getProjectByUser(assignee, max) {
    let maxParam = !isNil(max) ? '&max=' + max : ''
    return axios.get(UrlConstants.userProjectUrl + '?assignee=' + assignee + maxParam);
  },

  removeAssignedAdmin(projectKey) {
    return axios.delete(UrlConstants.removeAssignedAdmin + '?projectKey=' + projectKey);

  }
};

export const DocumentHandler = {
  approveDocument(uuid) {
    return axios.put(`${UrlConstants.approveDocumentUrl}?uuid=${uuid}`);
  },

  rejectDocument(uuid) {
    return axios.put(`${UrlConstants.rejectDocumentUrl}?uuid=${uuid}`);
  },

  attachedDocuments(issueKey) {
    return axios.get(`${UrlConstants.attachedDocumentsUrl}?issueKey=${issueKey}`);
  },

  delete(documentId) {
    return axios.delete(`${UrlConstants.removeDocumentUrl}?documentId=${documentId}`);
  },

  deleteAttachmentByUuid(fileUuid) {
    return axios.delete(`${UrlConstants.removeAttachmentByUuidUrl}?uuid=${fileUuid}`);
  }
};

export const User = {

  getUserSession() {
    return axios.get(UrlConstants.getUserUrl)
  },

  isAuthenticated() {
    return axios.get(UrlConstants.isAuthenticated)
  },

  getAllUsers(query) {
    return axios.get(UrlConstants.getAllUsersUrl, {
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

  editUserRole(userId, roles) {
    return axios.put(UrlConstants.editUserRoleUrl, {userId: userId, roles: roles});
  },

  signIn(token) {
    const config = {
      headers: { 'content-type': 'application/x-www-form-urlencoded' }
    };
    return axios.get(UrlConstants.authUserUrl + '?token=' + token);
  },

  signOut() {
    return axios.get(UrlConstants.signOutUrl);
  }
  
};

export const Organization = {

  getAllOrganizations(query) {
    return axios.get(UrlConstants.getAllOrganizationsUrl, {
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

  editOrganization(organizationId, name) {
    return axios.put(UrlConstants.editOrganizationUrl, {id: organizationId, name: name});
  },

  addOrganization(name) {
    return axios.post(UrlConstants.addOrganizationUrl, { name: name});
  },

  deleteOrganization(organizationId) {
    return axios.delete(UrlConstants.deleteOrganizationUrl, { params: {id: organizationId }});
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
    return axios.post(UrlConstants.saveCommentUrl + '?id=' + id, { comment:comment })
  },

  getComments(id) {
    return axios.get(UrlConstants.getCommentsUrl + '?id=' + id)
  },

  updateComment(commentData) {
    return axios.put(UrlConstants.updateComment, {id: commentData.id, comment: commentData.comment, author: commentData.author})
  },

  deleteComment(id) {
    return axios.put(UrlConstants.deleteComment, {id: id})
  }
};

export const DUL = {
  generateRedirectLink(data) {
    return axios.post(UrlConstants.dataUseLetterUrl, data);
  },

  updateDUL(data) {
    return axios.put(UrlConstants.dataUseLetterUrl, data);
  },

  createDulPdf(uid) {
    return axios.post(UrlConstants.saveDataUseLetterUrl, uid)
  },

  getDULInfo(uid) {
    return axios.get(UrlConstants.dulInfoUrl + '?id=' + uid)
  }
};

export const DataUse = {
  createRestriction(restriction) {
    return axios.post(UrlConstants.dataUseRestrictionUrl, restriction);
  },

  getRestriction(restrictionId) {
    return axios.get(UrlConstants.viewRestrictionUrl + '?id=' + restrictionId);
  },

  getRestrictions(query) {
    return axios.get(UrlConstants.showRestrictionsUrl, {
      params: {
        draw: 1,
        start: query.start,
        length: query.length,
        orderColumn: query.orderColumn,
        sortDirection: query.sortDirection,
        searchValue: query.searchValue
      }
    })
  }
};

export const ProjectInfoLink = {
  getProjectSampleCollections(cclId) {
    return axios.get(UrlConstants.infoLinkUrl + '?cclId=' + cclId);
  }
};

export const ConsentCollectionLink = {
  create(dataConsentCollection, files) {
    let data = new FormData();

    files.forEach(file => {
      if (file.file != null) {
        data.append(file.fileKey, file.file, file.file.name);
        const fileData = {
          fileName: file.file.name,
          fileDescription: file.fileDescription
        };
        data.append('fileData', JSON.stringify(fileData));
      }
    });
    data.append('dataConsentCollection', JSON.stringify(dataConsentCollection));
    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };
    return axios.post(UrlConstants.sampleConsentLinkUrl, data, config);
  },

  breakLink(projectKey, consentKey, actionKey) {
    return axios.post(UrlConstants.sampleBreakLinkUrl + '?projectKey='+ projectKey +"&consentKey=" + consentKey + "&type=" + actionKey);
  },

  submittedToIRBLink(projectKey, consentKey) {
    return axios.put(UrlConstants.sampleSubmitToIRBLinkURL + '?projectKey='+ projectKey +"&consentKey=" + consentKey);
  },

  approveLink(projectKey, consentKey) {
    return axios.put(UrlConstants.sampleApproveLinkUrl + '?projectKey='+ projectKey +"&consentKey=" + consentKey);
  },

  findCollectionLinks() {
    return axios.get(UrlConstants.collectionLinks);
  }
};

export const Reports = {
  getFundingsReports(query) {
    return axios.get(UrlConstants.fundingReportsUrl, {
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
  getReviewCategory(query) {
    return axios.get(UrlConstants.reviewCategoriesUrl, {
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
  getQaEventReport(tab) {
    return axios.get(UrlConstants.qaEventReportUrl, {
      params: {
        tab: tab
      }
    })
  },
  async getMetricsReport() {
    const resp = await axios.get(UrlConstants.metricsReportUrl);
    const blob = new Blob([resp.data], { type: 'text/plain' });
    fileDownload(blob, 'AAHRPPMetrics.csv');
  },
  getQaEventReportForProject(projectKey) {
    return axios.get(UrlConstants.qaEventReportForProjectUrl + '?projectKey=' + projectKey)
  },
  getCollectionLinksReport(query) {
    return axios.get(UrlConstants.getConsentCollectionLinks, {
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

  getComplianceReportData(startDate, endDate, projectType) {
    return axios.get(UrlConstants.complianceReportUrl + "?startDate=" + startDate + "&endDate=" + endDate + "&projectType=" + projectType);
  }
};

export const ProjectMigration = {

  getHistory(id) {
    return axios.get(UrlConstants.historyUrl + '?id=' + id);
  },

  getDisplaySubmissions(id) {
    return axios.get(UrlConstants.submissionDisplayUrl + '?id=' + id);
  },

  getSubmissionFormInfo(projectKey, type, submissionId) {
    if (submissionId === null) {
      return axios.get(UrlConstants.submissionInfoAddUrl + "?projectKey=" + projectKey + "&?type=" + type);
    } else {
      return axios.get(UrlConstants.submissionInfoAddUrl + "?projectKey=" + projectKey + "&type=" + type + "&submissionId=" + submissionId);
    }
  },

  saveSubmission(submissionData, files, submissionId) {
    let data = new FormData();

    files.forEach(file => {
      if (file.file != null) {
        const fileData = {
          fileType: file.fileType,
          name: file.fileName,
          fileDescription: file.fileDescription
        };
        data.append('files', file.file, file.fileName);
        data.append('fileTypes', JSON.stringify(fileData));
      }
    });
    data.append('submission', JSON.stringify(submissionData));

    const config = {
      headers: { 'content-type': 'multipart/form-data' }
    };
    if (submissionId === null) {
      return axios.post(UrlConstants.submissionSaveUrl, data, config);
    } else {
      return axios.post(UrlConstants.submissionSaveUrl + '?submissionId=' + submissionId, data, config);
    }
  },

  removeSubmissionFile(sumissionId, uuid) {
    return axios.delete(UrlConstants.submissionRemoveFileUrl + '?submissionId=' + sumissionId + "&uuid=" + uuid);
  },

  deleteSubmission(submissionId) {
    return axios.delete(UrlConstants.submissionsUrl + '?submissionId=' + submissionId);
  },

  getSubmissionValidateNumber(projectKey, type, number) {
    return axios.get(UrlConstants.submissionValidateNumberUrl + '?projectKey=' + projectKey + '&type=' + type + '&number=' + number);
  }
};

export const Issues = {
  getIssueList(assignee, max, admin) {
    return axios.get(UrlConstants.issueListUrl + '?assignee=' + assignee + '&max=' + max + '&admin=' + admin);
  },
};

export const LoginText = {
  getLoginText() {
    return axios.get(UrlConstants.loginTextUrl);
  },

  updateLoginText(heading, body, showMessage) {
    return axios.put(UrlConstants.editLoginTextUrl, {heading: heading, body: body, showMessage: showMessage});
  },

  getLoginTextResponse() {
    return axios.get(UrlConstants.LoginTextResponseUrl);
  }
};

export const DocumentDescription = {
  updateDocumentDescription(uuid, description, projectKey, creator, fileType) {
    return axios.put(UrlConstants.updateDocumentDescription, {uuid: uuid, description: description, projectKey: projectKey, creator: creator, fileType: fileType})
  }
};

export const Reviewer = {
  getReviewers() {
    return axios.get(UrlConstants.getReviewers)
  },

  addReviewer(data) {
    return axios.post(UrlConstants.addReviewer, data)
  },

  updateReviewer(data) {
    return axios.post(UrlConstants.updateReviewer, data)
  },

  removeReviewer(name) {
    return axios.get(UrlConstants.deleteReviewer + '?name=' + name)
  },

  getReviewerAssignedCount() {
    return axios.get(UrlConstants.getReviewerAssignedCount)
  },

  getReviewerProjectCount(userjson) {
    return axios.post(UrlConstants.getProjectCount, {json: userjson})
  },

  getDistinctiveReviewers() {
    return axios.get(UrlConstants.getDistinctiveReviewers)
  }
}