import { Component } from 'react';
import { div } from 'react-hyperscript-helpers';
import { StatusBox } from "../components/StatusBox";
import { ProjectContainer } from "../projectContainer/ProjectContainer";
import { ConsentGroupContainer } from "../consentGroupContainer/ConsentGroupContainer";
import get from 'lodash/get';
import './Main.css';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: {
        type: '',
        projectKey: '',
        summary: '',
        status: '',
        actor: '',
        projectReviewApproved: '',
        attachmentsApproved: ''
      }
    };
  }

  initStatusBoxInfo = (elementInfo) => {
    this.setState(prev => {
      prev.status.type = get(elementInfo, 'issue.type', '');
      prev.status.projectKey = get(elementInfo, 'issue.projectKey', '');
      prev.status.summary = get(elementInfo, 'issue.summary', '');
      prev.status.status = get(elementInfo, 'issue.approvalStatus', '');
      prev.status.actor = get(elementInfo, 'extraProperties.actor', '');
      prev.status.projectReviewApproved = get(elementInfo, 'extraProperties.projectReviewApproved', '');
      prev.status.attachmentsApproved = get(elementInfo, 'attachmentsApproved', '');
      return prev;
    });
  };

  updateDetailsStatus = (status) => {
    this.setState(prev => {
      prev.status.projectReviewApproved = status.projectReviewApproved;
      prev.status.summary = status.summary;
      prev.status.actor = status.pm;
      return prev;
    })
  };

  updateDocumentsStatus = (status) => {
    this.setState(prev => {
      prev.status.attachmentsApproved = status.attachmentsApproved;
      return prev;
    })
  };

  updateAdminOnlyStatus = (status) => {
    this.setState(prev => {
      prev.status.status = status.projectStatus;
      return prev;
    })
  };

  render() {
    return (
      div({ className: "headerBoxContainer" }, [
        StatusBox({
          status: this.state.status
        }),
        ProjectContainer({
          isRendered: component.issueType === 'project',
          searchUsersURL: component.searchUsersURL,
          projectKey: component.projectKey,
          projectUrl: component.projectUrl,
          isAdmin: component.isAdmin,
          isViewer: component.isViewer,
          serverURL: component.serverURL,
          rejectProjectUrl: component.rejectProjectUrl,
          updateProjectUrl: component.updateProjectUrl,
          discardReviewUrl: component.discardReviewUrl,
          clarificationUrl: component.clarificationUrl,
          loadingImage: component.loadingImage,
          saveExtraPropUrl: component.saveExtraPropUrl,
          initStatusBoxInfo: this.initStatusBoxInfo,
          updateDetailsStatus: this.updateDetailsStatus,
          updateDocumentsStatus: this.updateDocumentsStatus,
          updateAdminOnlyStatus: this.updateAdminOnlyStatus,
          statusBoxHandler: this.statusBoxHandler,
          userSessionUrl: component.sessionUserUrl,
          updateAdminOnlyPropsUrl: component.updateAdminOnlyPropsUrl,
          attachedDocumentsUrl: component.attachedDocumentsUrl,
          attachDocumentsUrl: component.attachDocumentsURL,
          approveDocumentUrl: component.approveDocumentUrl,
          downloadDocumentUrl: component.downloadDocumentUrl,
          sessionUserUrl: component.sessionUserUrl,
          removeDocumentUrl: component.removeDocumentUrl,
          tab: component.tab
        }),
        ConsentGroupContainer({
          isRendered: component.issueType === 'consent-group',
          attachmentsUrl: component.attachmentsUrl,
          attachDocumentsUrl: component.attachDocumentsURL,
          approveDocumentUrl: component.approveDocumentUrl,
          rejectDocumentUrl: component.rejectDocumentUrl,
          sessionUserUrl: component.sessionUserUrl,
          downloadDocumentUrl: component.downloadDocumentUrl,
          emailDulUrl: component.emailDulUrl,
          useRestrictionUrl: component.useRestrictionUrl,
          createRestrictionUrl:"VERO",
          removeDocumentUrl: component.removeDocumentUrl,
          consentKey: component.consentKey,
          consentGroupUrl: component.consentGroupUrl,
          approveConsentGroupUrl: component.approveConsentGroupUrl,
          isAdminUrl: component.isAdminUrl,
          isViewer: component.isViewer,
          sampleSearchUrl: component.sampleSearchUrl,
          rejectConsentUrl: component.rejectConsentUrl,
          updateConsentUrl: component.updateConsentUrl,
          projectKey: component.projectKey,
          serverURL: component.serverURL,
          discardReviewUrl: component.discardReviewUrl,
          consentNamesSearchURL: component.consentNamesSearchURL,
          clarificationUrl: component.clarificationUrl,
          loadingImage: component.loadingImage,
          initStatusBoxInfo: this.initStatusBoxInfo
        })
      ])
    );
  }
}

export default Main;
