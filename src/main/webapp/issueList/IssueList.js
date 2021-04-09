import { Component } from 'react';
import { div, h, h1, hh, button, span } from 'react-hyperscript-helpers';
import { TableComponent } from '../components/TableComponent';
import { Project } from '../util/ajax';
import { formatDataPrintableFormat } from '../util/TableUtil';
import { exportData, handleUnauthorized } from '../util/Utils';
import { Link } from 'react-router-dom';
import isNil from 'lodash/isNil';
import '../index.css';
import LoadingWrapper from '../components/LoadingWrapper';
import isEmpty from 'lodash/isEmpty';
import findIndex from 'lodash/findIndex';
import '../components/Btn.css';

const stylesHeader = {
  pageTitle: {
    fontWeight: '700', margin: '20px 0', fontSize: '35px', display: 'block'
  }
};

const styles = {
  project: {
    projectKeyWidth: '140px',
    projectWidth: '750px',
    titleWidth: '200px',
    typeWidth: '150px'
  }
}

const SIZE_PER_PAGE_LIST = [
  { text: '10', value: 10 },
  { text: '25', value: 25 },
  { text: '50', value: 50 },
  { text: '100', value: 100 }];

const columns = (ref) => [
  {
    dataField: 'id',
    text: 'Id',
    hidden: true,
    csvExport: false
  }, {
    dataField: 'projectKey',
    text: 'Project',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: styles.project.projectKeyWidth };
    },
    formatter: (cell, row, rowIndex, colIndex) => {
      if (row.type === "Consent Group") {
        return div({}, [
          h(Link, { to: { pathname: '/newConsentGroup/main', search: '?consentKey=' + row.projectKey, state: { issueType: 'consent-group', tab: 'documents', consentKey: row.projectKey } } }, [row.projectKey])
        ])
      } else {
        return div({}, [
          h(Link, { to: { pathname: '/project/main', search: '?projectKey=' + row.projectKey, state: { issueType: 'project', projectKey: row.projectKey } } }, [row.projectKey])
        ])
      }
    }
  }, {
    dataField: 'summary',
    text: 'Title',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: styles.project.titleWidth };
    },
    formatter: (cell, row, rowIndex, colIndex) => {
      if (row.type === "Consent Group") {
        return div({}, [
          h(Link, { to: { pathname: '/newConsentGroup/main', search: '?consentKey=' + row.projectKey, state: { issueType: 'consent-group', tab: 'documents', consentKey: row.projectKey } } }, [row.summary])
        ])
      } else {
        return div({}, [
          h(Link, { to: { pathname: '/project/main', search: '?projectKey=' + row.projectKey, state: { issueType: 'project', projectKey: row.projectKey } } }, [row.summary])
        ])
      }
    }
  }, {
    dataField: 'type',
    text: 'Type',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: styles.project.typeWidth };
    }
  }, {
    dataField: 'status',
    text: 'Status',
    formatter: (cell, row, rowIndex, colIndex) => row.type === 'Consent Group' ? '' : cell,
    csvFormatter: (cell, row, rowIndex, colIndex) => row.type === 'Consent Group' ? '' : cell,
    sort: true
  }, {
    dataField: 'updateDate',
    text: 'Updated',
    sort: true,
    classes: 'ellipsis-column'
  },
  {
    dataField: 'actors',
    text: 'Awaiting action from',
    sort: true,
    formatter: (cell, row, rowIndex, colIndex) =>
      div({}, [
        !isNil(row.actors) ? row.actors.join(", ") : ''
      ]),
    csvFormatter: (cell, row, rowIndex, colIndex) =>
      !isNil(row.actors) ? row.actors.join(", ") : ''
  },

  {
    dataField: 'assignedAdmin',
    hidden: ref.paramsContext.get('header') === 'My Projects',
    csvExport: true,
    text: 'Assigned Reviewer',
    csvFormatter: (cell, row, rowIndex, colIndex) => isEmpty(row.assignedAdmin) ? '' : JSON.parse(cell).value,
    sort: true,
    sortFunc: (a, b, order) => {
      let result = 0;
      if (order === 'asc') {
        if (isEmpty(a)) return 1;
        if (isEmpty(b) || a < b) return -1;
        if (b > a) return 1;
      } else {
        if (a > b) return -1;
        if (b < a) return 1;
      }
      return 0;
    },
    headerStyle: (column, colIndex) => {
      return { width: '180px' };
    },
    formatter: (cell, row, rowIndex, colIndex) => {
      return div({}, [
        !isEmpty(row.assignedAdmin) ? JSON.parse(cell).value : ''
      ])
    }
  }
];

const IssueList = hh(class IssueList extends Component {

  paramsContext = new URLSearchParams();
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      showAssignAdmin: false,
      sizePerPage: 10,
      search: null,
      issueKey: null,
      sort: {
        sortDirection: 'asc',
        orderColumn: null
      },
      currentPage: 1,
      issues: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.paramsContext = new URLSearchParams(this.props.location.search);
    this.init();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  init = async () => {
    this.props.showSpinner();
    this.tableHandler();
  };

  tableHandler = async () => {
    Project.getProjectByUser(this.paramsContext.get('assignee'), this.paramsContext.get('max')).then(result => {
      if (this._isMounted) {
        this.setState(prev => {
          prev.issues = result.data;
          return prev;
        }, () => this.props.hideSpinner())
      }
    }).catch(error => {
      this.handleError(error);
    });
  };

  handleError(error) {
    if (error.response != null && error.response.status === 401) {
      handleUnauthorized(this.props.history.location);
    } else {
      this.props.hideSpinner();
      this.setState(() => { throw error });
    }
  }

  onSearchChange = (search) => {
    this.tableHandler(0, this.state.sizePerPage, search, this.state.sort, 1);
  };

  onPageChange = (page, sizePerPage) => {
    const offset = (page - 1) * sizePerPage;
    this.tableHandler(offset, sizePerPage, this.state.search, this.state.sort, page);
  };

  onSizePerPageListHandler = (size) => {
    this.setState(prev => {
      prev.query.length = size;
      return prev;
    }, () => {
      this.tableHandler(this.state.query);
    });
  };

  onSortChange = (sortName, sortOrder) => {
    const sort = {
      sortDirection: sortOrder,
      orderColumn: FUNDING_SORT_NAME_INDEX[sortName]
    };
    this.tableHandler(0, this.state.sizePerPage, null, sort)
  };

  onTableChange = (type, newState) => {
    switch (type) {
      case TABLE_ACTIONS.SEARCH: {
        this.onSearchChange(newState.searchText);
        break
      }
      case TABLE_ACTIONS.FILTER: {
        // Not implemented
        break;
      }
      case TABLE_ACTIONS.PAGINATION: {
        this.onPageChange(newState.page, newState.sizePerPage);
        break;
      }
      case TABLE_ACTIONS.SORT: {
        this.onSortChange(newState.sortName, newState.sortOrder);
        break;
      }
    }
  };

  printContent = () => {
    let cols = columns(this).filter(el => el.dataField !== 'id');
    let issues = formatDataPrintableFormat(this.state.issues, cols);
    const tableColumnsWidth = [100, 100, '*', 80, '*', '*', '*'];
    exportData('print', '', issues, '', '', tableColumnsWidth, 'A3', 'landscape');
  };


  /*success = (issueKey, assignedAdmin) => {
    this.setAdmin(assignedAdmin, issueKey);
  }

  setAdmin(assignedAdmin, projectKey) {
    let issues = this.state.issues;
    var index = findIndex(issues, { projectKey: projectKey });
    issues[index].assignedAdmin = assignedAdmin;
    this.setState(prev => {
      prev.issues = issues;
      return prev;
    });
  }*/

  render() {
    return (
      div({}, [
        h1({ style: stylesHeader.pageTitle }, [this.paramsContext.get('header')]),
        TableComponent({
          remoteProp: false,
          data: this.state.issues,
          columns: columns(this),
          keyField: 'id',
          search: true,
          fileName: 'ORSP',
          showPrintButton: true,
          printComments: this.printContent,
          showExportButtons: true,
          showSearchBar: true,
          sizePerPageList: SIZE_PER_PAGE_LIST,
          pagination: true
        })
      ])
    )
  }
});
export default LoadingWrapper(IssueList);
