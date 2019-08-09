import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';
import { BrowserRouter } from 'react-router-dom';
import Routes from "./Routes";

ReactDOM.render(
  <ErrorHandler>
    <BrowserRouter basename= {component.contextPath}>
      <Routes props={{}}/>
    </BrowserRouter>
  </ErrorHandler>,

  document.getElementById('main')
);
