import React from 'react';
import { Route, Switch } from 'react-router-dom';
import RolesManagement from '../rolesManagement/RolesManagement';
import OrganizationsManagement from '../organizations/OrganizationsManagement';
import ReviewCategories from '../reviewCategories/ReviewCategories';
import Main from './Main';
import FundingsSourceReport from '../fundingSourceReport/FundingsSourceReport';
import SubmissionForm from '../projectContainer/SubmissionForm';
import DataUseRestrictionDetails from '../dataUse/DataUseRestrictionDetails';
import Profile from '../profile/Profile';
import DataUseRestrictionIndex from '../dataUse/DataUseRestrictionIndex';
import LinkWizard from '../linkWizard/LinkWizard';
import NewConsentGroup from '../consentGroup/NewConsentGroup';
import DataUseLetterIndex from '../dataUseLetter/DataUseLetterIndex';
import AboutPage from '../aboutPage/AboutPage';
import QaReport from '../qaReport/QaReport';
import DataUseRestrictionEdit from '../dataUse/DataUseRestrictionEdit';
import PageNotFound from '../pageNotFound/PageNotFound';
import IssueList from '../issueList/IssueList'
import LandingPage from './LandingPage';
import NewProject from '../project/NewProject';
import AuthenticatedRoute from './AuthenticatedRoute';
import Search from '../search/Search';
import ProjectReport from '../qaReport/ProjectReport';
import InfoLink from '../infoLink/InfoLink';
import { Storage } from '../util/Storage';
import SampleCollection from '../sampleCollection/SampleCollection';


const Routes = ( props ) => (
  <Switch>
    <AuthenticatedRoute path= {"/user/rolesManagement"} component={RolesManagement} props={props} admin={true}/> }/>
    <AuthenticatedRoute path= {"/admin/organizations"} component={OrganizationsManagement} props={props} admin={true}/> }/>
    <AuthenticatedRoute path= {["/project/main", "/newConsentGroup/main"]} component={Main} props={props}/> }/>
    <AuthenticatedRoute path= {"/project/pages"} component={NewProject} props={props}/> }/>
    <AuthenticatedRoute path= {"/admin/fundingReport"} component={FundingsSourceReport} props={props} admin={true}/> }/>
    <AuthenticatedRoute path= {"/report/reviewCategories"} component={ReviewCategories} props={props} admin={true}/> }/>
    <AuthenticatedRoute path= {"/report/sampleCollections"} component={SampleCollection} props={props} admin={true}/> }/>
    <AuthenticatedRoute path= {"/statusEvent/qaEventReport"} component={QaReport} props={props} admin={true}/> }/>
    <AuthenticatedRoute path= {"/statusEvent/projectReport"} component={ProjectReport} props={props} admin={true} />
    <AuthenticatedRoute path= {"/dataUse/list"}  component={DataUseRestrictionIndex} props={props} admin={true}/> }/>
    <AuthenticatedRoute path= {"/dataUse/view"}  component={DataUseRestrictionDetails} props={props}/> }/>
    <AuthenticatedRoute path= {"/consent-group/use-existing"} component={LinkWizard} props={props}/> }/>
    <AuthenticatedRoute path= {"/consent-group/new"} component={NewConsentGroup} props={props}/> }/>
    <AuthenticatedRoute path= {"/dataUse/restriction"} component={DataUseRestrictionEdit} props={props}/> }/>
    <AuthenticatedRoute path= {"/issueList/list"} component={IssueList} props={props} /> }/>
    <AuthenticatedRoute path= {"/search/index"} component={Search} props={props} /> }/>
    <AuthenticatedRoute path= {"/submissions/add-new"} component={SubmissionForm} props={props} /> }/>
    <AuthenticatedRoute path= {"/infoLink/showInfoLink"} component={InfoLink} props={props}/> }/>
    <AuthenticatedRoute path= {["/index/profile", "/profile"]} component={Profile} props={props}/>  }/>
    <AuthenticatedRoute path= {"/index"} exact component = {LandingPage} props= {props}/> }/>
    <Route path= {["/about"]} exact render = {(routeProps) =>  <AboutPage {...routeProps} {...props}/> }/>
    <AuthenticatedRoute path= {"/loginText"} component = {LogintText} props = {props} admin = {true} />
    <Route path= {"/"} exact render = {(routeProps) =>  Storage.userIsLogged() ? <LandingPage {...routeProps} {...props}/> : <AboutPage {...routeProps} {...props}/> }/>
    <Route path= {"/dataUseLetter/view"} render = {(routeProps) =>  <DataUseLetterIndex {...routeProps} {...props}/> }/>
    <Route path= {"/*"} render = {(routeProps) =>  <PageNotFound {...routeProps} {...props}/> }/>   
  </Switch>
);
export default Routes;
