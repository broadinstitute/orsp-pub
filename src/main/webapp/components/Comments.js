import React, { Component, Fragment } from 'react';
import { div, h, hh } from 'react-hyperscript-helpers';
import TextEditor from './TextEditor';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './Btn.css';
import { exportData } from '../util/Utils';
import { TableComponent } from './TableComponent';
import { formatDataPrintableFormat } from '../util/TableUtil';
import LoadingWrapper from './LoadingWrapper';
import { format } from 'date-fns';
import { isEmpty } from '../util/Utils';

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
    sort: true,
    formatter: (cell, row, rowIndex, colIndex) =>
    div({},[
      !isEmpty(row.date) ? format(new Date(row.date), 'MM/DD/YYYY HH:MM') : ''
    ])
  }, {
    dataField: 'comment',
    text: 'Comment',
    sort: true,
    formatter: (cell, row, rowIndex, colIndex) =>
      div({dangerouslySetInnerHTML: { __html: cell } },[]),
    csvFormatter: (cell, row, rowIndex, colIndex) =>
      cell.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')
}];

const columnsCopy = [{
  dataField: 'project',
  text: 'Project',
  sort: true
}, {
  dataField: 'title',
  text: 'Title',
  sort: true
}, {
  dataField: 'status',
  text: 'Status',
  sort: true
}, {
  dataField: 'type',
  text: 'Type',
  sort: true
}, {
  dataField: 'updated',
  text: 'Updated',
  sort: true
}, {
  dataField: 'expiration',
  text: 'Expiration',
  sort: true
}];

const Comments = hh(class Comments extends Component {

  constructor(props) {
    super(props);
  }

  printComments = () => {
    let cols = columns.filter(el => el.dataField !== 'id');
    let commentsArray = formatDataPrintableFormat(this.props.comments, cols);
    const titleText = (component.issueType === "project" ? ("Project ID: "+ this.props.projectKey)
      : ("Sample Data Cohort ID:"+ component.consentKey));
    const columnsWidths = [100, '*', 200];
    exportData('print', null, commentsArray, titleText, 'ORSP Comments', columnsWidths);
  };

  render() {
    return (
      h(Fragment, {}, [
        h(TextEditor, {
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
          hideXlsxColumns: [],
          showSearchBar: true
        })
      ])
    )
  }
});

export default LoadingWrapper(Comments)
