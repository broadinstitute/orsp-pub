import React from 'react';
import ReactDOM from 'react-dom';
import '../main/Main.css';
import '../index.css';

import ErrorHandler from '../components/ErrorHandler';
import AboutPage from "./AboutPage";

ReactDOM.render(
  <ErrorHandler>
    <AboutPage/>
  </ErrorHandler>,
  document.getElementById('about')
);
