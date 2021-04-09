import React, { Component } from 'react';
import { a, div, h, h3, hh } from 'react-hyperscript-helpers';
import { About } from '../components/About';
import { TableComponent } from '../components/TableComponent';
import { Issues, User, Search } from '../util/ajax';
import { parseDate } from '../util/TableUtil';
import { Link } from 'react-router-dom';
import LoadingWrapper from '../components/LoadingWrapper';
import { projectStatus, isEmpty } from '../util/Utils';
import { Storage } from '../util/Storage';
import { InputFieldSelect } from '../components/InputFieldSelect';
import moment from 'moment';
import get from 'lodash/get';

const styles = {
  projectWidth: '120px',
  titleWidth: '220px',
  expirationWidth: '110px',
  updatedWidth: '140px',
  typeWidth: '170px',
  statusWidth: '220px'
};

const columnsCopy = [{
  dataField: 'project',
  text: 'Project',
  sort: true,
  headerStyle: { width: styles.projectWidth },
  formatter: (cell, row, rowIndex, colIndex) => {
    return div({}, [
      linkFormatter(row, row.project)
    ])
  }
}, {
  dataField: 'title',
  text: 'Title',
  sort: true,
  headerStyle: { width: styles.titleWidth },
  formatter: (cell, row, rowIndex, colIndex) => {
    return div({}, [
      linkFormatter(row, row.title)
    ])
  }
}, {
  dataField: 'status',
  text: 'Status',
  sort: true,
  formatter: (cell, row, rowIndex, colIndex) => row.type === 'Consent Group' ? '' : cell,
  headerStyle: { width: styles.statusWidth }
}, {
  dataField: 'type',
  text: 'Type',
  sort: true,
  headerStyle: { width: styles.typeWidth }
}, {
  dataField: 'updated',
  text: 'Updated',
  sort: true,
  headerStyle: { width: styles.updatedWidth }
}, {
  dataField: 'expiration',
  text: 'Expiration',
  sort: true,
  formatter: (cell, row, rowIndex, colIndex) => cell ? moment(cell).format('MM/DD/YYYY') : ''
}, {
  dataField: 'assignedAdmin',
  text: 'Assigned reviewer',
  sort: true,
  headerStyle: { width: styles.updatedWidth }
},
{
  dataField: 'adminComments',
  text: 'Comments',
  sort: true,
  headerStyle: { width: styles.updatedWidth }
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
      taskList: [],
      assignedReviewer: '',
      orspAdmins: [],
      logged: false
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    this.loadORSPAdmins();
    await this.init()
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadORSPAdmins() {
    Search.getORSPAdmins().then(response => {
      let orspAdmins = response.data.map(function (item) {
        return {
          key: item.id,
          value: item.value,
          label: item.label
        };
      })
      this.setState(prev => {
        prev.orspAdmins = orspAdmins;
        return prev;
      })
    });
  }

  handleSelect = (field) => () => (selectedOption) => {
    this.props.showSpinner();
    this.setState(prev => {
      prev[field] = selectedOption;
      return prev;
    });
    Issues.getIssueList('true', 10, isEmpty(selectedOption) ? "" : selectedOption.key).then(
      response => {
        
        let taskList = [];
        response.data.forEach(issue => {
          taskList.push({
            project: issue.projectKey,
            title: issue.summary,
            status: projectStatus(issue),
            type: issue.type,
            updated: parseDate(issue.updateDate),
            expiration: parseDate(issue.expirationDate),
            adminComments: issue.adminComments,
            assignedAdmin: isEmpty(issue.assignedAdmin) ? "" : JSON.parse(issue.assignedAdmin).value  
          });
        });
        this.setState(prev => {
          prev.taskList = taskList;
          return prev;
        });
        this.props.hideSpinner();
      }).catch(
      error => {
        this.props.hideSpinner();
        throw error
      }
    );

  };

  init = async () => {
    this.props.showSpinner();
    let user = await User.isAuthenticated();
    let resp = {};
    let projectList = [];
    let taskList = [];
    if (user != null && user.data.session) {
      resp = await User.getUserSession();
    }
    component.isBroad = get(resp.data, 'isBroad', false);
    component.isAdmin = get(resp.data, 'isAdmin', false);
    component.isViewer = get(resp.data, 'isViewer', false);
    if (user.data.session && component.isBroad) {
      const [ projects, tasks ] = await Promise.all([
        Issues.getIssueList('false', 5, ''),
        Issues.getIssueList('true', 10, isEmpty(this.state.assignedReviewer) ? "" : JSON.parse(this.state.assignedReviewer).key)
      ]).catch(error => {
        this.props.hideSpinner();
        throw error
      });

      projects.data.forEach(issue => {
        projectList.push({
          project: issue.projectKey,
          title: issue.summary,
          status: projectStatus(issue),
          type: issue.type,
          updated: parseDate(issue.updateDate),
          expiration: parseDate(issue.expirationDate)
        });
      });

      tasks.data.forEach(issue => {
        taskList.push({
          project: issue.projectKey,
          title: issue.summary,
          status: projectStatus(issue),
          type: issue.type,
          updated: parseDate(issue.updateDate),
          expiration: parseDate(issue.expirationDate),
          adminComments: issue.adminComments,
          assignedAdmin: isEmpty(issue.assignedAdmin) ? "" : JSON.parse(issue.assignedAdmin).value  
        });
      });
      if (this._isMounted) {
        this.setState({
          projectList: projectList,
          taskList: taskList,
          logged: user.data.session
        });
        Storage.setUserIsLogged(user.data.session);
        this.props.hideSpinner();
      }
    } else {
      Storage.clearStorage();
      component.isBroad = null;
      component.isAdmin = null;
      component.isViewer = null;
      this.props.history.push('/');
      this.props.hideSpinner();
    }
  };

  render() {
     return (
      div({}, [
        About({showWarning: false}),
        div({className: "row", isRendered: component.isBroad === true && component.isAdmin === false}, [
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
        ]),

        div({className: "row", isRendered: component.isAdmin === true}, [
          div({className: "col-xs-12"}, [
            h3({style: {'fontWeight' : 'bold'}}, ["My Task List ",
              a({ style: {'fontWeight' : 'normal'},
                href: '/issueList/list?assignee=true&header=My+Task+List'
              }, ["(show all)"])
            ]),
            div({ style: { 'marginBottom': '20px' }}, [
              InputFieldSelect({
                label: "Assigned reviewer:",
                id: "assignedAdmin",
                name: "assignedAdmin",
                options: this.state.orspAdmins,
                value: this.state.assignedReviewer,
                onChange: this.handleSelect("assignedReviewer"),
                placeholder: "Select...",
                readOnly: false,
                edit: false
              })
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
            })
            
          ])
        ])
      ])
    );
  }

});

export default LoadingWrapper(LandingPage);
