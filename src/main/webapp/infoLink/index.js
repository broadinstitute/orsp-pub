import React from 'react';
import ReactDOM from 'react-dom';
import InfoLink from './InfoLink';
import '../index.css';

ReactDOM.render(
  <InfoLink
    serverURL = {component.serverURL}
    projectKey = {component.projectKey}
    consentKey = {component.consentKey}
    sampleCollectionId = {component.sampleCollectionId}
    loadingImage = {component.loadingImage}
  />,
  document.getElementById('infoLink')
);
