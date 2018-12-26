import { Component } from 'react';
import { hh, h1 } from 'react-hyperscript-helpers';
import { WizardStep } from '../components/WizardStep';
import { QuestionnaireWorkflow } from '../components/QuestionnaireWorkflow';

const EXIT = 500;
const DPA = 600;
const RA = 700;
const CTC = 800;
const OSAP = 900;

export const NewConsentGroupIntCohorts = hh(class NewConsentGroupIntCohorts extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = this.initQuestions();
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  initQuestions() {
    let questions = [];

    questions.push({
      question: 'Are samples or individual-level data sourced from a country in the European Economic Area? [provide link to list of countries included]',
      yesOutput: 2,
      noOutput: EXIT,
      answer: null,
      progress: 0,
      id: 1
    });

    questions.push({
      question: 'Is a link maintained (by anyone) between samples/data being sent to the Broad and the identities of living EEA subjects?',
      yesOutput: 3,
      noOutput: EXIT,
      answer: null,
      progress: 17,
      id: 2
    });

    questions.push({
      question: 'Is the Broad work being performed as fee-for-service?',
      yesOutput: DPA,
      noOutput: 4,
      answer: null,
      progress: 34,
      id: 3
    });

    questions.push({
      question: 'Are samples/data coming directly to the Broad from the EEA?',
      yesOutput: 5,
      noOutput: RA,
      answer: null,
      progress: 50,
      id: 4
    });

    questions.push({
      question: 'Is Broad or the EEA collaborator providing goods/services (including routine return of research results) to EEA subjects, or engaging in ongoing monitoring of them (e.g. via use of a FitBit)?',
      yesOutput: OSAP,
      noOutput: 6,
      answer: null,
      progress: 67,
      id: 5
    });

    questions.push({
      question: 'GDPR does not apply, but a legal basis for transfer must be established. Is consent unambiguous (identifies transfer to the US, and risks associated with less stringent data protections here)?',
      yesOutput: EXIT,
      noOutput: CTC,
      answer: null,
      progress: 83,
      id: 6
    });

    return {
      questions: questions
    }
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    return (
      WizardStep({ title: this.props.title, step: 2, currentStep: this.props.currentStep,
       questionnaireStep: true, error: this.props.errors, errorMessage: ' Please answer all questions to continue'}, [
        QuestionnaireWorkflow({ questions: this.state.questions, handler: this.props.handler, determination: this.props.determination })
      ])
    )
  }
});
