import React from 'react';
import ReactDOM from 'react-dom';
import NewProject from './NewProject';
import '../search//style.css';

ReactDOM.render(
    <NewProject
        user = {component.user}
     />,
    document.getElementById('pages')
);
