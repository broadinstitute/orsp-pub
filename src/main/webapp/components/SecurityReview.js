import { Component, React } from 'react';
import { hh, h1, span, a, div } from 'react-hyperscript-helpers';
import { WizardStep } from "./WizardStep";
import { InputFieldText } from './InputFieldText';
import { InputFieldRadio } from './InputFieldRadio';

const TEXT_SHARING_TYPES = ['open', 'controlled', 'both'];

export const SecurityReview = hh(class SecurityReview extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      errors: {
        pii: true,
        compliance: true,
        sharingType: true,
        textCompliance: true,
      },
      openSharingText: '(Data Use LetterNR/link, consent or waiver of consent, or documentation from source that consent is not available but samples were appropriately collected and publicly available)',
      controlledSharingText: '(Data Use LetterNR/link, consent or waiver of consent)'
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
        label: span({}, ["Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPAA, etc.)"]), "?*"]),
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
        id: "radioAccessible",
        name: "sharingType",
        label: span({}, ["Will the individual level data collected or generated as part of this project be shared via: *"]),
        value: this.props.review === true ? this.props.formData.projectExtraProps.sharingType : this.props.currentValue.securityInfoFormData.sharingType,
        currentValue: this.props.review === true ? this.props.current.projectExtraProps.sharingType : null,
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
        error: this.props.infoSecurityErrors.sharingType && this.props.showErrorInfoSecurity,
        errorMessage: "Required field",
        readOnly: this.props.readOnly,
        edit: this.props.edit,
        review: this.props.review
      }),
      InputFieldText({
        isRendered: this.props.review === true ?  TEXT_SHARING_TYPES.some((type) => type === this.props.formData.projectExtraProps.sharingType) : TEXT_SHARING_TYPES.some((type) => type === this.props.currentValue.securityInfoFormData.sharingType),
        id: "inputAccessible",
        name: "textSharingType",
        label: "Name of Database(s) ",
        moreInfo: this.props.formData.projectExtraProps.sharingType !== 'controlled' ? this.state.controlledSharingText : this.state.openSharingText,
        value: this.props.review === true ? this.props.formData.projectExtraProps.textSharingType : this.props.currentValue.securityInfoFormData.textSharingType,
        currentValue:  this.props.review === true ? this.props.current.projectExtraProps.textSharingType : undefined,
        disabled: false,
        required: false,
        onChange: this.handleInputChange,
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
