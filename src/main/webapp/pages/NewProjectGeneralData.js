import { Component, React } from 'react';
import { hh, div, button, h1 } from 'react-hyperscript-helpers';

import { WizardStep } from '../components/WizardStep';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { QuestionnaireWorkflow } from '../components/QuestionnaireWorkflow';
import { InputYesNo } from '../components/InputYesNo';
import ReactDOM from 'react-dom';


// import { TextEditor } from '../components/TextEditor';


const options = [
  { value: 'veronica', label: 'Veronica' },
  { value: 'nadya', label: 'Nadya' },
  { value: 'leo', label: 'Leonardo' }
]
const foundingOptions = [
  { value: 'federal_prime', label: 'Federal Prime' },
  { value: 'internal_broad', label: 'Internal Broad' }
]

export const NewProjectGeneralData = hh(class NewProjectGeneralData extends Component {

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
        subjectProtection: ''
    }
  };

  handler = () => {
    // this.setState({
    //   determination: determination
    // }, () => {
    //   console.log("project determination ", determination);
    // });
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
  console.log("RADIO ", e);
//    if (value === 'true') {
//      value = true;
//    } else if (value === 'false') {
//      value = false;
//    }
//    this.setState(prev => {
//      if ( value === false ) {
//        prev.formData.subjectProtection = '';
//      }
//      prev.formData[field] = value;
//      return prev;
//    }/*, () => this.checkValidations()*/);
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
   
  }
  
  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({},["Something went wrong."]);
    }

    return (
      WizardStep({ title: this.props.title, step: 0, currentStep: this.props.currentStep}, [
        Panel({ title: "Requestor Information (person filling the form)" }, [
          InputFieldText({ id: "inputRequestorName",
                           name: "requestorName",
                           label: "Requestor Name",
                           value: this.state.formData.requestorName,
                           disabled: false,
                           required: true,
                           onChange: this.handleInputChange }),
          InputFieldText({ id: "inputRequestorEmail",
                           name: "requestorEmail",
                           label: "Requestor Email Address",
                           value: this.state.formData.requestorEmail,
                           disabled: false,
                           required: true,
                           onChange: this.handleInputChange })
        ]),
        Panel({ title: "Principal Investigator (if applicable)" }, [
          InputFieldSelect({options: options, label: "Broad PI"}),
          InputFieldText({ id: "inputProjectManager",
                           name: "projectManager",
                           label: "Broad Project Manager",
                           value: this.state.formData.projectManager,
                           disabled: false,
                           required: false,
                           onChange: this.handleInputChange })
        ]),
        Panel({ title: "Funding" }, [
          InputFieldSelect({options: foundingOptions, label: "Founding Source"}),
          InputFieldText({ label: "Prime Sponsor Name" }),
          InputFieldText({ label: "Award Number / Identifier" }),
          // div({ className: "funding" }, [
          //   button({ id: "btn_action", className: "col-lg-3 col-md-3 col-sm-4 col-xs-6 btn " + this.props.color + "-background",
          //     onClick: this.addFundings }, ["+"]),
          //     div({id:"fundings"})
          // ]),
        ]),
        Panel({ title: "Project Summary" }, [
          // TextEditor({}),
           InputFieldTextArea({ id: "inputStudyActivitiesDescription",
                                name: "studyDescription",
                                label: "Describe Broad study activities * (briefly, in 1-2 paragraphs, with attention to wheter or not protected health information will be accessed, future data sharing plans, and commercial or academic sample/data sources. For commercially purchased products, please cite product URL.)",
                                value: this.state.formData.studyDescription,
                                disabled: false,
                                required: false,
                                onChange: this.handleInputChange }),
           InputFieldSelect({options: options, label: "Individuals who require access to this project record"}),
           InputFieldText({ id: "inputPTitle",
                            name: "pTitle",
                            label: "Tittle of project/protocol *",
                            value: this.state.formData.pTitle,
                            disabled: false,
                            required: false,
                            onChange: this.handleInputChange }),
           InputFieldText({ id: "inputIrbProtocolId",
                            name: "irbProtocolId",
                            label: "Protocol # at Broad IRB of record (If applicable/available)",
                            value: this.state.formData.irbProtocolId,
                            disabled: false,
                            required: false,
                            onChange: this.handleInputChange }),
           InputYesNo({ id: "radioSubjectProtection",
                        name: "subjectProtection",
                        label: "Is the Broad Institute's Office of Research Subject Protection administratively managing this project, i.e. responsible for oversight and submissions? *",
                        value: this.state.formData.subjectProtection,
                        onChange: this.handleRadioChange,
                        required: false }),
        ]),
      ])
    )
  }
});

// export default NewProjectGeneralData;