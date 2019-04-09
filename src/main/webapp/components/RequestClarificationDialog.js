import { Component } from 'react';
import { hh, div, h, button } from 'react-hyperscript-helpers';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { AlertMessage } from './AlertMessage';
import { spinnerService } from "../util/spinner-service";
import { ClarificationRequest } from "../util/ajax";
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
      prev.clarification = '';
      return prev;
    });
    this.props.closeModal();
  };

  submit = () => {
    if (this.state.clarification !== '') {
      spinnerService.showAll();
      ClarificationRequest.sendNewClarification(this.props.clarificationUrl, this.state.clarification, this.props.issueKey).
      then(resp => {
        spinnerService.hideAll();
        this.setState(prev => {
          prev.showAlert = false;
        });
        this.props.successClarification('showSuccessClarification', 'Request clarification sent.', 5000);
        this.handleClose();
      }).catch(error => {
        console.log(error);
        this.setState(prev => {
          prev.alertMessage = 'Something went wrong. Please try again.';
          prev.showAlert = true;
          return prev;
        });
        spinnerService.hideAll();
      });
    } else {
      this.setState(prev => {
        prev.alertMessage = 'Please describe the clarification.';
        prev.showAlert = true;
        return prev;
      });
    }
  };

  handleFormDataTextChange = (e) => {
    const value = e.target.value;
    this.setState(prev => {
      prev.clarification = value;
      prev.alertMessage = '';
      prev.showAlert = false;
      return prev;
    });
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
              onChange: this.handleFormDataTextChange
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
            button({ className: "btn buttonPrimary", disabled: this.state.disableBtn, onClick: this.submit }, ["Request Clarification"])
          ])
        ])
    )
  }
});
