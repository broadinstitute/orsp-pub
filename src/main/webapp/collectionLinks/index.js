import React from 'react';
import ReactDOM from 'react-dom';
import CollectionLinks from './CollectionLinks'
import './style.css';
import ErrorHandler from '../components/ErrorHandler';

ReactDOM.render(
  <ErrorHandler>
    <CollectionLinks
      cclPostUrl = {component.cclPostUrl}
      cclSummariesUrl = {component.cclSummariesUrl}
      consentKeySearchUrl = {component.consentKeySearchUrl}
      projectKeySearchUrl = {component.projectKeySearchUrl}
    />,
  </ErrorHandler>,
  document.getElementById('app')
);
