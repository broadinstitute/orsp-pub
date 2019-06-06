import { Component } from 'react';
import { h, div, h2, span, a } from 'react-hyperscript-helpers';
import { Panel } from "../components/Panel";
import { Table } from "../components/Table";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { RequestClarificationDialog } from "../components/RequestClarificationDialog";
import { RoleManagementEdit } from "../components/RoleManagementEdit";

const tableHeaders =
  [
    { name: 'User name', value: 'userName' },
    { name: 'Display name', value: 'displayName' },
    { name: 'Email address', value: 'mail' },
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
      users: [
        {
          userName: 'jbernales',
          displayName: 'Jaime',
          eMail: 'jbernales@broadinstitute.org',
          roles: 'Read only'
        },
        {
          userName: 'lforconesi',
          displayName: 'Leo',
          eMail: 'lforcone@broadinstitute.org',
          roles: 'ORSP'
        }
      ],
      editRoleDialog: false,
      editRoleRowData: {},
      showError: false,
      isAdmin: true // get current user role
    };
  }

  // componentDidMount() {
  //   this.init();
  // }
  //
  // init = () => {
  //   console.log("INIT HERE ROLES AND USERS");
  // };

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
          editRole: this.editRoleHandler
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

