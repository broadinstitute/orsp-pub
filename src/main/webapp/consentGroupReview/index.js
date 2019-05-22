import React from 'react';
import ReactDOM from 'react-dom';
import ConsentGroupReview from './ConsentGroupReview';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';

ReactDOM.render(
  <ErrorHandler>
    <ConsentGroupReview
      consentKey={consentGroupReviewComponent.consentKey}
      consentGroupUrl={consentGroupReviewComponent.consentGroupUrl}
      approveConsentGroupUrl={consentGroupReviewComponent.approveConsentGroupUrl}
      isAdminUrl={consentGroupReviewComponent.isAdminUrl}
      isViewer={consentGroupReviewComponent.isViewer}
      sampleSearchUrl={consentGroupReviewComponent.sampleSearchUrl}
      rejectConsentUrl={consentGroupReviewComponent.rejectConsentUrl}
      updateConsentUrl={consentGroupReviewComponent.updateConsentUrl}
      projectKey={consentGroupReviewComponent.projectKey}
      serverURL={consentGroupReviewComponent.serverURL}
      discardReviewUrl={consentGroupReviewComponent.discardReviewUrl}
      consentNamesSearchURL={consentGroupReviewComponent.consentNamesSearchURL}
      clarificationUrl={consentGroupReviewComponent.clarificationUrl}
      loadingImage={consentGroupReviewComponent.loadingImage}
    />
  </ErrorHandler>,
  document.getElementById('consentGroupReview')
);
