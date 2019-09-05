import React from "react";
import { Switch, Route } from "react-router-dom";
import RolesManagement from "../rolesManagement/RolesManagement";
import ReviewCategories from "../reviewCategories/ReviewCategories";
import Main from "./Main";
import FundingsSourceReport from "../fundingSourceReport/FundingsSourceReport";
import SubmissionForm from "../projectContainer/SubmissionForm";
import DataUseRestrictionDetails from "../dataUse/DataUseRestrictionDetails";
import Profile from "../profile/Profile";
import DataUseRestrictionIndex from "../dataUse/DataUseRestrictionIndex";
import { LinkWizard } from "../linkWizard/LinkWizard";
import NewConsentGroup from "../consentGroup/NewConsentGroup";
import DataUseLetterIndex from "../dataUseLetter/DataUseLetterIndex";
import AboutPage from "../aboutPage/AboutPage";
import DataUseRestrictionEdit from "../dataUse/DataUseRestrictionEdit";
import PageNotFound from "../PageNotFound/PageNotFound";
import NewProject from "../project/NewProject";

const Routes = ( props ) => (
  <Switch>
    <Route path= {"/project/newProject"} render ={(routeProps) => <NewProject {...routeProps} {...props}/> }/>
    <Route path= {"/user/rolesManagement"} render = {(routeProps) =>  <RolesManagement {...routeProps} {...props}/> }/>
    <Route path= {"/project/main"} render = {(routeProps) => <Main {...routeProps} {...props}/> }/>
    <Route path= {"/newConsentGroup/main"} render = {(routeProps) => <Main {...routeProps} {...props}/> }/>
    <Route path= {"/admin/fundingReport"} render = {(routeProps)=> <FundingsSourceReport {...routeProps} {...props}/>}/>
    <Route path= {"/report/reviewCategories"} render = {(routeProps) =>  <ReviewCategories {...routeProps} {...props}/> }/>
    <Route path= {"/index/profile"} render = {(routeProps) =>  <Profile {...routeProps} {...props}/> }/>
    <Route path= {"/index/about"} render = {(routeProps) =>  <AboutPage {...routeProps} {...props}/> }/>
    <Route path= {"/dataUse/list"} render = {(routeProps) =>  <DataUseRestrictionIndex {...routeProps} {...props}/> }/>
    <Route path= {"/consent-group/use-existing"} render = {(routeProps) => <LinkWizard {...routeProps} {...props}/> }/>
    <Route path= {"/consent-group/new"} render = {(routeProps) =>  <NewConsentGroup {...routeProps} {...props}/> }/>
    <Route path= {"/dataUseLetter/show"} render = {(routeProps) =>  <DataUseLetterIndex {...routeProps} {...props}/> }/>
    <Route path= {"/submissions/add-new"} render={(routeProps) => <SubmissionForm {...routeProps} {...props} />} />
    <Route path= {"/dataUse/show"} render = {(routeProps) =>  <DataUseRestrictionDetails {...routeProps} {...props}/> }/>
    <Route path= {"/dataUse/restriction"} render = {(routeProps) =>  <DataUseRestrictionEdit {...routeProps} {...props}/> }/>
    <Route path= {"/*"} render = {(routeProps) =>  <PageNotFound {...routeProps} {...props}/> }/>
  </Switch>
);

export default Routes;
