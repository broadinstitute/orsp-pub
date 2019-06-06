import { Component, Fragment } from 'react';
import { hh, div, h, button } from 'react-hyperscript-helpers';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import { spinnerService } from "../util/spinner-service";
import { ClarificationRequest } from "../util/ajax";
import { InputFieldCheckbox } from "./InputFieldCheckbox";
import { USER_ROLES } from '../util/roles';

/*
    PROPS needed
* userName
* show
* closeModal()
* */

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

  submit = () => {
    console.log("Submitted");
    this.props.closeModal();
    // submit role change
  };

  handleCheck = (e) => {
    const value = e.target.value;
    this.setState(prev => {
      prev.roles = value;
      prev.showAlert = false;
      return prev;
    });
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
                // onChange: this.handleCheck,
                label: role.label,
                defaultChecked: false
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