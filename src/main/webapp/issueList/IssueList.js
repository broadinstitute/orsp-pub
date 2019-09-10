import { Component } from 'react';
import { hh, div, h1, h } from 'react-hyperscript-helpers';
import { TableComponent } from "../components/TableComponent";
import { Project } from '../util/ajax';
import { formatDataPrintableFormat } from "../util/TableUtil";
import { printData } from "../util/Utils";
import { Link } from 'react-router-dom';
import isNil from 'lodash/isNil';
import '../index.css';

const stylesHeader = {
  pageTitle: {
    fontWeight: '700', margin: '20px 0', fontSize: '35px', display: 'block'
  }
};

const SPINNER_NAME = 'ISSUE_LIST';
const styles = {
  project: {
    projectKeyWidth: '140px',
    projectWidth: '750px',
    titleWidth: '280px',
    typeWidth: '193px'
  }
}

const SIZE_PER_PAGE_LIST = [
  { text: '10', value: 10 },
  { text: '25', value: 25 },
  { text: '50', value: 50 },
  { text: '100', value: 100 }];

const columns = [
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
    formatter: (cell, row, rowIndex, colIndex) =>
      div({}, [
        h(Link, { to: { pathname: '/project/main', search: '?projectKey=' + row.projectKey, state: { issueType: 'project', projectKey: row.projectKey } } }, [row.projectKey])
      ])
  }, {
    dataField: 'summary',
    text: 'Title',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: styles.project.titleWidth };
    },
    formatter: (cell, row, rowIndex, colIndex) =>
      div({}, [
        h(Link, { to: { pathname: '/project/main', search: '?projectKey=' + row.projectKey, state: { issueType: 'project', projectKey: row.projectKey } } }, [row.summary])
      ])
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
    sort: false
  }, {
    dataField: 'updateDate',
    text: 'Updated',
    sort: false,
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
  }
];

export const IssueList = hh(class IssueList extends Component {
  
  paramsContext = new URLSearchParams();
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 10,
      search: null,
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

  init = () => {
    this.props.showSpinner();
    this.tableHandler();
  };

  tableHandler = () => {
      Project.getProjectByUser(this.paramsContext.get('assignee'), this.paramsContext.get('max')).then(result => {
        if(this._isMounted) {
          this.setState(prev => {
            prev.issues = result.data;
            return prev;
          }, () => this.props.hideSpinner())
        }   
      }).catch(error => {
        this.props.hideSpinner();
        this.setState(() => { throw error });
      });  
  };
  
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
    let cols = columns.filter(el => el.dataField !== 'id');
    let issues = formatDataPrintableFormat(this.state.issues, cols);
    const tableColumnsWidth = [100, 100, '*', 80, '*', '*', '*', '*', '*'];
    const titleText = "";
    printData(issues, titleText, '', tableColumnsWidth, 'A3', 'landscape');
  };

  render() {
    return (
      div({}, [
        h1({ style: stylesHeader.pageTitle }, [this.paramsContext.get('header')]),
        TableComponent({
          remoteProp: false,
          data: this.state.issues,
          columns: columns,
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
export default IssueList;
