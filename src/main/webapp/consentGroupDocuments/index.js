import React from 'react';
import ReactDOM from 'react-dom';
import ConsentGroupDocuments from './ConsentGroupDocuments';

 ReactDOM.render(
  <ConsentGroupDocuments
    attachmentsUrl = {component.attachmentsUrl}
    serverURL = {component.serverURL}
    user = {component.user}
    attachDocumentsUrl = {component.attachDocumentsUrl}
    projectKey = {component.projectKey}
    approveDocumentUrl = {component.approveDocumentUrl}
    rejectDocumentUrl = {component.rejectDocumentUrl}
    isAdmin = {component.isAdmin}
  />,
  document.getElementById('consentGroupDocuments')
);
