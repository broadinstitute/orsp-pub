import React from 'react';
import ReactDOM from 'react-dom';
import NewProject from './NewProject';
import '../index.css';

ReactDOM.render(
    <NewProject
        user = {component.user}
        searchUsersURL = {component.searchUsersURL}
        attachDocumentsURL = {component.attachDocumentsURL}
        createProjectURL = {component.createProjectURL}
        serverURL = {component.serverURL}
     />,
    document.getElementById('project')
);
