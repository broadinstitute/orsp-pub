import React, { Component, Fragment } from 'react';
import { a, button, h, h3, hh } from 'react-hyperscript-helpers';
import { ConsentCollectionLink, ConsentGroup, DocumentHandler } from '../util/ajax';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import RequestClarificationDialog from '../components/RequestClarificationDialog';
import { CollapsibleElements } from '../CollapsiblePanel/CollapsibleElements';
import { isEmpty } from '../util/Utils';
import { TableComponent } from '../components/TableComponent';
import { SampleDataCohortsCollapsibleHeader } from '../CollapsiblePanel/SampleDataCohortsCollapsibleHeader';
import { formatUrlDocument, parseDate } from '../util/TableUtil';
import { AlertMessage } from '../components/AlertMessage';
import { UrlConstants } from '../util/UrlConstants';
import LoadingWrapper from '../components/LoadingWrapper';

const columns = (cThis) => [{
  dataField: 'id',
  text: 'Id',
  hidden: true,
  editable: false,
  csvExport : false
},
{
  dataField: 'uuid',
  text: '',
  style: { pointerEvents: 'auto' },
  editable: false,
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
  text: 'Attachment Type',
  editable: false
}, {
  dataField: 'fileName',
  text: 'File Name',
  style: { pointerEvents: 'auto' },
  editable: false,
  formatter: (cell, row, rowIndex, colIndex) =>
    a(formatUrlDocument(row), [row.fileName])
},{
  dataField: 'description',
  text: 'File Description'
},{
  dataField: 'creator',
  text: 'Author',
  editable: false
},
{
  dataField: 'creationDate',
  text: 'Created',
  editable: false,
  formatter: (cell, row, rowIndex, colIndex) =>
    isEmpty(row.creationDate) ? '' : parseDate(row.creationDate)
}
];

const defaultSorted = [{
  dataField: 'projectKey',
  order: 'desc'
}];

const ConsentGroups = hh(class ConsentGroups extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      showConfirmationModal: false,
      action: '',
      issueKey: '',
      consentKey: '',
      showRequestClarification: false,
      actionConsentKey: '',
      fileIdToRemove: '',
      issue: {},
      showSuccessClarification: false,
      showSaveAndCancel: false,
      columns: (_this) => [{
        dataField: 'id',
        text: 'Id',
        hidden: true,
        editable: false,
        csvExport : false
      },
      {
        dataField: 'uuid',
        text: '',
        style: { pointerEvents: 'auto' },
        editable: false,
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
        text: 'Attachment Type',
        editable: false
      }, {
        dataField: 'fileName',
        text: 'File Name',
        style: { pointerEvents: 'auto' },
        editable: false,
        formatter: (cell, row, rowIndex, colIndex) =>
          a(formatUrlDocument(row), [row.fileName])
      },{
        dataField: 'description',
        text: 'File Description',
        events: {
          onClick: (e) => {
            e.detail === 2 ? this.saveAndCancelToggle() : undefined
          }
        }
      },{
        dataField: 'creator',
        text: 'Author',
        editable: false
      },
      {
        dataField: 'creationDate',
        text: 'Created',
        editable: false,
        formatter: (cell, row, rowIndex, colIndex) =>
          isEmpty(row.creationDate) ? '' : parseDate(row.creationDate)
      }
      ]
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.showSpinner();
    this.getProjectConsentGroups();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getProjectConsentGroups = () => {
    ConsentGroup.getProjectConsentGroups(this.props.projectKey).then( result => {
      if (this._isMounted) {
        this.handleSuccessNotification();
        this.setState(prev => {
          prev.consentGroups = result.data.consentGroups;
          prev.issue = result.data.issue;
          return prev;
        },() => {
          this.collapseBtnAnimationListener();
          this.props.hideSpinner();
        });
      }
    }).catch(() => {
      this.props.hideSpinner();
    });
  };

  closeConfirmationModal = () => {
    this.setState({showConfirmationModal: !this.state.showConfirmationModal});
  };

  closeRequestClarification = () => {
    this.setState({showRequestClarification: false});
  };

  handleOkConfirmation = () => {
    this.props.showSpinner();
    if(this.state.action === "unlink" || this.state.action === "reject") {
      ConsentCollectionLink.breakLink(this.state.issue.projectKey, this.state.actionConsentKey, this.state.action).then(resp => {
        this.getProjectConsentGroups();
        this.closeConfirmationModal();
      });
    } else if (this.state.action === "submitToIRB") {
      ConsentCollectionLink.submittedToIRBLink(this.state.issue.projectKey, this.state.actionConsentKey).then(resp => {
        this.getProjectConsentGroups();
        this.closeConfirmationModal();
      });
    } else if (this.state.action === 'remove') {
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

  handleSuccessNotification = () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('new') && urlParams.get('tab') === 'consent-groups') {
      history.pushState({}, null, window.location.href.replace('&new',''));
      setTimeout(this.clearAlertMessage, 8000, null);
      this.props.updateContent();
      this.setState(prev => {
        prev.showSuccessClarification = true;
        prev.alertType = 'success';
        return prev;
      });
    }
  };

  clearAlertMessage = () => {
    this.setState(prev => {
      prev.showSuccessClarification = false;
      return prev;
    });
  };

  successClarification = () => {
    this.props.updateContent();
    this.closeRequestClarification();
  };

  collapseBtnAnimationListener() {
    $('.consent-accordion-toggle').on('click', function () {
      const icon = $(this).children().first();
      const body = $(this).parent().parent().next();
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

  submittedToIRB = (e, consentKey) => {
    e.stopPropagation();
    this.setState(prev => {
      prev.action = 'submitToIRB';
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
    e.stopPropagation();
    this.setState(prev => {
      prev.showRequestClarification = true;
      prev.actionConsentKey = consentKey;
      return prev;
    });
  };

  parseCollapsibleElementsData = (consents) => {
    let parsedArray = [];
    if (!isEmpty(consents)) {
      parsedArray = consents.map(consent => {
        return {
          consent : consent,
          search : false,
          remoteProp : false,
          data: consent.attachments,
          columns: this.state.columns(this),
          keyField: 'id',
          defaultSorted: defaultSorted,
          fileName: '_',
          pagination: false,
          showExportButtons : false,
          showSearchBar : false,
          customHandlers : {
            approveHandler: this.approve,
            rejectHandler: this.reject,
            unlinkHandler: this.unlink,
            submittedToIRBHandler: this.submittedToIRB,
            requestClarificationHandler: this.requestClarification
          },
          showSaveAndCancel: this.state.showSaveAndCancel,
          saveHandler: this.saveHandler,
          cancelHandler: this.cancelHandler
        }
      });
    }
    return parsedArray;
  };

  redirect = (action) => {
    const path = action === 'new' ? UrlConstants.newConsentGroupUrl + '?projectKey='+ this.props.projectKey : UrlConstants.useExistingConsentGroupUrl+ '?projectKey='+ this.props.projectKey;
    this.props.history.push(path)
  };

  removeAttachedDocument(file) {
    this.setState(prev => {
      prev.fileIdToRemove = file.uuid;
      prev.action = 'remove';
      prev.showConfirmationModal = true;
      return prev;
    });
  }

  saveAndCancelToggle() {
    this.setState({
      showSaveAndCancel: !this.state.showSaveAndCancel
    })
  }

  saveHandler(data) {
    this.saveAndCancelToggle();
    console.log(data);
  }

  cancelHandler() {
    this.saveAndCancelToggle();
  }

  render() {
    return (
      h(Fragment, {}, [
        AlertMessage({
          msg: 'Your Sample/Data Cohort was successfully submitted to the Broad Institute’s Office of Research Subject Protection. ' +
            'It will now be reviewed by the ORSP team who will reach out to you if they have any questions.',
          show: this.state.showSuccessClarification,
          type: 'success'
        }),
        button({
          isRendered: !component.isViewer,
          className: "btn btn-default",
          style: { marginRight:'5px' },
          onClick:() => this.redirect('new')
        }, ['Add New Sample/Data Cohort']),
        button({
          isRendered: !component.isViewer,
          className:"btn btn-default",
          onClick: () => this.redirect('useExisting')
        }, ['Use Existing Sample/Data Cohort'] ),
        h3({ isRendered: !isEmpty(this.state.consentGroups) },['Sample/Data Cohort']),
        CollapsibleElements({
          body: TableComponent,
          header: SampleDataCohortsCollapsibleHeader,
          accordion: false,
          data: isEmpty(this.state.consentGroups) ? [] : this.parseCollapsibleElementsData(this.state.consentGroups),
          extraData: { issue: this.state.issue, history: this.props.history }
        }),

        ConfirmationDialog({
          closeModal: this.closeConfirmationModal,
          show: this.state.showConfirmationModal,
          handleOkAction: this.handleOkConfirmation,
          bodyText: 'Are you sure you want to ' + (this.state.action === "submitToIRB" ? "submit to IRB" : this.state.action ) +  ' this Sample / Data Cohort?',
          actionLabel: 'Yes'
        }, []),

        h(RequestClarificationDialog, {
          closeModal: this.closeRequestClarification,
          show: this.state.showRequestClarification,
          issueKey: this.props.projectKey,
          consentKey: this.state.actionConsentKey,
          user: component.user,
          emailUrl: component.emailUrl,
          userName: component.userName,
          clarificationUrl: component.requestLinkClarificationUrl,
          successClarification: this.successClarification,
          linkClarification: true
        })
      ])
    )
  }
});
export default LoadingWrapper(ConsentGroups);
