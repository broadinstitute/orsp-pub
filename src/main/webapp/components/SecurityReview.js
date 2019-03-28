import { Component, React } from 'react';
import { hh, h1, span, a, div } from 'react-hyperscript-helpers';
import { WizardStep } from "./WizardStep";
import { InputFieldText } from './InputFieldText';
import { InputFieldRadio } from './InputFieldRadio';
import { isEmpty } from '../util/Utils'


export const SecurityReview = hh(class SecurityReview extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      errors: {
        pii: true,
        compliance: true,
        sensitive: true,
        accessible: true,
        textCompliance: true,
        textSensitive: true,
        textAccessible: true,
      },
    };
    this.formHasError = this.formHasError.bind(this);
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------');
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  handleRadio2Change = (e, field, value) => {
    this.props.updateForm(field, value);
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.props.updateForm(field, value);
  };


  formHasError() {
    let stateError = false;
    Object.keys(this.state.errors).forEach(key => {
      if (this.state.errors[key] === true) {
        stateError = true;
      }
    });
    return stateError;
  }

  initQuestions = () => {
    return div({ className: this.props.review === false ? "questionnaireContainer" : "" }, [
      InputFieldRadio({
        id: "radioPII",
        name: "pii",
        label: "As part of this project, will Broad receive either personally identifiable information (PII) or protected health information (PHI)?* ",
        moreInfo: span({}, ["For a list of what constitutes PII and PHI, ", a({ href: "https://intranet.broadinstitute.org/faq/storing-and-managing-phi", target: "_blank" }, ["visit this link"]), "."]),
        value: this.props.review === true ? this.props.formData.projectExtraProps.pii : this.props.currentValue.securityInfoFormData.pii,
        currentValue: this.props.review === true ? this.props.current.projectExtraProps.pii : null,
        optionValues: ["true", "false"],
        optionLabels: [
          "Yes",
          "No"
        ],
        onChange: this.handleRadio2Change,
        required: true,
        error: this.props.infoSecurityErrors.pii && this.props.showErrorInfoSecurity,
        errorMessage: "Required field",
        readOnly: this.props.readOnly,
        edit: this.props.edit,
        review: this.props.review
      }),
      InputFieldRadio({
        id: "radioCompliance",
        name: "compliance",
        label: span({}, ["Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPPA, etc.)"]), "?*"]),
        value: this.props.review === true ? this.props.formData.projectExtraProps.compliance : this.props.currentValue.securityInfoFormData.compliance,
        currentValue: this.props.review === true ? this.props.current.projectExtraProps.compliance : null,
        optionValues: ["true", "false", "uncertain"],
        optionLabels: [
          "Yes",
          "No",
          "Uncertain"
        ],
        onChange: this.handleRadio2Change,
        required: true,
        error: this.props.infoSecurityErrors.compliance && this.props.showErrorInfoSecurity,
        errorMessage: "Required field",
        readOnly: this.props.readOnly,
        edit: this.props.edit,
        review: this.props.review
      }),
      InputFieldText({
        isRendered: this.props.review === true ? this.props.formData.projectExtraProps.compliance === 'true' : this.props.currentValue.securityInfoFormData.compliance === 'true',
        id: "inputCompliance",
        name: "textCompliance",
        label: "Please specify which regulations must be adhered to below:*",
        value: this.props.review === true ? this.props.formData.projectExtraProps.textCompliance : this.props.currentValue.securityInfoFormData.textCompliance,
        currentValue: this.props.review === true ? this.props.current.projectExtraProps.textCompliance : undefined,
        disabled: false,
        required: false,
        onChange: this.handleInputChange,
        error: this.props.infoSecurityErrors.textCompliance && this.props.showErrorInfoSecurity,
        errorMessage: "Required field",
        readOnly: this.props.readOnly,
        edit: this.props.edit,
        review: this.props.review
      }),
      InputFieldRadio({
        id: "radioSensitive",
        name: "sensitive",
        label: span({}, ["Does this data require additional protections beyond Broad's standard data security measures?*"]),
        value: this.props.review === true ? this.props.formData.projectExtraProps.sensitive : this.props.currentValue.securityInfoFormData.sensitive,
        currentValue: this.props.review === true ? this.props.current.projectExtraProps.sensitive : null,
        optionValues: ["true", "false", "uncertain"],
        optionLabels: [
          "Yes",
          "No",
          "Uncertain"
        ],
        onChange: this.handleRadio2Change,
        required: true,
        error: this.props.infoSecurityErrors.sensitive && this.props.showErrorInfoSecurity,
        errorMessage: "Required field",
        readOnly: this.props.readOnly,
        edit: this.props.edit,
        review: this.props.review
      }),
      InputFieldText({
        isRendered: this.props.review === true ?  this.props.formData.projectExtraProps.sensitive === 'true' : this.props.currentValue.securityInfoFormData.sensitive === 'true',
        id: "inputSensitive",
        name: "textSensitive",
        label: "Please explain*",
        value: this.props.review === true ?  this.props.formData.projectExtraProps.textSensitive : this.props.currentValue.securityInfoFormData.textSensitive,
        currentValue: this.props.review === true ?  this.props.current.projectExtraProps.textSensitive : undefined,
        disabled: false,
        required: false,
        onChange: this.handleInputChange,
        error: this.props.infoSecurityErrors.textSensitive && this.props.showErrorInfoSecurity,
        errorMessage: "Required field",
        readOnly: this.props.readOnly,
        edit: this.props.edit,
        review: this.props.review
      }),
      InputFieldRadio({
        id: "radioAccessible",
        name: "accessible",
        label: span({}, ["Will the data collected or generated as part of this project be made available in an unrestricted/open-access environment ", span({ className: 'normal' }, ["(e.g. publicly available on the internet, shared via an open access repository such as GEO, etc)"]), "?*"]),
        value: this.props.review === true ? this.props.formData.projectExtraProps.accessible : this.props.currentValue.securityInfoFormData.accessible,
        currentValue: this.props.review === true ? this.props.current.projectExtraProps.accessible : null,
        optionValues: ["true", "false", "uncertain"],
        optionLabels: [
          "Yes",
          "No",
          "Uncertain"
        ],
        onChange: this.handleRadio2Change,
        required: true,
        error: this.props.infoSecurityErrors.accessible && this.props.showErrorInfoSecurity,
        errorMessage: "Required field",
        readOnly: this.props.readOnly,
        edit: this.props.edit,
        review: this.props.review
      }),
      InputFieldText({
        isRendered: this.props.review === true ?  this.props.formData.projectExtraProps.accessible === 'true' : this.props.currentValue.securityInfoFormData.accessible === 'true',
        id: "inputAccessible",
        name: "textAccessible",
        label: "Please explain*",
        value: this.props.review === true ? this.props.formData.projectExtraProps.textAccessible : this.props.currentValue.securityInfoFormData.textAccessible,
        currentValue:  this.props.review === true ? this.props.current.projectExtraProps.textAccessible : undefined,
        disabled: false,
        required: false,
        onChange: this.handleInputChange,
        error: this.props.infoSecurityErrors.textAccessible && this.props.showErrorInfoSecurity,
        errorMessage: "Required field",
        readOnly: this.props.readOnly,
        edit: this.props.edit,
        review: this.props.review
      })
    ])
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    if (this.props.review === false) {
      return (
        WizardStep({
          title: this.props.title,
          step: this.props.step,
          currentStep: this.props.currentStep,
          error: this.props.showErrorInfoSecurity && this.formHasError(),
          errorMessage: 'Please complete all required fields'
        }, [
          this.initQuestions()
        ])
      )
    } else {
      return  (
        this.initQuestions()
      )
    }
  }
});
