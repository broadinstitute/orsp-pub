import { Component } from 'react';
import { div } from 'react-hyperscript-helpers';
import { StatusBox } from "../components/StatusBox";
import { ProjectContainer } from "../projectContainer/ProjectContainer";
import { ConsentGroupContainer } from "../consentGroupContainer/ConsentGroupContainer";
import get from 'lodash/get';
import { isEmpty } from "../util/Utils";
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
        actor: [],
        projectReviewApproved: '',
        attachmentsApproved: ''
      },
      consentKey: this.props.location.state !== undefined && this.props.location.state.consentKey !== undefined  ? this.props.location.state.consentKey : component.consentKey,
      projectKey: this.props.location.state !== undefined && this.props.location.state.projectKey !== undefined  ? this.props.location.state.projectKey : component.projectKey,
      tab: this.props.location.state !== undefined && this.props.location.state.tab !== undefined  ? this.props.location.state.tab : component.tab,
      issueType: this.props.location.state !== undefined && this.props.location.state.issueType !== undefined  ? this.props.location.state.issueType : component.issueType
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

  changeInfoStatus = (data) => {
    this.setState(prev => {
      prev.status.projectReviewApproved = data;
      return prev;
    });
  };

  updateDetailsStatus = (status) => {
    this.setState(prev => {
      prev.status.projectReviewApproved = status.extraProperties !== null && !isEmpty(status.extraProperties.projectReviewApproved) ? status.extraProperties.projectReviewApproved : false;
      prev.status.summary = status.issue.summary;
      prev.status.actor = status.extraProperties !== null && !isEmpty(status.extraProperties.actor) ? status.extraProperties.actor : '';
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
    console.log(this.props);
    return (
      div({ className: "headerBoxContainer" }, [
        StatusBox({
          status: this.state.status
        }),
        ProjectContainer({
          history: this.props.history,
          isRendered: this.state.issueType === 'project',
          initStatusBoxInfo: this.initStatusBoxInfo,
          changeInfoStatus: this.changeInfoStatus,
          updateDetailsStatus: this.updateDetailsStatus,
          updateDocumentsStatus: this.updateDocumentsStatus,
          updateAdminOnlyStatus: this.updateAdminOnlyStatus,
          statusBoxHandler: this.statusBoxHandler,
          projectKey: this.state.projectKey,
          tab: this.state.tab
        }),
        ConsentGroupContainer({
          isRendered: this.state.issueType === 'consent-group',
          initStatusBoxInfo: this.initStatusBoxInfo,
          changeInfoStatus: this.changeInfoStatus,
          updateDetailsStatus: this.updateDetailsStatus,
          updateDocumentsStatus: this.updateDocumentsStatus,
          consentKey: this.state.consentKey,
          tab: this.state.tab
        })
      ])
    );
  }
}

export default Main;
