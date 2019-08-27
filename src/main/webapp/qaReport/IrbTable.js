import { Component } from 'react';
import { TableComponent } from "../components/TableComponent";
import { div, a } from 'react-hyperscript-helpers';
import { COLUMNS_TO_HIDE_FROM_EXCEL, defaultSorted, IRB, SIZE_PER_PAGE_LIST } from "../util/QaReportConstants";

const columns =(cthis) => [{
  dataField: 'id',
  text: 'Id',
  hidden: true,
  csvExport : false
}, {
  dataField: 'projectKey',
  text: 'Project',
  sort: true,
  formatter: (cell, row, rowIndex, colIndex) =>
    div({},[
      a({onClick: () => cthis.props.history.push("/statusEvent/projectReport")},[row.projectKey])
    ])
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
  sort: true
}, {
  dataField: 'actor',
  text: 'Assignees',
  sort: true
}];

class IrbTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      isAdmin: component.isAdmin,
    };
  }

  exportTable = (action) => {
    this.props.exportTable(action, IRB)
  };

  render() {
    return(
      TableComponent({
        remoteProp: true,
        onTableChange: (action, newState) => this.props.onTableChange(action, newState, IRB),
        data: this.props[IRB].data,
        columns: columns(this),
        keyField: 'id',
        search: true,
        fileName: 'ORSP',
        page: this.props[IRB].currentPage,
        totalSize: this.props[IRB].recordsFiltered,
        showPrintButton: true,
        sizePerPageList: SIZE_PER_PAGE_LIST,
        printComments: () => this.exportTable('print'),
        downloadPdf: () => this.exportTable('download'),
        defaultSorted: defaultSorted,
        pagination: true,
        showExportButtons: true,
        showSearchBar: true,
        showPdfExport: true,
        hideColumns: COLUMNS_TO_HIDE_FROM_EXCEL
      })
    );
  }
}
export default IrbTable;
