import { Component, Fragment } from 'react';
import { WizardStep } from '../components/WizardStep';
import { hh, h, h1 } from 'react-hyperscript-helpers';
import { InputFieldFile } from '../components/InputFieldFile';

export const NewConsentGroupDocuments = hh(class NewConsentGroupDocuments extends Component {

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

  obtainFile(fileKey) {
    return this.props.files.find(file => file.fileKey === fileKey)
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    if (this.props.files !== null) {

    }
    let requiredDocuments = [];

    requiredDocuments.push({ fileKey: 'Consent Document', label: "Upload the Consent Document for this Consent Group here:" });
    requiredDocuments.push({ fileKey: 'IRB approval', label: "Upload local IRB approval docuemnt (required for DFCO & MIT IRBs only):" });
    requiredDocuments.push({ fileKey: 'Sample Providers Permission', label: "Upload Sample Provider's Permission to add cohort to this Broad project (DCI IRB only. Optional):" });
    requiredDocuments.push({ fileKey: 'Data Use Letter', label: "Upload Data Use Letter her (optional):" });

    return (
      WizardStep({ title: this.props.title, step: 1, currentStep: this.props.currentStep }, [
        requiredDocuments.map((rd, Index) => {
          return h(Fragment, { key: Index }, [
            InputFieldFile({ label: rd.label, callback: this.setFilesToUpload(rd.fileKey), nameFiles: this.obtainFile(rd.fileKey) }),
          ])
        })
      ])
    )
  }
});

// export default NewProjectDocuments;