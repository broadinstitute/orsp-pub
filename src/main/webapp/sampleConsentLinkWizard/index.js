import React from 'react';
import ReactDOM from 'react-dom';
import  { SampleConsentLinkWizard } from './SampleConsentLinkWizard';


ReactDOM.render(
  <SampleConsentLinkWizard
    loadingImage = { component.loadingImage }
    consentNamesSearchURL = { component.consentNamesSearchURL }
    sampleSearchUrl = { component.sampleSearchUrl }
  />,
  document.getElementById('sampleConsentLinkWizard')
);
