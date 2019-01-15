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
        isAdmin = {component.isAdmin}
        component = {component}
        user = {component.user}
      />,
    document.getElementById('projectDocument')
);
