import React, { Component } from 'react';
import { h, h1, div, a, p, ul, li, span, pre } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { DataUse } from "../util/ajax";
import { isEmpty } from "../util/Utils";
import { format } from 'date-fns';
import { DUR_QUESTIONS } from './DataUseRestrictionConstants';
import { AlertMessage } from '../components/AlertMessage';
import { Link } from 'react-router-dom';


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

class DataUseRestrictionDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      summary: [],
      restriction: {
        vaultConsentId: null,
        diseaseRestrictions: []
      },
      consent: {},
      samples: []
    };
    this.init();
  }

  init() {
    DataUse.getRestriction().then(result => {
      this.setState(prev => {
        prev.summary = result.data.summary;
        prev.restriction = result.data.restriction;
        prev.consent = result.data.consent;
        prev.consentResource = result.data.consentResource;
        prev.samples = result.data.collectionLinks;
        return prev;
      });
    });
  }

  createRow(columnLeft, columnRight, index) {
    let contentRight = p({ style: styles.tableListItem }, [columnRight]);
    if (index === 0) {
      contentRight = h(Link, {to: {pathname:'/newConsentGroup/main', search: '?consentKey=' + this.state.consent.projectKey, state: {issueType: 'consent-group', tab: 'documents', consentKey: this.state.consent.projectKey}}}, [columnRight])
    }
    if (index % 2 == 0) {
      return li({ style: styles.tableListRowOdd }, [
        span({ style: styles.tableListColLeft }, [p({ style: styles.tableListItem }, [columnLeft])]),
        span({ style: styles.tableListColRight }, [contentRight])
      ]);
    } 
    else {
      return li({ style: styles.tableListRow }, [
        span({ style: styles.tableListColLeft }, [p({ style: styles.tableListItem }, [columnLeft])]),
        span({ style: styles.tableListColRight }, [contentRight])
      ]);
    }
  }

  createRowList(columnLeft, data, index) {
    let diseases = '';
    if (data.length > 1) {
      diseases = data.map((rd, idx) => {
        return span({ style: { 'display': 'block' }, key: idx }, ['• ' + rd])
      });
    } else if (data.length == 1) {
      diseases = span({}, [data[0]]);
    }
    return this.createRow(columnLeft, diseases, index);
  }

  createDuosExportRow(columnLeft) {
    if (this.state.restriction.vaultConsentId) {
      return this.createRow(columnLeft, this.getExportContent());
    } else {
      return this.createRow(columnLeft, span({}, ['Not exported to DUOS']))
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
  
  getExportContent() {
    let exportContent = span({}, [
      span({ style: {'display': 'block'}, key: 'exportDate' }, ['• ' + 'Export Date: ' + format(new Date(this.state.restriction.vaultExportDate), 'MM/dd/yyyy')]),
      span({ style: {'display': 'block'}, key: 'consentId' }, ['• ' + 'Consent ID: ' + this.state.restriction.vaultConsentId]),
      span({ style: {'display': 'block'}, key: 'consentUrl' }, [a({ href: "${restrictionUrl}" }, ['• ' + 'Consent'])]),
      span({ style: {'display': 'block'}, key: 'consentAssciation' }, [a({ href: "${restrictionUrl}/association" }, ['• ' + 'Consent Samples'])])
    ]);
    return exportContent;
  }

  render() {
    return (
      div({}, [
        AlertMessage({
          msg: 'Your Project was successfully submitted to the Broad Institute’s Office of Research Subject Protection. It will now be reviewed by the ORSP team who will reach out to you if they have any questions.',
          show: false,
          type: 'danger'
        }),
        h1({ style: { 'margin': '20px 0', 'fontWeight': '700', 'fontSize': '35px' } }, ["Data Use Restrictions for Consent Group: " + this.state.consent.projectKey]),
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
                else if (idx === 14) {
                  return this.createRow(rd.question, !isEmpty(this.state.restriction[rd.fieldName]) ? format(new Date(this.state.restriction[rd.fieldName])) : '', idx);
                }
                else if (idx === 15 || idx === 16) {
                  if (this.state.restriction['recontactingDataSubjects']) {
                    return this.createRow(rd.question, this.state.restriction[rd.fieldName], idx);
                  }
                }
                else if (idx === 23) {
                  return this.createRow(rd.question, this.state.restriction[rd.fieldName] ? this.state.restriction[rd.fieldName] : "--", idx);
                }
                else if(idx === 28) {
                  return this.createDuosExportRow('DUOS Export', idx);
                }
                else {
                  return this.createRow(rd.question, this.state.restriction[rd.fieldName], idx);
                }
             })
            ]),
            a({className: 'btn buttonSecondary', style: {'marginTop':'15px'}, href: component.serverURL + '/dataUse/edit/' + this.state.restriction.id },['Edit'])
          ]),
        
          Panel({ title: "Export Data Use Restrictions to DUOS"},[
            p({}, ["Exporting consent data information to the vault will enable other systems to recognize the data use restrictions required for the samples that are associated to the consent group."]),
            pre({},[this.state.consentResource]),
            p({}, ["The following samples will be associated to this set of data use restrictions:"]),
            ul({},[
              this.getSamples()
            ]),
            div({className:'well'}, [
              p({}, ["Export (or update) this consent to DUOS."]),
              a({className: 'btn buttonSecondary', href: component.serverURL + '/dataUse/exportConsent?id=' + this.state.restriction.id },[this.state.restriction.vaultConsentId !== null ? 'Update Consent' : 'Export Consent'])
            ])
          ])
      ])
    )
  }
}

export default DataUseRestrictionDetails;