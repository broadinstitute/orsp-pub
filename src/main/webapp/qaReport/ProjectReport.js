import React, { Component } from 'react';
import { div, h, h1, hh } from 'react-hyperscript-helpers';
import { Link } from 'react-router-dom'
import { TableComponent } from '../components/TableComponent';
import { defaultSorted, PROJECT_COLUMNS, SIZE_PER_PAGE_LIST_PROJECT } from '../util/ReportsConstants';
import LoadingWrapper from '../components/LoadingWrapper';
import { Reports } from '../util/ajax';
import get from 'lodash/get';
import * as qs from 'query-string';

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
      const result = await Reports.getQaEventReportForProject(get(qs.parse(this.props.location.search), 'projectKey', ''));
      this.setState({ data: result.data },
        ()=> this.props.hideSpinner()
      );
    } catch(error) {
      this.props.hideSpinner();
      this.setState(() => { throw error; })
    }
  };

  render() {
    const projectKey = get(qs.parse(this.props.location.search), 'projectKey', '');
    return(
      div({},[
        h1({ style: { marginBottom: '15px' } }, [" Quality Assurance Report for ",
          h(Link, {
            to: {
              pathname:'/project/main',
              search: '?projectKey=' + projectKey,
              state: {issueType: 'project',
              tab: 'review',
              projectKey: projectKey}
            }
          }, [projectKey])
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
