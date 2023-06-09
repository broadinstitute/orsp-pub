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

const defaultSorted = [{
  dataField: 'date',
  order: 'desc'
}];

const columns = [{
    dataField: 'id',
    text: 'Id',
    hidden: true,
    editable: false,
    csvExport : false
  }, {
    dataField: 'author',
    text: 'Author',
    sort: true,
    editable: false
  }, {
    dataField: 'date',
    text: 'Date',
    sort: true,
    editable: false
  }, {
    dataField: 'comment',
    text: 'Comment',
    sort: true,
    editable: false,
    formatter: (cell, row, rowIndex, colIndex) =>
      div({dangerouslySetInnerHTML: { __html: cell } },[]),
    csvFormatter: (cell, row, rowIndex, colIndex) =>
      cell.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ')
  }, {
    dataField: 'Actions',
    text: 'Actions',
    sort: false,
    formatter: (cell, row, rowIndex, formatExtraData) => {
      return (
        <>
          <button className='btnPrimary'>
            <span className='glyphicon glyphicon-pencil'></span>
          </button>
          <button className='btnPrimary'>
            <span className='glyphicon glyphicon-remove'></span>
          </button>
        </>
      )
    }
  }];

const Comments = hh(class Comments extends Component {

  constructor(props) {
    super(props);
  }

  printComments = () => {
    let cols = this.state.columns.filter(el => el.dataField !== 'id');
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
