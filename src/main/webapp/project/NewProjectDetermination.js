import { Component } from 'react';
import { hh, h1, b, span, i } from 'react-hyperscript-helpers';
import { WizardStep } from '../components/WizardStep';
import { QuestionnaireWorkflow } from '../components/QuestionnaireWorkflow';
import { initQuestions } from '../util/DeterminationQuestions';

export const NewProjectDetermination = hh(class NewProjectDetermination extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state.questions = initQuestions();
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    return (
      WizardStep({ title: this.props.title, step: 1, currentStep: this.props.currentStep, questionnaireStep: true,
                   error: this.props.errors, errorMessage: 'Please answer the next question(s) above before moving to the next step'}, [
        QuestionnaireWorkflow({ questions: this.state.questions, determination: this.props.determination, handler: this.props.handler })
      ])
    )
  }
});
