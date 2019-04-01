import { Component } from 'react';
import { hh, h1, span, div, label, h3, button } from 'react-hyperscript-helpers';
import { isEmpty } from "../util/Utils";
import { QuestionnaireWorkflow } from './QuestionnaireWorkflow';
import { AlertMessage } from "./AlertMessage";
import get from 'lodash/get';
import { DETERMINATION } from "../util/TypeDescription";

export const IntCohortsReview = hh(class IntCohortsReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      questions: []
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.resetIntCohorts){
      const questions = IntCohortsReview.initQuestions(nextProps.origin);
      return { questions: questions};
    }
    else return null;

  }

  componentDidMount() {
    this.setState(prev => {
      prev.questions = IntCohortsReview.initQuestions(this.props.origin);
      return prev;
    })
  }

  static initQuestions = (origin) => {
    const questions = [];
    questions.push({
      question: span({}, ["Are samples or individual-level data sourced from a country in the European Economic Area? ", span({ className: "normal" }, ["[provide link to list of countries included]"])]),
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
      progress: 17,
      key: 'isLinkMaintained',
      id: 2
    });

    questions.push({
      question: 'Is the Broad work being performed as fee-for-service?',
      yesOutput: DETERMINATION.DPA,
      noOutput: 4,
      answer: null,
      progress: 34,
      key: origin === 'project' ? 'feeForServiceWork' : 'feeForService',
      id: 3
    });

    questions.push({
      question: 'Are samples/data coming directly to the Broad from the EEA?',
      yesOutput: 5,
      noOutput: DETERMINATION.RA,
      answer: null,
      progress: 50,
      key: 'areSamplesComingFromEEAA',
      id: 4
    });

    questions.push({
      question: span({}, ["Is Broad or the EEA collaborator providing goods/services ", span({ className: "normal" }, ["(including routine return of research results) "]), "to EEA subjects, or engaging in ongoing monitoring of them", span({ className: "normal" }, ["(e.g. via use of a FitBit)?"])]),
      yesOutput: DETERMINATION.OSAP,
      noOutput: 6,
      answer: null,
      progress: 67,
      key: 'isCollaboratorProvidingGoodService',
      id: 5
    });

    questions.push({
      question: span({}, ["GDPR does not apply, but a legal basis for transfer must be established. Is consent unambiguous ", span({ className: "normal" }, ["(identifies transfer to the US, and risks associated with less stringent data protections here)?"])]),
      yesOutput: DETERMINATION.EXIT,
      noOutput: DETERMINATION.CTC,
      answer: null,
      progress: 83,
      key: 'isConsentUnambiguous',
      id: 6
    });

    return questions;
  };

  isEquals = (a, b) => {
    if (isEmpty(b) && !isEmpty(a) || isEmpty(a) && !isEmpty(b)) {
      return false;
    }
    if (a !== undefined && b !== undefined && !isEmpty(a) && !isEmpty(b) ) {
      if (JSON.parse(a) === JSON.parse(b)) {
        return true;
      } else if ((JSON.parse(a) !== JSON.parse(b))) {
        return false;
      }
    }
    return true;
  };

  stringAnswer = (current) => {
    let answer = '';
    if (current === 'true' || current === true) {
      answer = 'Yes';
    } else if (current === 'false' || current === false) {
      answer = 'No'
    } else if (current === 'null' || current === null || isEmpty(current)) {
      answer = '--';
    }
    return answer
  };

  handler = (answer) => {
    this.setState(prev => {
      prev.questions = answer.questions;
      return prev;
    }, () => this.props.handler(answer));
  };

  cleanUnanswered = (answers) => {
    this.setState(prev => {
    answers.questions.forEach((q, index) => {
      if (index > answers.currentQuestionIndex) {
        prev.questions[index].answer = null;
      }
    });
    return prev;
  }, () => this.props.cleanQuestionsUnanswered(answers));
  };

  render() {
    const {
      individualDataSourced : futureIndividualDataSourced = '',
      isLinkMaintained : futureIsLinkMaintained = '',
      areSamplesComingFromEEAA : futureAreSamplesComingFromEEAA = '',
      isCollaboratorProvidingGoodService: futureIsCollaboratorProvidingGoodService = '',
      isConsentUnambiguous: futureIsConsentUnambiguous = ''
    } = this.props.future;
    const futureProjectFeeForService = this.props.origin === 'project' ? get(this.props.future, 'feeForServiceWork', '') : get(this.props.future, 'feeForService', '');
    const {
      individualDataSourced : currentIndividualDataSourced = '',
      isLinkMaintained : currentIsLinkMaintained = '',
      areSamplesComingFromEEAA : currentAreSamplesComingFromEEAA = '',
      isCollaboratorProvidingGoodService: currentIsCollaboratorProvidingGoodService = '',
      isConsentUnambiguous: currentIsConsentUnambiguous = ''
    } = this.props.current;
    const currentProjectFeeForService  = this.props.origin === 'project' ? get(this.props.current, 'feeForServiceWork', '') : get(this.props.current, 'feeForService', '');
    return (
      div({}, [
        div({ className: "answerWrapper" }, [
          label({}, ["Are samples or individual-level data sourced from a country in the European Economic Area?"]),
          div({
            className: !this.isEquals(futureIndividualDataSourced, currentIndividualDataSourced) ? 'answerUpdated' : ''
          }, [this.stringAnswer(futureIndividualDataSourced)]),
          div({
            isRendered: !this.isEquals(futureIndividualDataSourced, currentIndividualDataSourced),
            className: "answerCurrent"
          }, [this.stringAnswer(currentIndividualDataSourced),])
        ]),

        div({ className: "answerWrapper" }, [
          label({}, ["Is a link maintained ", span({ className: "normal" }, ["(by anyone) "]), "between samples/data being sent to the Broad and the identities of living EEA subjects?"]),

          div({
            className: !this.isEquals(futureIsLinkMaintained, currentIsLinkMaintained) ? 'answerUpdated' : ''
          }, [this.stringAnswer(futureIsLinkMaintained)]),
          div({
            isRendered: !this.isEquals(futureIsLinkMaintained, currentIsLinkMaintained),
            className: "answerCurrent"
          }, [this.stringAnswer(currentIsLinkMaintained)])
        ]),

        div({ className: "answerWrapper" }, [
          label({}, ["Is the Broad work being performed as fee-for-service?"]),
          div({
            className: !this.isEquals(futureProjectFeeForService, currentProjectFeeForService) ? 'answerUpdated' : ''
          }, [this.stringAnswer(futureProjectFeeForService)]),
          div({
            isRendered: !this.isEquals(futureProjectFeeForService, currentProjectFeeForService),
            className: "answerCurrent"
          }, [this.stringAnswer(currentProjectFeeForService)])
        ]),

        div({ className: "answerWrapper" }, [
          label({}, ["Are samples/data coming directly to the Broad from the EEA?"]),
          div({
            className: !this.isEquals(futureAreSamplesComingFromEEAA, currentAreSamplesComingFromEEAA) ? 'answerUpdated' : ''
          }, [this.stringAnswer(futureAreSamplesComingFromEEAA)]),
          div({
            isRendered: !this.isEquals(futureAreSamplesComingFromEEAA, currentAreSamplesComingFromEEAA),
            className: "answerCurrent"
          }, [this.stringAnswer(currentAreSamplesComingFromEEAA)])
        ]),

        div({ className: "answerWrapper" }, [
          label({}, ["Is Broad or the EEA collaborator providing goods/services ", span({ className: "normal" }, ["(including routine return of research results) "]), "to EEA subjects, or engaging in ongoing monitoring of them", span({ className: "normal" }, ["(e.g. via use of a FitBit)?"])]),
          div({
            className: !this.isEquals(futureIsCollaboratorProvidingGoodService, currentIsCollaboratorProvidingGoodService) ? 'answerUpdated' : ''
          }, [this.stringAnswer(futureIsCollaboratorProvidingGoodService)]),
          div({
            isRendered: !this.isEquals(futureIsCollaboratorProvidingGoodService, currentIsCollaboratorProvidingGoodService),
            className: "answerCurrent"
          }, [this.stringAnswer(currentIsCollaboratorProvidingGoodService)])
        ]),

        div({ className: "answerWrapper" }, [
          label({}, ["GDPR does not apply, but a legal basis for transfer must be established. Is consent unambiguous ", span({ className: "normal" }, ["(identifies transfer to the US, and risks associated with less stringent data protections here)?"])]),
          div({
            className: !this.isEquals(futureIsConsentUnambiguous, currentIsConsentUnambiguous) ? 'answerUpdated' : ''
          }, [this.stringAnswer(futureIsConsentUnambiguous)]),
          div({
            isRendered: !this.isEquals(futureIsConsentUnambiguous, currentIsConsentUnambiguous),
            className: "answerCurrent"
          }, [this.stringAnswer(currentIsConsentUnambiguous)])
        ]),

        div({ isRendered: !this.props.readOnly, className: "questionnaireEdits" }, [
          div({ style: { 'margin': '15px 0 40px 0' } }, [
            AlertMessage({
              type: 'info',
              msg: "If you would like to change the answers to any of the International Cohort questions displayed above, please proceed through the questions below to change your answers accordingly.",
              show: true
            })
          ]),
          h3({}, ["International Cohorts' Questionnaire"]),
          QuestionnaireWorkflow({
            questions: this.props.resetIntCohorts ? IntCohortsReview.initQuestions(this.props.origin) : this.state.questions,
            edit: true,
            cleanQuestionsUnanswered: this.cleanUnanswered,
            handler: this.handler,
            determination: this.props.determination,
            readOnly: this.props.readOnly,
            resetHandler: this.props.resetHandler,
            resetIntCohorts : this.props.resetIntCohorts
          })
        ]),
      ]
    ))
  }
});
