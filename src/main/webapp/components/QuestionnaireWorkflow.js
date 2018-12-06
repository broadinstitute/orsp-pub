import { Component } from 'react';
import { div, hh, button } from 'react-hyperscript-helpers';

export const QuestionnaireWorkflow = hh(class QuestionnaireWorkflow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentQuestionIndex: 0,
    };
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  componentDidMount() {
  }

  prevQuestion = (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.currentQuestionIndex = prev.currentQuestionIndex === 0 ? this.props.children.length-1 : prev.currentQuestionIndex - 1;
      return prev;
    })
  }

  nextQuestion = (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.currentQuestionIndex = prev.currentQuestionIndex === this.props.children.length-1 ? 0 : prev.currentQuestionIndex + 1;
      return prev;
    })
  }

  render() {

    let currentQuestion = this.props.children[this.state.currentQuestionIndex];

    return (
      div({ style: { "margin": "3px", "padding": "2px", "border": "solid 1px blue" } }, [
        div({ style: { "margin": "3px", "padding": "2px", "backgroundColor": "orange", "color": "white" } }, ["(QuestionnaireWorkflow) " + this.props.title]),
        currentQuestion,
        button({ onClick: this.prevQuestion }, ["Previous Question"]),
        button({ onClick: this.nextQuestion }, ["Next Question"]),
      ])
    )
  }
});

// export default QuestionnaireWorkflow;