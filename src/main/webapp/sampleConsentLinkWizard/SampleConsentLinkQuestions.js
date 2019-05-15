import { Component } from 'react';
import { hh, h1 } from 'react-hyperscript-helpers';
import { WizardStep } from "../components/WizardStep";
import { Panel } from "../components/Panel";
import { IntCohortsReview } from "../components/IntCohortsReview";


export const SampleConsentLinkQuestons = hh(class SampleConsentLinkQuestons extends Component {
  state = {};

  constructor(props) {
    super(props);
  }

  render() {
    return (
      WizardStep({
        title: this.props.title,
        step: 0,
        currentStep: this.props.currentStep,
        error: this.props.errors.collectionSample || this.props.errors.consentGroup,
        errorMessage: 'Please complete all required fields'
      }, [
        Panel({
          title: "Select a sample collection",
          moreInfo: "(person filling the form)",
        }, [
          IntCohortsReview({
            future: get(this.state.formData, 'consentExtraProps', ''),
            current: this.state.current.consentExtraProps,
            readOnly: this.state.readOnly,
            resetHandler: this.resetHandler,
            determination: this.state.determination,
            handler: this.determinationHandler,
            cleanQuestionsUnanswered: this.cleanAnswersIntCohorts,
            resetIntCohorts: this.state.resetIntCohorts
          })
        ])
      ])
    )
  }
});