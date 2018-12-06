import { Component } from 'react';
import { div, hh, h3 } from 'react-hyperscript-helpers';

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
      return <h1>Something went wrong.</h1>;
    }

    let view = null;

    const { step, currentStep } = this.props;

    console.log(step, currentStep);

    if (currentStep === step) {

      view = div({ style: { "margin": "2px", "padding": "2px", "border": "solid 1px gray" } }, [
        div({ style: { "margin": "2px", "padding": "2px", "backgroundColor": "gray", "color": "black" } }, [
          h3({}, [this.props.title + " (wizardStep)"])
        ]),
        this.props.children
      ]);
    }
    return view;
  }
});

// export default WizardStep;