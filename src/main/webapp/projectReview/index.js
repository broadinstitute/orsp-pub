import React from 'react';
import ReactDOM from 'react-dom';
import ProjectReview from './ProjectReview';
import '../index.css';

ReactDOM.render(
  <ProjectReview
    issue = {projectReviewValues.issue}
    projectKey = {projectReviewValues.projectKey}
    projectUrl = {projectReviewValues.projectUrl}
    addExtraPropUrl = {urls.saveExtraPropUrl}
    isAdmin = {projectReviewValues.isAdmin}
  />,
  document.getElementById('projectReview')
);
