import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import AdminOnly from "./AdminOnly";

ReactDOM.render(
  <AdminOnly
    isAdmin = {adminOnlyComponent.isAdmin}
    loadingImage = {adminOnlyComponent.loadingImage}
    userSessionUrl = {adminOnlyComponent.userSessionUrl}
    projectKey = {adminOnlyComponent.projectKey}
    projectUrl = {adminOnlyComponent.projectUrl}
    updateProjectUrl = {adminOnlyComponent.updateProjectUrl}
  />,
  document.getElementById('adminOnly')
);
