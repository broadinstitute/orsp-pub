import React from 'react';
import ReactDOM from 'react-dom';
import NewConsentGroup from './NewConsentGroup';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';

ReactDOM.render(
  <ErrorHandler>
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
    />
  </ErrorHandler>,
  document.getElementById('newConsentGroup')
);
