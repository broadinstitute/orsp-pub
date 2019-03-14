import { Component } from 'react';
import { hh, h1, div } from 'react-hyperscript-helpers';

import { WizardStep } from './WizardStep';
import { InputFieldRadio } from './InputFieldRadio';
import { InputFieldText } from './InputFieldText';
import { isEmpty } from '../util/Utils';

export const DataSharing = hh(class DataSharing extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        sharingPlan: '',
        databaseControlled: '',
        databaseOpen: ''
      },
      errors: {
        sharingPlan: true
      }
    }

  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  handleRadio2Change = (e, field, value) => {
    this.setState(prev => {
      prev.formData[field] = value;
      prev.formData.databaseControlled = '';
      prev.formData.databaseOpen = '';
      return prev;
    }, () => {
      this.props.updateForm(this.state.formData, field);
      this.props.handleDataSharingValidity(this.validate(field));
      this.props.removeErrorMessage();
    });
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => {
      this.props.updateForm(this.state.formData, field);
      this.props.handleDataSharingValidity(this.validate(field));
      this.props.removeErrorMessage();
    });
  };

  validate(field) {
    let sharingPlan = false;
    let isValid = true;

    if (isEmpty(this.state.formData.sharingPlan)) {
      sharingPlan = true;
      isValid = false;
    }

    if (field === undefined || field === null || field === 4) {
      this.setState(prev => {
        prev.errors.sharingPlan = sharingPlan;
        return prev;
      });
    }
    else if (field === 'sharingPlan') {

      this.setState(prev => {
        if (field === 'sharingPlan') {
          prev.errors.sharingPlan = sharingPlan;
        }
        return prev;
      });
    }
    return isValid;
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    let errorText = '';

    if (this.props.generalError && this.state.errors.sharingPlan) {
      errorText = 'Please complete all required fields';
    } else {
      errorText = 'Please check previous steps';
    }
    if (this.props.submitError) {
      errorText = 'Something went wrong in the server. Please try again later.';
    }
    return (

      WizardStep({
        title: this.props.title, step: this.props.step, currentStep: this.props.currentStep,
        error: (this.state.errors.sharingPlan && this.props.showErrorDataSharing) || this.props.generalError,
        errorMessage: errorText
      }, [
        div({ className: "questionnaireContainer" }, [

          InputFieldRadio({
            id: "radioSharingPlan",
            name: "sharingPlan",
            label: "What is your Data Sharing plan?",
            moreInfo: "",
            optionValues: ["controlled", "open", "none", "undetermined"],
            optionLabels: ["Controlled Access", "Open Access", "No Sharing", "Data Sharing plan not yet determined"],
            value: this.state.formData.sharingPlan,
            onChange: this.handleRadio2Change,
            required: true,
            error: this.state.errors.sharingPlan && this.props.showErrorDataSharing,
            errorMessage: "Required field",
            edit: false
          }),
          InputFieldText({
            isRendered: this.state.formData.sharingPlan === "controlled",
            id: "inputDatabaseControlled",
            name: "databaseControlled",
            label: "Name of Database(s) ",
            moreInfo: "(Data Use LetterNR/link, consent or waiver of consent)",
            value: this.state.formData.databaseControlled,
            disabled: false,
            required: false,
            onChange: this.handleInputChange
          }),
          InputFieldText({
            isRendered: this.state.formData.sharingPlan === "open",
            id: "inputDatabaseOpen",
            name: "databaseOpen",
            label: "Name of Database(s) ",
            moreInfo: "(Data Use LetterNR/link, consent or waiver of consent, or documentation from source that consent is not available but samples were appropriately collected and publicly available)",
            value: this.state.formData.databaseOpen,
            disabled: false,
            required: false,
            onChange: this.handleInputChange
          })
        ])
      ])
    )
  }
});
