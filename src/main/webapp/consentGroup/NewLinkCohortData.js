import { Component, Fragment } from 'react';
import { hh, span, a, i } from 'react-hyperscript-helpers';
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
  };

  render() {
    let errorMessage = '';
    if(!this.props.showErrorInfoSecurity && !this.props.showErrorIntCohorts && !this.props.errors.requireMta && this.props.generalError) {
      errorMessage = 'Please check previous steps';
    } else if (this.props.submitError) {
      errorMessage = "Something went wrong in the server. Please verify that you don't exceed 100Mb total in files to upload.";
    } else {
      errorMessage = 'Please complete all required fields';
    }
    return (
      WizardStep({
        title: "InfoSec Details", step: 1, currentStep: this.props.currentStep,
        error: this.props.generalError || this.props.submitError, 
        errorMessage: errorMessage
      }, [
        /* Eliminated International Cohorts and MTA */
          Panel({ title: "Security" }, [
            Security({
              title: "Security",
              step: 1,
              currentStep: this.props.currentStep,
              user: this.props.user,
              updateForm: this.props.updateInfoSecurityFormData,
              generalError: this.props.generalError && this.props.showErrorInfoSecurity,
              submitError: this.props.submitError,
              handleSecurityValidity: this.props.handleInfoSecurityValidity,
              securityInfoData: this.props.securityInfoData,
              edit: false,
              review: false,
              readOnly: false
            })
          ]),
          /* Eliminated International Cohorts and MTA */
        ]))
  }
});
