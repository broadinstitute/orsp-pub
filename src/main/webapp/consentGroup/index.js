import React from 'react';
import ReactDOM from 'react-dom';
import NewConsentGroup from './NewConsentGroup';
import '../index.css';

ReactDOM.render(
    <NewConsentGroup
        user = {component.user}
        searchUsersURL = {component.searchUsersURL}
        sampleSearchUrl = {component.sampleSearchUrl}
        consentNamesSearchURL = {component.consentNamesSearchURL}
        attachDocumentsURL = {component.attachDocumentsURL}
        createProjectURL = {component.createProjectURL}
        serverURL = {component.serverURL}
     />,
    document.getElementById('newConsentGroup')
);
