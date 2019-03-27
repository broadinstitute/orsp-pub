import React from 'react';
import ReactDOM from 'react-dom';
import DataUseLetter from './DataUseLetter';
import DataUseLetterMessage from './DataUseLetterMessage';
import '../index.css';

function DUL(props) {
  const error = component.error;
  if (error !== undefined && error !== '') {
    return <DataUseLetterMessage error = {component.error}/>;
  }
  return  <DataUseLetter
                     serverUrl = {component.serverURL}
                     consentGroupUrl = {component.consentGroupUrl}
                     projectUrl = {component.projectUrl}
                     loadingImage = {component.loadingImage}
  />;
}

ReactDOM.render(
    <DUL isMessage={component.error}/>,
    document.getElementById('dataUseLetter')
);
