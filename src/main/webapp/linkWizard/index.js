import React from 'react';
import ReactDOM from 'react-dom';
import  { LinkWizard } from './LinkWizard';


ReactDOM.render(
  <LinkWizard
    loadingImage = {component.loadingImage}
    consentNamesSearchURL = {component.consentNamesSearchURL}
    sampleSearchUrl = {component.sampleSearchUrl}
    getConsentGroups = {component.getConsentGroups}
    serverURL = {component.serverURL}
    getUserUrl = {component.getUserUrl}
    projectKey = {component.projectKey}
    unConsentedSampleCollections = {component.unConsentedSampleCollections}
    getConsentGroupSampleCollections = {component.getConsentGroupSampleCollections}
  />,
  document.getElementById('linkWizard')
);
