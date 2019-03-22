import { Component, React } from 'react';
import { hh, h1, span, a, div } from 'react-hyperscript-helpers';
import { WizardStep } from "./WizardStep";
import { InputFieldText } from './InputFieldText';
import { InputFieldRadio } from './InputFieldRadio';
import { isEmpty } from '../util/Utils'


export const SecurityStep = hh(class SecurityStep extends Component {

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
        textAccessible: '',
      },
      current: {
        pii: '',
        compliance: '',
        sensitive: '',
        accessible: '',
        textCompliance: '',
        textSensitive: '',
        textAccessible: '',
      },
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

  componentDidMount() {
    if (this.props.review === true) {
      this.updateStateReview();
    }
  }

  updateStateReview = () => {
    this.setState(prev => {
      prev.formData.pii = this.props.current.projectExtraProps.pii.toString();
      prev.formData.compliance = this.props.current.projectExtraProps.compliance.toString();
      prev.formData.sensitive = this.props.current.projectExtraProps.sensitive.toString();
      prev.formData.accessible = this.props.current.projectExtraProps.accessible.toString();
      prev.formData.textCompliance = this.props.current.projectExtraProps.textCompliance;
      prev.formData.textAccessible = this.props.current.projectExtraProps.textAccessible;
      prev.formData.textSensitive = this.props.current.projectExtraProps.textSensitive;

      prev.errors.pii = false;
      prev.errors.compliance = false;
      prev.errors.accessible = false;
      prev.errors.sensitive = false;
      prev.errors.textAccessible = false;
      prev.errors.textCompliance = false;
      prev.errors.textSensitive = false;
      return prev;
    });

  };

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------');
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
    }, () => {
      const valid = this.validate();
      this.props.updateForm(this.state.formData, field);
      this.props.handleSecurityValidity(valid);
      this.props.removeErrorMessage();
    });
    this.updateStateReview();
    console.log('handleRadio2Change', this.state.formData);
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => {
      const valid = this.validate();
      console.log('handleInputChange', valid);
      this.props.handleSecurityValidity(valid);
      this.props.updateForm(this.state.formData, field, value);
      this.props.removeErrorMessage();
    })
  };

  validate = (field) => {
    let pii = false;
    let compliance = false;
    let sensitive = false;
    let accessible = false;
    let isValid = true;
    let textCompliance = false;
    let textSensitive = false;
    let textAccessible = false;

    if (isEmpty(this.state.formData.pii)) {
      pii = true;
      isValid = false;
    }
    if (isEmpty(this.state.formData.compliance)) {
      compliance = true;
      isValid = false;
    }

    if (!isEmpty(this.state.formData.compliance)
      && this.state.formData.compliance === "true"
      && isEmpty(this.state.formData.textCompliance)) {
      textCompliance = true;
      isValid = false;
    }
    if (isEmpty(this.state.formData.sensitive)) {
      sensitive = true;
      isValid = false;
    }
    if (!isEmpty(this.state.formData.sensitive) && this.state.formData.sensitive === "true" && isEmpty(this.state.formData.textSensitive)) {
      textSensitive = true;
      isValid = false;
    }
    if (isEmpty(this.state.formData.accessible)) {
      accessible = true;
      isValid = false;
    }
    if (!isEmpty(this.state.formData.accessible) && this.state.formData.accessible === "true" && isEmpty(this.state.formData.textAccessible)) {
      textAccessible = true;
      isValid = false;
    }
    if (field === undefined || field === null || field === 3) {
      this.setState(prev => {
        prev.errors.pii = pii;
        prev.errors.compliance = compliance;
        prev.errors.sensitive = sensitive;
        prev.errors.accessible = accessible;
        prev.errors.textCompliance = textCompliance;
        prev.errors.textSensitive = textSensitive;
        prev.errors.textAccessible = textAccessible;
        return prev;
      });
    }
    return isValid;
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
        error: this.state.errors.pii && this.props.showErrorInfoSecurity,
        errorMessage: "Required field",
        readOnly: this.props.readOnly,
        edit: this.props.edit,
        review: this.props.review
      }),
      InputFieldRadio({
        id: "radioCompliance",
        name: "compliance",
        label: span({}, ["Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, CLIA, etc.)"]), "?*"]),
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
        error: this.state.errors.compliance && this.props.showErrorInfoSecurity,
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
        error: this.state.errors.textCompliance && this.props.showErrorInfoSecurity,
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
        error: this.state.errors.sensitive && this.props.showErrorInfoSecurity,
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
        error: this.state.errors.textSensitive && this.props.showErrorInfoSecurity,
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
        error: this.state.errors.accessible && this.props.showErrorInfoSecurity,
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
        error: this.state.errors.textAccessible && this.props.showErrorInfoSecurity,
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
