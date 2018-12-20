import { Component, Fragment } from 'react';
import { WizardStep } from '../components/WizardStep';
import { hh, h, h1, span } from 'react-hyperscript-helpers';
import { InputFieldFile } from '../components/InputFieldFile';
const NE = 200;
const NHSR = 300;
const IRB = 400;

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
  };

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

    switch (this.props.projectType) {
      case IRB:
        requiredDocuments.push({ fileKey: 'IRB Approval Doc', label: span({}, ["Upload the ", span({ className: "bold" }, ["IRB Approval "]), "for this Project here"]) });
        requiredDocuments.push({ fileKey: 'IRB Applicationl Doc', label: span({}, ["Upload the ", span({ className: "bold" }, ["IRB Application "]), "for this Project here"]) });
        break;

      case NE:
        requiredDocuments.push({ fileKey: 'NE Approval Doc', label: span({}, ["Upload the ", span({ className: "bold" }, ["NE Approval "]), "for this Project here"]) });
        requiredDocuments.push({ fileKey: 'NE Applicationl Doc', label: span({}, ["Upload the ", span({ className: "bold" }, ["NE Application "]), "for this Project here"]) });
        requiredDocuments.push({ fileKey: 'NE Consent Doc', label: span({}, ["Upload the ", span({ className: "bold" }, ["Consent Document "]), "for this Project here ", span({ className: "italic" }, ["(if applicable)"])]) });
        break;

      case NHSR:
        requiredDocuments.push({ fileKey: 'NHSR Applicationl Doc', label: span({}, ["Upload the ", span({ className: "bold" }, ["NHSR Application "]), "for this Project here"]) });
        break;

      default:
        break;
    }

    return (
      WizardStep({ title: this.props.title, step: 2, currentStep: this.props.currentStep, errorMessage: !this.props.generalError ? 'Please upload all required documents' : 'Please check previous steps', error: this.props.errors || this.props.generalError }, [
        requiredDocuments.map((rd, Index) => {
          return h(Fragment, { key: Index }, [
            InputFieldFile({ label: rd.label, callback: this.setFilesToUpload(rd.fileKey), nameFiles: this.obtainFile(rd.fileKey) }),
          ])
        })
      ])
    )
  }
});
