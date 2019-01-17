import React from 'react';
import ReactDOM from 'react-dom';
import ProjectReview from './ProjectReview';
import '../index.css';

ReactDOM.render(
  <ProjectReview
    issue = {component.issue}
    searchUsersURL = {component.searchUsersURL}
    projectKey = {component.projectKey}
    projectUrl = {component.projectUrl}
    addExtraPropUrl = {urls.saveExtraPropUrl}
    isAdmin = {component.isAdmin}
  />,
  document.getElementById('projectReview')
);
