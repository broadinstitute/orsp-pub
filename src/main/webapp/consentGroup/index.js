import React from 'react';
import ReactDOM from 'react-dom';
import NewConsentGroup from './NewConsentGroup';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';

ReactDOM.render(
  <ErrorHandler>
    <NewConsentGroup
      serverURL = {component.serverURL}
      projectKey = {component.projectKey}
      loadingImage = {component.loadingImage}
      projectType = {component.projectType}
    />
  </ErrorHandler>,
  document.getElementById('newConsentGroup')
);
