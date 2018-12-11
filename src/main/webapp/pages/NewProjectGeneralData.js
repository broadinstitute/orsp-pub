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
    formData: {
      requestorName: '',
      requestorEmail: '',
      projectManager: '',
      primeSponsorName: '',
      awardId: '',
      studyDescription: '',
      pTitle: '',
      irbProtocolId: '',
      subjectProtection: '',
      fundings: [{ source: '', sponsor: '', identifier: '' }]
    }
  };

  handler = () => {

  }

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => console.log("STATE: ", this.state)/*this.checkValidations()*/);
  };

  handleRadioChange = (e) => {
  };

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
      let fundings = prev.formData.fundings;
      fundings.push({ source: '', sponsor: '', identifier: '' });
      prev.formData.fundings = fundings;
      return prev;
    });
  }

  removeFundings = (e) => (Index) => {
    if (this.state.formData.fundings.length > 1) {
      this.setState(prev => {
        let fundings = prev.formData.fundings;
        fundings.splice(Index, 1);
        prev.formData.fundings = fundings;
        return prev;
      });
    }
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    return (
      WizardStep({ title: this.props.title, step: 0, currentStep: this.props.currentStep }, [
        Panel({ title: "Requestor Information (person filling the form)" }, [
          InputFieldText({
            id: "inputRequestorName",
            name: "requestorName",
            label: "Requestor Name",
            value: this.props.user.name,
            disabled: true,
            required: true,
            onChange: this.handleInputChange
          }),
          InputFieldText({
            id: "inputRequestorEmail",
            name: "requestorEmail",
            label: "Requestor Email Address",
            value: this.props.user.email,
            disabled: true,
            required: true,
            onChange: this.handleInputChange
          })
        ]),
        Panel({ title: "Principal Investigator (if applicable)" }, [
          InputFieldSelect({ options: options, label: "Broad PI" }),
          InputFieldText({
            id: "inputProjectManager",
            name: "projectManager",
            label: "Broad Project Manager",
            value: this.state.formData.projectManager,
            disabled: false,
            required: false,
            onChange: this.handleInputChange
          })
        ]),
        Panel({ title: "Funding" }, [
          Btn({ action: { label: "++", handler: this.addFundings }, disabled: false }),
          this.state.formData.fundings.map((rd, Index) => {
            return h(Fragment, { key: Index }, [
              Funding({
                id: Index,
                options: fundingOptions,
                source: this.state.formData.fundings[Index].source,
                sponsor: this.state.formData.fundings[Index].sponsor,
                identifier: this.state.formData.fundings[Index].identifier,
                sourceLabel: Index === 0 ? "Funding Source" : "",
                sponsorLabel: Index === 0 ? "Prime Sponsor Name" : "",
                identifierLabel: Index === 0 ? "Award Number/Identifier" : ""
              }),
              Btn({ action: { label: "--", handler: this.removeFundings(Index) }, disabled: !this.state.formData.fundings.length > 1 }),
            ]);
          })
        ]),
        Panel({ title: "Project Summary" }, [
          InputFieldTextArea({
            id: "inputStudyActivitiesDescription",
            name: "studyDescription",
            label: "Describe Broad study activities * (briefly, in 1-2 paragraphs, with attention to wheter or not protected health information will be accessed, future data sharing plans, and commercial or academic sample/data sources. For commercially purchased products, please cite product URL.)",
            value: this.state.formData.studyDescription,
            disabled: false,
            required: false,
            onChange: this.handleInputChange
          }),
          InputFieldSelect({ options: options, label: "Individuals who require access to this project record" }),
          InputFieldText({
            id: "inputPTitle",
            name: "pTitle",
            label: "Tittle of project/protocol *",
            value: this.state.formData.pTitle,
            disabled: false,
            required: false,
            onChange: this.handleInputChange
          }),
          InputFieldText({
            id: "inputIrbProtocolId",
            name: "irbProtocolId",
            label: "Protocol # at Broad IRB of record (If applicable/available)",
            value: this.state.formData.irbProtocolId,
            disabled: false,
            required: false,
            onChange: this.handleInputChange
          }),
          InputYesNo({
            id: "radioSubjectProtection",
            name: "subjectProtection",
            label: "Is the Broad Institute's Office of Research Subject Protection administratively managing this project, i.e. responsible for oversight and submissions? *",
            value: this.state.formData.subjectProtection,
            onChange: this.handleRadioChange,
            required: false
          }),
        ]),
      ])
    )
  }
});