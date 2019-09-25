import { Component } from 'react';
import { div, h, hh } from 'react-hyperscript-helpers';
import ProjectReview from '../projectReview/ProjectReview';
import { History } from '../components/History';
import Comments from '../components/Comments';
import { Submissions } from './Submissions';
import ConsentGroups from './ConsentGroups';
import '../components/Wizard.css';
import ProjectDocument from '../projectDocument/ProjectDocument';
import AdminOnly from '../adminOnly/AdminOnly';
import MultiTab from '../components/MultiTab';
import { ProjectMigration, Review } from '../util/ajax';

const projectReviewTabs = ["adminOnly", "history", "comments", "submissions", "consent-groups", "documents", "review"];

export const ProjectContainer = hh(class ProjectContainer extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      currentStepIndex: 0,
      history: [],
      comments: [],
      dialogContent: '',
      activeTab: 'review'
    };
  }

  componentDidMount= async () => {
    this._isMounted = true;
    await this.activeTab();
    this.getHistory();
    this.getComments();
  };

  componentWillUnmount() {
    this._isMounted = false;
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
      if (this._isMounted) {
        this.setState(prev => {
          prev.history = resp.data;
          return prev;
        });
      }
    });
  };

  //comments
  getComments() {
    Review.getComments(this.props.projectKey).then(result => {
      if (this._isMounted) {
        this.setState(prev => {
          prev.comments = result.data;
          return prev;
        });
      }
    });
  }

  activeTab = async () => {
    let tab = this.state.activeTab;
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('tab') && projectReviewTabs.includes(urlParams.get('tab'))) {
      tab =  urlParams.get('tab');
    }
    await this.setState({ activeTab: tab });
  };

  handleTabChange = async (tab) => {
    await this.setState({ activeTab: tab });
  };

  render() {
    return (
      div({ className: "headerBoxContainer" }, [
        div({ className: "containerBox" }, [
          h( MultiTab, {
              activeKey: this.state.activeTab,
              handleSelect: this.handleTabChange
            },
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
                    history: this.props.history
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
                  h(ConsentGroups, {
                  history: this.props.history,
                  updateContent: this.updateContent,
                  projectKey: this.props.projectKey,
                })
                ]),
              div({
                key: "submissions",
                title: "Submissions",
              }, [
                Submissions({
                  history: this.props.history,
                  projectKey: this.props.projectKey,
                }),
              ]),
              div({
                key: "comments",
                title: "Comments",
              }, [
                h(Comments, {
                  comments: this.state.comments,
                  id: this.props.projectKey,
                  updateContent: this.updateContent,
                  projectKey: this.props.projectKey,
                })
              ]),
              div({
                key: "history",
                title: "History",
              }, [
                History({
                  history: this.state.history,
                  projectKey: this.props.projectKey,
                }),
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
