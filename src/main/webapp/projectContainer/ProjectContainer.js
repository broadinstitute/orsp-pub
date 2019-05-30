import { Component } from 'react';
import { div, span, className, h1, p, hh } from 'react-hyperscript-helpers';
import { ProjectReview } from "../projectReview/ProjectReview";
import { History } from "./History";
import { Comments } from "./Comments";
import { Submissions } from "./Submissions";
import { ConsentGroups } from "./ConsentGroups"
import '../components/Wizard.css';
import './index.css';
import { ProjectDocument } from "../projectDocument/ProjectDocument";
import { AdminOnly } from "../adminOnly/AdminOnly";

export const ProjectContainer = hh(class ProjectContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentStepIndex: 0,
      content: '',
      dialogContent: ''
    };
  }

  goStep = (n) => (e) => {
    this.setState(prev => {
      prev.currentStepIndex = n;
      return prev;
    });
  };

  render() {
    const { currentStepIndex } = this.state;
    return (
      // will be moved to a new component
      div({ className: "headerBoxContainer" }, [
        div({ className: "containerBox" }, [
          div({ className: "tabContainer" }, [
            //   this.props.children.map((child, idx) => {
            //     return h(Fragment, { key: idx }, [
            //       div({ className: "tabStep " + (idx === currentStepIndex ? "active" : ""), onClick: this.goStep(idx)}, [child.props.title])
            //     ])
            //   }
            div({ className: "tabStep " + (currentStepIndex === 0 ? "active" : ""), onClick: this.goStep(0) }, ["Project Details"]),
            div({ className: "tabStep " + (currentStepIndex === 1 ? "active" : ""), onClick: this.goStep(1) }, ["Documents New"]),
            div({ className: "tabStep " + (currentStepIndex === 2 ? "active" : ""), onClick: this.goStep(2) }, ["Sample/Data Cohort"]),
            div({ className: "tabStep " + (currentStepIndex === 3 ? "active" : ""), onClick: this.goStep(3) }, ["Submissions"]),
            div({ className: "tabStep " + (currentStepIndex === 4 ? "active" : ""), onClick: this.goStep(4) }, ["Messages"]),
            div({ className: "tabStep " + (currentStepIndex === 5 ? "active" : ""), onClick: this.goStep(5) }, ["History"]),
            div({ className: "tabStep " + (currentStepIndex === 6 ? "active" : ""), onClick: this.goStep(6) }, ["Admin Only"])
          ]),
          div({ className: "tabContent" }, [
            div({}, [
              ProjectReview({
                isRendered: this.state.currentStepIndex === 0,
                statusBoxHandler: this.props.statusBoxHandler,
                initStatusBoxInfo: this.props.initStatusBoxInfo,
                searchUsersURL: this.props.searchUsersURL, // searchUsersURL = "/dev/search/getMatchingUsers"
                projectKey: this.props.projectKey,
                projectUrl: this.props.projectUrl, //         projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
                isAdmin: this.props.isAdmin,
                isViewer: this.props.isViewer,
                serverURL: this.props.serverURL,
                rejectProjectUrl: this.props.rejectProjectUrl,
                updateProjectUrl: this.props.updateProjectUrl,
                discardReviewUrl: this.props.discardReviewUrl,
                clarificationUrl: this.props.clarificationUrl,
                loadingImage: this.props.loadingImage
              }),
              ProjectDocument({
                isRendered: this.state.currentStepIndex === 1,
                projectKey: this.props.projectKey,
                attachedDocumentsUrl: this.props.attachedDocumentsUrl,
                attachDocumentsUrl: this.props.attachDocumentsUrl,
                rejectDocumentUrl:this.props.rejectDocumentUrl,
                approveDocumentUrl:this.props.approveDocumentUrl,
                downloadDocumentUrl: this.props.downloadDocumentUrl,
                sessionUserUrl: this.props.sessionUserUrl,
                loadingImage: this.props.loadingImage,
                removeDocumentUrl: this.props.removeDocumentUrl
              }),
              ConsentGroups({ isRendered: this.state.currentStepIndex === 2 }),
              Submissions({ isRendered: this.state.currentStepIndex === 3 }),
              Comments({ isRendered: this.state.currentStepIndex === 4 }),
              History({ isRendered: this.state.currentStepIndex === 5 }),
              AdminOnly({
                isRendered: this.state.currentStepIndex === 6,
                isAdmin : this.props.isAdmin,
                loadingImage : this.props.loadingImage,
                userSessionUrl : this.props.userSessionUrl,
                projectKey : this.props.projectKey,
                projectUrl : this.props.projectUrl,
                updateAdminOnlyPropsUrl : this.props.updateAdminOnlyPropsUrl,
                statusBoxHandler: this.props.statusBoxHandler
              })
            ]
            )
          ])
        ])
      ])
    );
  }
});
