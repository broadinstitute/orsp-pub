import React, { Component } from 'react';
import { button, hh, span, div, i, a } from 'react-hyperscript-helpers';
import { buildUrlToConsentGroup, isEmpty } from '../util/Utils';
import '../components/Btn.css';

const styles = {
  pointer: {
    auto: { pointerEvents: 'auto' },
    none: { pointerEvents: 'none' }
  },
  statusBase: {
    float: 'right',
    padding: '5px 18px',
    borderRadius: '4px',
    marginRight: '15px',
    cursor: 'default'
  },
  statusApproved: {
    backgroundColor: '#DFF0D8',
    color: '#3C763D'
  },
  statusPending: {
    backgroundColor: '#F0E5A9',
    color: '#333333'
  },
  link: {
      textDecoration: "none",
      display: "inline-block",
      height: "42px",
      lineHeight: "30px",
      color:"#000000",
  }
};

const approved = { ...styles.statusBase, ...styles.statusApproved};
const pending = { ...styles.statusBase, ...styles.statusPending};

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
    let linkStyle = {...styles.pointer.auto, ...styles.link};
    return a({
      onClick : (e) => e.stopPropagation(),
      style: linkStyle,
      onMouseEnter: (e) => e.currentTarget.style.textDecoration = "underline",
      onMouseLeave: (e) => e.currentTarget.style.textDecoration = "none",
    href: buildUrlToConsentGroup(component.serverURL, this.props.element.consent.projectKey, this.props.extraData.issue.projectKey)
    },[
      projectKey + ': ' + summary
    ])
  };

  render() {
    const { unlinkHandler, rejectHandler, approveHandler, requestClarificationHandler } = this.props.element.customHandlers;
    const { projectKey, summary} = this.props.element.consent;
    const  status = isEmpty(this.props.element.consent.issueStatus) ? '' : this.props.element.consent.issueStatus.toLowerCase();

    return(
      div({ style: { width: '100%' } }, [
        a({className:'pull-right'}, [
          span({
            className: 'consent-accordion-toggle btn btn-default',
            style: styles.pointer.auto
            },[ i({ className: 'glyphicon glyphicon-chevron-down' },[])
          ])
        ]),
        span({ style: status === STATUS.approved ? approved : pending },
          [ status === STATUS.approved ? 'Approved' : 'Pending'
        ]),
        div({className: 'panel-title'}, [
          div({className: 'cta-container'}, [
            button({
              isRendered: component.isAdmin && (status === STATUS.pending || isEmpty(status)),
              className: 'btn btn-default btn-sm confirmationModal',
              style: styles.pointer.auto,
              onClick: (e) => approveHandler(e, projectKey)
            },['Approve']),
            button({
              isRendered: component.isAdmin && (status === STATUS.pending || isEmpty(status)),
              className: 'btn btn-default btn-sm confirmationModal',
              style: styles.pointer.auto,
              onClick: (e) => rejectHandler(e, projectKey)
            },['Reject']),
            button({
              isRendered: status === STATUS.approved && component.isAdmin,
              className: 'btn btn-default btn-sm confirmationModal',
              style: styles.pointer.auto,
              onClick: (e) => unlinkHandler(e, projectKey)
            },['Unlink']),
          ]),

          div({ className: 'right-container' }, [
            button({
              isRendered: component.isAdmin,
              className:'request-clarification',
              style: styles.pointer.auto,
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
