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
    ProjectMigration.getComments(component.serverURL, component.projectKey).then(resp => {
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
    ProjectMigration.getHistory(component.serverURL, component.projectKey).then(resp => {
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
                    updateDocumentsStatus: this.updateDocumentsStatus
                  })
                ]),
              div({
                key: "consent-groups",
                title: "Sample/Data Cohorts",
              }, [
                  h(Fragment, {}, [ConsentGroups({
                    updateContent: this.updateContent
                  })]),
                ]),
              div({
                key: "submissions",
                title: "Submissions",
              }, [
                  h(Fragment, {}, [Submissions({})]),
                ]),
              div({
                key: "comments",
                title: "Comments",
              }, [
                  h(Fragment, {}, [Comments({
                    commentsContent: this.state.commentsContent,
                      updateContent: this.updateContent
                  }
                  )]),
                ]),
              div({
                key: "history",
                title: "History",
              }, [
                  h(Fragment, {}, [History({
                    historyContent: this.state.historyContent
                  }
                  )]),
                ]),
              div({
                key: "adminOnly",
                title: "Admin Only",
              }, [
                  h(AdminOnly, {
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
