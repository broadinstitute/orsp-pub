import { Component } from 'react';
import { div, span, className, h1, p, hh } from 'react-hyperscript-helpers';
import { ProjectMigration } from '../util/ajax';
import { ProjectReview } from "../projectReview/ProjectReview";
import { History } from "./History";
import { Comments } from "./Comments";
import { Submissions } from "./Submissions";
import { ConsentGroups } from "./ConsentGroups"
import '../components/Wizard.css';
import './index.css';

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
          ]),
          div({ className: "tabContent" }, [
            div({}, [
              ProjectReview({
                isRendered: this.state.currentStepIndex === 0,
                statusBoxHandler: this.props.statusBoxHandler,
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
              ConsentGroups({ isRendered: this.state.currentStepIndex === 2 }),
              Submissions({ isRendered: this.state.currentStepIndex === 3 }),
              Comments({ isRendered: this.state.currentStepIndex === 4 }),
              History({ isRendered: this.state.currentStepIndex === 5 })
            ]
            )
          ])
        ])
      ])
    );
  }
});
