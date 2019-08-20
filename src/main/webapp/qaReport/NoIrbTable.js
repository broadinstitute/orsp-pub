import { Component } from 'react';
import { h, h1, div } from 'react-hyperscript-helpers';
import { Reports } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from '../components/Spinner';
import { TableComponent } from "../components/TableComponent";
import FilterPanel from "./FilterPanel";
import { TABLE_ACTIONS } from "../util/TableUtil";
import { QA_EVENT_SORT_NAME_INDEX } from "../util/ReportConstants";
import { MultiTab } from "../components/MultiTab";
import { Panel } from "../components/Panel";
import { datesDiff } from "../util/Utils";
import { QA_REPORT_SPINNER } from "./QaReport";

const columns = [{
  dataField: 'id',
  text: 'Id',
  hidden: true,
  csvExport : false
}, {
  dataField: 'projectKey',
  text: 'Project',
  sort: true
}, {
  dataField: 'type',
  text: 'Type',
  sort: true
}, {
  dataField: 'status',
  text: 'Status',
  sort: true
}, {
  dataField: 'age',
  text: 'Age',
  sort: true,
  formatter: (cell, row, rowIndex, colIndex) => {
    const result = datesDiff(new Date(), new Date(row.requestDate));
    return  (result.years > 0 ? result.years + ' years, ' : '') +
      (result.months > 0 ? result.months + ' months ' : '') +
      (result.months > 0 || result.years > 0 ? ' and ': '') + result.days + ' days'
  }
}, {
  dataField: 'actor',
  text: 'Assignees',
  sort: true
}];

const SIZE_PER_PAGE_LIST = [
  { text: '50', value: 50 },
  { text: '100', value: 100 },
  { text: '500', value: 500 }];

const defaultSorted = [{
  dataField: 'date',
  order: 'desc'
}];

class NoIrbTable extends Component {
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
      recordsTotal: 0,
      recordsFiltered: 0,
      data: [],

      beforeDate: null,
      afterDate: null,
      projectType: { value: 'all', label: 'All' },

      showError: false,
      isAdmin: component.isAdmin,
    };
  }

  async componentDidMount() {
    await this.init();
  }

  async init() {
    await this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, this.state.currentPage);
  }

  tableHandler = async (offset, limit, search, sort, page) => {
    let query = {
      draw: 1,
      start: offset,
      length: limit,
      orderColumn: sort.orderColumn,
      sortDirection: sort.sortDirection,
      searchValue: search,
    };

    let filter = {
      before: this.state.beforeDate ? this.state.beforeDate.toLocaleDateString('en-US') : this.state.afterDate,
      after: this.state.afterDate ? this.state.afterDate.toLocaleDateString('en-US') : this.state.afterDate,
      projectType: this.state.projectType.value
    };

    spinnerService.show(QA_REPORT_SPINNER);
    let result = await Reports.getQaEventReport(query,'NO_IRB', filter);

    const lastPage = Math.ceil(result.data.recordsFiltered / query.length);
    this.setState(prev => {
      prev.lastPage = lastPage;
      prev.currentPage = page;
      prev.data = result.data.data;
      prev.recordsTotal = result.data.recordsTotal;
      prev.recordsFiltered = result.data.recordsFiltered;
      prev.sizePerPage = query.length;
      prev.search = query.searchValue;
      prev.sort = {
        orderColumn : query.orderColumn,
        sortDirection: query.sortDirection
      };
      return prev;
    }, () => {
      spinnerService.hide(QA_REPORT_SPINNER)
    })
    // }).catch(error => {
    //   spinnerService.hide(QA_REPORT_SPINNER);
    //   this.setState(() => { throw error });
    // });
  };

  onTableChange = async (type, newState) => {
    switch(type) {
      case TABLE_ACTIONS.SEARCH: {
        await this.onSearchChange(newState.searchText);
        break
      }
      case TABLE_ACTIONS.FILTER: {
        // Not implemented
        break;
      }
      case TABLE_ACTIONS.PAGINATION: {
        await this.onPageChange(newState.page, newState.sizePerPage);
        break;
      }
      case TABLE_ACTIONS.SORT: {
        await this.onSortChange(newState.sortField, newState.sortOrder);
        break;
      }
    }
  };

  onSearchChange = async (search) => {
    await this.tableHandler(0, this.state.sizePerPage, search, this.state.sort, 1);
  };

  onPageChange = async (page, sizePerPage) => {
    const offset = (page - 1) * sizePerPage;
    await this.tableHandler(offset, sizePerPage, this.state.search, this.state.sort, page);
  };

  onSortChange = async (sortName, sortOrder) => {
    const sort = {
      sortDirection: sortOrder,
      orderColumn: QA_EVENT_SORT_NAME_INDEX[sortName]
    };
    this.tableHandler(0, this.state.sizePerPage, null, sort)
  };

  handleDatePicker = (e) => (date) => {
    this.setState(prev => {
      prev[e] = date;
      return prev;
    }) ;
  };

  handleSelectProjectType = (e) => {
    this.setState(prev => {
      prev.projectType = e;
      return prev;
    }) ;
  };

  render() {
    return(
      TableComponent({
        remoteProp: true,
        onTableChange: this.onTableChange,
        data: this.state.data,
        columns: columns,
        keyField: 'id',
        search: true,
        fileName: 'ORSP',
        page: this.state.currentPage,
        totalSize: this.state.recordsFiltered,
        showPrintButton: true,
        sizePerPageList: SIZE_PER_PAGE_LIST,
        printComments: this.printComments,
        defaultSorted: defaultSorted,
        pagination: true,
        showExportButtons: true,
        showSearchBar: true
      })
    );
  }
}
export default NoIrbTable;
