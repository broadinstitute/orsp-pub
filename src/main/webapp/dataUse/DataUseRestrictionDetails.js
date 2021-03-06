import React, { Component } from 'react';
import { a, button, div, h, h1, hh, li, p, pre, span, ul } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { ConsentGroup, DataUse } from '../util/ajax';
import { isEmpty } from '../util/Utils';
import { format } from 'date-fns';
import { DUR_QUESTIONS } from './DataUseRestrictionConstants';
import { AlertMessage } from '../components/AlertMessage';
import { Link } from 'react-router-dom';
import { UrlConstants } from '../util/UrlConstants';
import LoadingWrapper from '../components/LoadingWrapper';

const styles = {
  tableList: {
    padding: '0',
    margin: '0',
    border: '1px solid #E1E1E1',
    borderRadius: '4px',
    display: 'grid',
    width: '100%'
  },
  tableListRow: {
    listStyle: 'none',
    padding: '0',
    borderBottom: '1px solid #E1E1E1',
    display: 'inline-block',
    width: '100%'
  },
  tableListRowOdd: {
    listStyle: 'none',
    padding: '0',
    borderBottom: '1px solid #E1E1E1',
    display: 'inline-block',
    width: '100%',
    backgroundColor: '#F9F9F9'
  },
  tableListColLeft: {
    padding: '10px 0 10px 15px',
    display: 'block',
    float: 'left',
    width: '60%',
    clear: 'both',
    fontWeight: 'bold'
  },
  tableListColRight: {
    padding: '10px 15px 10px 20px',
    display: 'block',
    float: 'left',
    width: '40%',
    borderLeft: '1px solid #E1E1E1'
  },
  tableListItem: {
    width: '100%',
    margin: '0',
    minHeight: '20px'
  }
};

const DataUseRestrictionDetails = hh(class DataUseRestrictionDetails extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    const params = new URLSearchParams(this.props.location.search);
    this.state = {
      restrictionId: params.get('restrictionId'),
      summary: [],
      restrictionUrl: '',
      message: null,
      messageType: null,
      restriction: {
        vaultConsentId: null,
        diseaseRestrictions: []
      },
      consent: {
        projectKey: '',
        summary: ''
      },
      samples: []
    };
    this.exportConsent = this.exportConsent.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.init();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  init() {
    this.props.showSpinner();
    DataUse.getRestriction(this.state.restrictionId).then(result => {
      if (this._isMounted) {
        this.setState(prev => {
          prev.summary = result.data.summary;
          prev.restriction = result.data.restriction;
          prev.consent = result.data.consent;
          prev.consentResource = result.data.consentResource;
          prev.samples = result.data.samples;
          prev.restrictionUrl = result.data.restrictionUrl;
          return prev;
        }, () => {
          this.props.hideSpinner();
          this.scrollTop();
        });
      }
    });
  }

  createRow(columnLeft, columnRight, index, raw) {
    let contentRight = raw !== false ?
             p({ style: styles.tableListItem, dangerouslySetInnerHTML: { __html: columnRight }}, []) :
             p({ style: styles.tableListItem }, [columnRight]);
    if (index === 0) {
      contentRight = h(Link, {to: {pathname:'/newConsentGroup/main', search: '?consentKey=' + this.state.consent.projectKey, state: {issueType: 'consent-group', tab: 'documents', consentKey: this.state.consent.projectKey}}}, [columnRight]);
    }
    let style = index % 2 == 0 ? styles.tableListRowOdd : styles.tableListRow;
    return li({ style: style, key: index }, [
        span({ style: styles.tableListColLeft }, [p({ style: styles.tableListItem, dangerouslySetInnerHTML: { __html: columnLeft }}, [])]),
        span({ style: styles.tableListColRight }, [contentRight])
      ]);
  }
 
  createRowList(columnLeft, data, index) {
    let diseases = '';
    if (data.length > 1) {
      diseases = data.map((rd, idx) => {
        return span({ style: { 'display': 'block' }, key: idx }, ['• ' + rd])
      });
    } else if (data.length == 1) {
      diseases = span({key:'disease'}, [data[0]]);
    }
    return this.createRow(columnLeft, diseases, index, false);
  }

  createDuosExportRow(columnLeft, index) {
    if (this.state.restriction.vaultConsentId) {
      return this.createRow(columnLeft, this.getExportContent(), index, false);
    } else {
      return this.createRow(columnLeft, span({}, ['Not exported to DUOS']), index, false)
    }
  }

  getSamples() {
    let samples = [];
    if (this.state.samples !== null && this.state.samples !== undefined) {
      this.state.samples.map((sample, idx) => {
        if (sample != null && sample != undefined) {
          samples.push(li({key: idx},[sample.id + ': ' + sample.name]));
        }
      });
    }
    return samples;     
  }

  exportConsent() {
    this.props.showSpinner();
    ConsentGroup.exportConsent(this.state.restriction.id).then(resp => {
      this.setState(prev => {
        prev.message = resp.data.message;
        prev.messageType = 'success';
        return prev;
      }, () => {
        this.scrollTop();
        this.props.hideSpinner();
      });
    }).catch(error => {
      this.setState(prev => {
        prev.message = error.response.data.message;
        prev.messageType = 'danger';
        return prev;
      }, () => {
        this.scrollTop();
        this.props.hideSpinner();
      });
    });
  }

  scrollTop() {
    $('html, body').animate({ scrollTop: top }, 'fast');
  }

  getExportContent() {
    let exportContent = span({}, [
      span({ style: {'display': 'block'}, key: 'exportDate' }, ['• ' + 'Export Date: ' + format(new Date(this.state.restriction.vaultExportDate), 'MM/DD/YYYY')]),
      span({ style: {'display': 'block'}, key: 'consentId' }, ['• ' + 'Consent ID: ' + this.state.restriction.vaultConsentId]),
      span({ style: {'display': 'block'}, key: 'consentUrl' }, [a({ href: this.state.restrictionUrl}, ['• ' + 'Consent'])]),
      span({ style: {'display': 'block'}, key: 'consentAssciation' }, [a({ href: this.state.restrictionUrl + '/association'}, ['• ' + 'Consent Samples'])])
    ]);
    return exportContent;
  }

  render() {
    return (
      div({}, [
        h1({ style: { 'margin': '20px 0', 'fontWeight': '700', 'fontSize': '35px' } }, ["Data Use Restrictions for Consent Group: " + this.state.consent.projectKey]),
        AlertMessage({
          msg: this.state.message,
          show: this.state.error !== null,
          type: this.state.messageType
        }),
        Panel({ title: "Data Use Restriction Summary" }, [
          p({}, [
            this.state.summary.map((rd, idx) => {
              return span({ style: { 'display': 'block' }, key: idx }, [rd])
            })
          ])
        ]),
        Panel({
          title: "Data Use Restriction Details"
        }, [
            ul({ style: styles.tableList }, [
              DUR_QUESTIONS.map((rd, idx) => {
                if (idx === 0) {
                 return this.createRow(rd.question, this.state.consent.projectKey + ': ' + this.state.consent.summary, idx);
                }
                else if (rd.boolean) {
                  return  this.createRow(rd.question, this.state.restriction[rd.fieldName]  ? "Yes" : "No", idx);
                }
                else if (idx === 5) {
                  return this.createRowList(rd.question, this.state.restriction[rd.fieldName], idx);
                }
                // date format
                else if (idx === 15) {
                  return this.createRow(rd.question, !isEmpty(this.state.restriction[rd.fieldName]) ? format(new Date(this.state.restriction[rd.fieldName]), 'MM/DD/YYYY') : '', idx);
                }
                else if (idx === 16 || idx === 17) {
                  if (this.state.restriction['recontactingDataSubjects']) {
                    return this.createRow(rd.question, this.state.restriction[rd.fieldName], idx);
                  }
                }
                else if (idx === 24) {
                  return this.createRow(rd.question, this.state.restriction[rd.fieldName] ? this.state.restriction[rd.fieldName] : "--", idx);
                }
                else if(idx === 29) {
                  return this.createDuosExportRow('DUOS Export', idx);
                }
                else {
                  return this.createRow(rd.question, this.state.restriction[rd.fieldName], idx);
                }
             })
            ]),
            h(Link, {
              isRendered: !component.isViewer, className: "btn buttonSecondary", style: {'marginTop':'15px'},
              to: { pathname: UrlConstants.restrictionUrl, search: '?restrictionId=' + this.state.restriction.id + '&consentKey=' + this.state.consent.projectKey }
            }, ["Edit"]),
          ]),        
          Panel({ title: "Export Data Use Restrictions to DUOS"},[
            p({}, ["Exporting consent data information to the vault will enable other systems to recognize the data use restrictions required for the samples that are associated to the consent group."]),
            pre({},[this.state.consentResource]),
            p({}, ["The following samples will be associated to this set of data use restrictions:"]),
            ul({},[
              this.getSamples()
            ]),
            div({isRendered: !component.isViewer, className:'well'}, [
              p({}, ["Export (or update) this consent to DUOS."]),
              button({
                className: "btn buttonSecondary",
                onClick: this.exportConsent,
              }, [this.state.restriction.vaultConsentId !== null ? 'Update Consent' : 'Export Consent'])
            ])
          ])
      ])
    )
  }
});
export default LoadingWrapper(DataUseRestrictionDetails);
