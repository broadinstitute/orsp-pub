import React from 'react';
import ReactDOM from 'react-dom';
import '../main/Main.css';
import '../index.css';

import ErrorHandler from '../components/ErrorHandler';
import Profile from "./Profile";

ReactDOM.render(
  <ErrorHandler>
    <Profile/>
  </ErrorHandler>,
  document.getElementById('profile')
);
