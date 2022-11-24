import React, { Component } from "react";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import ExportExcel from "./ExportExcel";
import { User } from "../util/ajax";

const styles = {
  projectTitleWidth: '220',
  projectAccessWidth: '200',
  datesWidth: '110',
  typeWidth: '170'
};

class SearchResults extends Component {
  excelData = [];
  formattedProjectData = [];
  excelExportData = []
  columns = [
    {
      dataField: 'Project key',
      Text: 'Project key'
    },
    {
      
    }
  ]

  excelDataSet = [
    {
      columns: [
        "Project Key",
        "Title",
        "Project Type",
        "Status",
        "Update Date",
        "Expiration Date"
      ],
      data: this.excelData
    }
  ];

  constructor(props) {
    super(props);
    this.state = {
      user: {
        displayName: "",
        userName: "",
        emailAddress: ""
      }
    };
  }

  componentDidMount() {
    User.getUserSession().then(resp =>
      this.setState({ user: resp.data })
    ).catch(error => {
      this.setState(() => { throw error; });
    });
  }

  linkFormatter = (cell, row) => {
    if (row.linkDisabled === false) {
      return <a title={row.key} href={row.link}>{row.key}</a>;
    } else {
      return row.key;
    }
  };

  compareDateString = (a, b, order) => {
    // This format comes from the server - update if the format changes.
    const format = "MM/DD/YYYY";
    let aTime = moment(a, format);
    let bTime = moment(b, format);
    let aIsNewer = aTime.isValid() && bTime.isValid() && aTime > bTime;
    let bothSame = aTime.isValid() && bTime.isValid() && aTime === bTime;
    if (!aTime.isValid() && bTime.isValid()) {
      aIsNewer = false;
    }
    if (!bTime.isValid() && aTime.isValid()) {
      aIsNewer = true;
    }
    if (!aTime.isValid() && !bTime.isValid()) {
      bothSame = true;
    }
    if (order === "desc") {
      if (aIsNewer) return -1;
      if (bothSame) return 0;
      return 1;
    } else {
      if (aIsNewer) return 1;
      if (bothSame) return 0;
      return -1;
    }
  };

  expirationSort = (a, b, order) => {
    return this.compareDateString(a.expiration, b.expiration, order);
  };

  updateSort = (a, b, order) => {
    return this.compareDateString(a.updated, b.updated, order);
  };

  loadData = projectData => {
    this.formattedProjectData = [];
    this.excelExportData = [];
    projectData.map(project => {
      const dataColumnValues = [
        { value: project.key, style: { font: { sz: "10" } } },
        { value: project.title, style: { font: { sz: "10" } } },
        { value: project.type, style: { font: { sz: "10" } } },
        { value: project.type === 'Consent Group' ? '' : project.status, style: { font: { sz: "10" } } },
        {
          value: project.updated,
          style: { font: { sz: "10" }, numFmt: "mm/dd/yyyy" }
        },
        {
          value: project.expiration,
          style: { font: { sz: "10" }, numFmt: "mm/dd/yyyy" }
        }
      ];
      this.excelData.push(dataColumnValues);
      // remove commas in project data for CSV export
      let row = {
        key: project.key,
        link: project.link,
        title:
          project.title != null
            ? project.title.replace(/,/g, " ")
            : project.title,
        type: project.type,
        status: project.type === 'Consent Group' ? '' : project.status,
        updated: project.updated,
        expiration: project.expiration,
        reporter: project.reporter,
        linkDisabled: project.linkDisabled,
        extraProperties: project.extraProperties,
        projectAccessContact: project.projectAccessContact
      };
      let excelData = {
        "Project key": project.key,
        "Title":
          project.title != null
            ? project.title.replace(/,/g, " ")
            : project.title,
        "Type": project.type,
        "Status": project.type === 'Consent Group' ? '' : project.status,
        "Updated": project.updated,
        "Expiration": project.expiration,
        "Reporter": project.reporter,
        "Project Access Contact": project.projectAccessContact
      };
      this.formattedProjectData.push(row);
      this.excelExportData.push(excelData)
    });
  };
  renderPaginationShowsTotal(start, to, total) {
    return (
      <p className={"totalCount"}>
        From {start} to {to}, total is <b>{total}</b>
      </p>
    );
  }

  formatTooltipNames = (cell, row) => {
    const names = row.projectAccessContact.join(", ");
    return <span title={names}>{names}</span>
  };

  formatTooltipStatus = (cell, row) => {
    return <span title={row.status}>{row.status}</span>
  };

  formatTooltipTitle = (cell, row) => {
    return <span title={row.title}>{row.title}</span>
  };

  render(props) {
    if (this.props.loading) {
      return (
        <div>
          <h2>Results</h2>
          <div className={"alert alert-info"}>
            <span
              className={
                "glyphicon glyphicon-refresh glyphicon-refresh-animate"
              }
            >
              {" "}
            </span>{" "}
            Searching...
          </div>
        </div>
      );
    } else if (this.props.loaded) {
      this.loadData(this.props.data);
      return (
        <div className={"position-relative"}>
          <h2>Results</h2>
          <div>
            <Export
              csvData={this.excelExportData}
              columns={this.props.columns}
              fileName={"search-results"}
              fileType={EXPORT_FILE.XLSX.mimeType}
              fileExtension={EXPORT_FILE.XLSX.extension}
              hide={this.props.hideXlsxColumns}
              btnClassName={"btn btn-success btn-export-excel"}
            />
            {/* <ExportExcel
              filename="search-results"
              buttonClassName="btn btn-success btn-export-excel"
              spanClassName="fa glyphicon glyphicon-export fa-download"
              excelDataSet={this.excelDataSet}
              sheetName="search-result"
            /> */}
            
          </div>
          <BootstrapTable
            data={this.formattedProjectData}
            exportCSV={true}
            csvFileName="search-results.csv"
            striped
            hover
            pagination={true}
            options={{
              paginationShowsTotal: this.renderPaginationShowsTotal,
              noDataText: "No results available",
              paginationSize: 5,
              paginationPosition: "both",
              sizePerPage: 50
            }}
          >
            <TableHeaderColumn
              csvHeader="Project Key"
              dataField="key"
              isKey
              dataSort={true}
              dataFormat={this.linkFormatter}
            >
              Key
            </TableHeaderColumn>
            <TableHeaderColumn
              csvHeader="Title"
              dataField="title"
              width={styles.projectTitleWidth}
              dataFormat={this.formatTooltipTitle}
              dataSort={true}
            >
              Title
            </TableHeaderColumn>
            <TableHeaderColumn
              csvHeader="Project Type"
              dataField="type"
              width={styles.typeWidth}
              dataSort={true}
            >
              Type
            </TableHeaderColumn>
            <TableHeaderColumn
              csvHeader="Status"
              dataField="status"
              dataFormat={this.formatTooltipStatus}
              dataSort={true}
            >
              Status
            </TableHeaderColumn>
            <TableHeaderColumn
              csvHeader="Update Date"
              dataField="updated"
              dataSort={true}
              sortFunc={this.updateSort}
              width={styles.datesWidth}
            >
              Updated
            </TableHeaderColumn>
            <TableHeaderColumn
              csvHeader="Expiration Date"
              dataField="expiration"
              dataSort={true}
              sortFunc={this.expirationSort}
              width={styles.datesWidth}
            >
              Expiration
            </TableHeaderColumn>
            <TableHeaderColumn
              csvHeader="Project Access Contact"
              dataField="projectAccessContact"
              dataSort={true}
              dataFormat={this.formatTooltipNames}
              width={styles.projectAccessWidth}
            >
              Project Access Contact
            </TableHeaderColumn>
          </BootstrapTable>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default SearchResults;
