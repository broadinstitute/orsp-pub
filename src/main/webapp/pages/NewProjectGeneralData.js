import { Component } from 'react';
import { hh } from 'react-hyperscript-helpers';

import { WizardStep } from '../components/WizardStep';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';

export const NewProjectGeneralData = hh(class NewProjectGeneralData extends Component {

  state = {};
  
  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }
  
  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

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