import React from 'react';
import ReactDOM from 'react-dom';
import DataUseLetter from './DataUseLetter';
import '../index.css';

ReactDOM.render(
    <DataUseLetter
        serverUrl = {dataUseLetterComponent.serverURL}
        consentGroupUrl = {dataUseLetterComponent.consentGroupUrl}
        projectUrl = {dataUseLetterComponent.projectUrl}
    />,
    document.getElementById('dataUseLetter')
);
