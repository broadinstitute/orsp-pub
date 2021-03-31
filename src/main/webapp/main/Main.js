import { Component } from 'react';
import { div } from 'react-hyperscript-helpers';
import { StatusBox } from "../components/StatusBox";
import { ProjectContainer } from "../projectContainer/ProjectContainer";
import { ConsentGroupContainer } from "../consentGroupContainer/ConsentGroupContainer";
import get from 'lodash/get';
import defaultTo from 'lodash/defaultTo';
import { createObjectCopy, isEmpty, projectStatus } from '../util/Utils';
import './Main.css';

const LEGACY = 'Legacy';

class Main extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    const params = new URLSearchParams(this.props.location.search);
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

      consentKey: defaultTo(params.get('consentKey'), component.projectKey),
      projectKey: defaultTo(params.get('projectKey'), component.projectKey),
      tab: defaultTo(params.get('tab'), component.tab),
      issueType:  params.get('consentKey') != null ? 'consent-group' : 'project'
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  initStatusBoxInfo = (elementInfo) => {
    if (this._isMounted) {
      this.setState(prev => {
        prev.status.type = get(elementInfo, 'issue.type', '');
        prev.status.projectKey = get(elementInfo, 'issue.projectKey', '');
        prev.status.summary = get(elementInfo, 'issue.summary', '');
        prev.status.status = projectStatus(get(elementInfo, 'issue', ''));
        prev.status.actor = createObjectCopy(get(elementInfo, 'extraProperties.actor', ''));
        prev.status.assignedAdmin = createObjectCopy(get(elementInfo, 'extraProperties.assignedAdmin', ''));
        prev.status.projectReviewApproved = get(elementInfo, 'extraProperties.projectReviewApproved', '');
        prev.status.attachmentsApproved = get(elementInfo, 'attachmentsApproved', '');
        return prev;
      });
    }
  };

  changeInfoStatus = (data) => {
    if (this._isMounted) {
      this.setState(prev => {
        prev.status.projectReviewApproved = data;
        return prev;
      });
    }
  };

  updateDetailsStatus = (status) => {
    if (this._isMounted) {
      this.setState(prev => {
        prev.status.projectReviewApproved = status.extraProperties !== null && !isEmpty(status.extraProperties.projectReviewApproved) ? status.extraProperties.projectReviewApproved : false;
        prev.status.summary = status.issue.summary;
        prev.status.actor = status.extraProperties !== null && !isEmpty(status.extraProperties.actor) ? status.extraProperties.actor : '';
        return prev;
      });
    }
  };

  updateDocumentsStatus = (status) => {
    if (this._isMounted) {
      this.setState(prev => {
        prev.status.attachmentsApproved = status.attachmentsApproved;
        return prev;
      });
    }
  };

  updateAdminOnlyStatus = (status) => {
    if (this._isMounted) {
      this.setState(prev => {
        prev.status.status = status.projectStatus;
        return prev;
      });
    }
  };

  render() {
    return (
      div({ className: "headerBoxContainer" }, [
        StatusBox({
          issueType: this.state.issueType,
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
          tab: this.state.tab,
          history: this.props.history
        })
      ])
    );
  }
}

export default Main;
