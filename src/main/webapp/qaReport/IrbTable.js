import { Component } from 'react';
import { TableComponent } from "../components/TableComponent";
import { exportData } from "../util/Utils";
import { formatDataPrintableFormat } from "../util/TableUtil";
import { columns, COLUMNS_TO_HIDE_FROM_EXCEL, defaultSorted, IRB, SIZE_PER_PAGE_LIST } from "../util/QaReportConstants";

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
        columns: columns,
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
