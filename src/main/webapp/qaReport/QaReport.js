import { Component } from 'react';
import { h, h1, div } from 'react-hyperscript-helpers';
import { Reports } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from '../components/Spinner';
import FilterPanel from "./FilterPanel";
import { formatDataPrintableFormat } from "../util/TableUtil";
import { MultiTab } from "../components/MultiTab";
import IrbTable from "./IrbTable";
import NoIrbTable from "./NoIrbTable";
import { columns, IRB, NO_IRB, QA_REPORT_SPINNER } from "../util/QaReportConstants";
import { createObjectCopy, exportData, isEmpty } from "../util/Utils";

class QaReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      irb : {
        isLoaded: false,
        sizePerPage: 50,
        search: null,
        sort: {
          sortDirection: 'asc',
          orderColumn: null
        },
        data: [],
        filteredData: [],
        hide: false
      },
      noIrb : {
        isLoaded: false,
        sizePerPage: 50,
        search: null,
        sort: {
          sortDirection: 'asc',
          orderColumn: null
        },
        data: [],
        filteredData: [],
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
    await this.tableHandler(IRB);
  }

  tableHandler = async ( tab) => {
    spinnerService.show(QA_REPORT_SPINNER);
    try {
      let result = await Reports.getQaEventReport(tab);
      this.setState(prev => {
        prev[tab].data = result.data.data;
        prev[tab].filteredData = result.data.data;
        prev[tab].isLoaded = true;
        return prev;
      }, () => {
        spinnerService.hide(QA_REPORT_SPINNER)
      })
    } catch(error) {
      spinnerService.hide(QA_REPORT_SPINNER);
      this.setState(() => { throw error });
    }
  };

  handleTabChange = async (tab) => {
    if (!this.state[tab].isLoaded) {
      await this.tableHandler(tab);
    }
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
    if (isEmpty(this.state[NO_IRB].data)) {
      await this.tableHandler(NO_IRB);
    }
    if (this.state.projectType.value === IRB) {
      this.filterByDate(this.state[IRB].filteredData);
      this.setState( prev => {
          prev[IRB].filteredData = this.filterByDate(this.state[IRB].data);
          prev[IRB].hide = false;
          prev[NO_IRB].hide = true;
          prev.activeTab = IRB;
          return prev;
        }
      )
    } else if (this.state.projectType.value !== 'all') {
      this.setState( prev => {
          prev[NO_IRB].filteredData = this.filterByDate(this.state[NO_IRB].data.filter(element => (element.type === this.state.projectType.label)));
          prev[IRB].hide = true;
          prev[NO_IRB].hide = false;
          prev.activeTab = NO_IRB;
          return prev;
        }
      )
    } else {
      this.setState( prev => {
        prev[IRB].filteredData = this.filterByDate(this.state[IRB].data);
        prev[NO_IRB].filteredData = this.filterByDate(this.state[NO_IRB].data);
        prev[IRB].hide = false;
        prev[NO_IRB].hide = false;
        prev.activeTab = IRB;
        return prev;
      })
    }
  };

  filterByDate = (dataArray) => {
    let filtered = dataArray;
    if (this.state.afterDate || this.state.beforeDate) {
      filtered = dataArray.filter(element => {
        if (this.state.afterDate && this.state.beforeDate) {
          return(
            (new Date(element.requestDate) > this.state.afterDate) &&
            (new Date(element.requestDate) < this.state.beforeDate)
          )
        } else if (this.state.afterDate) {
          return (new Date(element.requestDate) > this.state.afterDate);
        } else if (this.state.beforeDate) {
          return (new Date(element.requestDate) < this.state.beforeDate);
        }
      });
    }
    return filtered;
  };

  clearFilterPanel = () => {
    this.setState(prev => {
      prev.beforeDate = null;
      prev.afterDate = null;
      prev.projectType = { value: 'all', label: 'All' };
      prev[IRB].filteredData = createObjectCopy(this.state[IRB].data);
      prev[NO_IRB].filteredData = isEmpty(this.state[NO_IRB].data) ? [] : createObjectCopy(this.state[NO_IRB].data);
      prev[IRB].hide = false;
      prev[NO_IRB].hide = false;
      prev.activeTab = IRB;
      return prev;
    });
  };

  exportTable = (action, tab) => {
    let cols = columns.filter(el => el.dataField !== 'id');
    let elementsArray = formatDataPrintableFormat(this.state[tab].data, cols);
    const headerText = 'Quality Assurance Report';
    const columnsWidths = ['*', '*', '*', '*', '*'];
    exportData(action,'Quality Assurance Report', elementsArray, '', headerText, columnsWidths, 'A3');
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
              defaultActive: this.state.activeTab,
              handleSelect: this.handleTabChange
            }, [
              div({
                key: IRB,
                title: "IRB Projects",
                hide: this.state[IRB].hide
              }, [
                h(IrbTable, {
                  history: this.props.history,
                  exportTable: this.exportTable,
                  irb: this.state[IRB],
                  onTableChange: this.onTableChange,
                  beforeDate: this.state.beforeDate,
                  afterDate: this.state.afterDate,
                  projectType: this.state.projectType
                })
              ]),
              div({
                key: NO_IRB,
                title: "Non IRB Projects",
                hide: this.state[NO_IRB].hide
              }, [
                h(NoIrbTable, {
                  exportTable: this.exportTable,
                  noIrb: this.state[NO_IRB],
                  onTableChange: this.onTableChange,
                  beforeDate: this.state.beforeDate,
                  afterDate: this.state.afterDate,
                  projectType: this.state.projectType
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
