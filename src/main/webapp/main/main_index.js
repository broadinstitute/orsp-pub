import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from "react-router-dom";
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';
import Main from "./Main";
import RolesManagement from "../rolesManagement/RolesManagement";
import { BrowserRouter } from 'react-router-dom';

// TODO: basename must be configured from application.yml contextPath
ReactDOM.render(
  <ErrorHandler>
    <BrowserRouter basename="/dev">
      <Switch>
        <Route exact path='/user/rolesManagement' render = {(routeProps) =>  <RolesManagement {...routeProps}/> }/>
        <Route exact path='/project/main' render = {(routeProps) => <Main {...routeProps}/> }/>
        <Route exact path='/newConsentGroup/main' render = {(routeProps) => <Main {...routeProps}/> }/>
      </Switch>
    </BrowserRouter>
  </ErrorHandler>,

  document.getElementById('main')
);
