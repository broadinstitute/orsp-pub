import { Component, Fragment } from 'react';
import { div, hh, h } from 'react-hyperscript-helpers';
import { ConsentGroupReview } from "../consentGroupReview/ConsentGroupReview";
import { History } from "../components/History";
import { Comments } from "../components/Comments";
import '../components/Wizard.css';
import { ConsentGroupDocuments } from "../consentGroupDocuments/ConsentGroupDocuments";
import { MultiTab } from "../components/MultiTab";
import { ProjectMigration } from '../util/ajax';

export const ConsentGroupContainer = hh(class ConsentGroupContainer extends Component {

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
    ProjectMigration.getComments(this.props.serverURL, this.props.consentKey).then(resp => {
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
    ProjectMigration.getHistory(this.props.serverURL, this.props.consentKey).then(resp => {
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
                title: "Review",
              }, [
                  h(ConsentGroupReview, {
                    consentKey: this.props.consentKey,
                    consentGroupUrl: this.props.consentGroupUrl,
                    approveConsentGroupUrl: this.props.approveConsentGroupUrl,
                    isAdminUrl: this.props.isAdminUrl,
                    isViewer: this.props.isViewer,
                    sampleSearchUrl: this.props.sampleSearchUrl,
                    rejectConsentUrl: this.props.rejectConsentUrl,
                    updateConsentUrl: this.props.updateConsentUrl,
                    projectKey: this.props.projectKey,
                    serverURL: this.props.serverURL,
                    discardReviewUrl: this.props.discardReviewUrl,
                    consentNamesSearchURL: this.props.consentNamesSearchURL,
                    clarificationUrl: this.props.clarificationUrl,
                    loadingImage: this.props.loadingImage,
                    initStatusBoxInfo: this.props.initStatusBoxInfo,
                    updateDetailsStatus: this.updateDetailsStatus,
                    updateContent: this.updateContent
                  })
                ]),
              div({
                key: "documents",
                title: "Documents",
              }, [
                  h(ConsentGroupDocuments, {
                    attachmentsUrl: this.props.attachmentsUrl,
                    serverURL: this.props.serverURL,
                    attachDocumentsUrl: this.props.attachDocumentsUrl,
                    projectKey: this.props.consentKey,
                    approveDocumentUrl: this.props.approveDocumentUrl,
                    rejectDocumentUrl: this.props.rejectDocumentUrl,
                    sessionUserUrl: this.props.sessionUserUrl,
                    downloadDocumentUrl: this.props.downloadDocumentUrl,
                    emailDulUrl: this.props.emailDulUrl,
                    loadingImage: this.props.loadingImage,
                    useRestrictionUrl: this.props.useRestrictionUrl,
                    createRestrictionUrl: this.props.createRestrictionUrl,
                    removeDocumentUrl: this.props.removeDocumentUrl,
                    updateDocumentsStatus: this.updateDocumentsStatus
                  })
                ]),
              div({
                key: "comments",
                title: "Messages",
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
                  )])
                ])
            ])
        ])
      ])
    );
  }
});
