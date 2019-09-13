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
import QaReport from "../qaReport/QaReport";
import DataUseRestrictionEdit from "../dataUse/DataUseRestrictionEdit";
import PageNotFound from "../pageNotFound/PageNotFound";
import IssueList from "../issueList/IssueList"
import LandingPage from "./LandingPage";
import Search from "../search/Search";
import TopNavigationMenu from "../components/TopNavigationMenu";
import NewProject from "../project/NewProject";

const Routes = ( props ) => (
  <Switch>
    <Route path= {["/", "/index"]} exact render = {(routeProps) =>  <LandingPage {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/user/rolesManagement"} render = {(routeProps) =>  <RolesManagement {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {["/project/main", "/newConsentGroup/main"]} render = {(routeProps) => <Main {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/project/pages"} render = {(routeProps) => <NewProject {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/admin/fundingReport"} render = {(routeProps)=> <FundingsSourceReport {...routeProps} {...props}/>}/>
    <AuthenticatedRoute path= {"/report/reviewCategories"} render = {(routeProps) => <ReviewCategories {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/statusEvent/qaEventReport"} render = {(routeProps) => <QaReport {...routeProps} {...props}/>} />
    <AuthenticatedRoute path= {["/index/about", "/about"]} render = {(routeProps) =>  <AboutPage {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/dataUse/list"} render = {(routeProps) =>  <DataUseRestrictionIndex {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/consent-group/use-existing"} render = {(routeProps) => <LinkWizard {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/consent-group/new"} render = {(routeProps) =>  <NewConsentGroup {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/dataUseLetter/show"} render = {(routeProps) =>  <DataUseLetterIndex {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/dataUse/show"} render = {(routeProps) =>  <DataUseRestrictionDetails {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/dataUse/restriction"} render = {(routeProps) =>  <DataUseRestrictionEdit {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/issueList/list"} render = {(routeProps) =>  <IssueList {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/search/index"} render = {(routeProps) =>  <Search {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/submissions/add-new"} render={(routeProps) => <SubmissionForm {...routeProps} {...props} />} />
    <Route path= {["/index/profile", "/profile"]} render = {(routeProps) =>  <Profile {...routeProps} {...props}/> }/>
    <Route path= {"/*"} render = {(routeProps) =>  <PageNotFound {...routeProps} {...props}/> }/>
  </Switch>
);

export default Routes;
