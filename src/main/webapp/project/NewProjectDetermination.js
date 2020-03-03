import { Component } from 'react';
import { hh, h1 } from 'react-hyperscript-helpers';
import { WizardStep } from '../components/WizardStep';
import { QuestionnaireWorkflow } from '../components/QuestionnaireWorkflow';
import { DETERMINATION } from "../util/TypeDescription";

export const NewProjectDetermination = hh(class NewProjectDetermination extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = this.initQuestions();
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  initQuestions() {
    let questions = [];
    questions.push({
      question: 'Is this a "fee-for-service" project? ',
      moreInfo: '(commercial service only, no direct federal award to the Broad)',
      progress: 0,
      yesOutput: DETERMINATION.NE,
      noOutput: 2,
      answer: null,
      key: 'feeForService',
      id: 1
    });

    questions.push({
      question: 'Is a Broad investigator(s) conducting research ',
      moreInfo: '(generating, contributing to generalizable knowledge, with the intention to publish results)? Examples of projects that DO NOT contribute to generalizable knowledge include case studies, internal technology development projects',
      progress: 12,
      yesOutput: 3,
      noOutput: DETERMINATION.NHSR,
      answer: null,
      key: 'broadInvestigator',
      id: 2
    });

    questions.push({
      question: 'Are all subjects who provided samples and/or data now deceased?',
      progress: 25,
      yesOutput: DETERMINATION.NHSR,
      noOutput: 4,
      answer: null,
      key: 'subjectsDeceased',
      id: 3
    });

    questions.push({
      question: 'Is the Broad investigator(s) being added as study staff to an IRB-reviewed protocol? ',
      moreInfo: '',
      progress: 37,
      yesOutput: DETERMINATION.IRB,
      noOutput: 5,
      answer: null,
      key: 'irbReviewedProtocol',
      id: 4
    });

    questions.push({
      question: 'Is Broad investigator/staff a) obtaining information or biospecimens through an interaction with living human subjects or, b) obtaining/analyzing/generating identifiable private information or identifiable biospecimens ',
      moreInfo: '(Coded data are considered identifiable if researcher has access to key)',
      progress: 37,
      yesOutput: 6,
      noOutput: 7,
      answer: null,
      key: 'sensitiveInformationSource',
      id: 5
    });

    questions.push({
      question: 'Will the only involvement of human subjects be either as a) survey/interview/focus group participants, or b) data/sample contributors to a secondary use study, with information recorded in such a way that a subject’s identity cannot be readily ascertained (directly or indirectly through a code) AND the investigator will not try to re-identify subjects?',
      progress: 50,
      yesOutput: DETERMINATION.EX,
      noOutput: DETERMINATION.IRB,
      answer: null,
      key: 'humanSubjects',
      id: 6
    });

    questions.push({
      question: 'Are samples/data being provided by an investigator who a) has access to identifiers or b) obtains samples through an intervention or interaction? ',
      progress: 50,
      yesOutput: 8,
      noOutput: DETERMINATION.NHSR,
      answer: null,
      key: 'interactionSource',
      id: 7
    });

    questions.push({
      question: 'Is the Broad researcher receiving subject identifiers?',
      progress: 62,
      yesOutput: DETERMINATION.NHSR,
      noOutput: 9,
      answer: null,
      key: 'isIdReceive',
      id: 8
    });

    questions.push({
      question: 'Is the Broad researcher co-publishing or doing joint analysis with investigator who has access to identifiers?',
      progress: 75,
      yesOutput: 10,
      noOutput: DETERMINATION.NHSR,
      answer: null,
      key: 'isCoPublishing',
      id: 9
    });

    questions.push({
      question: 'Is Broad receiving direct federal funding (Is Broad the prime awardee of a federal grant)?',
      progress: 87,
      yesOutput: DETERMINATION.IRB,
      noOutput: DETERMINATION.NE,
      answer: null,
      key: 'federalFunding',
      id: 10
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
      WizardStep({ title: this.props.title, step: 1, currentStep: this.props.currentStep, questionnaireStep: true,
                   error: this.props.errors, errorMessage: 'Please answer the next question(s) above before moving to the next step'}, [
        QuestionnaireWorkflow({ questions: this.state.questions, determination: this.props.determination, handler: this.props.handler })
      ])
    )
  }
});
