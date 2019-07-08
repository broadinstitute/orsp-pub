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
    <BrowserRouter basename= {component.contextPath}>
      <Switch>
        <Route path= {"/user/rolesManagement"} render = {(routeProps) =>  <RolesManagement {...routeProps}/> }/>
        <Route path= {"/project/main"} render = {(routeProps) => <Main {...routeProps}/> }/>
        <Route path= {"/newConsentGroup/main"} render = {(routeProps) => <Main {...routeProps}/> }/>
      </Switch>
    </BrowserRouter>
  </ErrorHandler>,

  document.getElementById('main')
);
