import React, { Component } from 'react';
import { h, h1, div } from 'react-hyperscript-helpers';
import { Link } from 'react-router-dom'
import { TableComponent } from "../components/TableComponent";
import {
  defaultSorted,
  formatAge,
  SIZE_PER_PAGE_LIST
} from "../util/QaReportConstants";
import { Reports } from "../util/ajax";

const columns = [{
  dataField: 'id',
  text: 'Id',
  hidden: true,
  csvExport : false
}, {
  dataField: 'status',
  text: 'Status',
  sort: true
}, {
  dataField: 'author',
  text: 'Author',
  sort: true
}, {
  dataField: 'statusDate',
  text: 'Status Date',
  sort: true
}, {
  dataField: 'duration',
  text: 'Duration',
  sort: true,
  formatter: (cell, row, rowIndex, colIndex) =>
    formatAge(row)
}];

class ProjectReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount = async () => {
    try {
      const result = await Reports.getQaEventReportForProject(this.props.location.state.projectKey);
      console.log(result)
      this.setState({ data: result.data });
    } catch(error) {
      this.setState(() => { throw error; })
    }
  };

  render() {
    return(
      div({},[
        h1({ style: { marginBottom: '15px' } }, [" Quality Assurance Report for ",
          h(Link, {to: {}}, [this.props.location.state.projectKey])
        ]),
        div({ className:'container-fluid well' }, [
          TableComponent({
            remoteProp: false,
            data: [],
            columns: columns,
            keyField: 'id',
            search: true,
            fileName: '',
            showPrintButton: false,
            sizePerPageList: SIZE_PER_PAGE_LIST,
            defaultSorted: defaultSorted,
            pagination: true,
            showExportButtons: false,
            showSearchBar: true,
            showPdfExport: false
          })
        ])
      ])
    )
  }
}

export default ProjectReport;
