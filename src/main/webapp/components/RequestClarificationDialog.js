import { Component } from 'react';
import { hh, div, h, button } from 'react-hyperscript-helpers';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { MultiSelect } from '../components/MultiSelect';
import { AlertMessage } from './AlertMessage';
import { spinnerService } from "../util/spinner-service";
import { ClarificationRequest } from "../util/ajax";
import { Search } from '../util/ajax';
import { isEmpty } from '../util/Utils';

import './ConfirmationDialog.css';

export const RequestClarificationDialog = hh(class RequestClarificationDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alertMessage: '',
      submit: false,
      clarification: '',
      showAlert: false,
      pm: [{key:''}],
      submit: false
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
      prev.pm = [{key:''}],
      prev.submit = false;
      return prev;
    });
    this.props.closeModal();
  };

  validateClarification() {
    let isValid = false;
    if (this.props.linkClarification === true) {
      if (!isEmpty(this.state.clarification) && !isEmpty(this.state.pm) && 
          !isEmpty(this.state.pm[0]) && !isEmpty(this.state.pm[0].key)) {
        isValid = true;
      }
    } else if (this.state.clarification !== '') {
      isValid = true;
    }
    let showAlert = !isValid;
    this.setState(prev => {
      prev.showAlert = showAlert;
      prev.alertMessage = this.props.linkClarification ? 'Please complete all the fields' : 'Please describe the clarification.';
      return prev;
    });
    return isValid;
  }

  submit = () => {
    this.setState(prev => {
      prev.submit = true;
      return prev;
    })
    if (this.validateClarification()) {
      spinnerService.showAll();
      ClarificationRequest.sendNewClarification(this.props.clarificationUrl, this.state.clarification, this.props.issueKey, this.state.pm[0].key).
      then(resp => {
        spinnerService.hideAll();
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
        prev.alertMessage = this.props.linkClarification ? 'Please complete all the fields' : 'Please describe the clarification.';
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
      return prev;
    }, () => { 
      if (this.state.submit) {
       this.validateClarification();
      }
    });
  };

  loadUsersOptions = (query, callback) => {
    if (query.length > 2) {
      Search.getMatchingQuery(component.searchUsersURL, query)
        .then(response => {
          let options = response.data.map(function (item) {
            return {
              key: item.id,
              value: item.value,
              label: item.label
            };
          });
          callback(options);
        }).catch(error => {
          this.setState(() => { throw error; });
        });
    }
  };

  handlePMChange = (data, action) => {
    this.setState(prev => {
      prev.pm = [data];
      return prev;
    }, () => {
      if (this.state.submit) {
        this.validateClarification();
      }
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
            MultiSelect({
              isRendered: this.props.linkClarification === true,
              id: "pm_select",
              label: "Project Member",
              name: 'pmList',
              loadOptions: this.loadUsersOptions,
              handleChange: this.handlePMChange,
              value: this.state.pm,
              isMulti: false,
              edit: false
            }),
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
