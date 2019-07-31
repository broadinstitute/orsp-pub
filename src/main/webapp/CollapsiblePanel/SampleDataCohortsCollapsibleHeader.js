import React, { Component } from 'react';
import { button, hh, span, div, i, a } from 'react-hyperscript-helpers';
import { handleRedirectToConsentGroup } from '../util/Utils';
import '../components/Btn.css';

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
      div({ className: 'sample-dc' }, [

        a({className:'pull-right'}, [
          span({
            className: 'consent-accordion-toggle btn btn-default',
            style: POINTER.auto
            },[ i({ className: 'glyphicon glyphicon-chevron-down' },[])
          ])
        ]),

        span({ className:'status ' + (status === 'Approved' ? 'approved' : 'pending')},
          [ status === 'Approved' ? 'Approved' : 'Pending' 
        ]),

        div({className: 'panel-title'}, [
          div({className: 'cta-container'}, [
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

          div({ className: 'right-container' }, [
            button({
              className:'request-clarification',
              style: POINTER.auto,
              onClick:(e) =>  requestClarificationHandler(e, projectKey)
            },[
              span({ className: 'req-tooltip' },[ 'Request Clarification']),
              span({ className: 'arrow-down' },[])
            ]),

            a({ 
              className: 'data-name',
              style: POINTER.auto,
              href: handleRedirectToConsentGroup(component.serverURL, this.props.element.consent.projectKey, this.props.extraData.issue.projectKey)
            },[
              projectKey + ': ' + summary
            ])
          ])
        ])
      ])
    )
  }
});