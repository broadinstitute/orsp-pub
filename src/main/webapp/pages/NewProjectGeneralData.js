import { Component, React, Fragment } from 'react';
import { hh, div, h, button, h1 } from 'react-hyperscript-helpers';

import { WizardStep } from '../components/WizardStep';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { QuestionnaireWorkflow } from '../components/QuestionnaireWorkflow';
import { InputYesNo } from '../components/InputYesNo';
import { Fundings } from '../components/Fundings';
import { MultiSelect } from '../components/MultiSelect';
import { Btn } from '../components/Btn';
import { Search } from '../util/ajax';

const options = [
  { value: 'veronica', label: 'Veronica' },
  { value: 'nadya', label: 'Nadya' },
  { value: 'leo', label: 'Leonardo' }
]

export const NewProjectGeneralData = hh(class NewProjectGeneralData extends Component {

  constructor(props) {
    console.log("Props general data: **** ", props);
    super(props);
    this.loadUsersOptions = this.loadUsersOptions.bind(this);
    this.state = {
      formData: {
        requestorName: this.props.user !== undefined ? this.props.user.name : '',
        requestorEmail: this.props.user !== undefined ? this.props.user.email.replace("&#64;", "@") : '',
        projectManager: '',
        piName: '',
        primeSponsorName: '',
        awardId: '',
        studyDescription: '',
        pTitle: '',
        irbProtocolId: '',
        subjectProtection: '',
        fundings: [{ source: '', sponsor: '', identifier: '' }],
        collaborators: []
      },
    };
  }

  handleUpdateFundings = (updated) => {
    this.setState(prev => {
      prev.formData.fundings = updated;
      return prev;
    }, () => this.props.updateForm(this.state.formData))
  }

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => this.props.updateForm(this.state.formData));
  };

  handleRadioChange = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }

    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => this.props.updateForm(this.state.formData));
  };

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  loadUsersOptions(query, callback) {
    // let options = [
    //   { key: 'vero', value: 'Vero', label: 'Veronica Vicario' },
    //   { key: 'leo', value: 'Leo', label: 'Leonardo Forconesi' },
    //   { key: 'nadya', value: 'Nadya', label: 'Nadya Lopez' },
    // ]
    // callback(options);
    Search.getMatchingUsers(this.props.searchUsersURL, query)
      .then(response => {
        let options = response.data.map(function (item) {
          return {
            key: item.id,
            value: item.value,
            label: item.label
          };
        });
        callback(options);
      })
  };

  handleProjectCollaboratorChange = (data, action) => {
    this.setState(prev => {
      prev.formData.collaborators = data;
      return prev;
    }, () => this.props.updateForm(this.state.formData));
  };

  handlePIChange = (data, action) => {
    this.setState(prev => {
      prev.formData.piName = data;
      return prev;
    }, () => this.props.updateForm(this.state.formData));
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    return (
      WizardStep({ title: this.props.title, step: 0, currentStep: this.props.currentStep }, [
        Panel({ title: "Requestor Information ", aclaration: "(person filling the form)", tooltipLabel: "?" }, [
          InputFieldText({
            id: "inputRequestorName",
            name: "requestorName",
            label: "Requestor Name",
            value: this.state.formData.requestorName,
            disabled: true,
            required: true,
            onChange: this.handleInputChange
          }),
          InputFieldText({
            id: "inputRequestorEmail",
            name: "requestorEmail",
            label: "Requestor Email Address",
            value: this.props.user.email.replace('&#64;', '@'),
            disabled: true,
            required: true,
            onChange: this.handleInputChange
          })
        ]),

        Panel({ title: "Principal Investigator ", aclaration: "(if applicable)" }, [
          MultiSelect({
            id: "pi_select",
            label: "Broad PI",
            isDisabled: false,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handlePIChange,
            value: this.state.formData.piName,
            placeholder: "Select...",
            isMulti: false
          }),

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

        Panel({ title: "Funding*", tooltipLabel: "?" }, [
          Fundings({
            fundings: this.state.formData.fundings,
            updateFundings: this.handleUpdateFundings
          }),
        ]),

        Panel({ title: "Project Summary" }, [
          InputFieldTextArea({
            id: "inputStudyActivitiesDescription",
            name: "studyDescription",
            label: "Describe Broad study activities* ",
            aclaration: "(briefly, in 1-2 paragraphs, with attention to wheter or not protected health information will be accessed, future data sharing plans, and commercial or academic sample/data sources. For commercially purchased products, please cite product URL.)",
            value: this.state.formData.studyDescription,
            disabled: false,
            required: false,
            onChange: this.handleInputChange
          }),
          MultiSelect({
            id: "collaborator_select",
            label: "Individuals who require access to this project record",
            isDisabled: false,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handleProjectCollaboratorChange,
            value: this.state.formData.collaborators,
            placeholder: "Please select one or more individuals",
            isMulti: true
          }),
          InputFieldText({
            id: "inputPTitle",
            name: "pTitle",
            label: "Title of project/protocol*",
            value: this.state.formData.pTitle,
            disabled: false,
            required: false,
            onChange: this.handleInputChange
          }),
          InputFieldText({
            id: "inputIrbProtocolId",
            name: "irbProtocolId",
            label: "Protocol # at Broad IRB-of-record ",
            aclaration: "(if applicable/available)",
            value: this.state.formData.irbProtocolId,
            disabled: false,
            required: false,
            onChange: this.handleInputChange
          }),
          InputYesNo({
            id: "radioSubjectProtection",
            name: "subjectProtection",
            label: "Is the Broad Institute's Office of Research Subject Protection administratively managing this project, ",
            aclaration: "i.e. responsible for oversight and submissions? *",
            value: this.state.formData.subjectProtection,
            onChange: this.handleRadioChange,
            required: false
          })
        ])
      ])
    )
  }
});