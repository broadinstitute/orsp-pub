import { Component, Fragment } from 'react';
import { WizardStep } from '../components/WizardStep';
import { hh, h, p} from 'react-hyperscript-helpers';
import { InputFieldFile } from '../components/InputFieldFile';

export const NewProjectDocuments = hh(class NewProjectDocuments extends Component {

  state = {};
  
  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  setFilesToUpload = (key) => (e) => {
    let filesBundle = {};
    let file = e.target.files[0];
    filesBundle.fileKey = key;
    filesBundle.fileData = file;
    this.props.fileHandler(filesBundle);
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    if (this.props.files !== null ) {

    }
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
            InputFieldFile({ label: rd.label, callback: this.setFilesToUpload(rd.fileKey) })
          ])
        })
      ])
    )
  }
});

// export default NewProjectDocuments;