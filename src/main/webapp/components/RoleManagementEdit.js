import { Component, Fragment } from 'react';
import { hh, h, button, div } from 'react-hyperscript-helpers';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import { InputFieldCheckbox } from "./InputFieldCheckbox";
import { ROLE, USER_ROLES } from '../util/roles';
import { createObjectCopy, isEmpty } from "../util/Utils";
import { User } from "../util/ajax";
import { AlertMessage } from "./AlertMessage";

const READ_ONLY = USER_ROLES[ROLE.readOnly].value;
const ADMIN = USER_ROLES[ROLE.admin].value;
const COMPLIANCE_OFFICE = USER_ROLES[ROLE.complianceOffice].value;

export const RoleManagementEdit = hh(class RoleManagementEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      disableClearButton: false,
      disableSubmitButton: true,
      showError: false,
      roles: {
        'orsp': false,
        'Compliance Office': false,
        'ro_admin': false
      },
      disabledChecks: {
        'orsp': false,
        'Compliance Office': false,
        'ro_admin': false
      }
    };
  }

  componentDidMount() {
     this.defaultChecked();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEmpty(nextProps.userData) && nextProps.userData !== prevState.userData) {
      return { userData: nextProps.userData};
    }
    else return null;
  }

  defaultChecked = () => {
    let checkedRoles = createObjectCopy(this.state.roles);
    if (!isEmpty(this.props.userData)) {
      USER_ROLES.forEach(role => {
        this.props.userData.roles.forEach(item => {
          if (role.value === item) {
            checkedRoles[role.value] = true;
          }
        })
      });
      this.setState(prev => {
        prev.roles = checkedRoles;
        return prev;
      })
    }
  };

  submit = () => {
    this.setState({ disableClearButton: true, disableSubmitButton: true });
    const rolesList = Object.keys(this.state.roles).filter(it => { return this.state.roles[it] });
    User.editUserRole(this.props.serverURL, this.props.userData.id, rolesList).then( () => {
      let response = createObjectCopy(this.state.userData);
      response.roles = rolesList;
      this.props.closeOnSubmit(response);
    }).catch(error => {
      this.setState(prev => {
        prev.showError = true;
        return prev;
      });
    });
  };

  handleCheck = (e) => {
    e.persist();
    let rolesToAssign = this.getRoles(e.target.id);
    // let rolesToAssign = createObjectCopy(this.state.roles);
    // rolesToAssign[e.target.id] = !rolesToAssign[e.target.id];
    this.setState(prev => {
      prev.roles = rolesToAssign;
      prev.disableSubmitButton = false;
      return prev;
    });
  };

  getRoles(roleChanged) {
    let rolesToAssign = createObjectCopy(this.state.roles);
    let role = roleChanged;
    if (role === READ_ONLY) {
      rolesToAssign[READ_ONLY] = !rolesToAssign[READ_ONLY];
      rolesToAssign[COMPLIANCE_OFFICE] = false;
      rolesToAssign[ADMIN] = false;
    } else if (role === COMPLIANCE_OFFICE || role === ADMIN) {
      rolesToAssign[role] = !rolesToAssign[role];
      rolesToAssign[READ_ONLY] = false;
    }
    return rolesToAssign;
  }

  disableCheckBox = (checkBox) => {
    let disable = false;
    if (checkBox === READ_ONLY && (this.state.roles[ADMIN] === true || this.state.roles[COMPLIANCE_OFFICE] === true)) {
      disable = true;
    } else if ((checkBox === COMPLIANCE_OFFICE || checkBox === ADMIN) && this.state.roles[READ_ONLY]) {
      disable = true;
    }
    return disable;
  };

  clearSelection = () => {
    this.setState(prev => {
      Object.keys(prev.roles).forEach(it => prev.roles[it] = false);
      prev.disableSubmitButton = this.state.showError;
      return prev;
    })
  };

  closeAlertHandler = () => {
    this.setState(prev => {
      prev.showError = false;
      prev.disableSubmitButton = false;
      return prev;
    })
  };

  render() {
    return(
      h(Modal, {
        show: this.props.show
      }, [
        h(ModalHeader, {}, [
          h(ModalTitle, { className: "dialogTitle" }, [this.props.userData.displayName + " (" + this.props.userData.emailAddress + ")"])
        ]),
        h(ModalBody, { className: "dialogBody" }, [
          USER_ROLES.map( (role, idx) => {
            return h(Fragment, { key: idx }, [
              InputFieldCheckbox({
                id: role.value,
                onChange: this.handleCheck,
                label: role.label,
                checked: this.state.roles[role.value],
                readOnly: this.disableCheckBox(role.value)
              })
            ])
          }),
          div({ style: { 'marginTop': '15px' } }, [
            AlertMessage({
              msg: "An error has occurred while updating the user role. Please try again later.",
              show: this.state.showError,
              closeable: true,
              closeAlertHandler: this.closeAlertHandler
            }),
          ])
        ]),
        h(ModalFooter, {className: 'roles-cta'}, [
          button({ className: "btn buttonTertiary", disabled: this.state.disableClearButton, onClick: this.clearSelection}, ["Clear"]),
          button({ className: "btn buttonSecondary", onClick: this.props.closeModal()}, ["Cancel"]),
          button({ className: "btn buttonPrimary", disabled: this.state.disableSubmitButton || this.state.showError, onClick: this.submit }, ["Submit"])
        ])
      ])
    );
  }
});