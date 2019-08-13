import { Component } from 'react';
import { div, hh, label, span } from 'react-hyperscript-helpers';
import { SecurityReview } from "./SecurityReview";
import { IntCohortsReview } from "./IntCohortsReview";
import { isEmpty } from "../util/Utils";
import { Documents } from "./Documents";
import { Table } from "./Table";
import { UrlConstants } from "../util/UrlConstants";

const headers =
  [
    { name: 'Document Type', value: 'fileType' },
    { name: 'File Name', value: 'fileName' }
  ];

export const SampleCollectionWizard = hh(class SampleCollectionWizard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStepIndex: 0,
    };
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------');
    console.log(error, info);
  }

  goStep = (n) => (e) => {
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

  mtaStringAnswer = (current) => {
    let answer = '';
    if (current === 'true' || current === true) {
      answer = "Yes, the provider does require an MTA/DTA.";
    } else if (current === 'false' || current === false) {
      answer = "No, the provider does not require an MTA/DTA.";
    } else if (current === 'uncertain') {
      answer = "Not sure.";
    } else if (current === 'null' || current === null || isEmpty(current)) {
      answer = '--';
    }
    return answer
  };

  // Look for documents belonging to each corresponding sample
  parseDocuments = (documents) => {
    let parsedDocuments = [];
    documents.map(element => {
      element.filter(it => {
        if (it.consentCollectionLinkId === this.props.sample.id) {
          parsedDocuments.push(it)
        }
      });
    });
    return parsedDocuments
  };

  buildMta = (currentStepIndex) => {
    if (currentStepIndex === 2) {
      return(
        div({ className: "answerWrapper" }, [
          label({}, [
            span({}, ["Has the ",
              span({ style: { 'textDecoration': 'underline' } }, ["tech transfer office "]), "of the institution providing samples/data confirmed that an Material or Data Transfer Agreement (MTA/DTA) is needed to transfer the materials/data? "]),
            span({ className: "italic normal" }, ["(PLEASE NOTE THAT ALL SAMPLES ARRIVING FROM THE DANA FARBER CANCER INSTITUTE NOW REQUIRE AN MTA)*"])
          ]),
          div({}, [this.mtaStringAnswer(this.props.sample.requireMta)]),
        ])
      )
    } else {
      return ('')
    }
  };

  getDocumentLink = (data) => {
    return [component.serverURL, UrlConstants.getDocumentById + '?id=' + data].join("/");
  };

  buildDocumentsTable = (currentStepIndex, headers) => {
    if (currentStepIndex === 3) {
      return Table({
        headers: headers,
        data: this.parseDocuments(this.props.documents),
        sizePerPage: 10,
        paginationSize: 10,
        getDocumentLink: this.getDocumentLink,
        reviewFlow: true,
      })
    } else {
      return "";
    }
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
              step: 0,
              sample : this.props.sample
            }),
            SecurityReview({
              currentStep: currentStepIndex,
              step: 1,
              sample : this.props.sample
            }),
            this.buildMta(currentStepIndex),
            this.buildDocumentsTable(currentStepIndex, headers)
          ])
        ])
      ])
    )
  }
});
