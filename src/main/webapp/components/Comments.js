import React from 'react';
import { Component, Fragment } from 'react';
import { div, hh, h } from 'react-hyperscript-helpers';
import { TextEditor } from "../main/TextEditor";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './Btn.css';
import { printData } from "../util/Utils";
import { TableComponent } from "./TableComponent";
import { formatDataPrintableFormat } from "../util/TableUtil";

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
    dataField: 'date',
    text: 'Date',
    sort: true
  }, {
    dataField: 'comment',
    text: 'Comment',
    sort: true,
    formatter: (cell, row, rowIndex, colIndex) =>
      div({dangerouslySetInnerHTML: { __html: cell } },[]),
    csvFormatter: (cell, row, rowIndex, colIndex) =>
      cell.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')
}];

export const Comments = hh(class Comments extends Component {

  constructor(props) {
    super(props);
  }

  printComments = () => {
    let cols = columns.filter(el => el.dataField !== 'id');
    let commentsArray = formatDataPrintableFormat(this.props.comments, cols);
    const titleText = (component.issueType === "project" ? ("Project ID: "+ this.props.projectKey)
      : ("Sample Data Cohort ID:"+ component.consentKey));
    const columnsWidths = [100, '*', 200];
    printData(commentsArray, titleText, 'ORSP Comments', columnsWidths);
  };

  render() {
    return (
      h(Fragment, {}, [
        TextEditor({
          showSpinner: this.props.showSpinner,
          hideSpinner: this.props.hideSpinner,
          id: this.props.id,
          loadComments: this.props.updateContent
        }),
        TableComponent({
          remoteProp: false,
          data: this.props.comments,
          columns: columns,
          keyField: 'id',
          search: true,
          fileName: 'ORSP',
          showPrintButton: false,
          printComments: this.printComments,
          defaultSorted: defaultSorted,
          pagination: true,
          showExportButtons: true,
          showSearchBar: true
        })
      ])
    )
  }
});
