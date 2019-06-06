import { Component } from 'react';
import { h, div, h2, span, a } from 'react-hyperscript-helpers';
import { Panel } from "../components/Panel";
import { Table } from "../components/Table";
import { RoleManagementEdit } from "../components/RoleManagementEdit";
import { User } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";


const tableHeaders =
  [
    { name: 'User Name', value: 'userName' },
    { name: 'Display Name', value: 'displayName' },
    { name: 'Mail', value: 'emailAddress' },
    { name: 'Roles', value: 'roles' },
  ];

  const styles = {
    wizardTitle: {
      fontWeight: '700', margin: '20px 0', fontSize: '35px', display: 'block'
    }
  };

class RolesManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      editRoleDialog: false,
      editRoleRowData: {},
      showError: false,
      isAdmin: true // get current user role
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    spinnerService.showAll();
    User.getAllUsers(component.serverURL).then(result => {
      this.setState(prev => {
        prev.users = result.data;
        return prev;
      }, () => spinnerService.hideAll())
    });
  };

  editRoleHandler = (data) => () => {
    this.setState(prev => {
      prev.editRoleDialog = !this.state.editRoleDialog;
      if (data !== undefined) {
        prev.editRoleRowData = data;
      }
      return prev;
    });
  };

  closeModal = () => () => {
    this.setState(prev => {
      prev.editRoleDialog = false;
      return prev;
    });
  };

  render() {
    return(
      div({},[
        span({ style: styles.wizardTitle}, ["Roles Management"]),
        Table({
          headers: tableHeaders,
          isAdmin: this.state.isAdmin,
          data: this.state.users,
          serverURL: component.serverURL,
          sizePerPage: 20,
          paginationSize: 20,
          editRole: this.editRoleHandler,
          reviewFlow: true
        }), 
        RoleManagementEdit({
          closeModal: this.closeModal,
          show: this.state.editRoleDialog,
          userData : this.state.editRoleRowData
        })
      ])
    );  
  }
}

export default RolesManagement;

