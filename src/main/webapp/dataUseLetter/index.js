import React from 'react';
import ReactDOM from 'react-dom';
import DataUseLetter from './DataUseLetter';
import DataUseLetterMessage from './DataUseLetterMessage';
import '../index.css';

function DUL(props) {
  const error = dataUseLetterComponent.error;
  if (error !== undefined && error !== '') {
    return <DataUseLetterMessage error = {dataUseLetterComponent.error}/>;
  }
  return  <DataUseLetter
                     serverUrl = {dataUseLetterComponent.serverURL}
                     consentGroupUrl = {dataUseLetterComponent.consentGroupUrl}
                     projectUrl = {dataUseLetterComponent.projectUrl}
                     loadingImage = {dataUseLetterComponent.loadingImage}
  />;
}

ReactDOM.render(
    <DUL isMessage={dataUseLetterComponent.error}/>,
    document.getElementById('dataUseLetter')
);
