import { Component } from 'react';
import { hh, h1, span, a, div } from 'react-hyperscript-helpers';
import { QuestionnaireWorkflow } from './QuestionnaireWorkflow';
import { DETERMINATION } from "../util/TypeDescription";
import './InternationalCohorts.css';

export const InternationalCohorts = hh(class InternationalCohorts extends Component {
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
      question: span({}, [
        "Are samples or individual-level data sourced from a country in the European Economic Area? ", 
        a({ href:"https://www.imf.org/external/pubs/ft/fandd/2014/03/europeaneconomicarea.htm", target: "_blank", className: "normal" }, "(List of member states of European Economic Area)")
    ]),
      yesOutput: 2,
      noOutput: DETERMINATION.EXIT,
      answer: null,
      progress: 0,
      key: 'individualDataSourced',
      id: 1
    });

    questions.push({
      question: span({}, ["Is a link maintained ", span({ className: "normal" }, ["(by anyone) "]), "between samples/data being sent to the Broad and the identities of living EEA subjects?"]),
      yesOutput: 3,
      noOutput: DETERMINATION.EXIT,
      answer: null,
      progress: 20,
      key: 'isLinkMaintained',
      id: 2
    });

    questions.push({
      question: 'Is the Broad work being performed as fee-for-service?',
      yesOutput: DETERMINATION.DPA,
      noOutput: 4,
      answer: null,
      progress: 40,
      key: this.props.origin === 'newProject' ? 'feeForServiceWork' : 'feeForService',
      id: 3
    });

    questions.push({
      question: 'Are samples/data coming directly to the Broad from the EEA?',
      yesOutput: 5,
      noOutput: DETERMINATION.RA,
      answer: null,
      progress: 60,
      key: 'areSamplesComingFromEEAA',
      id: 4
    });

    questions.push({
      question: span({}, ["Is Broad or the EEA collaborator providing goods/services ", span({ className: "normal" }, ["(including routine return of research results) "]), "to EEA subjects, or engaging in ongoing monitoring of them", span({ className: "normal" }, ["(e.g. via use of a FitBit)?"])]),
      yesOutput: DETERMINATION.OSAP,
      noOutput: DETERMINATION.EXIT,
      answer: null,
      progress: 80,
      key: 'isCollaboratorProvidingGoodService',
      id: 5
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
      div({className: 'internationlCohortsBar'}, [
        QuestionnaireWorkflow({ questions: this.state.questions, handler: this.props.handler, determination: this.props.determination, questionnaireUnwrapped: true })
      ])
    )
  }
});
