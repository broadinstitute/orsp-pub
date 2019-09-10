import React from 'react';
import ReactDOM from 'react-dom';
import AboutPage from './AboutPage';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';

ReactDOM.render(
  <ErrorHandler>
    <AboutPage/>
  </ErrorHandler>,
    document.getElementById('about')
);
