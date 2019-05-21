import { Component } from 'react';
import { hh, h1, span, div, label, h3, button, a } from 'react-hyperscript-helpers';
import { isEmpty } from "../util/Utils";
import get from 'lodash/get';

export const IntCohortsReview = hh(class IntCohortsReview extends Component {

  stringAnswer = (current) => {
    let answer = '';
    if (current === 'true' || current === true) {
      answer = 'Yes';
    } else if (current === 'false' || current === false) {
      answer = 'No'
    } else if (current === 'null' || current === null || isEmpty(current)) {
      answer = '--';
    }
    return answer
  };

  handler = (answer) => {
    this.setState(prev => {
      prev.questions = answer.questions;
      return prev;
    }, () => this.props.handler(answer));
  };

  render() {
    const {
      individualDataSourced : futureIndividualDataSourced = '',
      isLinkMaintained : futureIsLinkMaintained = '',
      areSamplesComingFromEEAA : futureAreSamplesComingFromEEAA = '',
      isCollaboratorProvidingGoodService: futureIsCollaboratorProvidingGoodService = '',
      isConsentUnambiguous: futureIsConsentUnambiguous = ''
    } = this.props.future;
    const futureProjectFeeForService = this.props.origin === 'project' ? get(this.props.future, 'feeForServiceWork', '') : get(this.props.future, 'feeForService', '');

      if (this.props.currentStep === this.props.step) {
      return(
        div({}, [
          div({ className: "answerWrapper" }, [
            label({}, ["Are samples or individual-level data sourced from a country in the European Economic Area? ",
              a({ href:"https://www.imf.org/external/pubs/ft/fandd/2014/03/europeaneconomicarea.htm", target: "_blank", className: "normal" }, "(List of member states of European Economic Area)")]),
            div({
            }, [this.stringAnswer(futureIndividualDataSourced)]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Is a link maintained ", span({ className: "normal" }, ["(by anyone) "]), "between samples/data being sent to the Broad and the identities of living EEA subjects?"]),

            div({
            }, [this.stringAnswer(futureIsLinkMaintained)]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Is the Broad work being performed as fee-for-service?"]),
            div({
            }, [this.stringAnswer(futureProjectFeeForService)]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Are samples/data coming directly to the Broad from the EEA?"]),
            div({
            }, [this.stringAnswer(futureAreSamplesComingFromEEAA)]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Is Broad or the EEA collaborator providing goods/services ", span({ className: "normal" }, ["(including routine return of research results) "]), "to EEA subjects, or engaging in ongoing monitoring of them", span({ className: "normal" }, ["(e.g. via use of a FitBit)?"])]),
            div({
            }, [this.stringAnswer(futureIsCollaboratorProvidingGoodService)]),
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["GDPR does not apply, but a legal basis for transfer must be established. Is consent unambiguous ", span({ className: "normal" }, ["(identifies transfer to the US, and risks associated with less stringent data protections here)?"])]),
            div({
            }, [this.stringAnswer(futureIsConsentUnambiguous)]),
          ])
        ])
      )
    } else {
      return ("")
    }
  }
});
