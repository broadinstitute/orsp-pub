import React, { Component } from 'react';
import { h, h1, div, a } from 'react-hyperscript-helpers';
import { Reports } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from "../components/Spinner";
import { TableComponent } from "../components/TableComponent";
import { handleRedirectToProject, printData } from "../util/Utils";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { SORT_NAME_INDEX, STYLES } from "../util/FundingsSourceReportConstants";
import { formatNullCell, TABLE_ACTIONS } from "../util/TableUtil";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const defaultSorted = [{
  dataField: 'projectKey',
  order: 'desc'
}];

const columns = [
  {
    dataField: 'type',
    text: 'Issue Type',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: STYLES.issueTypeWidth};
    } 
  }, {
    dataField: 'projectKey',
    text: 'Project Key',
    sort: true,
    formatter: (cell, row, rowIndex, colIndex) =>
      div({},[
        a({ href: handleRedirectToProject(component.serverURL, row.projectKey) },[row.projectKey])
      ]),
    headerStyle: (colum, colIndex) => {
      return { width: STYLES.projectKeyWidth };
    }
  }, {
  dataField: 'summary',
    text: 'Title',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: STYLES.titleWidth };
    }
  }, {
    dataField: 'status',
    text: 'Status',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: STYLES.projectKeyWidth };
    }
  }, {
    dataField: 'protocol',
    text: 'Protocol',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: STYLES.protocolWidth };
    },
    csvFormatter: (cell, row, rowIndex, colIndex) =>
      formatNullCell(cell)
  }, {
    dataField: 'pis',
    text: 'PIs',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: STYLES.pisWidth };
    },
    csvFormatter: (cell, row, rowIndex, colIndex) =>
      cell.join(', ')
  }, {
    dataField: 'source',
    text: 'Funding Source',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: STYLES.generalWidth };
    }
  }, {
    dataField: 'name',
    text: 'Funding Name',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: STYLES.generalWidth };
    }
  }, {
    dataField: 'awardNumber',
    text: 'Award Number',
    sort: true,
    headerStyle: (colum, colIndex) => {
      return { width: STYLES.generalWidth };
    },
    csvFormatter: (cell, row, rowIndex, colIndex) =>
      formatNullCell(cell)
  }
];

class FundingsSourceReport extends Component {

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
      fundings: [],
      isAdmin: true
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    spinnerService.showAll();
    this.setState({ isAdmin: component.isAdmin });
    this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, this.state.currentPage);
  };

  tableHandler = (offset, limit, search, sort, page) => {
    let query = {
      draw: 1,
      start: offset,
      length: limit,
      orderColumn: sort.orderColumn,
      sortDirection: sort.sortDirection,
      searchValue: search,
    };
    spinnerService.showAll();
    Reports.getFundingsReports(query).then(result => {
      const lastPage = Math.ceil(result.data.recordsFiltered / query.length);
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
      }, () => spinnerService.hideAll())
    }).catch(error => {
      spinnerService.hideAll();
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
      orderColumn: SORT_NAME_INDEX[sortName]
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
        // Not implemented here
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
    let fundingsArray = [];
    fundingsArray.push(columns.map(el => el.text));

    this.state.fundings.forEach(funding => {
      fundingsArray.push([funding.type, funding.projectKey, funding.summary, funding.status, (funding.protocol ? funding.protocol : ''), funding.pis.join(', '),
        funding.source, funding.name, funding.awardNumber ? funding.awardNumber : ''])
    });
    const tableColumnsWidth = ['*','*','*','*','*','*','*','*','*'];
    const titleText = "Funding Source Report";
    printData(fundingsArray, titleText, '', tableColumnsWidth, 'A3', 'landscape');
  };

  render() {
    return(
      div({},[
        h1({}, ["Funding Source Report"]),
        TableComponent({
          remoteProp: true,
          onTableChange: this.onTableChange,
          data: this.state.fundings,
          columns: columns,
          keyField: 'id',
          search: true,
          csvFileName: 'FundingsReport.csv',
          excelFileName: 'FundingsReport.xlsx',
          showPrintButton: false,
          printComments: this.printContent,
          defaultSorted: defaultSorted,
          page: this.state.currentPage,
          totalSize: this.state.recordsFiltered
        }),
        h(Spinner, {
          name: "mainSpinner", group: "orsp", loadingImage: component.loadingImage
        })
      ])
    )
  }
}

export default FundingsSourceReport;

