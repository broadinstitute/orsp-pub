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
        isAdminUrl = {component.isAdminUrl}
        component = {component}
        downloadDocumentUrl = {component.downloadDocumentUrl}
      />,
    document.getElementById('projectDocument')
);
