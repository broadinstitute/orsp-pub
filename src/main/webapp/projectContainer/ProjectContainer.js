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
import { ProjectMigration, Review } from '../util/ajax';
import { spinnerService } from "../util/spinner-service";

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
    spinnerService.hideAll();
    spinnerService._unregisterAll();
    this.getHistory();
    this.getComments();
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
    ProjectMigration.getHistory(component.projectKey).then(resp => {
      this.setState(prev => {
        prev.history = resp.data;
        return prev;
      })
    });
  };

  //comments
  getComments() {
    Review.getComments(component.projectKey).then(result => {
      this.setState(prev => {
        prev.comments = result.data;
        return prev;
      })
    });
  }

  render() {
    return (
      div({ className: "headerBoxContainer" }, [
        div({ className: "containerBox" }, [
          MultiTab({ defaultActive: component.tab === "" ? this.state.defaultActive : component.tab },
            [
              div({
                key: "review",
                title: "Project Details",
              }, [
                  h(ProjectReview, {
                    updateDetailsStatus: this.updateDetailsStatus,
                    changeInfoStatus: this.props.changeInfoStatus,
                    initStatusBoxInfo: this.props.initStatusBoxInfo,
                    updateContent: this.updateContent
                  })
                ]),
              div({
                key: "documents",
                title: "Project Documents",
              }, [
                  h(ProjectDocument, {
                    statusBoxHandler: this.props.statusBoxHandler,
                    updateDocumentsStatus: this.updateDocumentsStatus,
                    initStatusBoxInfo: this.props.initStatusBoxInfo
                  })
                ]),
              div({
                key: "consent-groups",
                title: "Sample/Data Cohorts",
              }, [
                  h(Fragment, {}, [ConsentGroups({
                    history: this.props.history,
                    updateContent: this.updateContent
                  })]),
                ]),
              div({
                key: "submissions",
                title: "Submissions",
              }, [
                  h(Fragment, {}, [Submissions({
                    history: this.props.history
                  })]),
                ]),
              div({
                key: "comments",
                title: "Comments",
              }, [
                  h(Fragment, {}, [Comments({
                    comments: this.state.comments,
                    id: component.projectKey,
                    updateContent: this.updateContent
                  })]),
                ]),
              div({
                key: "history",
                title: "History",
              }, [
                  h(Fragment, {}, [History({
                    history: this.state.history
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
                    initStatusBoxInfo: this.props.initStatusBoxInfo
                  })
                ])
            ])
        ])
      ])
    );
  }
});
