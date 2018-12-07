import { Component } from 'react';
import { hh } from 'react-hyperscript-helpers';
import { WizardStep } from '../components/WizardStep';
import { QuestionnaireWorkflow } from '../components/QuestionnaireWorkflow';
import { QuestionnaireStep } from '../components/QuestionnaireStep';

const NE = 200;
const NHSR = 300;
const IRB = 400;

export const NewProjectDetermination = hh(class NewProjectDetermination extends Component {

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
      question: '1. Is this a "fee-for-service" project? (commercial service only, no Broad publication privileges)',
      yesOutput: NE,
      noOutput: 2,
      answer: null
    });

    questions.push({
      question: '2. Is a Broad investigator conductin reseach (generating, contributing to generalizable knowledge) ? Examples include case studies, internal technology development projects',
      yesOutput: 3,
      noOutput: NHSR,
      answer: null
    });

    questions.push({
      question: '3. Are all subjects who provided samples and/or data now deceased?',
      yesOutput: NHSR,
      noOutput: 4,
      answer: null
    });

    questions.push({
      question: '4. Is Broad investigator/staff a) obtaining information or biospecimens through an interaction with living human subjects or, b) obtaining/analyzing/generating dentifiable private information or identifiable biospecimens (Coded data are considered identifiable if researcher has access to key)',
      yesOutput: IRB,
      noOutput: 5,
      answer: null
    });

    questions.push({
      question: '5. Are samples/data being provied by an investigator who has identifiers or obtains samples through and interaction (i.e. is conductin HSR)?',
      yesOutput: 6,
      noOutput: NHSR,
      answer: null
    });

    questions.push({
      question: '6. Is the Broad receiving subject identifiers?',
      yesOutput: IRB,
      noOutput: 7,
      answer: null
    });

    questions.push({
      question: '7. Is the Broad researcher co-publishing or doing joint analysis with investigator who has acess to identifiers?',
      yesOutput: 8,
      noOutput: NHSR,
      answer: null
    });

    questions.push({
      question: '8. Is Broad receiving direct federal funding?',
      yesOutput: IRB,
      noOutput: NE,
      answer: null
    });

    return {
      questions: questions
    }
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return (
      WizardStep({ title: this.props.title, step: 1, currentStep: this.props.currentStep }, [
        QuestionnaireWorkflow({ questions: this.state.questions, handler: this.props.handler })
      ])
    )
  }
});

// export default NewProjectDetermination;