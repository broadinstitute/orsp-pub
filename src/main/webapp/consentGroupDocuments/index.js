import React from 'react';
import ReactDOM from 'react-dom';
import ConsentGroupDocuments from './ConsentGroupDocuments';

 ReactDOM.render(
  <ConsentGroupDocuments
    attachmentsUrl = {component.attachmentsUrl}
    serverURL = {component.serverURL}
    userUrl = {component.userUrl}
    attachDocumentsUrl = {component.attachDocumentsUrl}
    projectKey = {component.projectKey}
    approveDocumentUrl = {component.approveDocumentUrl}
    rejectDocumentUrl = {component.rejectDocumentUrl}
    isAdminUrl = {component.isAdminUrl}
    downloadDocumentUrl = {component.downloadDocumentUrl}
  />,
  document.getElementById('consentGroupDocuments')
);
