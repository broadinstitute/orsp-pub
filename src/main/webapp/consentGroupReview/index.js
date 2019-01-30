import React from 'react';
import ReactDOM from 'react-dom';
import ConsentGroupReview from './ConsentGroupReview';
import '../index.css';

ReactDOM.render(
    <ConsentGroupReview
        consentKey = {consentGroupReviewComponent.consentKey}
        consentGroupUrl = {consentGroupReviewComponent.consentGroupUrl}
        approveConsentGroupUrl = {consentGroupReviewComponent.approveConsentGroupUrl}
        isAdminUrl = {consentGroupReviewComponent.isAdminUrl}
        sampleSearchUrl = {consentGroupReviewComponent.sampleSearchUrl}
        rejectConsentUrl = {consentGroupReviewComponent.rejectConsentUrl}
        updateConsentUrl = {consentGroupReviewComponent.updateConsentUrl}
        projectKey = {consentGroupReviewComponent.projectKey}
        serverURL = {consentGroupReviewComponent.serverURL}
        discardReviewUrl = {consentGroupReviewComponent.discardReviewUrl}
    />,
    document.getElementById('consentGroupReview')
);
