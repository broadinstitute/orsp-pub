import React from 'react';
import { Component, Fragment } from 'react';
import { div, hh, h } from 'react-hyperscript-helpers';
import { TextEditor } from "../main/TextEditor";
import { Review } from "../util/ajax";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './Btn.css';
import { printData } from "../util/Utils";
import { TableComponent } from "./TableComponent";

const defaultSorted = [{
  dataField: 'date',
  order: 'desc'
}];

const columns = [{
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
    cell.replace(/<[^>]*>?/gm, '')
}];

export const Comments = hh(class Comments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comments: []
    }
  }

  componentDidMount() {
    this.loadComments();
  }

  loadComments = () => {
    Review.getComments(this.props.id).then(result => {
      this.setState(prev => {
        prev.comments = result.data;
        return prev;
      })
    }).catch(error => {
      this.setState(() => { throw error; });
    })
  };

  printComments = () => {
    let commentsArray = [];
    commentsArray.push(columns.map(el => el.text));
    this.state.comments.forEach(comment => {
      commentsArray.push([comment.author, comment.date, comment.comment.replace(/<[^>]*>?/gm, '')])
    });
    const titleText = (component.issueType === "project" ? ("Project ID: "+ component.projectKey)
      : ("Sample Data Cohort ID:"+ component.consentKey));
    const columnsWidths = [100, '*', 200];
    printData(commentsArray, titleText, 'ORSP Comments', columnsWidths);
  };

  render() {
    return (
      h(Fragment, {}, [
        TextEditor({
          id: this.props.id,
          loadComments: this.loadComments
        }),
        TableComponent({
          remoteProp: false,
          data: this.state.comments,
          columns: columns,
          keyField: 'id',
          search: true,
          csvFileName: 'ORSP.csv',
          excelFileName: 'FundingsReport.xlsx',
          showPrintButton: false,
          printComments: this.printComments,
          defaultSorted: defaultSorted
        })
      ])
    )
  }
});
