import React from 'react';
import ReactDOM from 'react-dom';
import  SampleConsentLinkWizard  from './SampleConsentLinkWizard';


ReactDOM.render(
  <SampleConsentLinkWizard
    loadingImage = { sampleConsentLink.loadingImage }
    consentNamesSearchURL = { sampleConsentLink.consentNamesSearchURL }
    sampleSearchUrl = { sampleConsentLink.sampleSearchUrl }
  />,
  document.getElementById('sampleConsentLinkWizard')
);
