import React from 'react';
import ReactDOM from 'react-dom';
import DataUseLetter from './DataUseLetter';
import DataUseLetterMessage from './DataUseLetterMessage';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';

function DUL(props) {
  const error = component.error;
  if (error !== undefined && error !== '') {
    return <DataUseLetterMessage error = {component.error}/>;
  } else {
    return <ErrorHandler>
      <DataUseLetter
        serverUrl = {component.serverURL}
        loadingImage = {component.loadingImage}
      />
    </ErrorHandler>;
  }
}

ReactDOM.render(
  <DUL isMessage={component.error}/>,
  document.getElementById('dataUseLetter')
);
