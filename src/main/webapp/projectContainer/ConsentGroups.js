import { Component, Fragment } from 'react';
import { div, hh, h } from 'react-hyperscript-helpers';
import { ProjectMigration } from '../util/ajax';
import { ConsentCollectionLink } from '../util/ajax';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { RequestClarificationDialog } from "../components/RequestClarificationDialog";

export const ConsentGroups = hh(class ConsentGroups extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: '',
      showConfirmationModal: false,
      action: '',
      issueKey: '',
      consentKey: '',
      showRequestClarification: false
    };
    this.loadConsentGroups = this.loadConsentGroups.bind(this);
  }

  componentDidMount() {
    this.getConsentGroups();
  }

  closeConfirmationModal = () => {
    this.setState({showConfirmationModal: !this.state.showConfirmationModal});
  };

  closeRequestClarification = () => {
    this.setState({showRequestClarification: false});
  };

  handleOkConfirmation = () => {
    if(this.state.action == "unlink" || this.state.action == "reject") {
      ConsentCollectionLink.breakLink(this.state.issueKey, this.state.consentKey, this.state.action).then(resp => {
        this.getConsentGroups();
        this.closeConfirmationModal();
      });
    } else {
      ConsentCollectionLink.approveLink(this.state.issueKey, this.state.consentKey).then(resp => {
        this.getConsentGroups();
        this.closeConfirmationModal();
      });
    }
  };

  toggleState = (e) => () => {
    this.setState((state, props) => {
      return { [e]: !state[e] }
    });
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

    $(".confirmationModal").on('click', function () {
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
    // Display for 8 seconds a message indicating the submission of a new consent group. This is temporary until this page is moved to react.
    // https://broadinstitute.atlassian.net/browse/BTRX-628
    var url = new URLSearchParams(window.location.search);
    if (url.get('tab') === 'consent-groups' && url.has('new')) {
      $('#alert').fadeIn('slow', function () {
        $('#alert').delay(8000).fadeOut();
        history.pushState({}, null, window.location.href.split('&')[0]);
      });
    }
  }

  render() {
    return (
     h(Fragment, {}, [       
      div({ dangerouslySetInnerHTML: { __html: this.state.content } }, []),
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
        issueKey: this.state.issueKey,
        user: component.user,
        emailUrl: component.emailUrl,
        userName: component.userName,
        clarificationUrl: component.requestLinkClarificationUrl,
        successClarification: this.successClarification,
        linkClarification: true
      }),
     ]))
    }
});
