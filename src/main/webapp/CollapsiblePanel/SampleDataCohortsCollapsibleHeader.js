import React, { Component } from 'react';
import { button, hh, span, div, i, a } from 'react-hyperscript-helpers';
import { handleRedirectToConsentGroup, isEmpty } from '../util/Utils';
import '../components/Btn.css';

const POINTER = {
  auto: { pointerEvents: 'auto' },
  none: { pointerEvents: 'none' }
};

const STATUS = {
  approved: 'approved',
  pending: 'pending'
};

export const SampleDataCohortsCollapsibleHeader = hh(class SampleDataCohortsCollapsibleHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  linkToConsentGroup = (projectKey, summary) => {
    return a({
      onClick : (e) => e.stopPropagation(),
      className: 'data-name',
      style: POINTER.auto,
      href: handleRedirectToConsentGroup(component.serverURL, this.props.element.consent.projectKey, this.props.extraData.issue.projectKey)
    },[
      projectKey + ': ' + summary
    ])
  };

  render() {
    const { unlinkHandler, rejectHandler, approveHandler, requestClarificationHandler } = this.props.element.customHandlers;
    const { projectKey, summary} = this.props.element.consent;
    const  status = isEmpty(this.props.element.consent.status) ? '' : this.props.element.consent.status.toLowerCase();

    return(
      div({ className: 'sample-dc' }, [

        a({className:'pull-right'}, [
          span({
            className: 'consent-accordion-toggle btn btn-default',
            style: POINTER.auto
            },[ i({ className: 'glyphicon glyphicon-chevron-down' },[])
          ])
        ]),

        span({ className:'status ' + (status === STATUS.approved ? 'approved' : 'pending')},
          [ status === STATUS.approved ? 'Approved' : 'Pending'
        ]),

        div({className: 'panel-title'}, [
          div({className: 'cta-container'}, [
            button({
              isRendered: status === STATUS.pending && component.isAdmin,
              className: 'btn btn-default btn-sm confirmationModal',
              style: POINTER.auto,
              onClick: (e) => approveHandler(e, projectKey)
            },['Approve']),
            button({
              isRendered: status === STATUS.pending && component.isAdmin,
              className: 'btn btn-default btn-sm confirmationModal',
              style: POINTER.auto,
              onClick: (e) => rejectHandler(e, projectKey)
            },['Reject']),
            button({
              isRendered: status === STATUS.approved && component.isAdmin,
              className: 'btn btn-default btn-sm confirmationModal',
              style: POINTER.auto,
              onClick: (e) => unlinkHandler(e, projectKey)
            },['Unlink']),
          ]),

          div({ className: 'right-container' }, [
            button({
              className:'request-clarification',
              style: POINTER.auto,
              onClick:(e) =>  requestClarificationHandler(e, projectKey)
            },[
              span({ className: 'req-tooltip' },[ 'Request Clarification']),
              span({ className: 'arrow-down' },[])
            ]),
            this.linkToConsentGroup(projectKey, summary)
          ])
        ])
      ])
    )
  }
});
