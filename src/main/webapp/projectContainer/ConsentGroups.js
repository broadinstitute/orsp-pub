import React, { Component, Fragment } from 'react';
import { div, hh, h, hr, h3, a, button } from 'react-hyperscript-helpers';
import { ConsentGroup, DocumentHandler, ProjectMigration } from '../util/ajax';
import { ConsentCollectionLink } from '../util/ajax';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { RequestClarificationDialog } from "../components/RequestClarificationDialog";
import { Spinner } from "../components/Spinner";
import { CollapsibleElements } from "../CollapsiblePanel/CollapsibleElements";
import { isEmpty } from "../util/Utils";
import { TableComponent } from "../components/TableComponent";
import { SampleDataCohortsCollapsibleHeader } from "../CollapsiblePanel/SampleDataCohortsCollapsibleHeader";
import { formatUrlDocument, parseDate } from "../util/TableUtil";
import { AlertMessage } from "../components/AlertMessage";
import { styles } from "../util/ReportConstants";

const columns = (cThis) => [{
  dataField: 'id',
  text: 'Id',
  hidden: true,
  csvExport : false
},
{
  dataField: 'uuid',
  text: '',
  style: { pointerEvents: 'auto' },
  headerStyle: (column, colIndex) => {
    return {
      width: '65px',
    };
  },
  formatter: (cell, row, rowIndex, colIndex) =>
    button({
      isRendered: component.isAdmin,
      className: 'btn btn-default btn-xs link-btn',
      onClick: () => cThis.removeAttachedDocument(row)
    },["Delete"])
},
{
  dataField: 'fileType',
  text: 'Attachment Type'
}, {
  dataField: 'fileName',
  text: 'File Name',
  style: { pointerEvents: 'auto' },
  formatter: (cell, row, rowIndex, colIndex) =>
    a(formatUrlDocument(row), [row.fileName])
},
{
  dataField: 'creator',
  text: 'Author'
},
{
  dataField: 'creationDate',
  text: 'Created',
  formatter: (cell, row, rowIndex, colIndex) =>
    isEmpty(row.creationDate) ? '' : parseDate(row.creationDate)
}
];

const defaultSorted = [{
  dataField: 'projectKey',
  order: 'desc'
}];

export const ConsentGroups = hh(class ConsentGroups extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      showConfirmationModal: false,
      action: '',
      issueKey: '',
      consentKey: '',
      showRequestClarification: false,
      title: 0,
      actionConsentKey: '',
      fileIdToRemove: '',
      issue: {},
      alertMessage: '',
      alertType: 'success',
      showSuccessClarification: false
    };
  }

  componentDidMount() {
    this.getProjectConsentGroups();
  }

  closeConfirmationModal = () => {
    this.setState({showConfirmationModal: !this.state.showConfirmationModal});
  };

  closeRequestClarification = () => {
    this.setState({showRequestClarification: false});
  };

  handleOkConfirmation = () => {
    if(this.state.action === "unlink" || this.state.action === "reject") {
      ConsentCollectionLink.breakLink(this.state.issue.projectKey, this.state.actionConsentKey, this.state.action).then(resp => {
        this.getProjectConsentGroups();
        this.closeConfirmationModal();
      });
    } else if (this.state.action === 'removeAttachment') {
      DocumentHandler.deleteAttachmentByUuid(this.state.fileIdToRemove).
      then(resp => {
        this.getProjectConsentGroups();
        this.closeConfirmationModal();
      }).catch(error => {
        this.setState(() => { throw error; });
      });
    } else {
      ConsentCollectionLink.approveLink(this.state.issue.projectKey, this.state.actionConsentKey).then(resp => {
        this.getProjectConsentGroups();
        this.closeConfirmationModal();
      });
    }
  };

  successNotification = (type, message, time) => {
    setTimeout(this.clearAlertMessage(type), time, null);
    this.props.updateContent();
    this.closeRequestClarification();
    this.setState(prev => {
      prev.showSuccessClarification = true;
      prev.alertMessage = message;
      prev.alertType = 'success';
      return prev;
    });
  };

  clearAlertMessage = (type) => () => {
    this.setState(prev => {
      prev.showSuccessClarification = false;
      prev.alertMessage = '';
      prev.alertType = '';
      return prev;
    });
  };

  successClarification = () => {
    this.props.updateContent();
    this.closeRequestClarification();
  };

  getProjectConsentGroups = () => {
    ConsentGroup.getProjectConsentGroups(component.projectKey).then( result => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('new') && urlParams.get('tab') === 'review') {
        history.pushState({}, null, window.location.href.split('&')[0]);
        this.successNotification('showSuccessClarification', 'Your Project was successfully submitted to the Broad Institute’s Office of Research Subject Protection. It will now be reviewed by the ORSP team who will reach out to you if they have any questions.', 8000);
      }
        this.setState(prev => {
          prev.consentGroups = result.data.consentGroups;
          prev.issue = result.data.issue;
          return prev;
        },() => {
          this.collapseBtnAnimationListener();
        });
      }
    );
  };

  collapseBtnAnimationListener() {
    $('.consent-accordion-toggle').on('click', function () {
      let icon = $(this).children().first();
      let body = $(this).parent().parent().next();
      if (icon.hasClass("glyphicon-chevron-up")) {
        icon.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
        body.slideUp();
      } else {
        icon.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        body.show("slow");
      }
    });
  }

  approve = (e, consentKey) => {
    e.stopPropagation();
    this.setState(prev => {
      prev.action = 'approve';
      prev.showConfirmationModal = true;
      prev.actionConsentKey = consentKey;
      return prev;
    });
  };

  reject = (e, consentKey) => {
    e.stopPropagation();
    this.setState(prev => {
      prev.action = 'reject';
      prev.showConfirmationModal = true;
      prev.actionConsentKey = consentKey;
      return prev;
    });
  };

  unlink = (e, consentKey) => {
    e.stopPropagation();
    this.setState(prev => {
      prev.action = 'unlink';
      prev.showConfirmationModal = true;
      prev.actionConsentKey = consentKey;
      return prev;
    });
  };

  requestClarification = (e, consentKey) => {
    console.log("request clarification");
    e.stopPropagation();
    this.setState(prev => {
      prev.showRequestClarification = true;
      prev.actionConsentKey = consentKey;
      return prev;
    });
  };

  parseData = (consents) => {
    let parsedArray = [];
    if (!isEmpty(consents)) {
      consents.forEach(consent => {
        let parsedData = {};
        parsedData.consent = consent;
        parsedData.search = false;
        parsedData.remoteProp = false;
        parsedData.data= consent.attachments;
        parsedData.columns= columns(this);
        parsedData.keyField= 'id';
        parsedData.defaultSorted= defaultSorted;
        parsedData.fileName= '_';
        parsedData.pagination= false;
        parsedData.showExportButtons = false;
        parsedData.showSearchBar = false;
        parsedData.customHandlers = {
          approveHandler: this.approve,
          rejectHandler: this.reject,
          unlinkHandler: this.unlink,
          requestClarificationHandler: this.requestClarification
        };
        parsedArray.push(parsedData)
      });
    }
    return parsedArray;
  };

  redirect = (action) => {
    const path = action === 'new' ? '/consent-group/new' : '/consent-group/use-existing';
    this.props.history.push(path)
  };

  removeAttachedDocument(file) {
    console.log("file to remove", file);
    this.setState(prev => {
      prev.fileIdToRemove = file.uuid;
      prev.action = 'removeAttachment';
      prev.showConfirmationModal = true;
      return prev;
    });
  }

  render() {
    return (
      h(Fragment, {}, [
        AlertMessage({
          msg: 'Please complete all required fields',
          show: this.state.showSuccessClarification,
          type: this.state.alertType
        }),
        button({
          className: "btn btn-default",
          style: { marginRight:'5px' },
          onClick:() => this.redirect('new')
        }, ['Add New Sample/Data Cohort']),
        button({
          className:"btn btn-default",
          onClick: () => this.redirect('useExisting')
        }, ['Use Existing Sample/Data Cohort'] ),
        h3({},['Sample/Data Cohort']),
        CollapsibleElements({
          body: TableComponent,
          header: SampleDataCohortsCollapsibleHeader,
          accordion: false,
          data: isEmpty(this.state.consentGroups) ? [] : this.parseData(this.state.consentGroups),
          extraData: { issue: this.state.issue }
        }),

      ConfirmationDialog({
        closeModal: this.closeConfirmationModal,
        show: this.state.showConfirmationModal,
        handleOkAction: this.handleOkConfirmation,
        bodyText: 'Are you sure you want to ' + this.state.action +  ' this Sample / Data Cohort?',
        actionLabel: 'Yes'
      }, []),
      RequestClarificationDialog({
        closeModal: this.closeRequestClarification,
        show: this.state.showRequestClarification,
        issueKey: component.projectKey,
        consentKey: this.state.actionConsentKey,
        user: component.user,
        emailUrl: component.emailUrl,
        userName: component.userName,
        clarificationUrl: component.requestLinkClarificationUrl,
        successClarification: this.successClarification,
        linkClarification: true
      }),
      h(Spinner, {
        name: "mainSpinner", group: "orsp", loadingImage: component.loadingImage
      })
     ]))
    }
});
