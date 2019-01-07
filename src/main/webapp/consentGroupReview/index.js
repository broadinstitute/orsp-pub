import React from 'react';
import ReactDOM from 'react-dom';
import ConsentGroupReview from './ConsentGroupReview';
import '../index.css';

ReactDOM.render(
    <ConsentGroupReview
        consentKey = {component.consentKey}
        consentGroupUrl = {component.consentGroupUrl}
    />,
    document.getElementById('consentGroupReview')
);