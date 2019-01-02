import { Component, Fragment } from 'react';
import { WizardStep } from '../components/WizardStep';
import { hh, h, h1, span } from 'react-hyperscript-helpers';
import { InputFieldFile } from '../components/InputFieldFile';

export const NewProjectDocuments = hh(class NewProjectDocuments extends Component {

  state = {
    documents: []
  };

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  setFilesToUpload = (docs, ix) => (e) => {
    let selectedFile = e.target.files[0];
    docs[ix].file = selectedFile;
    docs[ix].error = false;
    this.props.fileHandler(docs);
  };

  removeFile = (docs, index) => {
    docs[index].file = null;
    this.props.fileHandler(docs);
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    let documents = this.props.files;

    let errors = false;
    documents.forEach(doc => {
      errors = errors || doc.error;
    });

    return (

      WizardStep({
        title: this.props.title, step: 2, currentStep: this.props.currentStep,
        errorMessage: !this.props.generalError ? 'Please upload all required documents' : 'Please check previous steps',
        error: errors || this.props.generalError
      }, [
          div({ className: "positionRelative" }, [
            documents.map((document, index) => {
              return h(Fragment, { key: index }, [
                InputFieldFile({
                  label: document.label,
                  callback: this.setFilesToUpload(documents, index),
                  fileName: (document.file != null ? document.file.name : ''),
                  required: document.required,
                  error: document.error,
                  errorMessage: "Required field",
                  removeHandler: () => this.removeFile(documents, index)
                })
              ])
            })
          ])
        ])
    )
  }
});
