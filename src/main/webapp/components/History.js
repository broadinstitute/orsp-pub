import React from 'react';
import { Component, Fragment } from 'react';
import { div, hh, h } from 'react-hyperscript-helpers';
import { TextEditor } from "./TextEditor";
import { Review } from "../util/ajax";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './Btn.css';
import { exportData } from "../util/Utils";
import { TableComponent } from "./TableComponent";
import { formatDataPrintableFormat } from "../util/TableUtil";
import { format } from 'date-fns';

const defaultSorted = [{
  dataField: 'date',
  order: 'desc'
}];

const columns = [{
    dataField: 'id',
    text: 'Id',
    hidden: true,
    csvExport : false
  }, {
    dataField: 'author',
    text: 'Author',
    sort: true
  }, {
    dataField: 'created',
    text: 'Date',
    sort: true
  }, {
    dataField: 'summary',
    text: 'Summary',
    sort: true,
    formatter: (cell, row, rowIndex, colIndex) =>
      div({dangerouslySetInnerHTML: { __html: cell } },[]),
    csvFormatter: (cell, row, rowIndex, colIndex) =>
      cell.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')
}];

export const History = hh(class History extends Component {

  constructor(props) {
    super(props);
  }

  printHistory = () => {
    let cols = columns.filter(el => el.dataField !== 'id');
    let historyArray = formatDataPrintableFormat(this.props.history, cols);
    const titleText = (component.issueType === "project" ? ("Project ID: " + component.projectKey)
      : ("Sample Data Cohort ID:"+ component.consentKey));
    const columnsWidths = [100, '*', 200];
    exportData('print',null, historyArray, titleText, 'ORSP History', columnsWidths);
  };

  render() {
    return (
      h(Fragment, {}, [
        TableComponent({
          remoteProp: false,
          data: this.props.history,
          columns: columns,
          keyField: 'id',
          search: true,
          fileName: 'ORSP',
          showPrintButton: false,
          printComments: this.printHistory,
          defaultSorted: defaultSorted,
          showSearchBar: true,
          pagination: true
        })
      ])
    )
  }
});
