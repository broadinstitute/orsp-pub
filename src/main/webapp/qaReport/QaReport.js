import { Component } from 'react';
import { h, h1, div } from 'react-hyperscript-helpers';
import { Reports } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from '../components/Spinner';
import FilterPanel from "./FilterPanel";
import { formatDataPrintableFormat, TABLE_ACTIONS } from "../util/TableUtil";
import { QA_EVENT_SORT_NAME_INDEX } from "../util/ReportConstants";
import { MultiTab } from "../components/MultiTab";
import IrbTable from "./IrbTable";
import NoIrbTable from "./NoIrbTable";
import { columns, IRB, NO_IRB, QA_REPORT_SPINNER } from "../util/QaReportConstants";
import { exportData } from "../util/Utils";

class QaReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      irb : {
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
        hide: false
      },
      noIrb : {
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
        hide: false
      },
      activeTab: IRB,
      applyFilter: false,
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
    await this.tableHandler(0, this.state[IRB].sizePerPage, this.state[IRB].search, this.state[IRB].sort, this.state[IRB].currentPage, IRB);
    await this.tableHandler(0, this.state[NO_IRB].sizePerPage, this.state[NO_IRB].search, this.state[NO_IRB].sort, this.state[NO_IRB].currentPage, NO_IRB);
  }

  dateHandler(today) {
    let nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1);
    return nextDay;
  }

  tableHandler = async (offset, limit, search, sort, page, tab) => {
    let query = {
      draw: 1,
      start: offset,
      length: limit,
      orderColumn: sort.orderColumn,
      sortDirection: sort.sortDirection,
      searchValue: search,
    };

    let filter = {
      before: this.state.beforeDate ? this.state.beforeDate.toLocaleDateString('en-US') : null,
      after: this.state.afterDate  ? this.dateHandler(this.state.afterDate).toLocaleDateString('en-US') : null,
      projectType: this.state.projectType.value
    };

    spinnerService.show(QA_REPORT_SPINNER);
    try {
      let result = await Reports.getQaEventReport(query, tab, filter);
      const lastPage = Math.ceil(result.data.recordsFiltered / query.length);
      this.setState(prev => {
        prev.query = query;
        prev[tab].lastPage = lastPage;
        prev[tab].currentPage = page;
        prev[tab].data = result.data.data;
        prev[tab].recordsTotal = result.data.recordsTotal;
        prev[tab].recordsFiltered = result.data.recordsFiltered;
        prev[tab].sizePerPage = query.length;
        prev[tab].search = query.searchValue;
        prev[tab].sort = {
          orderColumn : query.orderColumn,
          sortDirection: query.sortDirection
        };
        prev[tab].hide = result.data.data.length === 0;
        prev.activeTab = prev[IRB].hide ? NO_IRB : IRB;
        return prev;
      }, () => {
        spinnerService.hide(QA_REPORT_SPINNER)
      })
    } catch(error) {
      spinnerService.hide(QA_REPORT_SPINNER);
      this.setState(() => { throw error });
    }
  };

  onTableChange = async (type, newState, tab) => {
    switch(type) {
      case TABLE_ACTIONS.SEARCH: {
        await this.onSearchChange(newState.searchText, tab);
        break
      }
      case TABLE_ACTIONS.FILTER: {
        // Not implemented
        break;
      }
      case TABLE_ACTIONS.PAGINATION: {
        await this.onPageChange(newState.page, newState.sizePerPage, tab);
        break;
      }
      case TABLE_ACTIONS.SORT: {
        await this.onSortChange(newState.sortField, newState.sortOrder, tab);
        break;
      }
    }
  };

  onSearchChange = async (search, tab) => {
    await this.tableHandler(0, this.state[tab].sizePerPage, search, this.state[tab].sort, 1, tab);
  };

  onPageChange = async (page, sizePerPage, tab) => {
    const offset = (page - 1) * sizePerPage;
    await this.tableHandler(offset, sizePerPage, this.state[tab].search, this.state[tab].sort, page, tab);
  };

  onSortChange = async (sortName, sortOrder, tab) => {
    const sort = {
      sortDirection: sortOrder,
      orderColumn: QA_EVENT_SORT_NAME_INDEX[sortName]
    };
    this.tableHandler(0, this.state[tab].sizePerPage, null, sort,0 , tab)
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

  applyFilterPanel = async () => {
    if (this.state.projectType.value === 'irb') {
      this.setState(prev => {
        prev.activeTab = IRB;
        prev[NO_IRB].hide = true;
        }, async () =>
        await this.tableHandler(0, this.state[IRB].sizePerPage, this.state[IRB].search, this.state[IRB].sort, this.state[IRB].currentPage, IRB)
      );
    } else if (this.state.projectType.value !== 'all') {
      this.setState(prev => {
        prev.activeTab = NO_IRB;
        prev[IRB].hide = true;
      }, async () =>
        await this.tableHandler(0, this.state[NO_IRB].sizePerPage, this.state[NO_IRB].search, this.state[NO_IRB].sort, this.state[NO_IRB].currentPage, NO_IRB)
      );
    } else {
       this.init()
    }
  };

  clearFilterPanel = () => {
    this.setState(prev => {
      prev.beforeDate = null;
      prev.afterDate = null;
      prev.projectType = { value: 'all', label: 'All' };
      prev.hideIrb = false;
      prev.hideNoIrb = false;
      return prev;
    }, () =>
      this.init()
    );
  };

  exportTable = (action, tab) => {
    const allElementsQuery = {
      draw: 1,
      start: 0,
      length: 0,
      orderColumn: null,
      sortDirection: 'desc',
      searchValue: null,
    };

    let cols = columns.filter(el => el.dataField !== 'id');
    let elementsArray = formatDataPrintableFormat(this.state[tab].data, cols);
    const titleText = 'Quality Assurance Report';
    const columnsWidths = ['*', '*', '*', '*', '*'];
    exportData(action,'Quality Assurance Report', elementsArray, titleText, 'Quality Assurance Report', columnsWidths);
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
        div({ className: "headerBoxContainer" }, [
          div({ className: "containerBox" }, [
            MultiTab({
              defaultActive: this.state.activeTab
            }, [
              div({
                key: IRB,
                title: "IRB Projects",
                hide: this.state[IRB].hide
              }, [
                h(IrbTable, {
                  history: this.props.history,
                  tableHandler: this.tableHandler,
                  exportTable: this.exportTable,
                  irb: this.state[IRB],
                  onTableChange: this.onTableChange,
                  beforeDate: this.state.beforeDate,
                  afterDate: this.state.afterDate,
                  projectType: this.state.projectType,
                  applyFilter: this.state.applyFilter
                })
              ]),
              div({
                key: NO_IRB,
                title: "Non IRB Projects",
                hide: this.state[NO_IRB].hide
              }, [
                h(NoIrbTable, {
                  tableHandler: this.tableHandler,
                  exportTable: this.exportTable,
                  noIrb: this.state[NO_IRB],
                  onTableChange: this.onTableChange,
                  beforeDate: this.state.beforeDate,
                  afterDate: this.state.afterDate,
                  projectType: this.state.projectType,
                  applyFilter: this.state.applyFilter
                })
              ])
            ])
          ])
        ]),
        h(Spinner, {
          name: QA_REPORT_SPINNER, group: "orsp", loadingImage: component.loadingImage
        })
      ])
    );
  }
}
export default QaReport;
