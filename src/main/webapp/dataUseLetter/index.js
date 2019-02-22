import React from 'react';
import ReactDOM from 'react-dom';
import DataUseLetter from './DataUseLetter';
<<<<<<< HEAD
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
          />;
}

ReactDOM.render(
    <DUL isMessage={dataUseLetterComponent.error}/>,
=======
import '../index.css';

ReactDOM.render(
    <DataUseLetter
        serverUrl = {dataUseLetterComponent.serverURL}
        consentGroupUrl = {dataUseLetterComponent.consentGroupUrl}
        projectUrl = {dataUseLetterComponent.projectUrl}
    />,
>>>>>>> 2007ba4e0c39babfeb0cf35bc1f530d4bf642934
    document.getElementById('dataUseLetter')
);
