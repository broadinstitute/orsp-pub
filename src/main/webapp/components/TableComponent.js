import React from 'react';
import { Component, Fragment } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';
import { h, div, hh } from 'react-hyperscript-helpers';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './Btn.css';
import './TableComponent.css'
import ExportExcel from "../search/ExportExcel";
import { formatExcelData2 } from "../util/TableUtil";
import { Export } from "./Export";
const { ExportCSVButton } = CSVExport;
const { SearchBar } = Search;

export const TableComponent = hh(class TableComponent extends Component {

  render() {
    const { remoteProp }= this.props;

    return(
      h(Fragment, {}, [
        <div className={"table-containter"}>
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
              <Export csvData={formatExcelData2(this.props.data, this.props.columns)} headers={this.props.columns.map(el => el.text)} fileName={this.props.excelFileName} />

              {/*<ExportExcel*/}
              {/*  filename={this.props.excelFileName}*/}
              {/*  buttonClassName={"btn buttonSecondary pull-right"}*/}
              {/*  // style= {{ marginRight:'15px' }}*/}
              {/*  spanClassName="fa fa-download"*/}
              {/*  excelDataSet={formatExcelData(this.props.data, this.props.columns)}*/}
              {/*  sheetName={"search-result"}*/}
              {/*>*/}
              {/*</ExportExcel>*/}
              <ExportCSVButton className={"pull-right"} { ...props.csvProps }>
                <span>
                  <i style={{ marginRight:'5px' }} className= { "fa fa-download" }></i> Download CSV
                </span>
              </ExportCSVButton>
              <button onClick= { this.props.printComments } className= { "btn buttonSecondary pull-right" } style= {{ marginRight:'15px' }}>
                <i style={{ marginRight:'5px' }} className= { "fa fa-print" }></i> Print All
              </button>
              <hr/>
              <BootstrapTable
                remote= {{
                  filter: remoteProp,
                  pagination: remoteProp,
                  sort: remoteProp,
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
        </div>
      ])
    )
  }
});
