import React, { Component, Fragment } from 'react';
import { button, hh, h, h3, span, div, i, a } from 'react-hyperscript-helpers';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { handleRedirectToProject } from "../util/Utils";

const POINTER = { auto: { pointerEvents: 'auto' } };

export const SampleDataCohortsCollapsibleHeader = hh(class SampleDataCohortsCollapsibleHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    // console.log("attachments de ",this.props.element.consent.projectKey, " => ", this.props.element.consent.attachments);
    // console.log(" => ", this.props.element.consent);
    return(
      div({name: 'container'}, [
        div({name: 'actionButtons'}, [
          button({
            className: "btn btn-default btn-sm confirmationModal",
            style: POINTER.auto,
            onClick: this.props.element.customHandlers.approve
          },["Approve"]),
          button({
            className: "btn btn-default btn-sm confirmationModal",
            style: POINTER.auto,
            onClick: this.props.element.customHandlers.reject
          },["Reject"]),
          // h(BootstrapTable,{keyField:'id', data:[], columns: columns}),
        ]),
        // handleRedirectToProject
        // a({ href: handleRedirectToProject(component.serverURL, row.projectKey) },[row.projectKey])
        div({name: 'consentInfo'}, [
          a({
            style: POINTER.auto,
            href: handleRedirectToProject(component.serverURL, this.props.element.consent.projectKey)
          },[
            this.props.element.consent.projectKey+ ': ' + this.props.element.consent.summary
          ])
        ]),
        div({name: 'requestClarification'}, [
          button({
            className:"request-clarification",
            style: POINTER.auto,
            onClick: this.props.element.customHandlers.requestClarification
          },[
            span({ className: "req-tooltip" },[ 'Request Clarification']),
            span({ className: "arrow-down" },[])
          ])
        ]),
        // console.log("STATUS de ",this.props.element.consent.projectKey, " => ", this.props.element.consent.status),
        div({ name: 'status' }, [
          span({ className:"status " + (this.props.element.consent.status === "Approved" ? "approved" : 'pending')},[this.props.element.consent.status === "Approved" ? 'Approved' : "Pending"])
        ]),
          /*
          *             <g:if test="${consent.status == 'Approved'}">
                <span class="status approved">Approved</span>
              </g:if>
              <g:if test="${consent.status != 'Approved'}">
                <span class="status pending">Pending</span>
              </g:if>
          * */


        div({ name: 'collapseButton'},[
          button({
            className: "btn buttonSecondary pull-right",
            style: POINTER.auto
          },[
              i({className: "glyphicon glyphicon-chevron-down"},[])
            ]
          )
        ])
      ])
    )
  }
});