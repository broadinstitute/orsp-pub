import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

ReactDOM.render(
    <BrowserRouter basename= {component.contextPath}>
      <App/>
    </BrowserRouter>,
  document.getElementById('main')
);
