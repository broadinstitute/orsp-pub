import React from 'react';
import { Component, Fragment } from 'react';
import { div, hh, h } from 'react-hyperscript-helpers';
import { TextEditor } from "../main/TextEditor";
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './Comments.css';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';
import { Review } from "../util/ajax";

const { ExportCSVButton } = CSVExport;
const { SearchBar } = Search;

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
    div({dangerouslySetInnerHTML: { __html: cell } },[])
}];

export const Comments = hh(class Comments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comments: []
    }
  }

  componentDidMount() {
    Review.getComments(this.props.id).then(result => {
      this.setState(prev => {
        prev.comments = result.data;
        return prev;
      })
    }).catch(error => {
      this.setState(() => { throw error; });
    })
  }

  insertNewComment = (comment) => {
    let currentComments = this.state.comments;
    currentComments.push(comment);
    this.setState(prev => {
      prev.comments = currentComments;
      return prev;
    })
  };

  render() {
    return (
      h(Fragment, {}, [
        TextEditor({
          id: this.props.id,
          insertNewComment: this.insertNewComment
        }),
        <ToolkitProvider
          keyField="id"
          data={ this.state.comments }
          columns={ columns }
          exportCSV={ true }
          search={ true }
        >
          {
            props =>
              <div>
                <SearchBar { ...props.searchProps } />
                <ExportCSVButton
                     { ...props.csvProps }>Download CSV</ExportCSVButton>
                <hr/>
                <BootstrapTable
                  pagination= { paginationFactory() }
                  {...props.baseProps }
                />
              </div>
          }
        </ToolkitProvider>
      ])
    )
  }
});
