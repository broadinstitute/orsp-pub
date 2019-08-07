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

class DataUseRestrictions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 50,
      search: null,
      sort: {
        sortDirection: 'asc',
        orderColumn: null
      },
      currentPage: 1,
      fundings: [],
      isAdmin: true
    };
  }

  render() {
    return(
      div({},[
        h1({style: {'margin': '20px 0', 'fontWeight' : '700', 'fontSize' : '35px'}}, ["Data Use Restrictions for Consent Group: ORSP-614"]),
        Panel({ 
          title: "Data Use Restriction Summary"
         }, [
          p({}, [
             "Samples are restricted for use under the following conditions:",
          ]),
          p({}, [
              "Data use is limited for studying: cancer, disease of mental health [DS]",
          ]),
         ])
      ])
    )
  }
}

export default DataUseRestrictions;