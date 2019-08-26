import { Component, Fragment } from 'react';
import { div, hh, h } from 'react-hyperscript-helpers';
import { ProjectReview } from "../projectReview/ProjectReview";
import { History } from "../components/History";
import { Comments } from "../components/Comments";
import { Submissions } from "./Submissions";
import { ConsentGroups } from "./ConsentGroups";
import '../components/Wizard.css';
import { ProjectDocument } from "../projectDocument/ProjectDocument";
import { AdminOnly } from "../adminOnly/AdminOnly";
import { MultiTab } from "../components/MultiTab";
import { ProjectMigration, Review, requestTokens } from '../util/ajax';
import {isEmpty} from "../util/Utils";

export const ProjectContainer = hh(class ProjectContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentStepIndex: 0,
      history: [],
      comments: [],
      dialogContent: '',
      defaultActive: 'review'
    };
  }

  componentDidMount() {
    this.getHistory();
    this.getComments();
  }

  componentWillUnmount() {
    requestTokens.cancelRequests();
  }

  updateDetailsStatus = (status) => {
    this.getHistory();
    this.getComments();
    this.props.updateDetailsStatus(status);
  };

  updateDocumentsStatus = (status) => {
    this.getHistory();
    this.props.updateDocumentsStatus(status);
  };

  updateAdminOnlyStatus = (status) => {
    this.getHistory();
    this.props.updateAdminOnlyStatus(status);
  };

  updateContent = () => {
    this.getHistory();
    this.getComments();
  };


  // history
  getHistory() {
    ProjectMigration.getHistory(this.props.projectKey).then(resp => {
      this.setState(prev => {
        prev.history = resp.data;
        return prev;
      })
    });
  };

  //comments
  getComments() {
    Review.getComments(this.props.projectKey).then(result => {
      this.setState(prev => {
        prev.comments = result.data;
        return prev;
      })
    });
  }

  activeTab = () => {
    let tab = this.state.defaultActive;

   if (!isEmpty(this.props.tab) && !isEmpty(component.tab)){
      tab = component.tab;
    } else if (!isEmpty(this.props.tab)) {
      tab =  this.props.tab;
    }
    return tab;
  };

  render() {
    return (
      div({ className: "headerBoxContainer" }, [
        div({ className: "containerBox" }, [
          MultiTab({ defaultActive: this.activeTab() },
            [
              div({
                key: "review",
                title: "Project Details",
              }, [
                  h(ProjectReview, {
                    updateDetailsStatus: this.updateDetailsStatus,
                    changeInfoStatus: this.props.changeInfoStatus,
                    initStatusBoxInfo: this.props.initStatusBoxInfo,
                    updateContent: this.updateContent,
                    projectKey: this.props.projectKey,
                  })
                ]),
              div({
                key: "documents",
                title: "Project Documents",
              }, [
                  h(ProjectDocument, {
                    statusBoxHandler: this.props.statusBoxHandler,
                    updateDocumentsStatus: this.updateDocumentsStatus,
                    initStatusBoxInfo: this.props.initStatusBoxInfo,
                    projectKey: this.props.projectKey,
                  })
                ]),
              div({
                key: "consent-groups",
                title: "Sample/Data Cohorts",
              }, [
                  h(Fragment, {}, [ConsentGroups({
                    history: this.props.history,
                    updateContent: this.updateContent,
                    projectKey: this.props.projectKey,
                  })]),
                ]),
              div({
                key: "submissions",
                title: "Submissions",
              }, [
                  h(Fragment, {}, [Submissions({
                    history: this.props.history,
                    projectKey: this.props.projectKey,
                  })]),
                ]),
              div({
                key: "comments",
                title: "Comments",
              }, [
                  h(Fragment, {}, [Comments({
                    comments: this.state.comments,
                    id: this.props.projectKey,
                    updateContent: this.updateContent,
                    projectKey: this.props.projectKey,
                  })]),
                ]),
              div({
                key: "history",
                title: "History",
              }, [
                  h(Fragment, {}, [History({
                    history: this.state.history,
                    projectKey: this.props.projectKey,
                  }
                  )]),
                ]),
              div({
                key: "adminOnly",
                title: "Admin Only",
              }, [
                  h(AdminOnly, {
                    statusBoxHandler: this.props.statusBoxHandler,
                    updateAdminOnlyStatus: this.updateAdminOnlyStatus,
                    initStatusBoxInfo: this.props.initStatusBoxInfo,
                    projectKey: this.props.projectKey,
                  })
                ])
            ])
        ])
      ])
    );
  }
});
