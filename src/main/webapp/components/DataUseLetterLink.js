import { Component } from 'react';
import { input, hh, h, h3, div, p, hr, small, button, ul, li, br, span } from 'react-hyperscript-helpers';
import { DUL, ConsentGroup } from '../util/ajax';
import { AlertMessage } from './AlertMessage';
import { InputFieldText } from './InputFieldText';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { InputYesNo } from '../components/InputYesNo';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { validateEmail } from "../util/Utils";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from './Spinner';
import './Documents.css';

export const DataUseLetter = hh(class DataUseLetter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      alertMessage: '',
      showAlert: false,
      error: false,
      alertType: 'success',
      invalidEmail: false,
      collaboratorEmail: '',
      repositoryDeposition: '',
      startDate: null,
      endDate: null,
      onGoingProcess: false
    };
  }

  validEmail = (email) => {
    if (validateEmail(email)) {
      return true;
    } else {
      this.setState({ invalidEmail: true });
    }
  };

  send = () => {
    spinnerService.showAll();
    const collaboratorEmail = this.state.collaboratorEmail;
    if (this.validEmail(collaboratorEmail)) {
      this.setState({ alertMessage: '', collaboratorEmail: '', showAlert: false });
      ConsentGroup.sendEmailDul(this.props.emailUrl, this.props.projectKey, this.props.userName, this.state.collaboratorEmail).then(resp => {
        setTimeout(this.removeAlertMessage, 5000, null);
        this.setState(prev => {
          prev.alertType = 'success';
          prev.alertMessage = 'Email sent to: ' + collaboratorEmail;
          prev.showAlert = true;
          prev.collaboratorEmail = '';
          return prev;
        }, () => spinnerService.hideAll());
      }).catch(error => {
        spinnerService.hideAll();
        this.setState(prev => {
          prev.alertType = 'danger';
          prev.alertMessage = 'Error sending email to: ' + collaboratorEmail + '. Please try again later.';
          prev.showAlert = true;
          prev.collaboratorEmail = '';
          return prev;
        });
      });
    } else spinnerService.hideAll();
  };

  getShareableLink = () => {
    let data = {
      consentGroupKey: this.props.projectKey,
      creator: this.props.userName
    };
    DUL.generateRedirectLink(data, component.serverURL).then(resp => {
      navigator.clipboard.writeText(component.serverURL + "/dataUseLetter/show?id=" + resp.data.dulToken);
      this.successTimeAlert();
    }).catch(error => {
      this.setState(prev => {
        prev.disableBtn = false;
        prev.alertType = "danger";
        prev.alertMessage = 'Something went wrong. Please try again.';
        prev.showAlert = true;
        return prev;
      });
    });
  };

  successTimeAlert = () => {
    setTimeout(this.removeAlertMessage, 3000, null);
    this.setState(prev => {
      prev.alertType = "success";
      prev.alertMessage = "Link copied to clipboard!";
      prev.showAlert = true;
      return prev;
    });
  };

  removeAlertMessage = () => {
    this.setState(prev => {
      prev.alertType = "success";
      prev.alertMessage = "";
      prev.showAlert = false;
      return prev;
    });
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.fileError = false;
      prev[field] = value;
      if (field === 'collaboratorEmail') {
        prev.invalidEmail = false;
      }
      return prev;
    })
  };

  handleRadioChange = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      if (field === 'repositoryDeposition') {
        this.setState(prev => {
          prev.formData['GSRAvailability'] = '';
          prev.formData['dataSubmissionProhibition'] = '';
          prev.formData['repositoryType'] = '';
          prev.formData['dataDepositionDescribed'] = '';
          prev.formData['dataUseConsent'] = '';
          return prev;
        });
      } else if (field == 'dataUseConsent' || field == 'dataDepositionDescribed' || field == 'repositoryType') {
        this.setState(prev => {
          if (field === 'dataUseConsent') {
            prev.formData['dataDepositionDescribed'] = '';
            prev.formData['repositoryType'] = '';
          } else if (field === 'dataDepositionDescribed') {
            prev.formData['repositoryType'] = '';
          }
          return prev;
        });
      }
    }
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => {
      if (this.state.submit) {
        this.validateForm();
      }
    });
  };

  handleCheck = (e) => {
    const { name = '', checked = '' } = e.target;
    this.setState(prev => {
      prev.formData[name] = checked;
      if (name === 'ethnic' && checked === false) {
        prev.formData['ethnicSpecify'] = '';
      } else if (name === 'onGoingProcess' && checked === true) {
        prev.formData['endDate'] = null;
      }
      return prev;
    }, () => {
      if (this.state.submit) {
        this.validateForm();
      }
    });
  };

  handleDatePickerChange = (id) => (date) => {
    this.setState(prev => {
      prev[id] = date;
      return prev;
    }, () => {
      if (this.state.submit) {
        this.validateForm();
      }
    });
  };

  parseDate(date) {
    if (date !== null) {
      return (new Date(date)).toLocaleDateString('en-US');
    }
  }

  render(){

    return(

      div({ style: { 'marginTop': '10px' } }, [
        p({ className: "bold" }, [
          "If you would like a shareable link to the Broad's Data Use Limitation Record request form to provide to your collaborator for their IRB's completion,",
          span({style: { 'display': 'block' }}, [
            "please complete the fields below."
          ])
        ]),
        div({ className: "row yesNo-container" }, [
          div({ className: "col-xs-12" }, [
            InputYesNo({
              id: "radioRepositoryDeposition",
              name: "repositoryDeposition",
              value: this.state.repositoryDeposition,
              label: "Data is intended for repository deposition?",
              readOnly: this.state.readOnly,
              onChange: this.handleRadioChange,
            }), 
          ])
        ]),
        div({ className: "row" }, [
          div({ className: "col-xs-12 col-sm-4 col-padding" }, [
            InputFieldDatePicker({
              selected: this.state.startDate,
              name: "startDate",
              label: "Sample Collection Start Date*",
              onChange: this.handleDatePickerChange,
              placeholder: "Enter Start Date",
              maxDate: this.state.endDate !== null ? this.state.endDate : null,
              errorMessage: 'Required Fields'
            })
          ]),
          div({ className: "col-xs-12 col-sm-4 col-padding" }, [
            InputFieldDatePicker({
              startDate: this.state.startDate,
              name: "endDate",
              label: "Sample Collection End Date*",
              selected: this.state.endDate,
              onChange: this.handleDatePickerChange,
              placeholder: "Enter End Date",
              disabled: (this.state.onGoingProcess === true) || (this.state.startDate === null),
              minDate: this.state.startDate
            })
          ]),

          div({ className: "col-xs-12 col-sm-4 col-padding checkbox" }, [
            InputFieldCheckbox({
              id: "onGoingProcess",
              name: "onGoingProcess",
              onChange: this.handleCheck,
              label: "Ongoing Process",
              defaultChecked: this.state.onGoingProcess
            })
          ])
        ]),
        div({ className: "row" }, [
          div({ className: "col-xs-12" }, [
            button({
              className: "btn buttonPrimary getShareable",
              onClick: this.getShareableLink,
              name: "getLink",
              disabled: false,
              id: 'shareable-link'
              }, [
                span({ className: "glyphicon glyphicon-link" }, []),
                "Get shareable link"
            ])
          ])
        ]),
        div({ className: "row" }, [
          div({ className: "col-xs-12" }, [
            div({}, [
              AlertMessage({
                type: this.state.alertType,
                msg: this.state.alertMessage,
                show: this.state.showAlert
              }),
            ])
          ])
        ])
      ])
    );
  }
});