import { Component, React, Fragment } from 'react';
import { hh, div, h, button, h1 } from 'react-hyperscript-helpers';

import { WizardStep } from '../components/WizardStep';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { QuestionnaireWorkflow } from '../components/QuestionnaireWorkflow';
import { InputYesNo } from '../components/InputYesNo';
import { Funding } from '../components/Funding';
import { Btn } from '../components/Btn';

const options = [
  { value: 'veronica', label: 'Veronica' },
  { value: 'nadya', label: 'Nadya' },
  { value: 'leo', label: 'Leonardo' }
]
const fundingOptions = [
  { value: 'federal_prime', label: 'Federal Prime' },
  { value: 'internal_broad', label: 'Internal Broad' }
]

export const NewProjectGeneralData = hh(class NewProjectGeneralData extends Component {

  constructor(props) {
    super(props);
    // this.state = {
    //   fundings: [{ source: '', sponsor: '', identifier: '' }]
    // };
    this.addFundings = this.addFundings.bind(this);
    this.removeFundings = this.removeFundings.bind(this);
  }

  state = {
    fundings: [{ source: '', sponsor: '', identifier: '' }]
  };
  handler = () => {
    // this.setState({
    //   determination: determination
    // }, () => {
    //   console.log("project determination ", determination);
    // });
  }
  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  addFundings() {
    this.setState(prev => {
      let fundings = prev.fundings;
      fundings.push({ source: '', sponsor: '', identifier: '' });
      prev.fundings = fundings;
      return prev;
    });
  }
  removeFundings = (e) => (Index) => {
    this.setState(prev => {
      let fundings = prev.fundings;
      fundings.splice(Index, 1);
      prev.fundings = fundings;
      return prev;
    });
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    return (
      WizardStep({ title: this.props.title, step: 0, currentStep: this.props.currentStep }, [
        Panel({ title: "Requestor Information (person filling the form)" }, [
          InputFieldText({ label: "Requestor Name" }),
          InputFieldText({ label: "Requesto Email Address" })
        ]),
        Panel({ title: "Principal Investigator (if applicable)" }, [
          InputFieldSelect({ options: options, label: "Broad PI" }),
          InputFieldText({ label: "Broad Project Manager" })
        ]),
        Panel({ title: "Funding" }, [
          Btn({ action: { label: "++", handler: this.addFundings }, disabled: false }),
          this.state.fundings.map((rd, Index) => {
            return h(Fragment, { key: Index }, [
              Funding({
                id: Index,
                options: fundingOptions,
                source: this.state.fundings[Index].source,
                sponsor: this.state.fundings[Index].sponsor,
                identifier: this.state.fundings[Index].identifier,
                sourceLabel: Index === 0 ? "Funding Source" : "",
                sponsorLabel: Index === 0 ? "Prime Sponsor Name" : "",
                identifierLabel: Index === 0 ? "Award Number/Identifier" : ""
              }),
              Btn({ action: { label: "--", handler:  this.removeFundings(Index) }, disabled: false }),
            ]);
          })
        ]),
        Panel({ title: "Project Summary" }, [
          InputFieldTextArea({ label: "Describe Broad study activities * (briefly, in 1-2 paragraphs, with attention to wheter or not protected health information will be accessed, future data sharing plans, and commercial or academic sample/data sources. For commercially purchased products, please cite product URL.)" }),
          InputFieldSelect({ options: options, label: "Individuals who require access to this project record" }),
          InputFieldText({ label: "Tittle of project/protocol *" }),
          InputFieldText({ label: "Protocol # at Broad IRB of record (If applicable/available)" }),
          InputYesNo({ label: "Is the Broad Institute's Office of Research Subject Protection administratively managing this project, i.e. responsible for oversight and submissions? *" }),
        ]),
      ])
    )
  }
});

// export default NewProjectGeneralData;