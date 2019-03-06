import React from 'react';
import ReactDOM from 'react-dom';
import NewProject from './NewProject';
import '../index.css';

ReactDOM.render(
    <NewProject
        getUserUrl = {component.getUserUrl}
        searchUsersURL = {component.searchUsersURL}
        attachDocumentsURL = {component.attachDocumentsURL}
        createProjectURL = {component.createProjectURL}
        serverURL = {component.serverURL}
        loadingImage = {component.loadingImage}
        deleteProject = {component.deleteProject}
     />,
    document.getElementById('project')
);
