import { Component, Fragment } from 'react';
import { hh, h, button, div } from 'react-hyperscript-helpers';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import { InputFieldText } from "./InputFieldText";
import { createObjectCopy, isEmpty } from "../util/Utils";
import { Organization } from '../util/ajax';
import { AlertMessage } from "./AlertMessage";

export const OrganizationManagementEdit = hh(class OrganizationManagementEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      organizationData: {},
      organizationName: '',
      disableSubmitButton: true,
      showError: false
    };
  }

  componentDidMount() {
    this.setState(prev => {
      prev.organizationData = this.props.organizationData;
      prev.organizationName = this.props.organizationData.name;
      return prev;
    })
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEmpty(nextProps.organizationData) && nextProps.organizationData !== prevState.organizationData) {
      return { organizationData: nextProps.organizationData};
    }
    else return null;
  }

  submit = () => {
    if (this.props.organizationData.id) {
      Organization.editOrganization(this.props.organizationData.id, this.state.organizationName).then( () => {
        this.setState(prev => {
          prev.organizationData.name = prev.organizationName;
          return prev;
        });
        let response = createObjectCopy(this.state.organizationData);
        this.props.closeOnSubmit(response);
      }).catch(error => {
        this.setState(prev => {
          prev.showError = true;
          return prev;
        });
      });
    } else {
      Organization.addOrganization(this.state.organizationName).then( () => {
        this.setState(prev => {
          prev.organizationData.name = prev.organizationName;
          return prev;
        });
        let response = createObjectCopy(this.state.organizationData);
        this.props.closeOnSubmit(response);
      }).catch(error => {
        this.setState(prev => {
          prev.showError = true;
          return prev;
        });
      });
    }
  };

  closeAlertHandler = () => {
    this.setState(prev => {
      prev.showError = false;
      prev.disableSubmitButton = false;
      return prev;
    })
  };

  textHandler = (e) => {
    const value = e.target.value;
    this.setState(prev => {
      if (prev.organizationName != value) {
        prev.disableSubmitButton = false;
      }
      prev.organizationName = value;
      return prev;
    }, () => {
    });
  };


  render() {
    return(
      h(Modal, {
        show: this.props.show
      }, [
        h(ModalHeader, {}, [
          h(ModalTitle, { className: "dialogTitle" }, "Add/Edit Organization")
        ]),
        h(ModalBody, { className: "dialogBody rolesManagement" }, [
          h(Fragment, {}, [
            InputFieldText({
              id: "id",
              name: "name",
              label: "Organization Name",
              readOnly: false,
              value: this.state.organizationName,
              onChange: this.textHandler,
            })
          ]),
          div({ style: { 'marginTop': '15px' } }, [
            AlertMessage({
              msg: "An error has occurred while updating the organization name. Please try again later.",
              show: this.state.showError,
              closeable: true,
              closeAlertHandler: this.closeAlertHandler
            }),
          ])
        ]),
        h(ModalFooter, {className: 'roles-cta'}, [
          button({ className: "btn buttonSecondary", onClick: this.props.closeModal()}, ["Cancel"]),
          button({ className: "btn buttonPrimary", disabled: this.state.disableSubmitButton || this.state.showError, onClick: this.submit }, ["Submit"])
        ])
      ])
    );
  }
});
