import React, { Component } from 'react';
import { h, h1, div, a, p } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { Reports } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from "../components/Spinner";
import { TableComponent } from "../components/TableComponent";
import { handleRedirectToProject, printData } from "../util/Utils";
import { FUNDING_SORT_NAME_INDEX, styles } from "../util/ReportConstants";
import { formatDataPrintableFormat, formatNullCell, TABLE_ACTIONS } from "../util/TableUtil";

class DataUseRestrictionDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  createRow(columnLeft, columnRight) {
   return li({}, [             
      span({}, [
        p({}, [columnLeft])
      ]),
      span({}, [
        a({ href: 'vero.com.ar'},['summary..... ..... .... ... '])
      ])
    ]);
  }
  render() {
    return(
      div({},[
        h1({style: {'margin': '20px 0', 'fontWeight' : '700', 'fontSize' : '35px'}}, ["Data Use Restrictions for Consent Group: ORSP-614"]),
        Panel({ 
          title: "Data Use Restriction Details"
         }, [
          ul({}, [
             this.createRow('Consent Group'),
             this.createRow('Principal Investigator listed on the informed consent form'),
             this.createRow('Data is available for future research with no restrictions'),
             this.createRow('Data is available for future general research use'),
             this.createRow('Data is available for health/medical/biomedical research'),
             this.createRow('Future use is limited to research involving the following disease area(s)'),
             this.createRow('Future use of population origins or ancestry is prohibited'),
             this.createRow('Future commercial use is prohibited'),
             this.createRow('Future use for methods research (analytic/software/technology development) is prohibited'),
             this.createRow('Future use of aggregate-level data for general research purposes is prohibited'),
             this.createRow('Future as a control set for diseases other than those specified is prohibited'),
             this.createRow('Future use is limited to research involving a particular gender'),
             this.createRow('Future use is limited to pediatric research'),
             this.createRow('Future use is limited to research involving a specific population'),
             this.createRow('Future use is limited to data generated from samples collected after the following consent form date'),
            // if
             this.createRow('Subject re-contact <strong> may </strong> occur in certain circumstances, as specified '),

             this.createRow('Subject re-contact <strong> must </strong> occur in certain circumstances, as specified'),
// fin if
             this.createRow('Participants\' genomic and phenotypic data is available for future research and broad sharing'),
             this.createRow('Collaboration with the primary study investigators required'),
             this.createRow('Data storage on the cloud is prohibited'),
             this.createRow('Ethics committee approval is required'),
             this.createRow('Publication of results of studies using the data is required '),
             this.createRow('Genomic summary results from this study are available only through controlled-access'),
             this.createRow('Genomic summary'),
             this.createRow('Geographical restrictions'),
             this.createRow('Other Restrictions'),
             this.createRow('Future use of this data requires manual review'),
             this.createRow('ORSP Comments'),
             this.createRow('DUOS Export'), //ver problema adentro
             this.createRow('DUOS Export'),
             this.createRow('DUOS Export'),
             this.createRow('DUOS Export'),
             this.createRow('DUOS Export'),
          ])
         ])
      ])
    )
  }
}

export default DataUseRestrictionDetails;