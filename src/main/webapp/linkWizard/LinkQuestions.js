import { Component } from 'react';
import { hh, h1, span, a, i } from 'react-hyperscript-helpers';
import { WizardStep } from "../components/WizardStep";
import { Panel } from "../components/Panel";
import { InternationalCohorts } from "../components/InternationalCohorts";
import { AlertMessage } from "../components/AlertMessage";
import { Security } from "../components/Security";
import { InputFieldRadio } from "../components/InputFieldRadio";


export const LinkQuestions = hh(class LinkQuestions extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      intCohortsAnswers: {
        individualDataSourced : '',
        isLinkMaintained : '',
        areSamplesComingFromEEAA : '',
        isCollaboratorProvidingGoodService: '',
      },
    };
  }

  handleRadioChange = (e, field, value) => {
    this.setState(prev => {
      prev[field] = value;
      return prev;
    }, () => this.props.updateMTA(this.state, field));
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
        title: "Security/MTA/International Info",
        step: 1,
        currentStep: this.props.currentStep,
        error: this.props.generalError || this.props.submitError,
        errorMessage: errorMessage
      }, [
        Panel({ title: "International Cohorts" }, [
          InternationalCohorts({
            title: "International Cohorts",
            handler: this.props.handler,
            determination: this.props.determination,
            origin: 'feeForServiceWork'
          }),
          AlertMessage({
            msg: ' Please answer all questions to continue',
            show: this.props.showErrorIntCohorts && this.props.generalError
          })
        ]),
        Panel({ title: "Security" }, [
          Security({
            title: "Security",
            step: 1,
            currentStep: this.props.currentStep,
            user: this.props.user,
            updateForm: this.props.updateInfoSecurityFormData,
            generalError: this.props.generalError,
            submitError: this.props.submitError,
            handleSecurityValidity: this.props.handleInfoSecurityValidity,
            securityInfoData: this.props.securityInfoData,
            removeErrorMessage: this.props.removeErrorMessage,
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
            error: this.props.errors.requireMta && this.props.generalError,
            errorMessage: "Required field",
            edit: false
          }),
          span({ isRendered: this.props.requireMta === "true" }, [i({}, ["Upon receipt of the MTA from the provider, please visit "]),
            a({ href: "https://converge.broadinstitute.org", target: "_blank", className: "link" }, ["converge.broadinstitute.org"]), span({}, [i({}, [" to submit your MTA request."])])
          ])
        ])
      ]))
  }
});
