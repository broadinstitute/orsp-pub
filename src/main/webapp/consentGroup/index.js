import React from 'react';
import ReactDOM from 'react-dom';
import NewConsentGroup from './NewConsentGroup';
import '../index.css';

ReactDOM.render(
    <NewConsentGroup
        getUserUrl = {component.getUserUrl}
        searchUsersURL = {component.searchUsersURL}
        sampleSearchUrl = {component.sampleSearchUrl}
        consentNamesSearchURL = {component.consentNamesSearchURL}
        attachDocumentsURL = {component.attachDocumentsURL}
        createConsentGroupURL = {component.createConsentGroupURL}
        serverURL = {component.serverURL}
        fillablePdfURL = {component.fillablePdfURL}
        projectKey = {component.projectKey}
        loadingImage = {component.loadingImage}
        projectType = {component.projectType}
        deleteConsentGroup = {component.deleteConsentGroup}
     />,
    document.getElementById('newConsentGroup')
);
