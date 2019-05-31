import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';
import Main from "./Main";

ReactDOM.render(
  <ErrorHandler>
    <Main/>
  </ErrorHandler>,

  document.getElementById('main')
);
