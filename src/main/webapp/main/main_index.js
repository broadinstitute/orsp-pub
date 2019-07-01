import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from "react-router-dom";
import '../index.css';
import ErrorHandler from '../components/ErrorHandler';
import Main from "./Main";
import RolesManagement from "../rolesManagement/RolesManagement";
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <ErrorHandler>
    <BrowserRouter>
      <Switch>
        <Route exact path='/dev/user/rolesManagement' render = {(routeProps) =>  <RolesManagement {...routeProps}/> }/>
        <Route exact path='/dev/project/main' render = {(routeProps) => <Main {...routeProps}/> }/>
        <Route exact path='/dev/newConsentGroup/main' render = {(routeProps) => <Main {...routeProps}/> }/>
      </Switch>
    </BrowserRouter>
  </ErrorHandler>,

  document.getElementById('main')
);
