import { Component } from 'react';
import { TableComponent } from "../components/TableComponent";
import {
  columns,
  COLUMNS_TO_HIDE_FROM_EXCEL,
  defaultSorted,
  NO_IRB,
  SIZE_PER_PAGE_LIST
} from "../util/QaReportConstants";

class NoIrbTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      isAdmin: component.isAdmin,
    };
  }

  exportTable = (action) => {
    this.props.exportTable(action, NO_IRB)
  };

  render() {
    return(
      TableComponent({
        remoteProp: true,
        onTableChange: (action, newState) => this.props.onTableChange(action, newState, NO_IRB),
        data: this.props[NO_IRB].data,
        columns: columns,
        keyField: 'id',
        search: true,
        fileName: 'Quality Assurance Report',
        page: this.props[NO_IRB].currentPage,
        totalSize: this.props[NO_IRB].recordsFiltered,
        showPrintButton: true,
        sizePerPageList: SIZE_PER_PAGE_LIST,
        printComments: ()=> this.exportTable('print'),
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
export default NoIrbTable;
