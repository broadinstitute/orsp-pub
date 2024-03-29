import React, { Component } from 'react';
import { a, div, h1, hh, span } from 'react-hyperscript-helpers';
import { LoginText, Reports } from '../util/ajax';
import { TableComponent } from '../components/TableComponent';
import { exportData, handleRedirectToProject } from '../util/Utils';
import { FUNDING_SORT_NAME_INDEX, styles } from '../util/ReportConstants';
import { formatDataPrintableFormat, formatNullCell, TABLE_ACTIONS } from '../util/TableUtil';
import LoadingWrapper from '../components/LoadingWrapper';
import { projectStatus } from '../util/Utils';
import { PortalMessage } from '../components/PortalMessage';

const stylesHeader = {
  pageTitle: {
    fontWeight: '700', margin: '20px 0', fontSize: '35px', display: 'block'
  }
};

const SIZE_PER_PAGE_LIST = [
  { text: '50', value: 50 },
  { text: '100', value: 100 },
  { text: '500', value: 500 }];

const columns = [
  {
    dataField: 'id',
    text: 'Id',
    hidden: true,
    editable: false,
    csvExport : false
  } ,
  {
    dataField: 'type',
    text: 'Issue Type',
    sort: true,
    editable: false,
    headerStyle: (column, colIndex) => {
      return { width: styles.fundingReport.issueTypeWidth};
    } 
  },
  {
    dataField: 'projectKey',
    text: 'Project Key',
    sort: true,
    editable: false,
    formatter: (cell, row, rowIndex, colIndex) =>
      div({},[
        a({ href: handleRedirectToProject(component.serverURL, row.projectKey) },[row.projectKey])
      ]),
    headerStyle: (column, colIndex) => {
      return { width: styles.fundingReport.projectKeyWidth };
    }
  }, {
  dataField: 'summary',
    text: 'Title',
    sort: true,
    editable: false,
    headerStyle: (column, colIndex) => {
      return { width: styles.fundingReport.titleWidth };
    }
  }, {
    dataField: 'status',
    text: 'Status',
    sort: true,
    editable: false,
    headerStyle: (column, colIndex) => {
      return { width: styles.fundingReport.statusWidth };
    }
  }, {
    dataField: 'protocol',
    text: 'Protocol',
    sort: false,
    editable: false,
    headerStyle: (column, colIndex) => {
      return { width: styles.fundingReport.protocolWidth };
    },
    csvFormatter: (cell, row, rowIndex, colIndex) =>
      formatNullCell(cell)
  }, {
    dataField: 'pis',
    text: 'PIs',
    sort: false,
    editable: false,
    classes: 'ellipsis-column',
    formatter: (cell, row, rowIndex, colIndex) =>
      span({title: [row.pis]},[
        [row.pis]
    ]),
    headerStyle: (column, colIndex) => {
      return { width: styles.fundingReport.pisWidth };
    },
    csvFormatter: (cell, row, rowIndex, colIndex) =>
      cell.join(', ')
  }, {
    dataField: 'source',
    text: 'Funding Source',
    sort: true,
    editable: false,
    headerStyle: (column, colIndex) => {
      return { width: styles.fundingReport.generalWidth };
    }
  }, {
    dataField: 'name',
    text: 'Funding Name',
    sort: true,
    editable: false,
    classes: 'ellipsis-column',
    formatter: (cell, row, rowIndex, colIndex) =>
      span({title: [row.name]},[
        [row.name]
    ]),
    headerStyle: (column, colIndex) => {
      return { width: styles.fundingReport.fundingNameWidth };
    }
  }, {
    dataField: 'awardNumber',
    text: 'Award Number',
    sort: true,
    editable: false,
    headerStyle: (column, colIndex) => {
      return { width: styles.fundingReport.generalWidth };
    },
    csvFormatter: (cell, row, rowIndex, colIndex) =>
      formatNullCell(cell)
  }
];

const FundingsSourceReport = hh(class FundingsSourceReport extends Component {

  _isMounted = false;

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
      isAdmin: true,
      defaultValueForAbout: 'default'
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.checkDefault();
    this.init();
    this.checkDefault();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  init = () => {
    this.props.showSpinner();
    this.setState({ isAdmin: component.isAdmin });
    this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, this.state.currentPage);
  };

  async checkDefault() {
    await LoginText.getLoginText().then(loginText => {
      let data = loginText.data[0];
      if(data[3] === 'default') {
        this.setState({
          defaultValueForAbout: 'default'
        })
      } else {
        this.setState({
          defaultValueForAbout: ''
        })
      }
    })
  }

  tableHandler = (offset, limit, search, sort, page) => {
    let query = {
      draw: 1,
      start: offset,
      length: limit,
      orderColumn: sort.orderColumn,
      sortDirection: sort.sortDirection,
      searchValue: search,
    };
    this.props.showSpinner();
    Reports.getFundingsReports(query).then(result => {
      const lastPage = Math.ceil(result.data.recordsFiltered / query.length);
      result.data.data.forEach(fundingSt => {fundingSt.status = projectStatus(fundingSt)});
      if (this._isMounted) {
        this.setState(prev => {
          prev.lastPage = lastPage;
          prev.currentPage = page;
          prev.isAdmin = this.state.isAdmin;
          prev.fundings = result.data.data;
          prev.recordsTotal = result.data.recordsTotal;
          prev.recordsFiltered = result.data.recordsFiltered;
          prev.sizePerPage = query.length;
          prev.search = query.searchValue;
          prev.sort = {
            orderColumn : query.orderColumn,
            sortDirection: query.sortDirection
          };
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
    let fundingsArray = formatDataPrintableFormat(this.state.fundings, cols);
    const tableColumnsWidth = [100, 100,'*',80 ,'*','*','*','*','*'];
    const titleText = "Funding Source Report";
    exportData('print' ,null,fundingsArray, titleText, '', tableColumnsWidth, 'A3', 'landscape');
  };

  render() {
    return(
      div({},[
        PortalMessage({}),
        h1({ style: stylesHeader.pageTitle}, ["Funding Source Report"]),
        TableComponent({
          remoteProp: true,
          onTableChange: this.onTableChange,
          data: this.state.fundings,
          columns: columns,
          keyField: 'id',
          search: true,
          fileName: 'Funding Source Report',
          showPrintButton: false,
          printComments: this.printContent,
          sizePerPageList: SIZE_PER_PAGE_LIST,
          page: this.state.currentPage,
          totalSize: this.state.recordsFiltered,
          pagination: true,
          showExportButtons: true,
          showSearchBar: true
        })
      ])
    )
  }
});

export default LoadingWrapper(FundingsSourceReport);

