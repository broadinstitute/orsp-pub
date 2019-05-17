import React from 'react';
import ReactDOM from 'react-dom';
import InfoLink from './InfoLink';
import '../index.css';

ReactDOM.render(
  <InfoLink
    projectKey = {component.projectKey}
    consentKey = {component.consentKey}
    loadingImage = {component.loadingImage}
  />,
  document.getElementById('infoLink')
);