import { Component } from 'react';
import { hh, h1 } from 'react-hyperscript-helpers';
import { WizardStep } from "../components/WizardStep";
import { Panel } from "../components/Panel";


export const SampleConsentLinkQuestions = hh(class SampleConsentLinkQuestions extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      intCohortsAnswers: {
        individualDataSourced : '',
        isLinkMaintained : '',
        areSamplesComingFromEEAA : '',
        isCollaboratorProvidingGoodService: '',
        isConsentUnambiguous: '',
      },
    };
  }

  render() {
    return (
      WizardStep({
        title: this.props.title,
        step: 1,
        currentStep: this.props.currentStep,
        error: false,
        errorMessage: 'Please complete all required fields'
      }, [
        Panel({
          title: "Select a sample collection",
          moreInfo: "(person filling the form)",
        }, [

        ])
      ])
    )
  }
});