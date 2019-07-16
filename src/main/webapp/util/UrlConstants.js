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
  searchUsersURL: context + ''

};

