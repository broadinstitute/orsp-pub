import React, { Component } from 'react';
import { h, h1, div, a, p, ul, li, span } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { DataUse } from "../util/ajax";
import { isEmpty } from "../util/Utils";
import { format } from 'date-fns';

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
    backgroundColor: 'red'
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
        diseaseRestrictions: []
      },
      consent: {}
    };
    this.init();
  }

  init() {
    DataUse.getRestriction().then(result => {
      console.log(result);
      this.setState(prev => {
        prev.summary = result.data.summary;
        prev.restriction = result.data.restriction;
        prev.consent = result.data.consent;
        return prev;
      });
    });
  }

  createRow(columnLeft, columnRight, link, zebra) {
    let contentLeft = p({style: styles.tableListItem}, [columnRight]);
    if (link !== undefined) {
      contentLeft = a({style: styles.tableListItem, href: link }, [columnRight])
    }
    return li({style: {...styles.tableListRow, ...zebra}} [
      span({style: styles.tableListColLeft}, [p({style: styles.tableListItem}, [columnLeft])]),
      span({style: styles.tableListColRight}, [contentLeft])
    ]);
  }

  createRowList(columnLeft, data) {
    let diseases = '';
    if (data.length > 1) {
     diseases =  data.map((rd, idx) => {
        return span({style: {'display':'block'}, key: idx},['• ' + rd])
     });
    } else if (data.length > 1) {
      diseases = span({},[data[0]]);
    }
    return this.createRow(columnLeft, diseases);
  }

  createDuosExportRow(columnLeft) {
    if (this.state.restriction.vaultConsentId) {
      return this.createRow(columnLeft,  
            (
            span({style: {'display':'block'}},['• ' + 'Export Date: ' + format(new Date(this.state.restriction.vaultExportDate), 'MM/dd/yyyy')]),
            span({style: {'display':'block'}},['• ' + 'Consent ID: ' + this.state.restriction.vaultConsentId]),
            span({style: {'display':'block'}},[a({ href: "${restrictionUrl}" }, ['• ' + 'Consent'])]),
            span({style: {'display':'block'}},[a({ href: "${restrictionUrl}/association" }, ['• ' + 'Consent Samples'])]))
            )
    } else {
      return this.createRow(columnLeft, span({}, ['Not exported to DUOS']))
    }
  }

  render() {
    return (
      div({}, [
        h1({ style: { 'margin': '20px 0', 'fontWeight': '700', 'fontSize': '35px' } }, ["Data Use Restrictions for Consent Group: " + this.state.consent.projectKey]),
        Panel({ title: "Data Use Restriction Summary" }, [
          p({}, [
          this.state.summary.map((rd, idx) => {
            return span({style:{'display': 'block'}, key: idx},[rd])
          })
        ])
        ]),
        Panel({
          title: "Data Use Restriction Details"
        }, [
            ul({style: styles.tableList}, [
              this.createRow('Consent Group', this.state.consent.projectKey + ':' + this.state.consent.summary, 'www.google.com', styles.tableListRowOdd),
              this.createRow('Principal Investigator listed on the informed consent form', this.state.restriction.consentPIName),
              this.createRow('Data is available for future research with no restrictions', this.state.restriction.noRestriction ? "Yes" : "No", styles.tableListRowOdd),
              this.createRow('Data is available for future general research use', this.state.restriction.generalUse ? "Yes" : "No"),
              this.createRow('Data is available for health/medical/biomedical research', this.state.restriction.hmbResearch ? "Yes" : "No", styles.tableListRowOdd),
              this.createRowList('Future use is limited to research involving the following disease area(s)', this.state.restriction.diseaseRestrictions),
              this.createRow('Future use of population origins or ancestry is prohibited', this.state.restriction.populationOriginsAncestry ? "Yes" : "No", styles.tableListRowOdd),
              this.createRow('Future commercial use is prohibited', this.state.restriction.commercialUseExcluded ? "Yes" : "No"),
              this.createRow('Future use for methods research (analytic/software/technology development) is prohibited', this.state.restriction.methodsResearchExcluded ? "Yes" : "No", styles.tableListRowOdd),
              this.createRow('Future use of aggregate-level data for general research purposes is prohibited', this.state.restriction.aggregateResearchResponse),
              this.createRow('Future as a control set for diseases other than those specified is prohibited', this.state.restriction.controlSetOption, styles.tableListRowOdd),
              this.createRow('Future use is limited to research involving a particular gender', this.state.restriction.gender),
              this.createRow('Future use is limited to pediatric research', this.state.restriction.pediatricLimited ? "Yes" : "No", styles.tableListRowOdd),
              this.createRow('Future use is limited to research involving a specific population', this.state.restriction.populationRestrictions),
              this.createRow('Future use is limited to data generated from samples collected after the following consent form date', !isEmpty(this.state.restriction.dateRestriction) ? format(new Date(this.state.restriction.dateRestriction), 'MM/dd/yyyy') : '', styles.tableListRowOdd),
              div({isRendered: this.state.restriction.recontactingDataSubjects !== null}[
                this.createRow('Subject re-contact <strong> may </strong> occur in certain circumstances, as specified ', this.state.restriction.recontactMay),
                this.createRow('Subject re-contact <strong> must </strong> occur in certain circumstances, as specified ', this.state.restriction.recontactMust)
              ]),
              this.createRow('Participants\' genomic and phenotypic data is available for future research and broad sharing ', this.state.restriction.genomicPhenotypicData, styles.tableListRowOdd),
              this.createRow('Collaboration with the primary study investigators required', this.state.restriction.collaborationInvestigators? "Yes" : "No"),
              this.createRow('Data storage on the cloud is prohibited', this.state.restriction.cloudStorage, styles.tableListRowOdd),
              this.createRow('Ethics committee approval is required', this.state.restriction.irb ? "Yes" : "No"),
              this.createRow('Publication of results of studies using the data is required ', this.state.restriction.publicationResults? "Yes" : "No", styles.tableListRowOdd),
              this.createRow('Genomic summary results from this study are available only through controlled-access', this.state.restriction.genomicResults? "Yes" : "No"),
              this.createRow('Genomic summary', this.state.restriction.genomicResults? this.state.restriction.genomicSummaryResults : "--", styles.tableListRowOdd),
              this.createRow('Geographical restrictions', this.state.restriction.geographicalRestrictions),
              this.createRow('Other Restrictions', this.state.restriction.other, styles.tableListRowOdd),
              this.createRow('Future use of this data requires manual review', this.state.restriction.manualReview ? "Yes" : "No"),
              this.createRow('ORSP Comments', this.state.restriction.comments, styles.tableListRowOdd),
              this.createDuosExportRow('DUOS Export')
            ])
          ])
      ])
    )
  }
}

export default DataUseRestrictionDetails;