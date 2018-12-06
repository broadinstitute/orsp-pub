import { Component } from 'react';
import { div, hh } from 'react-hyperscript-helpers';

export const QuestionnaireStep = hh(class QuestionnaireStep extends Component {

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {

    return (
      div({ style: { "border": "solid 1px orange" } }, [
        div({style: {"margin":"3px", "padding":"2px", "backgroundColor":"white", "color":"black" }}, ["(QuestionnaireStep) " + this.props.question]),
      ])
    )
  }
});

// export default QuestionnaireStep;