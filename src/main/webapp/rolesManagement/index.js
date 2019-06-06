import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';
import RolesManagement from "./RolesManagement";

ReactDOM.render(
  <ErrorHandler>
    <RolesManagement
      loadingImage = {component.loadingImage}
    />
  </ErrorHandler>,
  document.getElementById('rolesManagement')
);
