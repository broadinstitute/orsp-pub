import { Component, Fragment } from 'react';
import { hh, h, button, div } from 'react-hyperscript-helpers';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import { InputFieldCheckbox } from "./InputFieldCheckbox";
import { USER_ROLES } from '../util/roles';
import { createObjectCopy, isEmpty } from "../util/Utils";
import { User } from "../util/ajax";
import { AlertMessage } from "./AlertMessage";

const READ_ONLY = USER_ROLES['Read Only'].value;
const ADMIN = USER_ROLES['Admin'].value;

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
        'ro_admin': false
      },
      disabledChecks: {
        'orsp': false,
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
      this.props.userData.roles.forEach(item => {
        Object.keys(USER_ROLES).forEach(role => {
          if (USER_ROLES[role].alias.includes(item)) {
            checkedRoles[USER_ROLES[role].value] = true
          }
        });
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
    User.editUserRole(this.props.userData.id, rolesList).then( () => {
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
    this.setState(prev => {
      prev.roles[e.target.id] = !prev.roles[e.target.id];
      prev.disableSubmitButton = false;
      return prev;
    });
  };

  disableCheckBox = (checkBox) => {
    let disable = false;
    if (checkBox === READ_ONLY && this.state.roles[ADMIN] === true) {
      disable = true;
    } else if (checkBox === ADMIN && this.state.roles[READ_ONLY]) {
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
        h(ModalBody, { className: "dialogBody rolesManagement" }, [
          Object.keys(USER_ROLES).map((role, idx) => {
            return h(Fragment, { key: idx }, [
              InputFieldCheckbox({
                id: USER_ROLES[role].value,
                onChange: this.handleCheck,
                label: role,
                checked: this.state.roles[USER_ROLES[role].value],
                readOnly: this.disableCheckBox(USER_ROLES[role].value)
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
