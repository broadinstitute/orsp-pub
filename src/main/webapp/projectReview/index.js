import React from 'react';
import ReactDOM from 'react-dom';
import ProjectReview from './ProjectReview';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';

ReactDOM.render(
  <ErrorHandler>
    <ProjectReview/>
  </ErrorHandler>,
  document.getElementById('projectReview')
);
