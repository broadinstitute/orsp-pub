import React from 'react';
import ReactDOM from 'react-dom';
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';
import ReviewCategories from "./ReviewCategories";

ReactDOM.render(
  <ErrorHandler>
    <ReviewCategories/>
  </ErrorHandler>,
  document.getElementById('reviewCategories')
);
