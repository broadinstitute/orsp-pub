import { Component } from 'react';
import { hh } from 'react-hyperscript-helpers';

import { WizardStep } from '../components/WizardStep';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';

export const NewProjectGeneralData = hh(class NewProjectGeneralData extends Component {

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {

    return (
      WizardStep({ title: this.props.title, step: 0, currentStep: this.props.currentStep}, [
        Panel({ title: "Requestor Information (person filling the form)" }, [
          InputFieldText({ label: "Requestor Name" }),
          InputFieldText({ label: "Requesto Email Address" })
        ]),
        Panel({ title: "Principal Investigator (if applicable)" }, []),
        Panel({ title: "Funding" }, []),
        Panel({ title: "Project Summary" }, []),
      ])
    )
  }
});

// export default NewProjectGeneralData;