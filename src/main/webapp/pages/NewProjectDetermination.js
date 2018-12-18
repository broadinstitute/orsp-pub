import { Component } from 'react';
import { hh, h1 } from 'react-hyperscript-helpers';
import { WizardStep } from '../components/WizardStep';
import { QuestionnaireWorkflow } from '../components/QuestionnaireWorkflow';

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
      question: 'Is this a "fee-for-service" project? ',
      moreInfo: '(commercial service only, no Broad publication privileges)',
      progress: 12,
      yesOutput: NE,
      noOutput: 2,
      answer: null,
      id: 1
    });

    questions.push({
      question: 'Is a Broad investigator conducting research ',
      moreInfo: '(generating, contributing to generalizable knowledge)? Examples include case studies, internal technology development projects.',
      progress: 25,
      yesOutput: 3,
      noOutput: NHSR,
      answer: null,
      id: 2
    });

    questions.push({
      question: 'Are all subjects who provided samples and/or data now deceased?',
      progress: 37,
      yesOutput: NHSR,
      noOutput: 4,
      answer: null,
      id: 3
    });

    questions.push({
      question: 'Is Broad investigator/staff a) obtaining information or biospecimens through an interaction with living human subjects or, b) obtaining/analyzing/generating identifiable private information or identifiable biospecimens ',
      moreInfo: '(Coded data are considered identifiable if researcher has access to key)',
      progress: 50,
      yesOutput: IRB,
      noOutput: 5,
      answer: null,
      id: 4
    });

    questions.push({
      question: 'Are samples/data being provied by an investigator who has identifiers or obtains samples through and interaction ',
      moreInfo: '(i.e. is conductin HSR)?',
      progress: 62,
      yesOutput: 6,
      noOutput: NHSR,
      answer: null,
      id: 5
    });

    questions.push({
      question: 'Is the Broad receiving subject identifiers?',
      progress: 75,
      yesOutput: IRB,
      noOutput: 7,
      answer: null,
      id: 6
    });

    questions.push({
      question: 'Is the Broad researcher co-publishing or doing joint analysis with investigator who has access to identifiers?',
      progress: 87,
      yesOutput: 8,
      noOutput: NHSR,
      answer: null,
      id: 7
    });

    questions.push({
      question: 'Is Broad receiving direct federal funding?',
      progress: 100,
      yesOutput: IRB,
      noOutput: NE,
      answer: null,
      id: 8
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
      WizardStep({ title: this.props.title, step: 1, currentStep: this.props.currentStep, questionnaireStep: true }, [
        QuestionnaireWorkflow({ questions: this.state.questions, handler: this.props.handler })
      ])
    )
  }
});

// export default NewProjectDetermination;