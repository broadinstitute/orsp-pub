import React, { Component } from 'react';
import { button, hh, span, div, i, a } from 'react-hyperscript-helpers';
import { handleRedirectToConsentGroup } from '../util/Utils';

const POINTER = { auto: { pointerEvents: 'auto' } };

export const SampleDataCohortsCollapsibleHeader = hh(class SampleDataCohortsCollapsibleHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: false
    };
  }

  componentDidMount() {
    this.setState( prev => {
      prev.isAdmin = component.isAdmin;
      return prev;
    })
  }

  render() {
    const { unlinkHandler, rejectHandler, approveHandler, requestClarificationHandler } = this.props.element.customHandlers;
    const { projectKey, summary, status } = this.props.element.consent;
    return(
      div({ name: 'container' }, [
        div({ name: 'actionButtons' }, [
          button({
            isRendered: status === 'Pending' && this.state.isAdmin,
            className: 'btn btn-default btn-sm confirmationModal',
            style: POINTER.auto,
            onClick: (e) => approveHandler(e, projectKey)
          },['Approve']),
          button({
            isRendered: status === 'Pending' && this.state.isAdmin,
            className: 'btn btn-default btn-sm confirmationModal',
            style: POINTER.auto,
            onClick: (e) => rejectHandler(e, projectKey)
          },['Reject']),
          button({
            isRendered: status === 'Approved' && this.state.isAdmin,
            className: 'btn btn-default btn-sm confirmationModal',
            style: POINTER.auto,
            onClick: (e) => unlinkHandler(e, projectKey)
          },['Unlink']),
        ]),

        div({ name: 'consentInfo' }, [
          a({
            style: POINTER.auto,
            href: handleRedirectToConsentGroup(component.serverURL, this.props.element.consent.projectKey, this.props.extraData.issue.projectKey)
          },[
            projectKey + ': ' + summary
          ])
        ]),

        div({ name: 'requestClarification' }, [
          button({
            className:'request-clarification',
            style: POINTER.auto,
            onClick:(e) =>  requestClarificationHandler(e, projectKey)
          },[
            span({ className: 'req-tooltip' },[ 'Request Clarification']),
            span({ className: 'arrow-down' },[])
          ])
        ]),

        div({ name: 'status' }, [
          span({ className:'status ' + (status === 'Approved' ? 'approved' : 'pending')},
            [ status === 'Approved' ? 'Approved' : 'Pending' ])
        ]),

        div({ name: 'collapseButton' },[
          button({
            className: 'btn buttonSecondary pull-right',
            style: POINTER.auto
          },[ i({ className: 'glyphicon glyphicon-chevron-down' },[])])
        ])

      ])
    )
  }
});