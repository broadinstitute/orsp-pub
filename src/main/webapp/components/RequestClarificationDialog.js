import { Component } from 'react';
import { hh, div, h, button } from 'react-hyperscript-helpers';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { AlertMessage } from './AlertMessage';
import { spinnerService } from "../util/spinner-service";
import './ConfirmationDialog.css';

export const RequestClarificationDialog = hh(class RequestClarificationDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertMessage: '',
      submit: false,
      clarification: '',
      showAlert: false,
    };
    this.handleFormDataTextChange = this.handleFormDataTextChange.bind(this);
  }

  handleClose = () => {
    this.setState(prev => {
      prev.showAlert = false;
      prev.disableBtn = false;
      prev.disableSendBtn = false;
      prev.alertMessage = '';
      return prev;
    });
    this.props.closeModal();
  };

  submit = () => {
    spinnerService.showAll();
    spinnerService.hideAll();
  };

  handleFormDataTextChange = (e) => {
  };

  render() {

    return (
      h(Modal, {
        show: this.props.show
      }, [
          h(ModalHeader, {}, [
            h(ModalTitle, { className: "dialogTitle" }, ['Request Clarification on ' + this.props.issueKey])
          ]),
          h(ModalBody, { className: "dialogBody" }, [
            InputFieldTextArea({
              id: "inputClarification",
              name: "clarification",
              label: "Please describe the clarification you are requesting",
              value: this.state.clarification,
              disabled: false,
              onChange: this.handleFormDataTextChange()
            }),
            div({ style: { 'marginTop': '15px' } }, [
              AlertMessage({
                msg: this.state.alertMessage,
                show: this.state.showAlert
              }),
            ])
          ]),

          h(ModalFooter, {}, [
            button({ className: "btn buttonSecondary", disabled: this.state.disableBtn, onClick: this.handleClose }, ["Cancel"]),
            button({ className: "btn buttonPrimary", disabled: this.state.disableBtn, onClick: this.submit }, ["Submit Clarification"])
          ])
        ])
    )
  }
});
