import { Component } from 'react';
import { div, hh } from 'react-hyperscript-helpers';
import { ProjectMigration } from '../util/ajax';

export const ConsentGroups = hh(class ConsentGroups extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: ''
    };
  }

  componentDidMount() {
    this.getConsentGroups();
  }

  getConsentGroups() {
    ProjectMigration.getConsentGroups(component.serverURL, component.projectKey).then(resp => {
      this.setState(prev => {
        prev.content = resp.data;
        return prev;
      }, () => {
        this.loadConsentGroups();
      });
    });
  };

  loadConsentGroups() {
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
      $("#confirmation-modal-dialog").load(
      component.serverURL + "/api/consent-group/confirmation-modal?"
      + $.param({
          issueKey: $(this).data("issue"),
          consentKey: $(this).data("consent"),
          action: $(this).data("action")
        }),
        function () {
          $(".chosen-select").chosen({ width: "100%" }).trigger("chosen:updated");
          $("button[data-dismiss='modal']").on("click", function () { $("#confirmation-modal-dialog").dialog("close"); });
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
    $(".request-clarification").on('click', function () {
      $("#request-clarification-dialog").load(
      component.serverURL + "/api/consent-group/request-clarification?"
      + $.param({
          issueKey: $(this).data("issue"),
          consentKey: $(this).data("consent"),
          action: $(this).data("action")
        }),
        function () {
          $(".chosen-select").chosen({ width: "100%" }).trigger("chosen:updated");
          $("button[data-dismiss='modal']").on("click", function () { $("#request-clarification-dialog").dialog("close"); });
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
      div({ dangerouslySetInnerHTML: { __html: this.state.content } }, [])
    )
  }
});
