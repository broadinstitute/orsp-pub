import React from 'react';
import ReactDOM from 'react-dom';
import ProjectReview from './ProjectReview';
import '../index.css';

ReactDOM.render(
  <ProjectReview
    issue = {component.issue}
    projectKey = {component.projectKey}
    projectUrl = {component.projectUrl}
  />,
  document.getElementById('projectReview')
);