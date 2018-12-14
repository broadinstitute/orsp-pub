import { Component } from 'react';
import { div, hh, h1, h2, small } from 'react-hyperscript-helpers';
import './Wizard.css';

export const WizardStep = hh(class WizardStep extends Component {

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

    let view = null;

    const { step, currentStep } = this.props;

    console.log(step, currentStep);

    if (currentStep === step) {
      view = div({ className: "wizardStepContainer" }, [
        h2({ className: "wizardStepTitle" }, [
          small({}, ["Step " + (step + 1)]),
          this.props.title
        ]),
        this.props.children
      ]);
    }
    return view;
  }
});

// export default WizardStep;