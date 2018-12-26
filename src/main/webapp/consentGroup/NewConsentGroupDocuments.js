import { Component, Fragment } from 'react';
import { WizardStep } from '../components/WizardStep';
import { hh, h, h1, a } from 'react-hyperscript-helpers';
import { InputFieldFile } from '../components/InputFieldFile';
import { Files } from "../util/ajax";

export const NewConsentGroupDocuments = hh(class NewConsentGroupDocuments extends Component {

  state = {
    documents: []
  };

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------');
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  setFilesToUpload = (docs, ix) => (e) => {
    docs[ix].file = e.target.files[0];
    docs[ix].error = false;
    this.props.fileHandler(docs);
  };

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

      a({onClick: this.downloadFillablePDF}, ['download PDF']),
      WizardStep({
        title: this.props.title, step: 1, currentStep: this.props.currentStep,
        errorMessage: !this.props.generalError ? 'Please upload all required documents' : 'Please check previous steps',
        error: errors || this.props.generalError
      }, [
        documents.map((document, index) => {
          return h(Fragment, { key: index }, [
            document.link != null ? document.link: null,
            InputFieldFile({
              label: document.label,
              callback: this.setFilesToUpload(documents, index),
              fileName: (document.file != null ? document.file.name : ''),
              required: document.required,
              error: document.error,
              errorMessage: "Required field"
            }),
          ])
        })
      ])
    )
  }
});
