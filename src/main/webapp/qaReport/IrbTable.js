import { Component } from 'react';
import { TableComponent } from "../components/TableComponent";
import { datesDiff, printData } from "../util/Utils";
import { formatDataPrintableFormat } from "../util/TableUtil";

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

class IrbTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showError: false,
      isAdmin: component.isAdmin,
    };
  }

  printTable = () => {
    let cols = columns.filter(el => el.dataField !== 'id');
    let commentsArray = formatDataPrintableFormat(this.props.comments, cols);
    const titleText = (component.issueType === "project" ? ("Project ID: "+ component.projectKey)
      : ("Sample Data Cohort ID:"+ component.consentKey));
    const columnsWidths = [100, '*', 200];
    printData(commentsArray, titleText, 'ORSP Comments', columnsWidths);
  };

  render() {
    return(
      TableComponent({
        remoteProp: true,
        onTableChange: (action, newState) => this.props.onTableChange(action, newState, 'IRB'),
        data: this.props.irb.data,
        columns: columns,
        keyField: 'id',
        search: true,
        fileName: 'ORSP',
        page: this.props.irb.currentPage,
        totalSize: this.props.irb.recordsFiltered,
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
export default IrbTable;
