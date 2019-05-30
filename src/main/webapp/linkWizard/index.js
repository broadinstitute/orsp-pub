import React from 'react';
import ReactDOM from 'react-dom';
import { LinkWizard } from './LinkWizard';
import ErrorHandler from '../components/ErrorHandler';


ReactDOM.render(
  <ErrorHandler>
    <LinkWizard />
  </ErrorHandler>,
  document.getElementById('linkWizard')
);
