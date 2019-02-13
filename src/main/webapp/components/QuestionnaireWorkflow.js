import { Component } from 'react';
import { div, hh, button, label, input, h1, span, p, small } from 'react-hyperscript-helpers';
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
      projectType: null,
      endState: true,
      questions: []
    };
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //
  // }

  componentDidMount() {
    // console.log('------------------------------componentDidMount--------------------------------------------', this.props);
    if (this.props.determination.questions.length > 0) {
      this.setState({
        endState: this.props.determination.endState,
        requiredError: this.props.determination.requiredError,
        currentQuestionIndex: this.props.determination.currentQuestionIndex,
        nextQuestionIndex: this.props.determination.nextQuestionIndex,
        questions: this.props.determination.questions,
        projectType: this.props.determination.projectType
      });
    } else {
      this.setState({
        endState: false,
        requiredError: false,
        currentQuestionIndex: 0,
        nextQuestionIndex: 1,
        questions: this.props.questions
      });
    }
  }

  prevQuestion = (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.projectType = null;
      prev.endState = false;
      prev.requiredError = false;
      prev.nextQuestionIndex = prev.currentQuestionIndex;
      prev.currentQuestionIndex = prev.currentQuestionIndex > 0 ? prev.currentQuestionIndex - 1 : 0;
      return prev;
    })
  }

  nextQuestion = (e) => {
    let currentAnswer = this.state.questions[this.state.currentQuestionIndex].answer;
    // console.log('----> nextQuestion 1 ------- currentAnswer : ', currentAnswer, this.state.currentQuestionIndex);

    if (this.props.edit === true) {
      this.props.cleanQuestionsUnanswered(this.state, "next");
    }

    if (currentAnswer !== null) {
      // console.log('----> nextQuestion 2 ------- currentAnswer : ', currentAnswer);
      e.preventDefault();
      this.setState(prev => {
        prev.endState = false;
        prev.currentQuestionIndex = prev.nextQuestionIndex;
        prev.requiredError = false;
        return prev;
      }, () => {
        let answer = this.state.questions[this.state.currentQuestionIndex].answer;
        // console.log('----> nextQuestion 3 ------- answer : ', answer);
        if (answer !== null) {
          this.evaluateAnswer(answer);
        }
      });
    } else {
      this.setState(prev => {
        prev.requiredError = true;
        return prev;
      }, () => {
        this.props.handler(this.state);
      });
    }
  }

  evaluateAnswer = (answer) => {
    // console.log('evaluateAnswer ----> ', answer);
    let onYes = this.state.questions[this.state.currentQuestionIndex].yesOutput;
    let onNo = this.state.questions[this.state.currentQuestionIndex].noOutput;
    let nextQuestionIndex = null;
    let projectType = null;
    let endState = false;

    switch(answer) {

      case null:
        // console.log('answer is null');
        nextQuestionIndex = null;
        projectType = null;
        endState = true;
        break;

      case true:
        // console.log('answer is true');
        if (onYes < 100) {
          nextQuestionIndex = onYes - 1;
          projectType = null;
          endState = false;
        } else {
          nextQuestionIndex = null;
          projectType = onYes;
          this.props.cleanQuestionsUnanswered(this.state, "end - true");
          endState = true;
        }
        break;

      case false:
        // console.log('answer is false');
        if (onNo < 100) {
          nextQuestionIndex = onNo - 1;
          projectType = null;
          endState = false;
        } else {
          nextQuestionIndex = null;
          this.props.cleanQuestionsUnanswered(this.state, "end - false");
          projectType = onNo;
          endState = true;
        }
        break;

      default:
        break;
    }

    // if (answer === null) {
    //   console.log('answer is null');
    //   nextQuestionIndex = null;
    //   projectType = null;
    //   endState = true;
    // } else if (answer === true) {
    //   console.log('answer is true');
    //   if (onYes < 100) {
    //     nextQuestionIndex = onYes - 1;
    //     projectType = null;
    //     endState = false;
    //   } else {
    //     nextQuestionIndex = null;
    //     projectType = onYes;
    //     this.props.cleanQuestionsUnanswered(this.state.currentQuestionIndex, "end - true");
    //     endState = true;
    //   }
    // } else if (answer === false) {
    //   console.log('answer is false');
    //   if (onNo < 100) {
    //     nextQuestionIndex = onNo - 1;
    //     projectType = null;
    //     endState = false;
    //   } else {
    //     nextQuestionIndex = null;
    //     this.props.cleanQuestionsUnanswered(this.state.currentQuestionIndex, "end - false");
    //     projectType = onNo;
    //     endState = true;
    //   }
    // }

    this.setState(prev => {
      prev.nextQuestionIndex = nextQuestionIndex;
      prev.projectType = projectType;
      prev.requiredError = false;
      prev.endState = endState;
      return prev
    }, () => {
      // console.log('evaluateAnswer state ', this.state);
      this.props.handler(this.state);
    });
  };

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
    if (t === 500) return 'EXIT';
    if (t === 600) return 'DPA';
    if (t === 700) return 'RA';
    if (t === 800) return 'CTC';
    if (t === 900) return 'OSAP';
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

        small({ isRendered: this.state.requiredError === true, className: "errorMessage" }, ["Required field"]),

        div({ className: "buttonContainer" }, [
          button({ isRendered: (currentQuestionIndex > 0), className: "btn buttonSecondary circleBtn floatLeft", onClick: this.prevQuestion }, [
            span({ className: "glyphicon glyphicon-chevron-left" }, [])
          ]),
          button({ isRendered: (this.state.endState === false), className: "btn buttonPrimary circleBtn floatRight", onClick: this.nextQuestion }, [
            span({ className: "glyphicon glyphicon-chevron-right" }, [])
          ])
        ])
      ])
    )
  }
});
