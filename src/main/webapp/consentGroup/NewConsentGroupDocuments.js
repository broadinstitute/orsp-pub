import { Component, Fragment } from 'react';
import { WizardStep } from '../components/WizardStep';
import { hh, h, h1, a, div } from 'react-hyperscript-helpers';
import { InputFieldFile } from '../components/InputFieldFile';


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
    e.target.value = '';
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
        title: this.props.title, step: 1, currentStep: this.props.currentStep,
        errorMessage: 'Please upload all required documents',
        error: errors || this.props.generalError
      }, [
        div({ style: {'position': 'relative'}}, [
          documents.map((document, index) => {
            return h(Fragment, { key: index }, [
              InputFieldFile({
                label: document.label,
                callback: this.setFilesToUpload(documents, index),
                fileName: (document.file != null ? document.file.name : ''),
                required: document.required,
                error: document.error,
                errorMessage: "Required field",
                removeHandler:() => this.removeFile(documents, index)
              }),
              document.link != null ? document.link: null
            ])
          })
      ])

      ])
    )
  }
});
