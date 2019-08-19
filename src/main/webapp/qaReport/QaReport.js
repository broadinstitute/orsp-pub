import { Component } from 'react';
import { h, h1, div, p } from 'react-hyperscript-helpers';
import { format } from 'date-fns';
import { Table } from "../components/Table";
import { RoleManagementEdit } from "../components/RoleManagementEdit";
import { Reports, User } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from '../components/Spinner';
import { TablePaginator } from "../components/TablePaginator";
import { TableComponent } from "../components/TableComponent";
import FilterPanel from "./FilterPanel";
import { TABLE_ACTIONS } from "../util/TableUtil";
import { QA_EVENT_SORT_NAME_INDEX } from "../util/ReportConstants";
import { MultiTab } from "../components/MultiTab";
import { Panel } from "../components/Panel";
import { datesDiff, isEmpty, parseDate } from "../util/Utils";

const QA_REPORT_SPINNER = "qaReportSpinner";
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

class QaReport extends Component {
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
      activeTab: 'IRB',

      // Table data
      irb: [],
      nonIrb: [],
      //filter Options
      beforeDate: null,
      afterDate: null,
      projectType: { value: 'all', label: 'All' },

      showError: false,
      isAdmin: component.isAdmin
    };
  }

  async componentDidMount() {
    await this.init();
  }

  async init() {
    await this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, this.state.currentPage, this.state.activeTab);
  }

  tableHandler = async (offset, limit, search, sort, page, type) => {
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
    let result = await Reports.getQaEventReport(query, type, filter);
      // .then(result => {
      const lastPage = Math.ceil(result.data.recordsFiltered / query.length);
      this.setState(prev => {
        prev.activeTab = type;
        prev.lastPage = lastPage;
        prev.currentPage = page;
        prev.irb = result.data.data;
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
    await this.tableHandler(0, this.state.sizePerPage, search, this.state.sort, 1, this.state.activeTab);
  };

  onPageChange = async (page, sizePerPage) => {
    const offset = (page - 1) * sizePerPage;
    await this.tableHandler(offset, sizePerPage, this.state.search, this.state.sort, page, this.state.activeTab);
  };

  onSortChange = async (sortName, sortOrder) => {
    const sort = {
      sortDirection: sortOrder,
      orderColumn: QA_EVENT_SORT_NAME_INDEX[sortName]
    };
    this.tableHandler(0, this.state.sizePerPage, null, sort, this.state.activeTab)
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

  tabChange = async (tab) => {
    await this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, 1, tab)
  };

  applyFilterPanel = async () => {
    await this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, 1, this.state.activeTab)
  };

  clearFilterPanel = async () => {
    this.setState(prev => {
      prev.beforeDate = null;
      prev.afterDate = null;
      prev.projectType = { value: 'all', label: 'All' };
    });
    await this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, 1, 'IRB');
  };

  render() {
    return(
      div({
      },[
        h1({},['Quality Assurance Report']),
        h(FilterPanel,{
          handleDatePicker: this.handleDatePicker,
          handleSelectProjectType: this.handleSelectProjectType,
          beforeDate: this.state.beforeDate,
          afterDate: this.state.afterDate,
          projectType: this.state.projectType,
          applyFilterPanel: this.applyFilterPanel,
          clearFilterPanel: this.clearFilterPanel
        }),
        Panel({
          title:
            MultiTab({
              defaultActive: 'IRB',
              handleSelect: (tab) => this.tabChange(tab)
            }, [
              div({
                key: "IRB",
                title: "IRB Projects"

              }, []),
              div({
                key: "NO_IRB",
                title: "Non IRB Projects"
              }, []),
            ])
        },[
          TableComponent({
            remoteProp: true,
            onTableChange: this.onTableChange,
            data: this.state.irb,
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
        ]),
        h(Spinner, {
          name: QA_REPORT_SPINNER, group: "orsp", loadingImage: component.loadingImage
        })
      ])
    );
  }

}
export default QaReport;
