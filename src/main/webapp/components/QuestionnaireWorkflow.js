import { Component } from 'react';
import { div, hh, button, label, input, h1, span, p, small } from 'react-hyperscript-helpers';
import { InputYesNo } from './InputYesNo';
import { InputFieldRadio } from './InputFieldRadio';
import { QuestionnaireProgressBar } from './QuestionnaireProgressBar';
import { InputFieldTextArea } from './InputFieldTextArea';
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
      questions: [],
      current: {
        questions: []
      }
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.resetIntCohorts && nextProps.questions !== prevState.questions && nextProps.determination !== prevState){
      nextProps.resetHandler();
      return { questions: nextProps.questions, currentQuestionIndex: 0, nextQuestionIndex: 1, projectType: null, endState: false};
    }
    else return null;
  }

  componentDidMount() {
    if (this.props.determination.questions.length > 0 && this.props.edit) {
      this.setState({
        endState: false,
        requiredError: false,
        currentQuestionIndex: 0,
        nextQuestionIndex: this.props.determination.nextQuestionIndex,
        questions: this.props.questions,
        projectType: null
      });
    } else if (this.props.determination.questions.length > 0 ) {
      this.setState({
        // This state set is to maintain project or consent group creation questionnaires state
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
      prev.questions[currentQuestionIndex].textValue = '';
      return prev;
    },()=> {
      console.log('thi.state :>> ', this.state);
    })
  };

  nextQuestion = (e) => {
    let currentAnswer = this.state.questions[this.state.currentQuestionIndex].answer;
    let currentTextValue = this.state.questions[this.state.currentQuestionIndex].textValue;

    if (this.props.edit === true) {
      this.props.cleanQuestionsUnanswered(this.state);
    }

    if (currentAnswer !== null) {
      if (currentTextValue !== null) {
        this.setState(prev => {
          prev.current.questions[currentQuestionIndex].textValue = currentTextValue;
        })
      }
      e.preventDefault();
      this.setState(prev => {
        prev.endState = false;
        prev.currentQuestionIndex = prev.nextQuestionIndex;
        prev.requiredError = false;
        return prev;
      }, () => {
        let answer = this.state.questions[this.state.currentQuestionIndex].answer;
        if (answer !== null && typeof answer === 'boolean') {
          this.evaluateAnswer(answer);
        } 
        else if(answer !== null && typeof answer === 'string') {
          this.evaluateRadioAnswer(answer);
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
  };

  evaluateRadioAnswer = (answer) => {
    let result = this.state.questions[this.state.currentQuestionIndex].outputs.find(value => value.key === answer);
    let value = result !== null ? result.value : null;
    let nextQuestionIndex = null;
    let projectType = null;
    let endState = false;
    if (answer === null) {
      nextQuestionIndex = null;
      projectType = null;
      endState = true;
    }
    else if (value < 100) {
      nextQuestionIndex = value - 1;
      projectType = null;
      endState = false;
    } 
    else {
      nextQuestionIndex = null;
      projectType = value;
      if (this.props.edit === true) {
        this.props.cleanQuestionsUnanswered(this.state);
      }
      endState = true;
    }
    this.setState(prev => {
      prev.nextQuestionIndex = nextQuestionIndex;
      prev.projectType = projectType;
      prev.requiredError = false;
      prev.endState = endState;
      return prev
    }, () => {
      this.props.handler(this.state);
    });
  }

  evaluateAnswer = (answer) => {
    let onYes = this.state.questions[this.state.currentQuestionIndex].yesOutput;
    let onNo = this.state.questions[this.state.currentQuestionIndex].noOutput;
    let nextQuestionIndex = null;
    let projectType = null;
    let endState = false;

    switch (answer) {

      case null:
        nextQuestionIndex = null;
        projectType = null;
        endState = true;
        break;

      case true:
        if (onYes < 100) {
          nextQuestionIndex = onYes - 1;
          projectType = null;
          endState = false;
        } else {
          nextQuestionIndex = null;
          projectType = onYes;
          if (this.props.edit === true){
            this.props.cleanQuestionsUnanswered(this.state);
          }
          endState = true;
        }
        break;

      case false:
        if (onNo < 100) {
          nextQuestionIndex = onNo - 1;
          projectType = null;
          endState = false;
        } else {
          nextQuestionIndex = null;
          if (this.props.edit === true) {
            this.props.cleanQuestionsUnanswered(this.state);
          }
          projectType = onNo;
          endState = true;
        }
        break;

      default:
        break;
    }
    this.setState(prev => {
      prev.nextQuestionIndex = nextQuestionIndex;
      prev.projectType = projectType;
      prev.requiredError = false;
      prev.endState = endState;
      return prev
    }, () => {
      this.props.handler(this.state);
    });
  };

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
      for(let i = prev.currentQuestionIndex + 1; i < prev.questions.length -1; i++) {
        prev.questions[i].answer = null;
      }
      return prev;
    }, () => {
      this.evaluateAnswer(value);
    });
  }

  handleRadioChange = (e, field, value) => {
    this.setState(prev => {
      prev.questions[prev.currentQuestionIndex].answer = value;
      for(let i = prev.currentQuestionIndex + 1; i < prev.questions.length; i++) {
        prev.questions[i].answer = null;
      }
      return prev;
    }, () => {
      this.evaluateRadioAnswer(value);
    });
  }

  handleTextAreaChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.questions[prev.currentQuestionIndex].textValue = value;
    }, ()=> {
      console.log('this.state.questions[currentQuestionIndex].textValue :>> ', this.state.questions[currentQuestionIndex].textValue)
    })
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
    console.log('state', this.state.questions[currentQuestionIndex])
    
    return (
      div({ className: this.props.questionnaireUnwrapped === true ? 'questionnaireContainerLight' : 'questionnaireContainer' }, [
        div({ className: "questionnaireProgressBar col-lg-4 col-md-5 col-sm-5 col-4" }, [
            p({}, [(this.state.endState === true ? "100%" : this.state.questions[currentQuestionIndex].progress + "%")]),
            QuestionnaireProgressBar({ progress: (this.state.endState === true ? 100 : this.state.questions[currentQuestionIndex].progress) }, [])
        ]),
        div({isRendered: this.state.questions[currentQuestionIndex].isYesNo === true}, [
          InputYesNo({           
            id: this.state.questions[currentQuestionIndex].id,
            value: this.state.questions[currentQuestionIndex].answer,
            label: this.state.questions[currentQuestionIndex].question,
            moreInfo: this.state.questions[currentQuestionIndex].moreInfo,
            onChange: this.handleChange,
            required: false,
          }),
          InputFieldTextArea({
            isRendered: this.state.questions[currentQuestionIndex].id === 2 && this.state.questions[currentQuestionIndex].answer,
            id: "broadInvestigatorTextValue",
            name: "broadInvestigatorTextValue",
            label: "Please provide a rationale for why this project/work would not be considered as research",
            currentValue: this.state.current.questions[currentQuestionIndex].textValue,
            value: this.state.questions[currentQuestionIndex].textValue,
            required: true,
            error: this.state.questions[currentQuestionIndex].textValue ? false : true,
            errorMessage: "Required Field",
            onChange: this.handleTextAreaChange,
          })
        ]),

        div({isRendered: this.state.questions[currentQuestionIndex].isRadio === true }, [
          InputFieldRadio({
            id:  this.state.questions[currentQuestionIndex].id,
            label: this.state.questions[currentQuestionIndex].question,
            moreInfo: this.state.questions[currentQuestionIndex].moreInfo,
            value: this.state.questions[currentQuestionIndex].answer,
            onChange: this.handleRadioChange,
            optionValues: this.state.questions[currentQuestionIndex].optionValues,
            optionLabels: this.state.questions[currentQuestionIndex].optionLabels,
            required: false,
            edit: false
          })
        ]),
        small({ isRendered: this.state.requiredError === true, className: "errorMessage" }, ["Required field"]),

        div({ className: "buttonContainer" }, [
          button({ isRendered: (currentQuestionIndex > 0), className: "btn buttonSecondary floatLeft", onClick: this.prevQuestion }, ["Previous Question"]),
          button({ isRendered: (this.state.endState === false), className: "btn buttonPrimary", style: {"marginLeft":"15px"}, onClick: this.nextQuestion }, ["Next Question"])
        ])
      ])
    )
  }
});
