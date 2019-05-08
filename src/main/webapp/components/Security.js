import { Component, React } from 'react';
import { hh, h1, span, a, div } from 'react-hyperscript-helpers';

import { WizardStep } from './WizardStep';
import { InputFieldText } from './InputFieldText';
import { InputFieldRadio } from './InputFieldRadio';
import { isEmpty } from '../util/Utils'

const TEXT_SHARING_TYPES = ['open', 'controlled', 'both'];

export const Security = hh(class Security extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        pii: '',
        compliance: '',
        sharingType: '',
        textSharingType: '',
        textCompliance: '',
      },
      errors: {
        pii: true,
        compliance: true,
        sharingType: true,
        textCompliance: true,
      },
      openSharingText: '(Data Use LetterNR/link, consent or waiver of consent, or documentation from source that consent is not available but samples were appropriately collected and publicly available)',
      controlledSharingText: '(Data Use LetterNR/link, consent or waiver of consent)'
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
    }, () => {
      this.props.updateForm(this.state.formData, field);
      this.props.handleSecurityValidity(this.validate());
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
      this.props.handleSecurityValidity(this.validate());
      this.props.updateForm(this.state.formData, field);
      this.props.removeErrorMessage();
    })
  };

  validate = (field) => {
    let pii = false;
    let compliance = false;
    let sharingType = false;
    let isValid = true;
    let textCompliance = false;

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
    if (isEmpty(this.state.formData.sharingType)) {
      sharingType = true;
      isValid = false;
    }
    if (field === undefined || field === null || field === 3) {
      this.setState(prev => {
        prev.errors.pii = pii;
        prev.errors.compliance = compliance;
        prev.errors.sharingType = sharingType;
        prev.errors.textCompliance = textCompliance;
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

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }
    let errorMessage = ''
    if(!this.props.showErrorInfoSecurity && this.props.generalError) {
      errorMessage = 'Please check previous steps';
    } else if (this.props.submitError) {
      errorMessage =  'Something went wrong. Please try again.';
    } else {
      errorMessage = 'Please complete all required fields';
    }
    return (
      // WizardStep({
      //   title: this.props.title, step: this.props.step, currentStep: this.props.currentStep,
      //   error: this.props.showErrorInfoSecurity && this.formHasError() || this.props.generalError || this.props.submitError,
      //   errorMessage: errorMessage,
      // }, [
        div({ className: "questionnaireContainer" }, [
          InputFieldRadio({
            id: "radioPII",
            name: "pii",
            label: "As part of this project, will Broad receive either personally identifiable information (PII) or protected health information (PHI)?* ",
            moreInfo: span({}, ["For a list of what constitutes PII and PHI, ", a({ href: "https://intranet.broadinstitute.org/faq/storing-and-managing-phi", className: "link", target: "_blank" }, ["visit this link"]), "."]),
            value: this.props.securityInfoData.pii,
            optionValues: ["true", "false"],
            optionLabels: [
              "Yes",
              "No"
            ],
            onChange: this.handleRadio2Change,
            required: true,
            error: this.state.errors.pii && this.props.showErrorInfoSecurity,
            errorMessage: "Required field",
            edit: false
          }),
          InputFieldRadio({
            id: "radioCompliance",
            name: "compliance",
            label: span({}, ["Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPAA, etc.)"]), "?*"]),
            value: this.props.securityInfoData.compliance,
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
            edit: false
          }),
          InputFieldText({
            isRendered: this.props.securityInfoData.compliance === "true",
            id: "inputCompliance",
            name: "textCompliance",
            label: "Please specify which regulations must be adhered to below:*",
            value: this.props.securityInfoData.textCompliance,
            disabled: false,
            required: false,
            onChange: this.handleInputChange,
            error: this.props.securityInfoData.textCompliance && this.props.showErrorInfoSecurity,
            errorMessage: "Required field"
          }),
          InputFieldRadio({
            id: "radioAccessible",
            name: "sharingType",
            label: span({}, ["Will the individual level data collected or generated as part of this project be shared via: *"]),
            value: this.props.securityInfoData.sharingType,
            optionLabels: [
              "An open/unrestricted repository (such as GEO)",
              "A controlled-access repository (such as dbGaP or DUOS)",
              "Both a controlled-access and an open-access repository",
              "No data sharing via a repository (data returned to research collaborator only)",
              "Data sharing plan not yet determined"
            ],
            optionValues: [
              "open",
              "controlled",
              "both",
              "noDataSharing",
              "undetermined"
            ],
            onChange: this.handleRadio2Change,
            required: true,
            error: this.state.errors.sharingType && this.props.showErrorInfoSecurity,
            errorMessage: "Required field"
          }),

          InputFieldText({
            isRendered: TEXT_SHARING_TYPES.some((type) => type === this.state.formData.sharingType),
            id: "inputAccessible",
            name: "textSharingType",
            label: "Name of Database(s):",
            value: this.props.securityInfoData.textSharingType,
            disabled: false,
            required: false,
            onChange: this.handleInputChange,
          })
        ])
    //  ])
    )
  }
});
