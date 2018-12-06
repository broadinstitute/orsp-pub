import { Component } from 'react';
import { div, hh, h3 } from 'react-hyperscript-helpers';

export const WizardStep = hh(class WizardStep extends Component {

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {

    let view = null;

    const { step, currentStep } = this.props;

    console.log(step, currentStep);

    if (currentStep === step) {

      view = div({ style: { "margin": "3px", "padding": "2px", "border": "solid 2px red" } }, [
        div({ style: { "margin": "3px", "padding": "2px", "backgroundColor": "yellow", "color": "black" } }, [
          h3({}, ["(wizardStep) " + this.props.title])
        ]),
        this.props.children
      ]);
    }
    return view;
  }
});

// export default WizardStep;