import React from 'react';
import ReactDOM from 'react-dom';
import ConsentGroupReview from './ConsentGroupReview';
import '../index.css';

ReactDOM.render(
    <ConsentGroupReview
        consentKey = {consentGroupReviewComponent.consentKey}
        consentGroupUrl = {consentGroupReviewComponent.consentGroupUrl}
        approveConsentGroupUrl = {urls.approveConsentGroupUrl}
        isAdminUrl = {consentGroupReviewComponent.isAdminUrl}
        sampleSearchUrl = {consentGroupReviewComponent.sampleSearchUrl}
        rejectConsentUrl = {consentGroupReviewComponent.rejectConsentUrl}
        projectKey = {consentGroupReviewComponent.projectKey}
        serverURL = {consentGroupReviewComponent.serverURL}
    />,
    document.getElementById('consentGroupReview')
);
