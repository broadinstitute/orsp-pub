const context = component.contextPath;

export const UrlConstants = {
  getConsentGroupByUUID: context + '/api/consent-group/find-by-uuid',
  attachDocuments: '/api/files-helper/attach-document',
  consentNamesSearchURL: context + '/consent-group/name-search',
  createConsentGroupURL: context + '/api/consent-group/create',
  createProjectUrl: context + '/api/project',
  fillablePdfURL: context + '/api/consent-group/get-fillable-pdf',
  getUserUrl: context + '/api/user/authenticated',
  projectKeySearchUrl: context + '/search/project-key/autocomplete',
  sampleSearchUrl: context + '/consent-group/sample-search',
  rejectProjectUrl: context + '/api/project/reject',
  updateProjectUrl: context + '/api/project/update',
  issueReviewUrl: context + '/api/issue-review',
  addExtraPropertiesUrl: context + '/api/project/extra-properties',
  updateExtraPropertiesUrl: context + '/api/project/update-properties',
  clarificationUrl: context + '/api/clarification-request',
  searchUsersURL: context + '/search/matching-users',
  sourceDiseasesUrl: context + '/search/matching-diseases-ontologies',
  projectInfoURl: context + '/api/project/get-info',
  searchUrl: context + '/search/general-table-json',
  linkedSampleCollectionsUrl: context + '/api/consent-group/sample-collections',
  attachedDocumentsUrl : context + '/api/files-helper/attached-documents',
  rejectDocumentUrl: context + '/api/files-helper/reject-document',
  approveDocumentUrl: context + '/api/files-helper/approve-document',
  removeDocumentUrl: context + '/api/files-helper/delete',
  downloadDocumentUrl: context + '/api/user/authenticated/download-document',
  updateAdminOnlyPropsUrl: context + '/api/project/update-admin-props',
  saveCommentUrl: context + '/api/comments/save',
  getCommentsUrl: context + '/api/comments/list',

};

