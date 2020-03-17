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
      isYesNo: true,
      question: 'Is a Broad scientist(s) conducting research (generating or contributing to generalizable knowledge, with the intention to publish results)? ',
      moreInfo: 'Examples of projects that DO NOT contribute to generalizable knowledge include small case studies and internal technology development/validation projects ',
      progress: 0,
      yesOutput: 2,
      noOutput: DETERMINATION.NHSR,
      answer: null,
      key: 'broadInvestigator',
      id: 1
    });

    questions.push({
      isYesNo: true,
      question: 'Does this project  involve only specimens or data from deceased individuals?',
      progress: 12,
      yesOutput: DETERMINATION.NHSR,
      noOutput: 3,
      answer: null,
      key: 'subjectsDeceased',
      id: 2
    });

    questions.push({
      isYesNo: true,
      question: 'Will specimens or data be provided without identifiable information by someone without any role in this study except provision of samples/data ',
      moreInfo: '(no joint analysis, no co-publishing)',
      progress: 25,
      yesOutput: DETERMINATION.NHSR,
      noOutput: 4,
      answer: null,
      key: 'isCoPublishing',
      id: 3
    });

    questions.push({
      isYesNo: true,
      question: 'Is this a "fee-for-service" project? ',
      moreInfo: '(Commercial service only, no direct federal funding, no data analysis/storage/dbGaP deposition by Broad)',
      progress: 37,
      yesOutput: DETERMINATION.NE,
      noOutput: 5,
      answer: null,
      key: 'feeForService',
      id: 4
    });

    questions.push({
      isYesNo: true,
      question: 'Is this a project in which Broad 1) will obtain coded private information or biospecimen from another institution that retains a link to individually identifying information, AND 2) will be UNABLE to readily ascertain the identity of subjects, AND 3) is NOT the recipient of a direct federal grant/award ',
      progress: 47,
      yesOutput: DETERMINATION.NE,
      noOutput: 6,
      answer: null,
      key: 'sensitiveInformationSource',
      id: 5
    });

    questions.push({
      isRadio: true,
      question: 'Please select the option which best describes your research ',
      progress: 50,
      value: 'irbReviewedProtocol',
      answer: null,
      key: 'irbReviewedProtocol',
      optionLabels: ['This is a project that will be/has been reviewed by an IRB, with Broad listed as a study site.', 'This project will include an intervention/interaction with subjects, or identifiable information or identifiable private biospecimens will be used', 'This project is secondary research using data or biospecimens not collected specifically for this study'],
      optionValues: ['irbReviewedProtocol', 'sensitiveInformationSource', 'secondaryResearch'],
      outputs: [{key: 'irbReviewedProtocol', value: DETERMINATION.IRB}, {key: 'sensitiveInformationSource', value: 7}, {key: 'secondaryResearch', value: 8}],
      id: 6
    });

    questions.push({
      isYesNo: true,
      question: "Is this a project only includes interactions involving surveys or  interview procedures (including visual or auditory recording) IF AT LEAST ONE OF THE FOLLOWING IS TRUE: (i) The information is recorded in such a manner that the identity of the subjects cannot readily be ascertained; OR (ii) Any disclosure of the responses outside the research would not reasonably place the subjects at risk of criminal or civil liability or be damaging to the subjects' financial standing, employability, educational advancement, or reputation",
      progress: 62,
      yesOutput: DETERMINATION.EX,
      noOutput: 8,
      answer: null,
      key: 'humanSubjects',
      id: 7
    });

    questions.push({
      isYesNo: true,
      question: "Does the following statement accurately describe your study: I or another member of the project team (including a collaborator, sample/data contributor, or co-investigator) has recorded study data (including data about biospecimens) in such a way that the identity of the subjects cannot be readily ascertained directly or indirectly through identifiers linked to the subjects.  ",
      moreInfo: '(For example, your collaborator will provide specimens that are no longer linked to subject identifiers). Additionally, no one on the research team will attempt to contact or re-identify subjects',
      progress: 74,
      yesOutput: DETERMINATION.EX,
      noOutput: DETERMINATION.IRB,
      answer: null,
      key: 'interactionSource',
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
      WizardStep({ title: this.props.title, step: 1, currentStep: this.props.currentStep, questionnaireStep: true,
                   error: this.props.errors, errorMessage: 'Please answer the next question(s) above before moving to the next step'}, [
        QuestionnaireWorkflow({ questions: this.state.questions, determination: this.props.determination, handler: this.props.handler })
      ])
    )
  }
});
