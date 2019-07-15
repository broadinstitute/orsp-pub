import React from 'react';
import { Component, Fragment } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';
import { h, div, hh } from 'react-hyperscript-helpers';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './Btn.css';

const { ExportCSVButton } = CSVExport;
const { SearchBar } = Search;
const MySearch = (props) => {
  let input;
  const handleClick = () => {
    props.onSearch(input.value);
  };
  return (
    <div>
      <input
        className="form-control"
        style={ { backgroundColor: 'pink' } }
        ref={ n => input = n }
        type="text"
      />
      <button className="btn btn-warning" onClick={ handleClick }>Click to Search!!</button>
    </div>
  );
};

export const TableAsync = hh(class TableAsync extends Component {
  render() {
    return(
      h(Fragment, {}, [
        <ToolkitProvider
          keyField= {this.props.keyField}
          data= { this.props.data }
          columns= { this.props.columns }
          search= { this.props.search }
          exportCSV= {{ fileName: this.props.csvFileName }}
        >
          { props =>
            <div>
              <SearchBar { ...props.searchProps } />

              <ExportCSVButton className={"pull-right"} { ...props.csvProps }>
                <span>
                  <i style={{marginRight:'5px'}} className= { "fa fa-download" }></i> Download CSV
                </span>
              </ExportCSVButton>

              <button onClick= { this.props.printComments } className= { "btn buttonSecondary pull-right" } style= {{ marginRight:'15px' }}>
                <i style={{marginRight:'5px'}} className= { "fa fa-print" }></i> Print All
              </button>

              <hr/>
              <BootstrapTable
                remote= {{
                  filter: true,
                  pagination: true,
                  sort: true,
                  cellEdit: false
                }}
                pagination={ paginationFactory({ page: this.props.page, totalSize: this.props.totalSize })}
                defaultSorted= { this.props.defaultSorted}
                onTableChange= { this.props.onTableChange }
                {...props.baseProps }
              />
            </div>
          }
        </ToolkitProvider>
      ])
    )
  }
});
