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

  state = {};

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
    console.log("test vero************");
  //   ReactDOM.render(
  //     <NewProject />,
  //     document.getElementById('pages')
  // );
    ReactDOM.render(InputFieldText({ label: "Tittle of project/protocol *" }), document.getElementById('fundings'));
    
  }
  
  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({},["Something went wrong."]);
    }

    return (
      WizardStep({ title: this.props.title, step: 0, currentStep: this.props.currentStep}, [
        Panel({ title: "Requestor Information (person filling the form)" }, [
          InputFieldText({ label: "Requestor Name" }),
          InputFieldText({ label: "Requesto Email Address" })
        ]),
        Panel({ title: "Principal Investigator (if applicable)" }, [
          InputFieldSelect({options: options, label: "Broad PI"}),
          InputFieldText({ label: "Broad Project Manager" })
        ]),
        Panel({ title: "Funding" }, [
          InputFieldSelect({options: foundingOptions, label: "Founding Source"}),
          InputFieldText({ label: "Prime Sponsor Name" }),
          InputFieldText({ label: "Award Number / Identifier" }),
          div({ className: "funding" }, [
            button({ id: "btn_action", className: "col-lg-3 col-md-3 col-sm-4 col-xs-6 btn " + this.props.color + "-background",
              onClick: this.addFundings }, ["+v"]),
              div({id:"fundings", className: "fundings" }, [                               
              ]),
          ]),
        ]),
        Panel({ title: "Project Summary" }, [
          // TextEditor({}),
           InputFieldTextArea({ label: "Describe Broad study activities * (briefly, in 1-2 paragraphs, with attention to wheter or not protected health information will be accessed, future data sharing plans, and commercial or academic sample/data sources. For commercially purchased products, please cite product URL.)"}),
           InputFieldSelect({options: options, label: "Individuals who require access to this project record"}),
           InputFieldText({ label: "Tittle of project/protocol *" }),
           InputFieldText({ label: "Protocol # at Broad IRB of record (If applicable/available)" }),
           InputYesNo({ label: "Is the Broad Institute's Office of Research Subject Protection administratively managing this project, i.e. responsible for oversight and submissions? *" }),
        ]),
      ])
    )
  }
});

// export default NewProjectGeneralData;