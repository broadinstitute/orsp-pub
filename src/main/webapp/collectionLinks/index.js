import React from 'react';
import ReactDOM from 'react-dom';
import CollectionLinks from './CollectionLinks'
import './style.css';

ReactDOM.render(
    <CollectionLinks
        cclPostUrl = {component.cclPostUrl}
        cclSummariesUrl = {component.cclSummariesUrl}
        consentKeySearchUrl = {component.consentKeySearchUrl}
        projectKeySearchUrl = {component.projectKeySearchUrl}
        sampleSearchUrl = {component.sampleSearchUrl}
    />,
    document.getElementById('app')
);
