const context = process.env.NODE_ENV === 'test' ? 'http://localhost' : component.contextPath;

export const UrlConstants = {
  // Project
  createProjectUrl: context + '/api/project',
  projectInfoUrl: context + '/api/project/get-info',
  projectTypeUrl: context + '/api/project/get-type',
  rejectProjectUrl: context + '/api/project/reject',
  updateProjectUrl: context + '/api/project/update',
  addExtraPropertiesUrl: context + '/api/project/extra-properties',
  updateExtraPropertiesUrl: context + '/api/project/update-properties',
  updateAdminOnlyPropsUrl: context + '/api/project/update-admin-props',

  // Consent Group
  updateConsentGroupUrl: context + '/api/consent-group',
  rejectConsentUrl: context + '/api/consent-group/delete',
  associatedProjects: context + '/api/consent-group/associated-projects',
  unlinkAssociatedProjects: context + '/api/consent-group/unlink-associated-projects',
  unlinkAssociatedSampleCollection: context + '/api/consent-group/unlink-associated-sample-collection',
  getProjectConsentGroupsUrl: context + '/api/consent-group/getProjectConsentGroups',
  getConsentGroupByUUID: context + '/api/consent-group/find-by-uuid',
  createConsentGroupURL: context + '/api/consent-group/create',
  fillablePdfURL: context + '/api/consent-group/get-fillable-pdf',
  useRestrictionUrl: context + '/aip/consent-group/use-restriction',
  linkedSampleCollectionsUrl: context + '/api/consent-group/sample-collections',
  consentNamesSearchURL: context + '/consent-group/name-search',
  sampleSearchUrl: context + '/consent-group/sample-search',
  approveConsentGroupUrl: context + '/api/consent-group/approve',
  getConsentGroup: context + '/api/consent-group/review',
  uploadModalUrl: context + '/api/consent-group/upload-modal',
  allConsentGroupsUrl: context + '/api/consent-groups',

  // File related urls
  attachDocuments: context + '/api/files-helper/attach-document',
  attachedDocumentsUrl : context + '/api/files-helper/attached-documents',
  approveDocumentUrl: context + '/api/files-helper/approve-document',
  rejectDocumentUrl: context + '/api/files-helper/reject-document',
  removeDocumentUrl: context + '/api/files-helper/delete',
  removeAttachmentByUuidUrl: context + '/api/files-helper/remove-attachment',
  getDocumentById: context + '/api/files-helper/get-document',

  // Issue Review urls
  issueReviewUrl: context + '/api/issue-review',

  getUserUrl: context + '/api/user/authenticated/user-data',
  projectKeySearchUrl: context + '/search/project-key/autocomplete',
  clarificationUrl: context + '/api/clarification-request',
  clarificationCollectionUrl: context + '/api/clarification-request/collection',
  userNameSearchUrl: context + '/search/matching-users',
  sourceDiseasesUrl: context + '/search/matching-diseases-ontologies',
  searchUrl: context + '/search/general-table-json',

  downloadDocumentUrl: context + '/api/user/authenticated/download-document',
  saveCommentUrl: context + '/api/comments/save',
  getCommentsUrl: context + '/api/comments/list',
  saveExtraPropsUrl: context + '/api/project/extra-properties',
  emailDulUrl: context + '/api/dul-email-notification',
  editUserRoleUrl: context + '/api/edit-user-role',
  getAllUsersUrl: context + '/api/get-users',
  dataUseLetterUrl: context + '/api/data-use-letter',
  saveDataUseLetterUrl: context + '/api/data-use-letter/pdf',
  dataUseLetterRestrictionUrl: context + '/api/data-use-letter/restriction',
  infoLinkUrl: context + '/api/info-link',

  sampleConsentLinkUrl: context + '/api/sample-consent-link',
  sampleBreakLinkUrl: context + '/api/break-link',
  sampleApproveLinkUrl: context + '/api/approve-link',
  historyUrl: context + '/api/history',
  submissionsUrl: context + '/api/submissions',
  submissionDisplayUrl: context + '/api/submissions/display',
  newRestrictionUrl: context + '/api/data-use/new-restriction',
  reviewCategoriesUrl: context + '/api/report/review-categories',
  fundingReportsUrl: context + '/api/report/get-funding',
};

