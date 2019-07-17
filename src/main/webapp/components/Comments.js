import React from 'react';
import { Component, Fragment } from 'react';
import { div, hh, h } from 'react-hyperscript-helpers';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';
import { TextEditor } from "../main/TextEditor";
import { Review } from "../util/ajax";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './Btn.css';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { printData } from "../util/Utils";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const { ExportCSVButton } = CSVExport;
const { SearchBar } = Search;
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
        <ToolkitProvider
          keyField= "id"
          data= { this.state.comments }
          columns= { columns }
          search= { true }
          exportCSV= {{ fileName: 'ORSP.csv' }}
        >
          {
            props =>
              <div>
                <SearchBar { ...props.searchProps } />
                <ExportCSVButton className={"pull-right"} { ...props.csvProps }>
                  <span>
                    <i style={{marginRight:'5px'}} className= { "fa fa-download" }></i> Download CSV
                  </span>
                </ExportCSVButton>
                <button onClick= { this.printComments } className= { "btn buttonSecondary pull-right" } style= {{ marginRight:'15px' }}>
                  <i style={{marginRight:'5px'}} className= { "fa fa-print" }></i> Print All
                </button>
                <hr/>
                <BootstrapTable
                  pagination= { paginationFactory() }
                  defaultSorted= { defaultSorted}
                  {...props.baseProps }
                />
              </div>
          }
        </ToolkitProvider>
      ])
    )
  }
});
