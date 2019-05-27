import React from 'react';
import ReactDOM from 'react-dom';
import { LinkWizard } from './LinkWizard';
import ErrorHandler from '../components/ErrorHandler';


ReactDOM.render(
  <ErrorHandler>
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
    />
  </ErrorHandler>,
  document.getElementById('linkWizard')
);
