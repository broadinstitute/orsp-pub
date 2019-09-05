import React, { Component } from 'react';
import { hh, h, div, h1, a } from 'react-hyperscript-helpers';
import { About } from '../components/About';
import { TableComponent } from "../components/TableComponent";
import { IssueList, User } from "../util/ajax";
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

const Index = hh(class Index extends Component{

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      projectList: [],
      taskList: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.getProjectsList();
    this.getTaskList();
    this.hasSession();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getProjectsList = () => {
    IssueList.getIssueList('assignee', 5).then(response => {
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
    }).catch(() => {});
  };

  getTaskList = () => {
    IssueList.getIssueList('user', 5).then(response => {
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
          resp.taskList = taskListData;
          return resp;
        });
      }
    }).catch(() => {});
  };

  printComments = () => {

  };

  hasSession = () => {
      User.isAuthenticated().then(resp => {
        if (this._isMounted) {
          this.setState({
            logged: resp.data.session
          })
        }
      }).catch(error => this.setState(() => { throw error; }));
  };

  render() {
    return (
      div({}, [
        About(),
        div({
          isRendered: this.state.logged,
        }, [
          h1({}, ["My Task List"]),
          a({
            href: '/issueList/list?assignee=true&header=My+Task+List'
          }, ["Show all"]),
          TableComponent({
            remoteProp: false,
            data: this.state.taskList,
            columns: columnsCopy,
            keyField: 'project',
            fileName: 'xxxxx',
            search: false,
            showPrintButton: false,
            defaultSorted: defaultSorted,
            pagination: false,
            showExportButtons: false,
            showSearchBar: false
          }),
          h1({}, ["My Project List"]),
          a({
            href: '/issueList/list?assignee=false&header=My+Projects'
          }, ["Show all"]),
          TableComponent({
            remoteProp: false,
            data: this.state.projectList,
            columns: columnsCopy,
            keyField: 'project',
            fileName: 'xxxxx',
            search: false,
            showPrintButton: false,
            defaultSorted: defaultSorted,
            pagination: false,
            showExportButtons: false,
            showSearchBar: false
          })
        ])
      ])
    );
  }

});

export default Index;
