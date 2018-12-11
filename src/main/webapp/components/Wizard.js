import { Component, Fragment } from 'react';
import { div, hh, h2, h, button, h1 } from 'react-hyperscript-helpers';

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
    this.setState(prev => {
      prev.currentStepIndex = prev.currentStepIndex === this.props.children.length - 1 ? 0 : prev.currentStepIndex + 1;
      return prev;
    }, () => {
      this.props.stepChanged(this.state.currentStepIndex);
    })
  }

  goStep = (n) => (e) => {
    console.log(n);
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
      return h1({},["Something went wrong."]);
    }

    const { currentStepIndex } = this.state;

    return (
      div({ style: { "border": "solid 1px black", "borderRadius": "4px" } }, [
        div({ style: { "margin": "3px", "padding": "2px", "backgroundColor": "#aabbcc" } }, [h2({}, [this.props.title + " (wizard)"])]),
        div({}, [
          this.props.children.map((child, idx) => {
            return h(Fragment, { key: idx }, [
              div({
                style: { "margin": "4px", "padding": "4px", "borderRadius": "3px", "border": "1px solid gray", "display": "inline",
                 "cursor":"pointer", "fontWeight": idx === currentStepIndex ? 'bold' : 'normal' },
                onClick: this.goStep(idx)
              }, [child.props.title])
            ])
          })
        ]),
        this.props.children,
        button({ className: "btn btn-primary", style: { "margin": "2px" }, onClick: this.prevStep }, ["Previous Step"]),
        button({ className: "btn btn-default", style: { "margin": "2px" }, onClick: this.nextStep }, ["Next Step"]),
      ])
    );
  }
});

// export default Wizard;
