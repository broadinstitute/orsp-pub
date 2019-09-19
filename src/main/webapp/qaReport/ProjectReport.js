import React, { Component } from 'react';
import { div, h, h1, hh } from 'react-hyperscript-helpers';
import { Link } from 'react-router-dom'
import { TableComponent } from '../components/TableComponent';
import { defaultSorted, PROJECT_COLUMNS, SIZE_PER_PAGE_LIST_PROJECT } from '../util/ReportConstants';
import LoadingWrapper from '../components/LoadingWrapper';
import { Reports } from '../util/ajax';

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
      const result = await Reports.getQaEventReportForProject(this.getProjectKey());
      this.setState({ data: result.data },
        ()=> this.props.hideSpinner()
      );
    } catch (error) {
      this.props.hideSpinner();
      this.setState(() => { throw error; })
    }
  };

  getProjectKey = () => {
    let params = new URLSearchParams(this.props.location.search);
    return params.get('projectKey') != null ? params.get('projectKey') : '';
  };

  render() {
    return(
      div({},[
        h1({ style: { marginBottom: '15px' } }, [" Quality Assurance Report for ",
          h(Link, {
            to: {
              pathname:'/project/main',
              search: '?projectKey=' + this.getProjectKey(),
              state: {issueType: 'project',
              tab: 'review',
              projectKey: this.getProjectKey()}
            }
          }, [this.getProjectKey()])
        ]),
        div({ className:'container-fluid well' }, [
          TableComponent({
            remoteProp: false,
            data: this.state.data,
            columns: PROJECT_COLUMNS,
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
