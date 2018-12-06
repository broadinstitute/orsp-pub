import { Component } from 'react';
import { div, hh, h2, button } from 'react-hyperscript-helpers';

export const Wizard = hh(class Wizard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStepIndex: 0,
    };
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  prevQuestion = (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.currentStepIndex = prev.currentStepIndex === 0 ? this.props.children.length-1 : prev.currentStepIndex - 1;
      return prev;
    })
  }

  nextQuestion = (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.currentStepIndex = prev.currentStepIndex === this.props.children.length-1 ? 0 : prev.currentStepIndex + 1;
      return prev;
    })
  }

  render() {

    return (
      div({ style: { "border": "solid 3px black" } }, [
        div({ style: { "margin": "3px", "padding": "2px", "backgroundColor": "#aabbcc" } }, [h2({}, ["(wizard) " + this.props.title])]),
        this.props.children,
        button({ onClick: this.prevStep }, ["Previous Step"]),
        button({ onClick: this.nextStep }, ["Next Step"]),
      ])
    );
  }
});

// export default Wizard;
