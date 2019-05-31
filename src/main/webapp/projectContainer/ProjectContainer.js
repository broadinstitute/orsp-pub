import { Component, Fragment } from 'react';
import { div, hh, h } from 'react-hyperscript-helpers';
import { ProjectReview } from "../projectReview/ProjectReview";
import { History } from "./History";
import { Comments } from "./Comments";
import { Submissions } from "./Submissions";
import { ConsentGroups } from "./ConsentGroups"
import '../components/Wizard.css';
import { ProjectDocument } from "../projectDocument/ProjectDocument";
import { AdminOnly } from "../adminOnly/AdminOnly";
import { MultiTab } from "../components/MultiTab";

export const ProjectContainer = hh(class ProjectContainer extends Component {

  constructor(props) {
    super(props);
    let tab = '';
    if (this.props.tab !== "" && this.props.tab !== undefined) {
      tab = this.props.tab
    }
    this.state = {
      loading: false,
      tab: tab,
      currentStepIndex: 0,
      content: '',
      dialogContent: ''
    };
  }

  render() {
    return (
      div({ className: "headerBoxContainer" }, [
        div({ className: "containerBox" }, [
          MultiTab({defaultActive: "projectReview"},
            [
              div({
                key: "projectReview",
                title: "Project Review",
              },[
                h(ProjectReview, {
                  updateDetailsStatus: this.props.updateDetailsStatus,
                  initStatusBoxInfo: this.props.initStatusBoxInfo,
                  searchUsersURL: this.props.searchUsersURL, 
                  projectKey: this.props.projectKey,
                  projectUrl: this.props.projectUrl,
                  isAdmin: this.props.isAdmin,
                  isViewer: this.props.isViewer,
                  serverURL: this.props.serverURL,
                  rejectProjectUrl: this.props.rejectProjectUrl,
                  updateProjectUrl: this.props.updateProjectUrl,
                  discardReviewUrl: this.props.discardReviewUrl,
                  clarificationUrl: this.props.clarificationUrl,
                  loadingImage: this.props.loadingImage
                })
              ]),
              div({
                  key: "projectDocument",
                  title: "Project Document",
              },[
                h(ProjectDocument, {
                  statusBoxHandler: this.props.statusBoxHandler,
                  updateDocumentsStatus : this.props.updateDocumentsStatus,
                  projectKey: this.props.projectKey,
                  attachedDocumentsUrl: this.props.attachedDocumentsUrl,
                  serverURL: this.props.serverURL,
                  approveDocumentUrl:this.props.approveDocumentUrl,
                  downloadDocumentUrl: this.props.downloadDocumentUrl,
                  sessionUserUrl: this.props.sessionUserUrl,
                  loadingImage: this.props.loadingImage,
                  removeDocumentUrl: this.props.removeDocumentUrl
                })
              ]),
              div({
                key: "consentGroups",
                title: "Sample/Data Cohorts",
              }, [
                h(Fragment, {}, [ConsentGroups( {
                    projectKey: this.props.projectKey,
                    serverURL: this.props.serverURL
                  }
                )]),
              ]),
              div({
                key: "submissions",
                title: "Submissions",
              }, [
                h(Fragment, {}, [Submissions({
                    projectKey: this.props.projectKey,
                    serverURL: this.props.serverURL
                  }
                )]),
              ]),
              div({
                key: "comments",
                title: "Comments",
              }, [
                h(Fragment, {}, [Comments({
                    projectKey: this.props.projectKey,
                    serverURL: this.props.serverURL
                  }
                )]),
              ]),
              div({
                key: "history",
                title: "History",
              }, [
                h(Fragment, {}, [History({
                    projectKey: this.props.projectKey,
                    serverURL: this.props.serverURL
                  }
                )]),
              ]),
              div({
                key: "adminOnly",
                title: "Admin Only",
              },[
                h( AdminOnly, {
                  isAdmin : this.props.isAdmin,
                  loadingImage : this.props.loadingImage,
                  userSessionUrl : this.props.userSessionUrl,
                  projectKey : this.props.projectKey,
                  projectUrl : this.props.projectUrl,
                  updateAdminOnlyPropsUrl : this.props.updateAdminOnlyPropsUrl,
                  statusBoxHandler: this.props.statusBoxHandler,
                  updateAdminOnlyStatus : this.props.updateAdminOnlyStatus
                })
              ])
            ])
        ])
      ])
    );
  }
});
