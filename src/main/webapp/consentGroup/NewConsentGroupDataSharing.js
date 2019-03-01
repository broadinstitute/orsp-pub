import { Component } from 'react';
import { hh, h1, div } from 'react-hyperscript-helpers';

import { WizardStep } from '../components/WizardStep';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldText } from '../components/InputFieldText';

export const NewConsentGroupDataSharing = hh(class NewConsentGroupDataSharing extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        sharingPlan: '',
        databaseControlled: '',
        databaseOpen: ''
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
    }, () => this.props.updateForm(this.state.formData, field));
    this.props.removeErrorMessage();
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => {
      this.props.updateForm(this.state.formData, field);
      this.props.removeErrorMessage();
    })
  };

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    let errorText = '';

    if (this.props.generalError && this.props.errors.sharingPlan) {
      errorText = 'Please complete all required fields';
    } else {
      errorText = 'Please check previous steps';
    }

    if (this.props.submitError) {
      errorText = 'Something went wrong in the server. Please try again later.';
    }

    return (
      WizardStep({
        title: this.props.title, step: 4, currentStep: this.props.currentStep,
        error: this.props.errors.sharingPlan || this.props.generalError,
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
              error: this.props.errors.sharingPlan,
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

