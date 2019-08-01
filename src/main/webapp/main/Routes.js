import React from "react";
import { Switch, Route } from "react-router-dom";
import RolesManagement from "../rolesManagement/RolesManagement";
import ReviewCategories from "../reviewCategories/ReviewCategories";
import Main from "./Main";
import FundingsSourceReport from "../fundingSourceReport/FundingsSourceReport";
import { LinkWizard } from "../linkWizard/LinkWizard";
import NewConsentGroup from "../consentGroup/NewConsentGroup";

const Routes = ( props ) => (
  <Switch>
    <Route path= {"/user/rolesManagement"} render = {(routeProps) =>  <RolesManagement {...routeProps} {...props}/> }/>
    <Route path= {"/project/main"} render = {(routeProps) => <Main {...routeProps} {...props}/> }/>
    <Route path= {"/newConsentGroup/main"} render = {(routeProps) => <Main {...routeProps} {...props}/> }/>
    <Route path= {"/admin/fundingReport"} render = {(routeProps)=> <FundingsSourceReport {...routeProps} {...props}/>}/>
    <Route path= {"/report/reviewCategories"} render = {(routeProps) => <ReviewCategories {...routeProps} {...props}/> }/>
    <Route path= {"/consent-group/use-existing"} render = {(routeProps) => <LinkWizard {...routeProps} {...props}/> }/>
    <Route path= {"/consent-group/new"} render = {(routeProps) =>  <NewConsentGroup {...routeProps} {...props}/> }/>
  </Switch>
);

export default Routes;
