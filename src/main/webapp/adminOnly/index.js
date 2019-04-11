import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import AdminOnly from "./AdminOnly";

ReactDOM.render(
  <AdminOnly
    isAdmin = {adminOnlyComponent.isAdmin}
    loadingImage = {adminOnlyComponent.loadingImage}
  />,
  document.getElementById('adminOnly')
);
