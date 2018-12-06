import { Component } from 'react';
import { div, hh, button } from 'react-hyperscript-helpers';

export const QuestionnaireWorkflow = hh(class QuestionnaireWorkflow extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentQuestionIndex: 0,
    };
  }

  componentDidMount() {
  }

  prevQuestion = (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.currentQuestionIndex = prev.currentQuestionIndex === 0 ? this.props.children.length - 1 : prev.currentQuestionIndex - 1;
      return prev;
    })
  }

  nextQuestion = (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.currentQuestionIndex = prev.currentQuestionIndex === this.props.children.length - 1 ? 0 : prev.currentQuestionIndex + 1;
      return prev;
    })
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }
  
  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    let currentQuestion = this.props.children[this.state.currentQuestionIndex];

    return (
      div({ style: { "margin": "2px", "padding": "2px", "border": "solid 1px gray", "borderRadius":"4px" } }, [
        div({ style: { "margin": "2px", "padding": "2px", "backgroundColor": "gray", "color": "white" } }, ["(QuestionnaireWorkflow)"]),
        currentQuestion,
        button({ className: "btn btn-primary", style: { "margin": "2px" }, onClick: this.prevQuestion }, ["Previous Question"]),
        button({ className: "btn btn-default", style: { "margin": "2px" }, onClick: this.nextQuestion }, ["Next Question"]),
      ])
    )
  }
});

// export default QuestionnaireWorkflow;