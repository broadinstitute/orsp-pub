import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';
import { BrowserRouter } from 'react-router-dom';
import App from "./App";

ReactDOM.render(
  <ErrorHandler>
    <BrowserRouter basename= {component.contextPath}>
      <App props={{}}/>
    </BrowserRouter>
  </ErrorHandler>,

  document.getElementById('main')
);
