import { Component, Fragment } from 'react';
import { hh, span } from 'react-hyperscript-helpers';
import { InternationalCohorts } from '../components/InternationalCohorts';
import { Security } from '../components/Security';
import { Panel } from '../components/Panel';
import { WizardStep } from '../components/WizardStep';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { AlertMessage } from '../components/AlertMessage';

export const NewLinkCohortData = hh(class NewLinkCohortData extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        requireMta: ''
      }
    };
    this.handleChange = this.handleRadioChange.bind(this);
  }


  handleRadioChange = (e, field, value) => {
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => this.props.updateMTA(this.state.formData, field));
    this.props.removeErrorMessage();
  };

  render() {
    let errorMessage = '';
    if(!this.props.showErrorInfoSecurity && !this.props.showErrorIntCohorts && !this.props.errors.requireMta && this.props.generalError) {
      errorMessage = 'Please check previous steps';
    } else if (this.props.submitError) {
      errorMessage =  'Something went wrong. Please try again.';
    } else {
      errorMessage = 'Please complete all required fields';
    }
    return (
      WizardStep({
        title: "Security, International Cohort and MTA", step: 1, currentStep: this.props.currentStep,
        error: this.props.showErrorIntCohorts || this.props.showErrorInfoSecurity || this.props.generalError || this.props.submitError || this.props.errors.requireMta, 
        errorMessage: errorMessage
      }, [
          Panel({ title: "International Cohorts" }, [
            InternationalCohorts({
              title: "International Cohorts",
              currentStep: this.props.currentStep,
              handler: this.props.handler,
              determination: this.props.determination,
              origin: 'consentGroup'
            }),
            AlertMessage({
              msg: ' Please answer all questions to continue',
              show: this.props.showErrorIntCohorts
            })
          ]),
          Panel({ title: "Security" }, [
            Security({
              title: "Security",
              step: 1,
              currentStep: this.props.currentStep,
              user: this.props.user,
              searchUsersURL: this.props.searchUsersURL,
              updateForm: this.props.updateInfoSecurityFormData,
              showErrorInfoSecurity: this.props.showErrorInfoSecurity,
              generalError: this.props.generalError,
              submitError: this.props.submitError,
              removeErrorMessage: this.props.removeErrorMessage,
              handleSecurityValidity: this.props.handleInfoSecurityValidity,
              securityInfoData: this.props.securityInfoData,
              edit: false,
              review: false,
              readOnly: false
            })
          ]),
          Panel({ title: "MTA" }, [
            InputFieldRadio({
              id: "radioRequireMta",
              name: "requireMta",
              label: span({}, ["Has the ", span({ style: { 'textDecoration': 'underline' } }, ["tech transfer office "]), "of the institution providing samples/data confirmed that an Material or Data Transfer Agreement (MTA/DTA) is needed to transfer the materials/data? "]),
              moreInfo: span({ className: "italic" }, ["(PLEASE NOTE THAT ALL SAMPLES ARRIVING FROM THE DANA FARBER CANCER INSTITUTE NOW REQUIRE AN MTA)*"]),
              value: this.props.requireMta,
              onChange: this.handleRadioChange,
              optionValues: ["true", "false", "uncertain"],
              optionLabels: [
                "Yes, the provider does require an MTA/DTA.",
                "No, the provider does not require an MTA/DTA.",
                "Not sure"
              ],
              required: true,
              error: this.props.errors.requireMta,
              errorMessage: "Required field",
              edit: false
            })
          ])
        ]))
  }
});
