import React from "react";
import { Switch, Route } from "react-router-dom";
import RolesManagement from "../rolesManagement/RolesManagement";
import ReviewCategories from "../reviewCategories/ReviewCategories";
import Profile from "../profile/Profile";
import Main from "./Main";
import FundingsSourceReport from "../fundingSourceReport/FundingsSourceReport";

const Routes = ( props ) => (
  <Switch>
    <Route path= {"/user/rolesManagement"} render = {(routeProps) =>  <RolesManagement {...routeProps} {...props}/> }/>
    <Route path= {"/project/main"} render = {(routeProps) => <Main {...routeProps} {...props}/> }/>
    <Route path= {"/newConsentGroup/main"} render = {(routeProps) => <Main {...routeProps} {...props}/> }/>
    <Route path={"/admin/fundingReport"} render = {(routeProps)=> <FundingsSourceReport {...routeProps} {...props}/>}/>
    <Route path= {"/report/reviewCategories"} render = {(routeProps) =>  <ReviewCategories {...routeProps} {...props}/> }/>
    <Route path= {"/index/profile"} render = {(routeProps) =>  <Profile {...routeProps} {...props}/> }/>

  </Switch>
);

export default Routes;
