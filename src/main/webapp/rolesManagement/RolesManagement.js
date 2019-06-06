import { Component } from 'react';
import { h, div, h2, span, a } from 'react-hyperscript-helpers';
import { Panel } from "../components/Panel";
import { Table } from "../components/Table";

const tableHeaders =
  [
    { name: 'User Name', value: 'userName' },
    { name: 'Display Name', value: 'displayName' },
    { name: 'Mail', value: 'mail' },
    { name: 'Roles', value: 'roles' },
  ];

class RolesManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [
        {
          userName: 'jbernales',
          displayName: 'Jaime',
          mail: 'jbernales@broadinstitute.org',
          roles: 'Read only'
        },
        {
          userName: 'lforconesi',
          displayName: 'Leo',
          mail: 'lforcone@broadinstitute.org',
          roles: 'ORSP'
        }
      ],
      showError: false,
      isAdmin: true // get current user role
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    console.log("INIT HERE ROLES AND USERS");
  };

  render() {
    return(
      div({},[
        Panel({ title: "Roles Management" }, [
          Table({
            headers: tableHeaders,
            isAdmin: this.state.isAdmin,
            data: this.state.users,
            serverURL: component.serverURL,
            sizePerPage: 20,
            paginationSize: 20
          })
        ])
      ])
    );
  }
}

export default RolesManagement;

