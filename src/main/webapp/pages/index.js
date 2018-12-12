import React from 'react';
import ReactDOM from 'react-dom';
import NewProject from './NewProject';
import '../index.css';

ReactDOM.render(
    <NewProject
        user = {component.user}
     />,
    document.getElementById('pages')
);
