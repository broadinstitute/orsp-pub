import { Component, Fragment } from 'react';
import { WizardStep } from '../components/WizardStep';
import { hh, h } from 'react-hyperscript-helpers';
import { InputFieldFile } from '../components/InputFieldFile';

export const NewProjectDocuments = hh(class NewProjectDocuments extends Component {

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  render() {
    let requiredDocuments = [];

    switch (this.props.projectType) {
      case 'IRB':
        requiredDocuments.push({ fileKey: 'IRB Approval Doc', label: "Upload the IRB Approval for this Project here" });
        requiredDocuments.push({ fileKey: 'IRB Applicationl Doc', label: "Upload the IRB Application for this Project here" });
        break;

      case 'NE':
        requiredDocuments.push({ fileKey: 'NE Approval Doc', label: "Upload the NE Approval for this Project here" });
        requiredDocuments.push({ fileKey: 'NE Applicationl Doc', label: "Upload the NE Application for this Project here" });
        requiredDocuments.push({ fileKey: 'NE Consent Doc', label: "Upload the Consent Document I for this Project here (if applicable)" });
        break;

      case 'NHSR':
        requiredDocuments.push({ fileKey: 'NHSR Applicationl Doc', label: "Upload the NHSR Application for this Project here" });
        break;

      default:
        break;
    }

    return (
      WizardStep({ title: this.props.title, step: 2, currentStep: this.props.currentStep }, [
        requiredDocuments.map((rd, Index) => {
          return h(Fragment, { key: Index }, [
            InputFieldFile({ label: rd.label })
          ])
        })
      ])
    )
  }
});

// export default NewProjectDocuments;