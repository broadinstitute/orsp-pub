import { Component, Fragment } from 'react';
import { div, hh, h2, h, button, h1,  p } from 'react-hyperscript-helpers';
import './Wizard.css';

export const Wizard = hh(class Wizard extends Component {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      currentStepIndex: 0,
      showError: false
    };
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
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
    if (this.props.isValid(this.state.currentStepIndex, null)) {
      this.setState(prev => {
        prev.showError = true;
        prev.currentStepIndex = prev.currentStepIndex === this.props.children.length - 1 ? 0 : prev.currentStepIndex + 1;
        return prev;
      }, () => {
        this.props.stepChanged(this.state.currentStepIndex);
      })
    }
  }

  goStep = (n) => (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.currentStepIndex = n;
      return prev;
    }, () => {
      this.props.stepChanged(this.state.currentStepIndex);
    })
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    const { currentStepIndex } = this.state;

    return (
      div({ className: "wizardWrapper" }, [
        h1({ className: "wizardTitle" }, [this.props.title]),
        div({ className: "wizardContainer" }, [
          div({ className: "tabContainer" }, [
            this.props.children.map((child, idx) => {
              return h(Fragment, { key: idx }, [
                div({ className: "tabStep " + (idx === currentStepIndex ? "active" : ""), onClick: this.goStep(idx) }, [child.props.title])
              ])
            })
          ]),
          this.props.children,
          div({ className: "buttonContainer wizardButtonContainer" }, [
            button({ className: "btn buttonSecondary floatLeft", onClick: this.prevStep }, ["Previous Step"]),
            button({ className: "btn buttonPrimary floatRight", onClick: this.nextStep }, ["Next Step"]),
          ])
        ])
      ])
    );
  }
});
