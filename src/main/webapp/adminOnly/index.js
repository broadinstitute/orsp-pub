import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import AdminOnly from "./AdminOnly";
import ErrorHandler from '../components/ErrorHandler';

ReactDOM.render(
  <ErrorHandler>
    <AdminOnly
      isAdmin={adminOnlyComponent.isAdmin}
      loadingImage={adminOnlyComponent.loadingImage}
      userSessionUrl={adminOnlyComponent.userSessionUrl}
      projectKey={adminOnlyComponent.projectKey}
      projectUrl={adminOnlyComponent.projectUrl}
      updateAdminOnlyPropsUrl={adminOnlyComponent.updateAdminOnlyPropsUrl}
    />
  </ErrorHandler>,
  document.getElementById('adminOnly')
);
