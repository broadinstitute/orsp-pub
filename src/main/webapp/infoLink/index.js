import React from 'react';
import ReactDOM from 'react-dom';
import InfoLink from './InfoLink';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';

ReactDOM.render(
  <ErrorHandler>
    <InfoLink
      serverURL = {component.serverURL}
      projectKey = {component.projectKey}
      consentKey = {component.consentKey}
      loadingImage = {component.loadingImage}
    />
  </ErrorHandler>,

  document.getElementById('infoLink')
);
