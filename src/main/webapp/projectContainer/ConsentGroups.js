import React, { Component, Fragment } from 'react';
import { div, hh, h, h1 } from 'react-hyperscript-helpers';
import { ProjectMigration } from '../util/ajax';
import { ConsentCollectionLink } from '../util/ajax';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { RequestClarificationDialog } from "../components/RequestClarificationDialog";
import { Spinner } from "../components/Spinner";
import Collapse, { Panel } from 'rc-collapse';
import 'rc-collapse/assets/index.css';
const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
const arrowPath = 'M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88' +
  '.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.' +
  '6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-0.7 5.' +
  '2-2L869 536.2c14.7-12.8 14.7-35.6 0-48.4z';
function expandIcon({ isActive }) {
  return (
    <i style={{ marginRight: '.5rem' }}>
      <svg
        viewBox="0 0 1024 1024"
        width="1em"
        height="1em"
        fill="currentColor"
        style={{
          verticalAlign: '-.125em',
          transition: 'transform .2s',
          transform: `rotate(${isActive ? 90 : 0}deg)`,
        }}
      >
        <path d={arrowPath} p-id="5827"></path>
      </svg>
    </i>
  );
}

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
      activeKey: ['4'],
      accordion: false

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
    if(this.state.action === "unlink" || this.state.action === "reject") {
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
  }

  onChange = (activeKey) => {
    this.setState({
      activeKey,
    });
  }

  toggle = () => {
    this.setState({
      accordion: !this.state.accordion,
    });
  }

  render() {
    const accordion = this.state.accordion;
    const btn = accordion ? 'Mode: accordion' : 'Mode: collapse';
    const activeKey = this.state.activeKey;
    return (
     h(Fragment, {}, [       
      // div({ dangerouslySetInnerHTML: { __html: this.state.content } }, []),
       h(Collapse,{
         accordion: true,
         onChange:this.onChange,
         activeKey:activeKey,
         expandIcon:expandIcon
       }, [


         <Panel header={`This is panel header `} key={1}>
          <p>{text.repeat(1)}</p>
         </Panel>,
           <Panel header="hello" headerClass="my-header-class">this is panel content</Panel>,
           <Panel header="title2">this is panel content2 or other</Panel>
       ]),
       // <Collapse accordion={true}>
       //   <Panel header="hello" headerClass="my-header-class">this is panel content</Panel>
       //   <Panel header="title2">this is panel content2 or other</Panel>
       // </Collapse>




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
        consentKey: this.state.consentKey,
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
