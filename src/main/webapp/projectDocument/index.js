import React from 'react';
import ReactDOM from 'react-dom';
import ProjectDocument from './ProjectDocument';
import '../index.css';


 ReactDOM.render(
    <ProjectDocument
        projectKey = {component.projectKey}
        attachDocumentsUrl = {component.attachDocumentsUrl}
        attachedDocumentsUrl = {component.attachedDocumentsUrl}
        approveDocumentUrl = {component.approveDocumentUrl}
        rejectDocumentUrl = {component.rejectDocumentUrl}
        sessionUserUrl = {component.sessionUserUrl}
        component = {component}
        downloadDocumentUrl = {component.downloadDocumentUrl}
        loadingImage = {component.loadingImage}
      />,
    document.getElementById('projectDocument')
);
