import { Component } from 'react';
import { div, hh, h1, h2, small } from 'react-hyperscript-helpers';
import { AlertMessage } from './AlertMessage';
import './Wizard.css';

export const WizardStep = hh(class WizardStep extends Component {

  state = {
    tooltipShown: this.props.error
  };

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  tooltipBtnHandler = (e) => {
    this.setState(prev => {
      prev.tooltipShown = !prev.tooltipShown;
      return prev;
    }, () => {
    });
  };

  dismissHandler = () => {
    this.setState({
      tooltipShown: false
    });
  };

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

    const { step, currentStep, questionnaireStep } = this.props;

    if (currentStep === step) {
      view = div({ className: "wizardStepContainer" }, [
        div({ className: "row" }, [
          h2({ className: "wizardStepTitle " + (questionnaireStep !== undefined ? 'col-lg-8 col-md-7 col-sm-7 col-8' : 'col-lg-12 col-md-12 col-sm-12 col-12') }, [
            small({}, ["Step " + (step + 1)]),
            this.props.title
          ])
        ]),
        div({ className: "wizardStepContent" }, [this.props.children] ), 
        AlertMessage({
          msg: this.props.errorMessage,
          show: this.props.error
        })
      ]);
    }
    return view;
  }
});
