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
    await this.init()
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  init = async () => {
    this.props.showSpinner();
    const [ projects, tasks, user ] = await Promise.all([
      Issues.getIssueList('assignee', 5),
      Issues.getIssueList('user', 5),
      User.isAuthenticated()
    ]);
    let projectList = [];
    let taskList = [];

    projects.data.forEach(issue => {
      projectList.push({
        project: issue.projectKey,
        title: issue.summary,
        status: issue.status,
        type: issue.type,
        updated: parseDate(issue.updateDate),
        expiration: parseDate(issue.expirationDate)
      });
    });

    tasks.data.forEach(issue => {
      taskList.push({
        project: issue.projectKey,
        title: issue.summary,
        status: issue.status,
        type: issue.type,
        updated: parseDate(issue.updateDate),
        expiration: parseDate(issue.expirationDate)
      });
    });

    this.props.hideSpinner();

    if (this._isMounted) {
      this.setState({
        projectList: projectList,
        taskList: taskList,
        logged: user.data.session
      })
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
