import { Component } from 'react';
import { hh, h, div, p, button, span } from 'react-hyperscript-helpers';
import { DUL, ConsentGroup } from '../util/ajax';
import { AlertMessage } from './AlertMessage';
import { InputFieldText } from './InputFieldText';
import { validateEmail } from "../util/Utils";
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { InputYesNo } from '../components/InputYesNo';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { spinnerService } from "../util/spinner-service";
import { Spinner } from './Spinner';
import './Documents.css';
import { isEmpty } from '../util/Utils';

const DUL_SPINNER = 'dataUseLetterSpinner';

const styles = {
  getShareable: {
    marginTop: '20px',
    glyphicon: {marginRight: '5px'}
  }
};

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
      disableShareableLink: true,
      formData: {
        repositoryDeposition: '',
        startDate: null,
        endDate: null,
        onGoingProcess: false
      }      
    };
  }

  componentWillUnmount() {
    spinnerService._unregister(DUL_SPINNER);
  }

  validEmail = (email) => {
    if (validateEmail(email)) {
      return true;
    } else {
      this.setState({ invalidEmail: true });
    }
  };

  send = () => {
    spinnerService.show(DUL_SPINNER);
    const collaboratorEmail = this.state.collaboratorEmail;
    if (this.validEmail(collaboratorEmail)) {
      this.setState({ alertMessage: '', collaboratorEmail: '', showAlert: false });
      ConsentGroup.sendEmailDul(this.props.projectKey, this.props.userName, this.state.collaboratorEmail).then(resp => {
        setTimeout(this.removeAlertMessage, 5000, null);
        this.setState(prev => {
          prev.alertType = 'success';
          prev.alertMessage = 'Email sent to: ' + collaboratorEmail;
          prev.showAlert = true;
          prev.collaboratorEmail = '';
          return prev;
        }, () => spinnerService.hide(DUL_SPINNER));
      }).catch(error => {
        spinnerService.hide(DUL_SPINNER);
        this.setState(prev => {
          prev.alertType = 'danger';
          prev.alertMessage = 'Error sending email to: ' + collaboratorEmail + '. Please try again later.';
          prev.showAlert = true;
          prev.collaboratorEmail = '';
          return prev;
        });
      });
    } else spinnerService.hide(DUL_SPINNER);
  };

  getShareableLink = () => {
    let data = {
      consentGroupKey: this.props.projectKey,
      creator: this.props.userName,
      dulInfo: JSON.stringify(this.state.formData)
    };
    DUL.generateRedirectLink(data).then(resp => {
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
      value = false;
    }
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => { this.showShareableLink() });
  };

  handleCheck = (e) => {
    const { name = '', checked = '' } = e.target;
    this.setState(prev => {
      prev.formData[name] = checked;
      if (checked) {
        prev.formData['endDate'] = null;
      }
      return prev;
    }, () => { this.showShareableLink() });
  };

  handleDatePickerChange = (id) => (date) => {
    this.setState(prev => {
      prev.formData[id] = date;
      return prev;
    }, () => { this.showShareableLink() });
  };

  showShareableLink() {
    // Date Range Validations
    let disableShareableLink = false;
    if (this.state.formData.startDate === null
      || (this.state.formData.onGoingProcess === false && this.state.formData.endDate === null)
      || isEmpty(this.state.formData.repositoryDeposition)) {
        disableShareableLink = true;
    }
    this.setState(prev => {
      prev.disableShareableLink = disableShareableLink;
      return prev;
    });
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
              value: this.state.formData.repositoryDeposition,
              label: "Data is intended for repository deposition?*",
              readOnly: false,
              onChange: this.handleRadioChange,
            }), 
          ])
        ]),
        div({ className: "row" }, [
          div({ className: "col-xs-12 col-sm-4 col-padding" }, [
            InputFieldDatePicker({
              selected: this.state.formData.startDate,
              name: "startDate",
              label: "Sample Collection Start Date*",
              onChange: this.handleDatePickerChange,
              placeholder: "Enter Start Date",
              maxDate: this.state.formData.endDate !== null ? this.state.formData.endDate : null
            })
          ]),
          div({ className: "col-xs-12 col-sm-4 col-padding" }, [
            InputFieldDatePicker({
              startDate: this.state.formData.startDate,
              name: "endDate",
              label: "Sample Collection End Date*",
              selected: this.state.formData.endDate,
              onChange: this.handleDatePickerChange,
              placeholder: "Enter End Date",
              disabled: (this.state.formData.onGoingProcess === true) || (this.state.formData.startDate === null),
              minDate: this.state.formData.startDate
            })
          ]),

          div({ className: "col-xs-12 col-sm-4 col-padding checkbox" }, [
            InputFieldCheckbox({
              id: "onGoingProcess",
              name: "onGoingProcess",
              onChange: this.handleCheck,
              label: "Ongoing Process",
              defaultChecked: this.state.formData.onGoingProcess
            })
          ])
        ]),
        div({ className: "row" }, [
          div({ className: "col-xs-12" }, [
            button({
              className: "btn brnPrimary",
              style: styles.getShareable,
              onClick: this.getShareableLink,
              name: "getLink",
              disabled: this.state.disableShareableLink,
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
        ]),
        h(Spinner, {
          name: "dataUseLetterSpinner", group: "orsp", loadingImage: component.loadingImage
        })
      ])
    );
  }
});
