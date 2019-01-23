import React from 'react';
import ReactDOM from 'react-dom';
import ProjectReview from './ProjectReview';
import '../index.css';

ReactDOM.render(
  <ProjectReview
    issue = {projectReviewValues.issue}
    searchUsersURL = {projectReviewValues.searchUsersURL}
    projectKey = {projectReviewValues.projectKey}
    projectUrl = {projectReviewValues.projectUrl}
    addExtraPropUrl = {urls.saveExtraPropUrl}
    isAdmin = {projectReviewValues.isAdmin}
    serverURL = {projectReviewValues.serverURL}
    rejectProjectUrl = {projectReviewValues.rejectProjectUrl}
  />,
  document.getElementById('projectReview')
);
