import { Component, React } from 'react';
import { hh, h1, span, a, div, label } from 'react-hyperscript-helpers';
import { isEmpty, capitalize } from "../util/Utils";

export const SecurityReview = hh(class SecurityReview extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
    };
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------');
    console.log(error, info);
  }

  stringAnswer = (current) => {
    let answer = '';
    if (current === 'true' || current === true) {
      answer = 'Yes';
    } else if (current === 'false' || current === false) {
      answer = 'No'
    } else if (current === 'null' || current === null || isEmpty(current)) {
      answer = '--';
    }
    return answer
  };
  // initQuestions = () => {
  //   return div({ className: this.props.review === false ? "questionnaireContainer" : "" }, [
  //     InputFieldRadio({
  //       id: "radioPII",
  //       name: "pii",
  //       label: "As part of this project, will Broad receive either personally identifiable information (PII) or protected health information (PHI)?* ",
  //       moreInfo: span({}, ["For a list of what constitutes PII and PHI, ", a({ href: "https://intranet.broadinstitute.org/faq/storing-and-managing-phi", className: "link", target: "_blank" }, ["visit this link"]), "."]),
  //       value: this.props.review === true ? this.props.formData.projectExtraProps.pii : this.props.currentValue.securityInfoFormData.pii,
  //       currentValue: this.props.review === true ? this.props.current.projectExtraProps.pii : null,
  //       optionValues: ["true", "false"],
  //       optionLabels: [
  //         "Yes",
  //         "No"
  //       ],
  //       onChange: this.handleRadio2Change,
  //       required: true,
  //       error: this.props.infoSecurityErrors.pii && this.props.showErrorInfoSecurity,
  //       errorMessage: "Required field",
  //       readOnly: this.props.readOnly,
  //       edit: this.props.edit,
  //       review: this.props.review
  //     }),
  //     InputFieldRadio({
  //       id: "radioCompliance",
  //       name: "compliance",
  //       label: span({}, ["Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPAA, etc.)"]), "?*"]),
  //       value: this.props.review === true ? this.props.formData.projectExtraProps.compliance : this.props.currentValue.securityInfoFormData.compliance,
  //       currentValue: this.props.review === true ? this.props.current.projectExtraProps.compliance : null,
  //       optionValues: ["true", "false", "uncertain"],
  //       optionLabels: [
  //         "Yes",
  //         "No",
  //         "Uncertain"
  //       ],
  //       onChange: this.handleRadio2Change,
  //       required: true,
  //       error: this.props.infoSecurityErrors.compliance && this.props.showErrorInfoSecurity,
  //       errorMessage: "Required field",
  //       readOnly: this.props.readOnly,
  //       edit: this.props.edit,
  //       review: this.props.review
  //     }),
  //     InputFieldText({
  //       isRendered: this.props.review === true ? this.props.formData.projectExtraProps.compliance === 'true' : this.props.currentValue.securityInfoFormData.compliance === 'true',
  //       id: "inputCompliance",
  //       name: "textCompliance",
  //       label: "Please specify which regulations must be adhered to below:*",
  //       value: this.props.review === true ? this.props.formData.projectExtraProps.textCompliance : this.props.currentValue.securityInfoFormData.textCompliance,
  //       currentValue: this.props.review === true ? this.props.current.projectExtraProps.textCompliance : undefined,
  //       disabled: false,
  //       required: false,
  //       onChange: this.handleInputChange,
  //       error: this.props.infoSecurityErrors.textCompliance && this.props.showErrorInfoSecurity,
  //       errorMessage: "Required field",
  //       readOnly: this.props.readOnly,
  //       edit: this.props.edit,
  //       review: this.props.review
  //     }),
  //     InputFieldRadio({
  //       id: "radioAccessible",
  //       name: "sharingType",
  //       label: span({}, ["Will the individual level data collected or generated as part of this project be shared via: *"]),
  //       value: this.props.review === true ? this.props.formData.projectExtraProps.sharingType : this.props.currentValue.securityInfoFormData.sharingType,
  //       currentValue: this.props.review === true ? this.props.current.projectExtraProps.sharingType : null,
  //       optionLabels: [
  //         "An open/unrestricted repository (such as GEO)",
  //         "A controlled-access repository (such as dbGaP or DUOS)",
  //         "Both a controlled-access and an open-access repository",
  //         "No data sharing via a repository (data returned to research collaborator only)",
  //         "Data sharing plan not yet determined"
  //       ],
  //       optionValues: [
  //         "open",
  //         "controlled",
  //         "both",
  //         "noDataSharing",
  //         "undetermined"
  //       ],
  //       onChange: this.handleRadio2Change,
  //       required: true,
  //       error: this.props.infoSecurityErrors.sharingType && this.props.showErrorInfoSecurity,
  //       errorMessage: "Required field",
  //       readOnly: this.props.readOnly,
  //       edit: this.props.edit,
  //       review: this.props.review
  //     }),
  //     InputFieldText({
  //       isRendered: this.props.review === true ?  TEXT_SHARING_TYPES.some((type) => type === this.props.formData.projectExtraProps.sharingType) : TEXT_SHARING_TYPES.some((type) => type === this.props.currentValue.securityInfoFormData.sharingType),
  //       id: "inputAccessible",
  //       name: "textSharingType",
  //       label: "Name of Database(s): ",
  //       value: this.props.review === true ? this.props.formData.projectExtraProps.textSharingType : this.props.currentValue.securityInfoFormData.textSharingType,
  //       currentValue:  this.props.review === true ? this.props.current.projectExtraProps.textSharingType : undefined,
  //       disabled: false,
  //       required: false,
  //       onChange: this.handleInputChange,
  //       readOnly: this.props.readOnly,
  //       edit: this.props.edit,
  //       review: this.props.review
  //     })
  //   ])
  // };

  render() {
    const {
      textSharingType = '',
      sharingType = '',
      textCompliance = '',
      compliance = '',
      pii = ''
    } = this.props.sample;

    if (this.props.currentStep === this.props.step) {
      return(
        div({}, [
          div({ className: "answerWrapper" }, [
            label({}, ["As part of this project, will Broad receive either personally identifiable information (PII) or protected health information (PHI)?* "]),
            div({
            }, [this.stringAnswer(pii)]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPAA, etc.)"]), "?*"]),
            div({
            }, [this.stringAnswer(compliance)]),
          ]),
          div({ className: "answerWrapper" }, [
            label({}, ["Please specify which regulations must be adhered to below:"]),
            div({
            }, [this.stringAnswer(textCompliance)]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Will the individual level data collected or generated as part of this project be shared via: *"]),
            div({
            }, [capitalize(sharingType)]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Name of Database(s): "]),
            div({
            }, [isEmpty(textSharingType) ? "--" : textSharingType]),
          ]),
        ])
      )
    } else {
      return ("")
    }
  }
});
