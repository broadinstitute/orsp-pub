import { Component, Fragment } from 'react';
import { hh, div, h, button } from 'react-hyperscript-helpers';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import { InputFieldCheckbox } from "./InputFieldCheckbox";
import { USER_ROLES } from '../util/roles';
import { isEmpty } from "../util/Utils";

export const RoleManagementEdit = hh(class RoleManagementEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roles: [],
      submit: false,
      showAlert: false,
    };
  }

  handleClose = () => {
    this.setState(prev => {
      prev.showAlert = false;
      prev.disableBtn = false;
      prev.disableSendBtn = false;
      return prev;
    });
    this.props.closeModal();
  };

  defaultChecked = (role) => {
    let isChecked= false;
    if (!isEmpty(this.props.userData)) {
      this.props.userData.roles.forEach(it => {
          if (role.label === it) isChecked = true
        }
      )
    }
    return isChecked
  };

  submit = () => {
    console.log("Submitted", this.props);
    this.props.closeModal();
    // submit role change
  };

  handleCheck = (e) => {
    const value = e.target.name;
    console.log("cambio ", value)
    // this.setState(prev => {
    //   prev.roles = value;
    //   return prev;
    // });
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
                name: role.label,
                onChange: this.handleCheck,
                label: role.label,
                checked: this.defaultChecked(role)
              })
            ])
          }),
        ]),
        h(ModalFooter, {}, [
          button({ className: "btn buttonSecondary", disabled: false, onClick: this.props.closeModal()}, ["Cancel"]),
          button({ className: "btn buttonPrimary", disabled: false, onClick: this.submit }, ["Submit"])
        ])
      ])
    );
  }
});