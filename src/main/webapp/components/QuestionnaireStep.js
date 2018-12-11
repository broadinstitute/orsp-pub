import { Component } from 'react';
import { div, hh, h1 } from 'react-hyperscript-helpers';

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
      return h1({},["Something went wrong."]);
    }

    return (
      div({ style: { "border": "solid 1px gray" } }, [
        div({style: {"margin":"3px", "padding":"2px", "backgroundColor":"white", "color":"black" }}, [this.props.question ]),
        this.props.children
      ])
    )
  }
});

// export default QuestionnaireStep;