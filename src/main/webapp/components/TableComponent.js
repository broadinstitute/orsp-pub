import React from 'react';
import { Component, Fragment } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport, Search } from 'react-bootstrap-table2-toolkit';
import { h, div, hh, span } from 'react-hyperscript-helpers';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import './Btn.css';
import './TableComponent.css'
import { Export } from "./Export";
import { EXPORT_FILE } from "../util/TableUtil";
import { TableHeaderColumn } from 'react-bootstrap-table';
const { ExportCSVButton } = CSVExport;
const { SearchBar } = Search;

export const TableComponent = hh(class TableComponent extends Component {

  documentDescriptionEdit = (cell, row) => {
    this.props.documentDescriptionEdit(row);
  }

  render() {
    const { remoteProp } = this.props;

    return(
      h(Fragment, {}, [
        <div className={"table-containter"}>
          <ToolkitProvider
          keyField= {this.props.keyField}
          data= { this.props.data }
          columns= { this.props.columns }
          search= { this.props.search }
          exportCSV= {{ fileName: this.props.fileName.concat('.csv') }}
        >
          { props =>
            <div>
              {this.props.showSearchBar ? <SearchBar { ...props.searchProps } /> : ''}
              {this.props.showExportButtons ?
                <span name={'exportButtons'}>
                  <Export
                    csvData={this.props.data}
                    columns={this.props.columns}
                    fileName={this.props.fileName}
                    fileType={EXPORT_FILE.XLSX.mimeType}
                    fileExtension={EXPORT_FILE.XLSX.extension}
                    hide={this.props.hideXlsxColumns}
                  />
                  <ExportCSVButton className={"pull-right"} { ...props.csvProps }>
                    <span>
                      <i style={{ marginRight:'5px' }} className= { "fa fa-download" }></i> Download CSV
                    </span>
                  </ExportCSVButton>
                  { this.props.showPrintButton ? <button onClick= { this.props.printComments } className= { "btn buttonSecondary pull-right" } style= {{ marginRight:'15px' }}>
                    <i style={{ marginRight:'5px' }} className= { "fa fa-print" }></i> Print
                  </button> : ''}
                  {this.props.showPdfExport ?
                    <button onClick= { this.props.downloadPdf } className= { "btn buttonSecondary pull-right" } style= {{ marginRight:'15px' }}>
                      <i style={{ marginRight:'5px' }} className= { "fa fa-print" }></i> PDF
                    </button>
                    : ''}
                  <hr/>
                </span>
                : ''
              }
              <BootstrapTable
                remote= {{
                  filter: remoteProp,
                  pagination: remoteProp,
                  sort: remoteProp,
                  cellEdit: false
                }}
                pagination= {
                  this.props.pagination ?
                  paginationFactory({
                    page: this.props.page,
                    totalSize: this.props.totalSize,
                    sizePerPageList: this.props.sizePerPageList
                  }) : null
                }
                defaultSorted= { this.props.defaultSorted }
                onTableChange= { this.props.onTableChange }
                {...props.baseProps }
              >
                {
                  this.props.columns.map((column, index) => {
                    isKey = (index === 0)
                    if (column.dataField === 'description') {
                      return (
                        <TableHeaderColumn
                          key={column.text}
                          dataField={column.dataField}
                          dataFormat={this.documentDescriptionEdit}
                        >{column.text}</TableHeaderColumn>
                      )
                    }
                  })
                }
              </BootstrapTable>
            </div>
          }
        </ToolkitProvider>
        </div>
      ])
    )
  }
});
