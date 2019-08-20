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
import IrbTable from "./IrbTable";
import NoIrbTable from "./NoIrbTable";

export const QA_REPORT_SPINNER = "qaReportSpinner";

class QaReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 'IRB',
      applyFilter: false,
      beforeDate: null,
      afterDate: null,
      projectType: { value: 'all', label: 'All' },
      showError: false,
      isAdmin: component.isAdmin
    };
  }

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
    this.setState(prev => {
      prev.applyFilter = true;
      return prev;
    });
    // await this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, 1, this.state.activeTab)
  };

  clearFilterPanel = () => {
    this.setState(prev => {
      prev.beforeDate = null;
      prev.afterDate = null;
      prev.projectType = { value: 'all', label: 'All' };
      prev.applyFilter = false;
      return prev;
    }
    // , async () => await this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, 1, 'IRB')
    );
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
              handleSelect: (tab) => console.log(tab)
            }, [
              div({
                key: "IRB",
                title: "IRB Projects",
                hide: false
              }, [
                h(IrbTable, {
                  beforeDate: this.state.beforeDate,
                  afterDate: this.state.afterDate,
                  projectType: this.state.projectType,
                  applyFilter: this.state.applyFilter
                })
              ]),
              div({
                key: "NO_IRB",
                title: "Non IRB Projects",
                hide: false
              }, [
                h(NoIrbTable, {
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
