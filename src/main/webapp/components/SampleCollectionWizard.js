import { Component, Fragment } from 'react';
import { div, hh, h3, h, button, h1, p } from 'react-hyperscript-helpers';
import { SecurityReview } from "./SecurityReview";
import { IntCohortsReview } from "./IntCohortsReview";
import { Mta } from "./Mta";
import { isEmpty } from "../util/Utils";
import { Documents } from "./Documents";


export const SampleCollectionWizard = hh(class SampleCollectionWizard extends Component {
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

  goStep = (n) => (e) => {
    e.preventDefault();
    this.setState(prev => {
      prev.currentStepIndex = n;
      return prev;
    })
  };

  parseIntCohorts = (intCohorts) => {
    let parsedIntCohorts = {};
    if (!isEmpty(intCohorts)) {
      JSON.parse(intCohorts).map(element => {
        parsedIntCohorts[element.name] = element.value
      });
    }
    return parsedIntCohorts
  };

  render() {
    const { currentStepIndex } = this.state;

    return (
      div({}, [
        div({ className: "linkTab" }, [
          div({ className: "linkTabHeader" }, [
            div({ className: "tab " + (currentStepIndex === 0 ? "active" : ""), onClick: this.goStep(0)}, ["International Cohorts"]),
            div({ className: "tab " + (currentStepIndex === 1 ? "active" : ""), onClick: this.goStep(1)}, ["Security"]),
            div({ className: "tab "  + (currentStepIndex === 2 ? "active" : ""), onClick: this.goStep(2)}, ["MTA"]),
            div({ className: "tab "  + (currentStepIndex === 3 ? "active" : ""), onClick: this.goStep(3)}, ["Documents"])
          ]),
          div({ className: "linkTabContent" }, [
            IntCohortsReview({
              future: this.parseIntCohorts(this.props.sample.internationalCohorts),
              currentStep: currentStepIndex,
              determination: this.state.determination,
              handler: () => {},
              step: 0,
              sample : this.props.sample
            }),
            SecurityReview({
              currentStep: currentStepIndex,
              step: 1,
              sample : this.props.sample
            }),
            Mta({
              currentStep: currentStepIndex,
              step: 2,
              sample: this.props.sample
            })
          ]),
        ])
      ])
    )
  }
});
