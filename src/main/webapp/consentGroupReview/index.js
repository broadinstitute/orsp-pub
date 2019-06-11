import React from 'react';
import ReactDOM from 'react-dom';
import ConsentGroupReview from './ConsentGroupReview';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';

ReactDOM.render(
  <ErrorHandler>
    <ConsentGroupReview
      consentKey = {consentGroupReviewComponent.consentKey}
      consentGroupUrl = {consentGroupReviewComponent.consentGroupUrl}
      approveConsentGroupUrl = {consentGroupReviewComponent.approveConsentGroupUrl}
      isAdminUrl = {consentGroupReviewComponent.isAdminUrl}
      rejectConsentUrl = {consentGroupReviewComponent.rejectConsentUrl}
      updateConsentUrl = {consentGroupReviewComponent.updateConsentUrl}
      projectKey = {consentGroupReviewComponent.projectKey}
    />
  </ErrorHandler>,
  document.getElementById('consentGroupReview')
);
