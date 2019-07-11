import React from "react";
import { Switch, Route } from "react-router-dom";
import RolesManagement from "../rolesManagement/RolesManagement";
import Main from "./Main";
import FundingsSourceReport from "../fundingSourceReport/FundingsSourceReport";

const Routes = ( props ) => (
  <Switch>
    <Route path= {"/user/rolesManagement"} render = {(routeProps) =>  <RolesManagement {...routeProps} {...props}/> }/>
    <Route path= {"/project/main"} render = {(routeProps) => <Main {...routeProps} {...props}/> }/>
    <Route path= {"/newConsentGroup/main"} render = {(routeProps) => <Main {...routeProps} {...props}/> }/>
    <Route path={"/admin/fundingReport"} render = {(routeProps)=> <FundingsSourceReport {...routeProps} {...props}/>}/>

  </Switch>
);

export default Routes;
