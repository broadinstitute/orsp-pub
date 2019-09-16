import React, { Component } from 'react';
import { div, h, h1, hh } from 'react-hyperscript-helpers';
import { Link } from 'react-router-dom'
import { TableComponent } from '../components/TableComponent';
import { defaultSorted, formatAge, SIZE_PER_PAGE_LIST_PROJECT } from '../util/QaReportConstants';
import LoadingWrapper from '../components/LoadingWrapper';
import { Reports } from '../util/ajax';

const columns = [{
  dataField: 'event.id',
  text: 'Id',
  hidden: true,
  csvExport : false
}, {
  dataField: 'event.summary',
  text: 'Status',
  sort: true,
  headerStyle: (column, colIndex) => {
    return {
      width: '484px',
    };
  }
}, {
  dataField: 'event.author',
  text: 'Author',
  sort: true,
  headerStyle: (column, colIndex) => {
    return {
      width: '139px',
    };
  }
}, {
  dataField: 'event.created',
  text: 'Status Date',
  sort: true,
  headerStyle: (column, colIndex) => {
    return {
      width: '241px',
    };
  },
  formatter: (cell, row, rowIndex, colIndex) =>
     new Date(cell).toLocaleString()

}, {
  dataField: 'duration',
  text: 'Duration',
  sort: true,
  headerStyle: (column, colIndex) => {
    return {
      width: '235px',
    };
  },
  formatter: (cell, row, rowIndex, colIndex) =>
    formatAge(cell)
}];

const ProjectReport = hh(class ProjectReport extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount = async () => {
    this.props.showSpinner();
    try {
      const result = await Reports.getQaEventReportForProject(this.props.location.state.projectKey);
      this.setState({ data: result.data },
        ()=> this.props.hideSpinner()
        );
    } catch(error) {
      this.props.hideSpinner();
      this.setState(() => { throw error; })
    }
  };

  render() {
    return(
      div({},[
        h1({ style: { marginBottom: '15px' } }, [" Quality Assurance Report for ",
          h(Link, {
            to: {
              pathname:'/project/main',
              search: '?projectKey=' + this.props.location.state.projectKey,
              state: {issueType: 'project',
              tab: 'review',
              projectKey: this.props.location.state.projectKey}
            }
          }, [this.props.location.state.projectKey])
        ]),
        div({ className:'container-fluid well' }, [
          TableComponent({
            remoteProp: false,
            data: this.state.data,
            columns: columns,
            keyField: 'event.id',
            search: true,
            fileName: '',
            showPrintButton: false,
            sizePerPageList: SIZE_PER_PAGE_LIST_PROJECT,
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
});

export default LoadingWrapper(ProjectReport);
