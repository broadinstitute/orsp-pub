import React from 'react';
import ReactDOM from 'react-dom';
import ConsentGroupDocuments from './ConsentGroupDocuments';

 ReactDOM.render(
  <ConsentGroupDocuments
    attachmentsUrl = {consentGroupDocumentsComponent.attachmentsUrl}
    serverURL = {consentGroupDocumentsComponent.serverURL}
    userUrl = {consentGroupDocumentsComponent.userUrl}
    attachDocumentsUrl = {consentGroupDocumentsComponent.attachDocumentsUrl}
    projectKey = {consentGroupDocumentsComponent.projectKey}
    approveDocumentUrl = {consentGroupDocumentsComponent.approveDocumentUrl}
    rejectDocumentUrl = {consentGroupDocumentsComponent.rejectDocumentUrl}
    sessionUserUrl = {consentGroupDocumentsComponent.sessionUserUrl}
    downloadDocumentUrl = {consentGroupDocumentsComponent.downloadDocumentUrl}
  />,
  document.getElementById('consentGroupDocuments')
);
