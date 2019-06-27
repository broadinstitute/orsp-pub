import { Component, React } from 'react';
import { hh, span, a, div, label } from 'react-hyperscript-helpers';
import { isEmpty } from "../util/Utils";
import './QuestionnaireWorkflow.css';

const sharingTypes = {
    open : "An open/unrestricted repository (such as GEO)",
    controlled: "A controlled-access repository (such as dbGaP or DUOS)",
    both: "Both a controlled-access and an open-access repository",
    noDataSharing: "No data sharing via a repository (data returned to research collaborator only)",
    undetermined: "Data sharing plan not yet determined"
}
export const SecurityReview = hh(class SecurityReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0,
    };
  }

  stringAnswer = (current) => {
    let answer = '';
    if (current === 'true' || current === true) {
      answer = 'Yes';
    } else if (current === 'uncertain') {
      answer = 'Uncertain';
    } else if (current === 'false' || current === false) {
      answer = 'No';
    } else if (current === 'null' || current === null || isEmpty(current)) {
      answer = '--';
    }
    return answer
  };

  sharingTypeAnswer = (type) => {
    return sharingTypes[type];
  };

  render() {
    const {
      textSharingType = '',
      sharingType = '',
      textCompliance = '',
      compliance = '',
      pii = ''
    } = this.props.sample;

    if (this.props.currentStep === this.props.step) {
      return(
        div({}, [
          div({ className: "answerWrapper" }, [
            label({}, ["As part of this project, will Broad receive either personally identifiable information (PII) or protected health information (PHI)?* ",
              span({ className: "normal" }, ["For a list of what constitutes PII and PHI, ", a({ href: "https://intranet.broadinstitute.org/faq/storing-and-managing-phi", className: "link", target: "_blank" }, ["visit this link"]), "."])]),
            div({
            }, [this.stringAnswer(pii)]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPAA, etc.)"]), "?*"]),
            div({
            }, [this.stringAnswer(compliance)]),
          ]),
          div({ className: "answerWrapper" }, [
            label({}, ["Please specify which regulations must be adhered to below:"]),
            div({
            }, [isEmpty(textCompliance) ? "--" : textCompliance]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Will the individual level data collected or generated as part of this project be shared via: *"]),
            div({}, [this.sharingTypeAnswer(sharingType)]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Name of Database(s): "]),
            div({
            }, [isEmpty(textSharingType) ? "--" : textSharingType]),
          ]),
        ])
      )
    } else {
      return ("")
    }
  }
});
