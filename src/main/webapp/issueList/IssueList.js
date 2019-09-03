import { Component } from 'react';
import { hh, div, h1, h } from 'react-hyperscript-helpers';
import { TableComponent } from "../components/TableComponent";
import { Project } from '../util/ajax';
import { Spinner } from "../components/Spinner";
import { spinnerService } from "../util/spinner-service";
import { Link } from 'react-router-dom';

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
    typeWidth: '140px'
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
    csvExport : false
  }, {
    dataField: 'projectKey',
    text: 'Project',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width:  styles.project.projectKeyWidth};
    },
    formatter: (cell, row, rowIndex, colIndex) =>
      div({}, [
        h(Link, {to: {pathname:'/project/main', search: '?projectKey=' + row.projectKey, state: {issueType: 'project', projectKey: row.projectKey}}}, [row.projectKey])
      ])
  }, {
  dataField: 'summary',
    text: 'Title',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: styles.project.titleWidth };
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
    sort: false
  }, {
    dataField: 'updateDate',
    text: 'Updated',
    sort: false,
    classes: 'ellipsis-column'
  }, {
    dataField: 'actor',
    text: 'Awaiting action from',
    sort: true,

  }
];

export const IssueList = hh(class IssueList extends Component {

  constructor(props) {
    console.log('acaaaaaaaaaaa');
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
    this.init();
  }

  init = () => {
    spinnerService.show(SPINNER_NAME);
    this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, this.state.currentPage);
  };

  tableHandler = (offset, limit, search, sort, page) => {
    Project.getProjectByUser(true, null).then(result => {
      this.setState(prev => {       
        prev.issues = result.data;
        return prev;
      }, () => spinnerService.hide(SPINNER_NAME))
    }).catch(error => {
      spinnerService.hide(SPINNER_NAME);
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
    }, () =>{
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
    switch(type) {
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
    let fundingsArray = formatDataPrintableFormat(this.state.issues, cols);
    const tableColumnsWidth = [100, 100,'*',80 ,'*','*','*','*','*'];
    const titleText = "";
    printData(fundingsArray, titleText, '', tableColumnsWidth, 'A3', 'landscape');
  };



  render() {
    return (
      div({}, [
        h1({ style: stylesHeader.pageTitle}, ["My Task List"]),
        TableComponent({
          remoteProp: false,
          data: this.state.issues,
          columns: columns,
          keyField: 'id',
          search: true,
          fileName: 'ORSP',
          showPrintButton: false,
          printComments: this.printContent,
          showExportButtons: true,
          showSearchBar: true,
          sizePerPageList: SIZE_PER_PAGE_LIST,
          pagination: true
        }),
        h(Spinner, {
          name: SPINNER_NAME, group: "orsp", loadingImage: component.loadingImage
        })
      ])
    )
  }
})
export default IssueList;
