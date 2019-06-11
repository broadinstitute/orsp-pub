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
import { ProjectMigration } from '../util/ajax';

export const ProjectContainer = hh(class ProjectContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      currentStepIndex: 0,
      historyContent: '',
      commentsContent: '',
      dialogContent: '',
      defaultActive: 'review'
    };
  }

  componentDidMount() {
    this.getHistory();
    this.getComments();
  }

  updateDetailsStatus = (status) => {
    this.getHistory();
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
    this.getComments();
    this.getHistory();
  };
 
  // comments
  getComments() {
    ProjectMigration.getComments(this.props.serverURL, this.props.projectKey).then(resp => {
      this.setState(prev => {
        prev.commentsContent = resp.data;
        return prev;
      }, () => {
        this.initializeComments();
      });
    })
  };

  initializeComments() {
   tinymce.remove();
    $.fn.dataTable.moment('MM/DD/YYYY hh:mm:ss');
    if (!$.fn.dataTable.isDataTable("#comments-table")) {
      $("#comments-table").DataTable({
        dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
        buttons: ['excelHtml5', 'csvHtml5', 'print'],
        language: { search: 'Filter:' },
        pagingType: "full_numbers",
        order: [1, "desc"]
      });
    }
    this.initializeEditor();
  }
  
  initializeEditor() {
    tinymce.init({
      selector: 'textarea.editor',
      width: '100%',
      menubar: false,
      statusbar: false,
      plugins: "paste",
      paste_data_images: false
    });
  }

  // history
  getHistory() {
    ProjectMigration.getHistory(this.props.serverURL, this.props.projectKey).then(resp => {
      this.setState(prev => {
        prev.historyContent = resp.data;
        return prev;
      }, () => {
        this.initializeHistory();
      });
    })
  };

  initializeHistory() {
    $.fn.dataTable.moment('MM/DD/YYYY hh:mm:ss');
    if (!$.fn.dataTable.isDataTable("#history-table")) {
      $("#history-table").DataTable({
        dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
        buttons: ['excelHtml5', 'csvHtml5', 'print'],
        language: { search: 'Filter:' },
        pagingType: "full_numbers",
        order: [1, "desc"]
      });
    }
  }

  render() {
    return (
      div({ className: "headerBoxContainer" }, [
        div({ className: "containerBox" }, [
          MultiTab({ defaultActive: this.props.tab === "" ? this.state.defaultActive : this.props.tab },
            [
              div({
                key: "review",
                title: "Project Review",
              }, [
                  h(ProjectReview, {
                    updateDetailsStatus: this.updateDetailsStatus,
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
                    loadingImage: this.props.loadingImage,
                    updateContent: this.updateContent,
                  })
                ]),
              div({
                key: "documents",
                title: "Project Documents",
              }, [
                  h(ProjectDocument, {
                    statusBoxHandler: this.props.statusBoxHandler,
                    updateDocumentsStatus: this.updateDocumentsStatus,
                    projectKey: this.props.projectKey,
                    attachedDocumentsUrl: this.props.attachedDocumentsUrl,
                    serverURL: this.props.serverURL,
                    approveDocumentUrl: this.props.approveDocumentUrl,
                    downloadDocumentUrl: this.props.downloadDocumentUrl,
                    sessionUserUrl: this.props.sessionUserUrl,
                    loadingImage: this.props.loadingImage,
                    removeDocumentUrl: this.props.removeDocumentUrl
                  })
                ]),
              div({
                key: "consent-groups",
                title: "Sample/Data Cohorts",
              }, [
                  h(Fragment, {}, [ConsentGroups({
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
                    serverURL: this.props.serverURL,
                    commentsContent: this.state.commentsContent
                  }
                  )]),
                ]),
              div({
                key: "history",
                title: "History",
              }, [
                  h(Fragment, {}, [History({
                    projectKey: this.props.projectKey,
                    serverURL: this.props.serverURL,
                    historyContent: this.state.historyContent
                  }
                  )]),
                ]),
              div({
                key: "adminOnly",
                title: "Admin Only",
              }, [
                  h(AdminOnly, {
                    loadingImage: this.props.loadingImage,
                    userSessionUrl: this.props.userSessionUrl,
                    projectKey: this.props.projectKey,
                    projectUrl: this.props.projectUrl,
                    updateAdminOnlyPropsUrl: this.props.updateAdminOnlyPropsUrl,
                    statusBoxHandler: this.props.statusBoxHandler,
                    updateAdminOnlyStatus: this.updateAdminOnlyStatus
                  })
                ])
            ])
        ])
      ])
    );
  }
});
