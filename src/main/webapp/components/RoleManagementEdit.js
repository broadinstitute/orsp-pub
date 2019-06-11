import { Component, Fragment } from 'react';
import { hh, h, button } from 'react-hyperscript-helpers';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import { InputFieldCheckbox } from "./InputFieldCheckbox";
import { USER_ROLES } from '../util/roles';
import { createObjectCopy, isEmpty } from "../util/Utils";
import { User } from "../util/ajax";

export const RoleManagementEdit = hh(class RoleManagementEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      disableButton: false,
      roles: {
        orsp: false,
        'Compliance Office': false,
        ro_admin: false
      }
    };
  }

  componentDidMount() {
     this.defaultChecked();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEmpty(nextProps.userData) && nextProps.userData !== prevState.userData){
      return { userData: nextProps.userData};
    }
    else return null;
  }

  defaultChecked = () => {
    let checkedRoles = createObjectCopy(this.state.roles);
    if (!isEmpty(this.props.userData)) {
      USER_ROLES.forEach(role => {
        this.props.userData.roles.split(",").forEach(item => {
          if (role.value === item.trim()) {
            checkedRoles[role.value] = true;
          }
        })
      })
    }
    this.setState(prev => {
      prev.roles = checkedRoles;
      return prev;
    })
  };

  submit = () => {
    this.setState({ disableButton: true });
   const rolesList = Object.keys(this.state.roles).filter(it => { return this.state.roles[it] });
    User.editUserRole(this.props.serverURL, this.props.userData.id, rolesList).then( () => {
      let response = createObjectCopy(this.state.userData);
      response.roles = rolesList;
      this.props.closeOnSubmit(response);
    }).catch(error => {
      this.setState(() => { throw error; });
    });
  };

  handleCheck = (e) => {
    e.persist();
    this.setState(prev => {
      prev.roles[e.target.id] = !this.state.roles[e.target.id];
      return prev;
    });
  };

  clearSelection = () => {
    this.setState(prev => {
      Object.keys(prev.roles).forEach(it => prev.roles[it] = false);
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
                checked: this.state.roles[role.value]
              })
            ])
          }),
        ]),
        h(ModalFooter, {className: 'roles-cta'}, [
          button({ className: "btn buttonTertiary", disabled: this.state.disableButton, onClick: this.clearSelection}, ["Clear"]),
          button({ className: "btn buttonSecondary", disabled: this.state.disableButton, onClick: this.props.closeModal()}, ["Cancel"]),
          button({ className: "btn buttonPrimary", disabled: this.state.disableButton, onClick: this.submit }, ["Submit"])
        ])
      ])
    );
  }
});