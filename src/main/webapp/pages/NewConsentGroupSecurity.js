import { Component } from 'react';
import { hh, h1 } from 'react-hyperscript-helpers';

import { WizardStep } from '../components/WizardStep';
import { InputYesNo } from '../components/InputYesNo';
import { InputFieldText } from '../components/InputFieldText';

//import { Search } from '../util/ajax';

export const NewConsentGroupSecurity = hh(class NewConsentGroupSecurity extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        pii: null,
        compliance: null,
        sensitive: null,
        accesible: null,
        textCompliance: '',
        textSensitive: '',
        textAccesible: ''
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

  handleRadioChange = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }

    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    });
  };

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    return (
      WizardStep({ title: this.props.title, step: 3, currentStep: this.props.currentStep }, [
        InputYesNo({
          id: "radioPII",
          name: "pii",
          label: "As part of this project, will Broad receive either personally identifiable information (PII) or protected health information (PHI)? ",
          moreInfo: "For a list of what constitues PII and PHI, visit this link.",
          value: this.state.formData.pii,
          onChange: this.handleRadioChange,
          required: false,
          error: this.props.subjectProtection,
          errorMessage: "Required field"
        }),
        InputYesNo({
          id: "radioCompliance",
          name: "compliance",
          label: "Are you bound by any regulatory compliance (FISMA, CLIA, etc.)? ",
          moreInfo: "If so which, one?",
          value: this.state.formData.compliance,
          onChange: this.handleRadioChange,
          required: false,
          error: this.props.subjectProtection,
          errorMessage: "Required field"
        }),
        InputFieldText({
          isRendered: this.state.formData.compliance === true,
          id: "inputCompliance",
          name: "textCompliance",
          label: "Add regulatory compliance:",
          value: this.state.formData.textCompliance,
          disabled: false,
          required: true,
          onChange: this.handleInputChange
        }),
        InputYesNo({
          id: "radioSensitive",
          name: "sensitive",
          label: "Is this data “sensitive” for any reason? ",
          moreInfo: "If yes, please explain",
          value: this.state.formData.sensitive,
          onChange: this.handleRadioChange,
          required: false,
          error: this.props.subjectProtection,
          errorMessage: "Required field"
        }),
        InputFieldText({
          isRendered: this.state.formData.sensitive === true,
          id: "inputSensitive",
          name: "textSensitive",
          label: "Please explain:",
          value: this.state.formData.textSensitive,
          disabled: false,
          required: true,
          onChange: this.handleInputChange
        }),
        InputYesNo({
          id: "radioAccesible",
          name: "accesible",
          label: "Will your data be accessible on the Internet (even if authenticated)? ",
          moreInfo: "If yes, please explain",
          value: this.state.formData.accesible,
          onChange: this.handleRadioChange,
          required: false,
          error: this.props.subjectProtection,
          errorMessage: "Required field"
        }),
        InputFieldText({
          isRendered: this.state.formData.accesible === true,
          id: "inputAccesible",
          name: "textAccesible",
          label: "Please explain:",
          value: this.state.formData.textAccesible,
          disabled: false,
          required: true,
          onChange: this.handleInputChange
        })
      ])
    )
  }
});