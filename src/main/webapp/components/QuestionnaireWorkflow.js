import { Component } from 'react';
import { div, hh, button, label, input, h1 } from 'react-hyperscript-helpers';
import { InputYesNo } from './InputYesNo';


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
      endState : endState
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
      return h1({},["Something went wrong."]);
    }

    if (this.state.currentQuestionIndex === null) {
      return null;
    }

    const { currentQuestionIndex } = this.state;
    return (
      div({ style: { "margin": "2px", "padding": "2px", "border": "solid 1px gray", "borderRadius": "4px" } }, [
        div({ style: { "margin": "2px", "padding": "2px", "backgroundColor": "gray", "color": "white" } }, ["(QuestionnaireWorkflow)"]),
        div({}, [this.state.questions[currentQuestionIndex].question]),
        InputYesNo({
           id: this.state.questions[currentQuestionIndex].id,

          value: this.state.questions[currentQuestionIndex].answer,
          onChange: this.handleChange,
          required: false
        }),
        div({ isRendered: (this.state.projectType != null) }, ["Project Type is " + this.getTypeDescription(this.state.projectType)]),
        div({}, [
          button({ isRendered: (currentQuestionIndex > 0), className: "btn btn-primary", style: { "margin": "2px" }, onClick: this.prevQuestion }, ["Previous Question"]),
          button({ isRendered: (this.state.endState === false), className: "btn btn-default", style: { "margin": "2px" }, onClick: this.nextQuestion }, ["Next Question"]),
        ]),
        div({ isRendered: this.state.requiredError === true }, ["Please answer Yes or No"])
      ])
    )
  }
});
