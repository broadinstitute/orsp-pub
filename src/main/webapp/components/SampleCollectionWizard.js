import { Component, Fragment } from 'react';
import { div, hh, h3, h, button, h1, p } from 'react-hyperscript-helpers';
import { SecurityReview } from "./SecurityReview";
import { IntCohortsReview } from "./IntCohortsReview";
import { Mta } from "./Mta";
import { isEmpty } from "../util/Utils";
import { Documents } from "./Documents";
import _ from 'lodash';
import { KeyDocumentsEnum } from "../util/KeyDocuments";
import { Table } from "./Table";

const headers =
  [
    { name: 'Document Type', value: 'fileKey' },
    { name: 'File Name', value: 'fileName' }
  ];

export const SampleCollectionWizard = hh(class SampleCollectionWizard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentStepIndex: 0,
    };
    this.findDocuments = this.findDocuments.bind(this);
  }

  componentDidMount() {
    if (isEmpty(this.props.sample.id)) {
      this.findDocuments(this.props.sample.id, this.props.documents)
    }
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
  findDocuments(id, documents) {

      this.setState({documents: _.find(documents, document => document.consentCollectionLinkId === id)})

  }

  parseIntCohorts = (intCohorts) => {
    let parsedIntCohorts = {};
    if (!isEmpty(intCohorts)) {
      JSON.parse(intCohorts).map(element => {
        parsedIntCohorts[element.name] = element.value
      });
    }
    return parsedIntCohorts
  };

  parseDocuments = (documents) => {
    let parsedDocuments = {};
    if (!isEmpty(documents)) {
      JSON.parse(documents).map(element => {
        parsedDocuments[element.name] = element.value
      });
    }
    return parsedDocuments
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
            }),
            // Table({
            //   headers: headers,
            //   data: this.parseDocuments(this.props.documents),
            //   sizePerPage: 10,
            //   paginationSize: 10,
            //   handleDialogConfirm: () => {},
            //   downloadDocumentUrl: () => {},
            //   remove: () => {},
            //   reviewFlow: false
            // })
          ])
        ])
      ])
    )
  }
});
