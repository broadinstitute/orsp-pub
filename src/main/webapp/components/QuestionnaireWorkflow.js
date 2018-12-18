import { Component } from 'react';
import { div, hh, button, label, input, h1, span, p } from 'react-hyperscript-helpers';
import { InputYesNo } from './InputYesNo';
import { QuestionnaireProgressBar } from './QuestionnaireProgressBar';
import './QuestionnaireWorkflow.css';


export const QuestionnaireWorkflow = hh(class QuestionnaireWorkflow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      requiredError: false,
      currentQuestionIndex: null,
      nextQuestionIndex: null,
      endState: true,
      questions: []
    };
  }

  componentDidMount() {
    this.setState({
      endState: false,
      requiredError: false,
      currentQuestionIndex: 0,
      nextQuestionIndex: 1,
      questions: this.props.questions
    });
  }

  prevQuestion = (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.projectType = null;
      prev.endState = false;
      prev.nextQuestionIndex = prev.currentQuestionIndex;
      prev.currentQuestionIndex = prev.currentQuestionIndex > 0 ? prev.currentQuestionIndex - 1 : 0;
      return prev;
    })
  }

  nextQuestion = (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.endState = false;
      prev.currentQuestionIndex = prev.nextQuestionIndex;
      return prev;
    })
  }

  gotoNextquestion = () => {
    let answer = this.state.questions[this.state.currentQuestionIndex].answer;
    this.evaluateAnswer();
  }

  evaluateAnswer = (answer) => {
    let onYes = this.state.questions[this.state.currentQuestionIndex].yesOutput;
    let onNo = this.state.questions[this.state.currentQuestionIndex].noOutput;
    let requiredError = true;
    let nextQuestionIndex = null;
    let projectType = null;
    let endState = true;

    if (answer === null) {
      requiredError = true;
      nextQuestionIndex = null;
      projectType = null;
      endState = true;
    } else if (answer) {
      if (onYes < 100) {
        requiredError = false;
        nextQuestionIndex = onYes - 1;
        projectType = null;
        endState = false;
      } else {
        requiredError = false;
        nextQuestionIndex = null;
        projectType = onYes;
        endState = true;
      }
    } else if (answer === false) {
      if (onNo < 100) {
        requiredError = false;
        nextQuestionIndex = onNo - 1;
        projectType = null;
        endState = false;
      } else {
        requiredError = false;
        nextQuestionIndex = null;
        projectType = onNo;
        endState = true;
      }
    }

    this.setState({
      requiredError: requiredError,
      nextQuestionIndex: nextQuestionIndex,
      projectType: projectType,
      endState: endState
    }, () => {
      this.props.handler(this.state);
    });

  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  handleChange = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }
    this.setState(prev => {
      prev.questions[prev.currentQuestionIndex].answer = value;
      return prev;
    }, () => {
      this.evaluateAnswer(value);
    });
  }


  getTypeDescription = (t) => {
    if (t === 200) return 'NE';
    if (t === 300) return 'NHSR';
    if (t === 400) return 'IRB';
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    if (this.state.currentQuestionIndex === null) {
      return null;
    }

    const { currentQuestionIndex } = this.state;

    return (
      div({ className: "questionnaireContainer" }, [
        div({ className: "questionnaireProgressBar col-lg-4 col-md-5 col-sm-5 col-4" }, [
          p({}, [(this.state.endState === true ? "100%" : this.state.questions[currentQuestionIndex].progress + "%")]),
          QuestionnaireProgressBar({ progress: (this.state.endState === true ? 100 : this.state.questions[currentQuestionIndex].progress) }, [])
        ]),

        InputYesNo({
          id: this.state.questions[currentQuestionIndex].id,
          value: this.state.questions[currentQuestionIndex].answer,
          label: this.state.questions[currentQuestionIndex].question,
          moreInfo: this.state.questions[currentQuestionIndex].moreInfo,
          onChange: this.handleChange,
          required: false
        }),

        div({ isRendered: this.state.projectType != null }, ["Project Type is " + this.getTypeDescription(this.state.projectType)]),
        div({ isRendered: this.state.requiredError === true }, ["Please answer Yes or No"]),

        div({ isRendered: (this.state.endState === false), className: "buttonContainer" }, [
          button({ isRendered: (currentQuestionIndex > 0), className: "btn buttonSecondary circleBtn floatLeft", onClick: this.prevQuestion }, [
            span({ className: "glyphicon glyphicon-chevron-left" }, [])
          ]),
          button({ className: "btn buttonPrimary circleBtn floatRight", onClick: this.nextQuestion }, [
            span({ className: "glyphicon glyphicon-chevron-right" }, [])
          ])
        ])
      ])
    )
  }
});
