import { Component } from 'react';
import { div, hh, h1 } from 'react-hyperscript-helpers';
import './Questionnaire.css';

export const QuestionnaireStep = hh(class QuestionnaireStep extends Component {

  state = {};

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
      return h1({}, ["Something went wrong."]);
    }

    return (
      div({}, [
        div({ style: { "margin": "3px", "padding": "2px", "backgroundColor": "red", "color": "red" } }, [this.props.question]),
        this.props.children
      ])
    )
  }
});

// export default QuestionnaireStep;