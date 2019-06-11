import React from 'react';
import ReactDOM from 'react-dom';
import ProjectReview from './ProjectReview';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';

ReactDOM.render(
  <ErrorHandler>
    <ProjectReview
      issue = {projectReviewValues.issue}
      searchUsersURL = {projectReviewValues.searchUsersURL}
      projectKey = {projectReviewValues.projectKey}
      projectUrl = {projectReviewValues.projectUrl}
      addExtraPropUrl = {urls.saveExtraPropUrl}
      isViewer = {projectReviewValues.isViewer}
      serverURL = {projectReviewValues.serverURL}
      rejectProjectUrl = {projectReviewValues.rejectProjectUrl}
      updateProjectUrl = {projectReviewValues.updateProjectUrl}
      discardReviewUrl = {projectReviewValues.discardReviewUrl}
      clarificationUrl = {projectReviewValues.clarificationUrl}
      loadingImage = {projectReviewValues.loadingImage}
    />
  </ErrorHandler>,
  document.getElementById('projectReview')
);
