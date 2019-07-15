import React, { Component } from 'react';
import { h, div, span, a, h1 } from 'react-hyperscript-helpers';
import { spinnerService } from "../util/spinner-service";
import { Spinner } from '../components/Spinner';
import { Report } from '../util/ajax';
import { handleRedirectToProject } from "../util/Utils";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './reviewCategories.css';

const headers =
  [
    { name: 'Project', value: 'projectKey' },
    { name: 'Summary', value: 'summary' },
    { name: 'Status', value: 'status' },
    { name: 'Review Category', value: 'reviewCategory' }
  ];

class ReviewCategories extends Component {

  constructor(props) {
    super(props);
    this.state = {
      reviewCategories: [],
      isAdmin: false
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    spinnerService.showAll();
    Report.getReviewCategory().then(resp => {
      this.setState(prev => {
        prev.reviewCategories = resp.data;
        return prev;
      });
      spinnerService.hideAll();
    });   
  };

  redirectToProject = (cell, row) => {
    const url = handleRedirectToProject(component.serverURL, row.projectKey);
    return a({
      href: url,
      target: '_blank'
    }, [row.projectKey])
  };

   render() {
    return(
      div({className: "review-category-container"},[
        h1({}, ["Review Category Report"]),
        <BootstrapTable
            data={this.state.reviewCategories}
            striped
            hover
            search={true}
            pagination={true}
            options={{
              paginationShowsTotal: this.renderPaginationShowsTotal,
              noDataText: "No results available",
              paginationSize: 5,
              paginationPosition: "bottom",
              sizePerPage: 50,
              searchPosition: "left"
            }}
          >
            <TableHeaderColumn
              dataField="projectKey"
              isKey
              dataSort={true}
              dataFormat={this.redirectToProject}
            >
              Project
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="summary"
              dataSort={true}
            >
              Summary
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="status"
              dataSort={true}
            >
              Status
            </TableHeaderColumn>
            <TableHeaderColumn
              csvHeader="Review Category"
              dataField="reviewCategory"
              dataSort={true}
            >
              Review Category
            </TableHeaderColumn>
          </BootstrapTable>,
        h(Spinner, {
          name: "mainSpinner", group: "orsp", loadingImage: component.loadingImage
        })
      ])
    );  
  }
}

export default ReviewCategories;
