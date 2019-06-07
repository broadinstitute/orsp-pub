import { Component } from 'react';
import { h, div, h2, span, a } from 'react-hyperscript-helpers';
import { Panel } from "../components/Panel";
import { Table } from "../components/Table";
import { RoleManagementEdit } from "../components/RoleManagementEdit";
import { User } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from '../components/Spinner';
import { obtainStringRole } from "../util/Utils";

const tableHeaders =
  [
    { name: 'User Name', value: 'userName' },
    { name: 'Display Name', value: 'displayName' },
    { name: 'Email Address', value: 'emailAddress' },
    { name: 'Roles', value: 'roles' },
  ];

  const styles = {
    pageTitle: {
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
      let parsedUsers = {};
      result.data.map(it => {
          parsedUsers = it.user;
          parsedUsers.roles = it.roles.map(element => obtainStringRole(element.role));
        }
      );

      this.setState(prev => {
        prev.users = result.data.map(it => it.user);
        return prev;
      }, () => spinnerService.hideAll())
    }).catch(error => {
      this.setState(() => { throw error; });
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
      div({className: "roles-management"},[
        span({ style: styles.pageTitle}, ["Roles Management"]),
        Table({
          headers: tableHeaders,
          isAdmin: this.state.isAdmin,
          data: this.state.users,
          serverURL: component.serverURL,
          sizePerPage: 20,
          paginationSize: 10,
          editRole: this.editRoleHandler,
          reviewFlow: true
        }), 
        RoleManagementEdit({
          closeModal: this.closeModal,
          show: this.state.editRoleDialog,
          userData : this.state.editRoleRowData
        }),
        h(Spinner, {
          name: "mainSpinner", group: "orsp", loadingImage: this.props.loadingImage
        })
      ])
    );  
  }
}

export default RolesManagement;

