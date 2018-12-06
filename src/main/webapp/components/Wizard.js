import { Component, Fragment } from 'react';
import { div, hh, h2, h, button } from 'react-hyperscript-helpers';

export const Wizard = hh(class Wizard extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      currentStepIndex: 0,
    };
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  prevStep = (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.currentStepIndex = prev.currentStepIndex === 0 ? this.props.children.length - 1 : prev.currentStepIndex - 1;
      return prev;
    }, () => {
      this.props.stepChanged(this.state.currentStepIndex);
    })
  }

  nextStep = (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.currentStepIndex = prev.currentStepIndex === this.props.children.length - 1 ? 0 : prev.currentStepIndex + 1;
      return prev;
    }, () => {
      this.props.stepChanged(this.state.currentStepIndex);
    })
  }

  goStep = (n) => {
    // this.setState(prev => {
    //   prev.currentStepIndex = n;
    //   return prev;
    // }, () => {
    //   this.props.stepChanged(this.state.currentStepIndex);
    // })
  }

  render() {

    return (
      div({ style: { "border": "solid 3px black" } }, [
        div({ style: { "margin": "3px", "padding": "2px", "backgroundColor": "#aabbcc" } }, [h2({}, ["(wizard) " + this.props.title])]),
        div({  }, [
          this.props.children.map((child, idx) => {
            console.log(child.props.title);
            return h(Fragment, { key: idx }, [
              div({ style: { "margin":"4px", "padding":"4px", "borderRadius":"3px", "border": "1px solid gray", "display":"inline" },
            onClick: this.goStep(idx) }, [child.props.title])
            ])
          })
        ]),
        this.props.children,
        button({ onClick: this.prevStep }, ["Previous Step"]),
        button({ onClick: this.nextStep }, ["Next Step"]),
      ])
    );
  }
});

// export default Wizard;
