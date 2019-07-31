import React, { Component, Fragment } from 'react';
import { div, hh, h, hr, h3, a, button } from 'react-hyperscript-helpers';
import { ConsentGroup, ProjectMigration } from '../util/ajax';
import { ConsentCollectionLink } from '../util/ajax';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { RequestClarificationDialog } from "../components/RequestClarificationDialog";
import { Spinner } from "../components/Spinner";
import { CollapsibleElements } from "../CollapsiblePanel/CollapsibleElements";
import { isEmpty } from "../util/Utils";
import { TableComponent } from "../components/TableComponent";
import { SampleDataCohortsCollapsibleHeader } from "../CollapsiblePanel/SampleDataCohortsCollapsibleHeader";
import { formatUrlDocument, parseDate } from "../util/TableUtil";

const columns = [{
  dataField: 'id',
  text: 'Id',
  hidden: true,
  csvExport : false
}, {
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
      issue: {}
    };
    this.loadConsentGroups = this.loadConsentGroups.bind(this);
  }

  componentDidMount() {
    this.getConsentGroups();
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
        this.getConsentGroups();
        this.getProjectConsentGroups();
        this.closeConfirmationModal();
      });
    } else {
      ConsentCollectionLink.approveLink(this.state.issue.projectKey, this.state.actionConsentKey).then(resp => {
        this.getConsentGroups();
        this.getProjectConsentGroups();
        this.closeConfirmationModal();
      });
    }
  };

  getConsentGroups() {
    ProjectMigration.getConsentGroups(component.serverURL, component.projectKey).then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      }, () => {
        this.loadConsentGroups(this);
      });
    });
  };

  successClarification = () => {
    this.props.updateContent();
    this.closeRequestClarification();
  };

  loadConsentGroups = (rThis) => {
    $('.consent-group-panel-body').hide();
    $('.consent-accordion-toggle').on('click', function () {
      var icon = $(this).children().first();
      var body = $(this).parent().parent().next();
      if (icon.hasClass("glyphicon-chevron-up")) {
        icon.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
        body.slideUp();
      } else {
        icon.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
        body.show("slow");
      }
    });
    $(".modal-add-button").on('click', function () {
      $("#add-consent-document-modal").load(
        component.serverURL + "/api/consent-group/upload-modal?"
        + $.param({
          issueKey: $(this).data("issue"),
          consentKey: $(this).data("consent")
        }),
        function () {
          $(".chosen-select").chosen({ width: "100%" }).trigger("chosen:updated");
          $("button[data-dismiss='modal']").on("click", function () { $("#add-consent-document-modal").dialog("close"); });
        }
      ).dialog({
        modal: true,
        minWidth: 1000,
        minHeight: 500,
        closeOnEscape: true,
        hide: { effect: "fadeOut", duration: 300 },
        show: { effect: "fadeIn", duration: 300 },
        dialogClass: "no-titlebar"
      }).parent().removeClass("ui-widget-content");
      $(".ui-dialog-titlebar").hide();
    });

    $(".loadConsentGroups").on('click', function () {
      rThis.setState(prev => {
        prev.showConfirmationModal = true;
        prev.action = $(this).data("handler");
        prev.issueKey = $(this).data("issue");
        prev.consentKey = $(this).data("consent");
        return prev;
      });
    });
    $(".request-clarification").on('click', function () {
      rThis.setState(prev => {
        prev.showRequestClarification = true;
        prev.issueKey = $(this).data("issue");
        prev.consentKey = $(this).data("consent");
        return prev;
      });
    });
    // Display for 8 seconds a message indicating the submission of a new consent group.
    // This is temporary until this page is moved to react.
    // https://broadinstitute.atlassian.net/browse/BTRX-628
    var url = new URLSearchParams(window.location.search);
    if (url.get('tab') === 'consent-groups' && url.has('new')) {
      $('#alert').fadeIn('slow', function () {
        $('#alert').delay(15000).fadeOut();
        history.pushState({}, null, window.location.href.split('&')[0]);
      });
    }
  };

  getProjectConsentGroups = () => {
    ConsentGroup.getProjectConsentGroups(component.projectKey).then( result => {
        this.setState(prev => {
          prev.consentGroups = result.data.consentGroups;
          prev.issue = result.data.issue;
          return prev;
        });
      }
    )
  };

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
        // parsedData.data= isEmpty(consent.attachments) ? null : consent.attachments;
        parsedData.columns= columns;
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

  render() {
    return (
      h(Fragment, {}, [
        div({ dangerouslySetInnerHTML: { __html: this.state.content } }, []),
        button({ className: "btn btn-default", style: { marginRight:'5px' } }, ['New Sample/Data Cohort']),
        button({ className:"btn btn-default" }, ['New Sample/Data Cohort'] ),
        h3({},['Sample/Data Cohort']),
        CollapsibleElements({
          customHandlers: {
            approve: this.approve,
            reject: this.reject
          },
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
