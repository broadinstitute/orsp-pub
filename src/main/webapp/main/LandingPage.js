import React, { Component } from 'react';
import { hh, h, div, h3, a } from 'react-hyperscript-helpers';
import { About } from '../components/About';
import { TableComponent } from "../components/TableComponent";
import { Issues, User } from "../util/ajax";
import { parseDate } from "../util/TableUtil";
import { Link } from 'react-router-dom';

const columnsCopy = [{
  dataField: 'project',
  text: 'Project',
  sort: true,
  formatter: (cell, row, rowIndex, colIndex) => {
    return div({}, [
      linkFormatter(row, row.project)
    ])
  }
}, {
  dataField: 'title',
  text: 'Title',
  sort: true,
  formatter: (cell, row, rowIndex, colIndex) => {
    return div({}, [
      linkFormatter(row, row.title)
    ])
  }
}, {
  dataField: 'status',
  text: 'Status',
  sort: true
}, {
  dataField: 'type',
  text: 'Type',
  sort: true
}, {
  dataField: 'updated',
  text: 'Updated',
  sort: true
}, {
  dataField: 'expiration',
  text: 'Expiration',
  sort: true
}];

const defaultSorted = [{
  dataField: 'date',
  order: 'desc'
}];

function linkFormatter(row, text) {
  if (row.type === "Consent Group") {
    return h(Link, {to: {pathname:'/newConsentGroup/main', search: '?consentKey=' + row.project, state: {issueType: 'consent-group', tab: 'review', consentKey: row.project}}}, [text])
  }
  return h(Link, {to: {pathname:'/project/main', search: '?projectKey=' + row.project, state: {issueType: 'project', tab: 'review', projectKey: row.project}}}, [text])
}

const LandingPage = hh(class LandingPage extends Component{

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      projectList: [],
      taskList: []
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    this.props.showSpinner();
    await this.getProjectsList();
    await this.getTaskList();
    await this.hasSession();
    this.props.hideSpinner();
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  getProjectsList = async () => {
    try {
      const response = await Issues.getIssueList('assignee', 5);
      if (this._isMounted) {
        let projectListData = [];

        response.data.forEach(issue => {
          projectListData.push({
            project: issue.projectKey,
            title: issue.summary,
            status: issue.status,
            type: issue.type,
            updated: parseDate(issue.updateDate),
            expiration: parseDate(issue.expirationDate)
          });
        });

        this.setState(resp => {
          resp.projectList = projectListData;
          return resp;
        });
      }
    } catch(e) {
      this.props.hideSpinner()
    }
  };

  getTaskList = async () => {
    try {
      const response = await Issues.getIssueList('user', 5);
      if (this._isMounted) {
        let taskListData = [];

        response.data.forEach(issue => {
          taskListData.push({
            project: issue.projectKey,
            title: issue.summary,
            status: issue.status,
            type: issue.type,
            updated: parseDate(issue.updateDate),
            expiration: parseDate(issue.expirationDate)
          });
        });
        this.setState(resp => {
          this.props.hideSpinner();
          resp.taskList = taskListData;
          return resp;
        });
      }
    } catch(e) {
      this.props.hideSpinner();
    }
  };

  hasSession = async () => {
    try {
      const resp = await User.isAuthenticated();
      if (this._isMounted) {
        this.setState({
          logged: resp.data.session
        })
      }
    } catch(error) {
      this.setState(() => {
        throw error;
      }, () => this.props.hideSpinner());
    }
  };

  render() {
    return (
      div({}, [
        About(),
        div({className: "row", isRendered: this.state.logged}, [
          div({className: "col-xs-12"}, [
            h3({style: {'fontWeight' : 'bold'}}, ["My Task List ",
              a({ style: {'fontWeight' : 'normal'},
                href: '/issueList/list?assignee=true&header=My+Task+List'
              }, ["(show all)"])
            ]),
            TableComponent({
              remoteProp: false,
              data: this.state.taskList,
              columns: columnsCopy,
              keyField: 'project',
              fileName: 'TaskList',
              search: false,
              showPrintButton: false,
              defaultSorted: defaultSorted,
              pagination: false,
              showExportButtons: false,
              showSearchBar: false
            }),
            h3({style: {'fontWeight' : 'bold'}}, ["My Project List ",
              a({ style: {'fontWeight' : 'normal'},
                href: '/issueList/list?assignee=false&header=My+Projects'
              }, ["(show all)"])
            ]),
            TableComponent({
              remoteProp: false,
              data: this.state.projectList,
              columns: columnsCopy,
              keyField: 'project',
              fileName: 'ProjectList',
              search: false,
              showPrintButton: false,
              defaultSorted: defaultSorted,
              pagination: false,
              showExportButtons: false,
              showSearchBar: false
            })
          ])
        ])
      ])
    );
  }

});

export default LandingPage;
