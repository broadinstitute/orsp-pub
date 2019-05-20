import { Component } from 'react';
import { hh, span, div, label } from 'react-hyperscript-helpers';

export const Mta = hh(class Mta extends Component {

  stringAnswer = (current) => {
    let answer = '';
    if (current === 'true' || current === true) {
      answer = 'Yes';
    } else if (current === 'false' || current === false) {
      answer = 'No';
    } else if (current === 'uncertain') {
      answer = 'Uncertain';
    } else if (current === 'null' || current === null || isEmpty(current)) {
      answer = '--';
    }
    return answer
  };

  render() {
    if (this.props.currentStep === this.props.step) {
      return(
        div({ className: "answerWrapper" }, [
          label({}, [
            span({}, ["Has the ",
              span({ style: { 'textDecoration': 'underline' } }, ["tech transfer office "]), "of the institution providing samples/data confirmed that an Material or Data Transfer Agreement (MTA/DTA) is needed to transfer the materials/data? "]),
            span({ className: "italic normal" }, ["(PLEASE NOTE THAT ALL SAMPLES ARRIVING FROM THE DANA FARBER CANCER INSTITUTE NOW REQUIRE AN MTA)*"])
          ]),
          div({
          }, [this.stringAnswer(this.props.sample.requireMta)]),
        ])
      )
    } else {
      return ('')
    }
  }
});
