import React from 'react';
import ReactDOM from 'react-dom';
import NewProject from './NewProject';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';

ReactDOM.render(
  <ErrorHandler>
    <NewProject
        searchUsersURL = {component.searchUsersURL}
        attachDocumentsURL = {component.attachDocumentsURL}
        serverURL = {component.serverURL}
        loadingImage = {component.loadingImage}
     />
  </ErrorHandler>,    
    document.getElementById('project')
);
