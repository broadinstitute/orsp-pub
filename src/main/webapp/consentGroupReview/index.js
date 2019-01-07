import React from 'react';
import ReactDOM from 'react-dom';
import ConsentGroupReview from './consentGroupReview';
import '../index.css';

ReactDOM.render(
    <ConsentGroupReview
        consentKey = {component.consentKey}
        consentGroupUrl = {component.consentGroupUrl}
    />,
    document.getElementById('consentGroupReview')
);