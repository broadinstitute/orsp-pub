import { Component } from 'react';
import { TableComponent } from "../components/TableComponent";
import { QA_REPORT_COLUMNS, COLUMNS_TO_HIDE_FROM_EXCEL, defaultSorted, IRB, SIZE_PER_PAGE_LIST } from '../util/ReportConstants';

class IrbTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      isAdmin: component.isAdmin
    };
  }

  exportTable = (action) => {
    this.props.exportTable(action, IRB)
  };

  render() {
    return(
      TableComponent({
        remoteProp: false,
        data: this.props[IRB].filteredData,
        columns: QA_REPORT_COLUMNS,
        keyField: 'id',
        search: true,
        fileName: 'Quality Assurance Report',
        showPrintButton: true,
        sizePerPageList: SIZE_PER_PAGE_LIST,
        printComments: () => this.exportTable('print'),
        downloadPdf: () => this.exportTable('download'),
        defaultSorted: defaultSorted,
        pagination: true,
        showExportButtons: true,
        showSearchBar: true,
        showPdfExport: true,
        hideXlsxColumns: COLUMNS_TO_HIDE_FROM_EXCEL
      })
    );
  }
}
export default IrbTable;
