import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';
import RolesManagement from "./RolesManagement";
import ConsentGroupReview from "../consentGroupReview/ConsentGroupReview";

ReactDOM.render(
  <ErrorHandler>
    <RolesManagement
      loadingImage = {component.loadingImage}
    />
  </ErrorHandler>,
  document.getElementById('rolesManagement')
);
