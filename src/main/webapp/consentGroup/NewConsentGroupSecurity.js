import { Component, React } from 'react';
import { hh, h1, span, a, div } from 'react-hyperscript-helpers';

import { WizardStep } from '../components/WizardStep';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldRadio } from '../components/InputFieldRadio';

export const NewConsentGroupSecurity = hh(class NewConsentGroupSecurity extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        pii: '',
        compliance: '',
        sensitive: '',
        accessible: '',
        textCompliance: '',
        textSensitive: '',
        textAccessible: ''
      }
    };
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

    return (
      WizardStep({
        title: this.props.title, step: 3, currentStep: this.props.currentStep,
        error: this.props.errors.pii || this.props.errors.compliance
          || this.props.errors.sensitive || this.props.errors.accessible
          || this.props.errors.textCompliance || this.props.errors.textSensitive || this.props.errors.textAccessible,
        errorMessage: 'Please complete all required fields'
      }, [
          div({ className: "questionnaireContainer" }, [
            InputFieldRadio({
              id: "radioPII",
              name: "pii",
              label: "As part of this project, will Broad receive either personally identifiable information (PII) or protected health information (PHI)?* ",
              moreInfo: span({}, ["For a list of what constitutes PII and PHI, ", a({ href: "https://intranet.broadinstitute.org/faq/storing-and-managing-phi", target: "_blank" }, ["visit this link"]), "."]),
              value: this.state.formData.pii,
              optionValues: ["true", "false"],
              optionLabels: [
                "Yes",
                "No"
              ],
              onChange: this.handleRadio2Change,
              required: true,
              error: this.props.errors.pii,
              errorMessage: "Required field",
              edit: false
            }),
            InputFieldRadio({
              id: "radioCompliance",
              name: "compliance",
              label: span({}, ["Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, CLIA, etc.)"]), "?*"]),
              value: this.state.formData.compliance,
              optionValues: ["true", "false", "uncertain"],
              optionLabels: [
                "Yes",
                "No",
                "Uncertain"
              ],
              onChange: this.handleRadio2Change,
              required: true,
              error: this.props.errors.compliance,
              errorMessage: "Required field",
              edit: false
            }),
            InputFieldText({
              isRendered: this.state.formData.compliance === "true",
              id: "inputCompliance",
              name: "textCompliance",
              label: "Please specify which regulations must be adhered to below:*",
              value: this.state.formData.textCompliance,
              disabled: false,
              required: false,
              onChange: this.handleInputChange,
              error: this.props.errors.textCompliance,
              errorMessage: "Required field"
            }),
            InputFieldRadio({
              id: "radioSensitive",
              name: "sensitive",
              label: span({}, ["Does this data require additional protections beyond Broad's standard data security measures?*"]),
              value: this.state.formData.sensitive,
              optionValues: ["true", "false", "uncertain"],
              optionLabels: [
                "Yes",
                "No",
                "Uncertain"
              ],
              onChange: this.handleRadio2Change,
              required: true,
              error: this.props.errors.sensitive,
              errorMessage: "Required field"
            }),
            InputFieldText({
              isRendered: this.state.formData.sensitive === "true",
              id: "inputSensitive",
              name: "textSensitive",
              label: "Please explain*",
              value: this.state.formData.textSensitive,
              disabled: false,
              required: false,
              onChange: this.handleInputChange,
              error: this.props.errors.textSensitive,
              errorMessage: "Required field"
            }),
            InputFieldRadio({
              id: "radioAccessible",
              name: "accessible",
              label: span({}, ["Will the data collected or generated as part of this project be made available in an unrestricted/open-access environment ", span({ className: 'normal' }, ["(e.g. publicly available on the internet, shared via an open access repository such as GEO, etc)"]), "?*"]),
              value: this.state.formData.accessible,
              optionValues: ["true", "false", "uncertain"],
              optionLabels: [
                "Yes",
                "No",
                "Uncertain"
              ],
              onChange: this.handleRadio2Change,
              required: true,
              error: this.props.errors.accessible,
              errorMessage: "Required field"
            }),
            InputFieldText({
              isRendered: this.state.formData.accessible === "true",
              id: "inputAccessible",
              name: "textAccessible",
              label: "Please explain*",
              value: this.state.formData.textAccessible,
              disabled: false,
              required: false,
              onChange: this.handleInputChange,
              error: this.props.errors.textAccessible,
              errorMessage: "Required field"
            })
          ])
        ])
    )
  }
});