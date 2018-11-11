import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import ExportExcel from './ExportExcel'

function linkFormatter(cell, row) {
    return '<a href="' + row.link + '">' + row.key + '</a>';
}

let excelData = [];
let formattedProjectData = [];

const excelDataSet = [
    {
        columns: ["Project Key", "Title", "Project Type", "Status", "Update Date", "Expiration Date"],
        data: excelData
    }
];

function compareDateString(a, b, order) {

    // This format comes from the server - update if the format changes.
    const format = "MM/DD/YYYY";
    let aTime = moment(a, format);
    let bTime = moment(b, format);
    let aIsNewer = (aTime.isValid() && bTime.isValid() && aTime > bTime);
    let bothSame = (aTime.isValid() && bTime.isValid() && aTime === bTime);
    if (!aTime.isValid() && bTime.isValid()) {
        aIsNewer = false
    }
    if (!bTime.isValid() && aTime.isValid()) {
        aIsNewer = true
    }
    if (!aTime.isValid() && !bTime.isValid()) {
        bothSame = true
    }
    if (order === 'desc') {
        if (aIsNewer) return -1;
        if (bothSame) return 0;
        return 1;
    } else {
        if (aIsNewer) return 1;
        if (bothSame) return 0;
        return -1;
    }
}

function expirationSort(a, b, order) {
    return compareDateString(a.expiration, b.expiration, order);
}

function updateSort(a, b, order) {
    return compareDateString(a.updated, b.updated, order);
}

function loadData(projectData) {
    formattedProjectData = [];
    projectData.map(project => {
         const dataColumnValues = [
                       {value: project.key, style: {font: {sz: "10"}}},
                       {value: project.title, style: {font: {sz: "10"}}},
                       {value: project.type, style: {font: {sz: "10"}}},
                       {value: project.status, style: {font: {sz: "10"}}},
                       {value: project.updated, style: {font: {sz: "10"}, numFmt: "mm/dd/yyyy"}},
                       {value: project.expiration, style: {font: {sz: "10"}, numFmt: "mm/dd/yyyy"}}
                   ];
       excelData.push(dataColumnValues);
       // remove commas in project data for CSV export
       let row = {
                  key: project.key,
                  link: project.link,
                  title: project.title != null ? project.title.replace(/,/g," ") : project.title,
                  type: project.type,
                  status: project.status,
                  updated: project.updated,
                  expiration: project.expiration
                  };
       formattedProjectData.push(row);
    })
}

class SearchResults extends React.Component {

    renderPaginationShowsTotal(start, to, total) {
      return (
        <p className={"totalCount"}>
          From { start } to { to }, total is <b>{ total }</b>
        </p>
      );
    }

    render(props) {
        if (this.props.loading) {
            return (<div>
                <h2>Results</h2>
                <div className={"alert alert-info"}><span className={"glyphicon glyphicon-refresh glyphicon-refresh-animate"}> </span> Searching...</div>
            </div>)
        } else if (this.props.loaded) {
            loadData(this.props.data);
            return (<div className={"position-relative"}>
                <h2>Results</h2>
                <div>
                  <ExportExcel filename="search-results"
                               buttonClassName="btn btn-success btn-export-excel"
                               spanClassName="fa glyphicon glyphicon-export fa-download"
                               excelDataSet={excelDataSet}
                               sheetName="search-result"
                  />
                </div>
                <BootstrapTable data={formattedProjectData}
                                exportCSV={true}
                                csvFileName='search-results.csv'
                                striped
                                hover
                                pagination={true}
                                options={{
                                    paginationShowsTotal: this.renderPaginationShowsTotal,
                                    noDataText: 'No results available',
                                    paginationSize: 5,
                                    paginationPosition: 'both',
                                    sizePerPage: 50
                                }}>
                    <TableHeaderColumn csvHeader='Project Key' dataField='key' isKey dataSort={ true } dataFormat={linkFormatter}>Key</TableHeaderColumn>
                    <TableHeaderColumn csvHeader='Title' dataField='title' width={'30%'} dataSort={ true }>Title</TableHeaderColumn>
                    <TableHeaderColumn csvHeader='Project Type' dataField='type' dataSort={ true }>Type</TableHeaderColumn>
                    <TableHeaderColumn csvHeader='Status' dataField='status' dataSort={ true }>Status</TableHeaderColumn>
                    <TableHeaderColumn csvHeader='Update Date' dataField='updated' dataSort={ true } sortFunc={ updateSort }>Updated</TableHeaderColumn>
                    <TableHeaderColumn csvHeader='Expiration Date' dataField='expiration' dataSort={ true } sortFunc={ expirationSort }>Expiration</TableHeaderColumn>
                </BootstrapTable>
            </div>)
        } else {
            return (<div></div>)
        }
    }
}

export default SearchResults;
