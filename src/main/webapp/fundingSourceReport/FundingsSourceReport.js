import { Component } from 'react';
import { h, div, h1 } from 'react-hyperscript-helpers';
import { Reports, User } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from "../components/Spinner";
import { TableAsync } from "../components/TableAsync";

const SORT_NAME_INDEX = {
  'userName': 0,
  'displayName': 1,
  'emailAddress': 2
};

const TABLE_ACTIONS = {
  SEARCH : "search"
};

const defaultSorted = [{
  dataField: 'date',
  order: 'desc'
}];

const columns = [
  {
    dataField: 'type',
    text: 'Issue Type',
    sort: true
  }, {
    dataField: 'projectKey',
    text: 'Project Key',
    sort: true
  }, {
    dataField: 'summary',
    text: 'Title',
    sort: true
  }, {
    dataField: 'status',
    text: 'Status',
    sort: true
  }, {
    dataField: 'protocol',
    text: 'Protocol',
    sort: true
  }, {
    dataField: 'pis',
    text: 'PIs',
    sort: true
  }, {
    dataField: 'source',
    text: 'Funding Source',
    sort: true
  }, {
    dataField: 'name',
    text: 'Funding Name',
    sort: true
  }, {
  dataField: 'awardNumber',
  text: 'Award Number',
  sort: true
}
// , {
//   dataField: 'comment',
//   text: 'Comment',
//   sort: true,
//   formatter: (cell, row, rowIndex, colIndex) =>
//     div({dangerouslySetInnerHTML: { __html: cell } },[]),
//   csvFormatter: (cell, row, rowIndex, colIndex) =>
//     cell.replace(/<[^>]*>?/gm, '')
// }
];

class FundingsSourceReport extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 15,
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
      this.setState(() => { throw error });
    });
  };

  onSearchChange = (search) => {
    this.tableHandler(0, this.state.sizePerPage, search, this.state.sort, 1);
  };

  onPageChange = (page) => {
    const offset = (page - 1) * this.state.sizePerPage;
    this.tableHandler(offset, this.state.sizePerPage, this.state.search, this.state.sort, page);
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
  // Only used when remote value is established as true
  onTableChange = (type, newState) => {
    // types =
    // filter
    // pagination
    // sort
    // cellEdit
    switch(type) {
      case TABLE_ACTIONS.SEARCH: {
        console.log("BUSCA", newState.searchText);
        this.tableHandler(0, this.state.sizePerPage, newState.searchText, this.state.sort, 1);
        break
      }
      default: {
        console.log("nada");
        break;
      }
    }

    console.log("type => ", type, "\nnewState => ",newState);

  };
  render() {
    return(
      div({},[
        TableAsync({
          customFilter: true,
          customPagination: true,
          customSort: true,
          customCellEdit: false,
          onTableChange: this.onTableChange,
          data: this.state.fundings,
          columns: columns,
          keyField: 'id',
          search: true,
          csvFileName: 'FundingsReport.csv',
          showPrintButton: false,
          printComments: () => { console.log("HOLIS") },
          defaultSorted: defaultSorted
        }),
        h(Spinner, {
          name: "mainSpinner", group: "orsp", loadingImage: component.loadingImage
        })
      ])
    )
  }
}

export default FundingsSourceReport;

