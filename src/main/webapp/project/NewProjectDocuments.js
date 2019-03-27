import { Component, Fragment } from 'react';
import { WizardStep } from '../components/WizardStep';
import { hh, h, h1, span } from 'react-hyperscript-helpers';
import { InputFieldFile } from '../components/InputFieldFile';
import { Panel } from "../components/Panel";
import { Table } from "../components/Table";
import { IRB, NHSR, NE } from '../util/DocumentType';

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


  // load file types options to header
  loadKeyOptions () {
    let key = this.props.projectKey.split("-");
    let projectType;
    if (key.length === 3) {
      projectType = key[1].toUpperCase();
    } else {
      projectType = key[0].toUpperCase();
    }
    let documentOptions = [];
    if (projectType === 'IRB') {
      IRB.forEach(type => {
        documentOptions.push({value: type, label: type});
      });
    }
    else if (projectType === 'NE') {
      NE.forEach(type => {
        documentOptions.push({value: type, label: type});
      });
    }
    else if (projectType === 'NHSR') {
      NHSR.forEach(type => {
        documentOptions.push({value: type, label: type});
      });
    }
    this.setState({documentKeyOptions: documentOptions});
  };

  setFilesToUpload = (docs, ix) => (e) => {
    let selectedFile = e.target.files[0];
    e.target.value = '';
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

    let errorText = '';
    if (!this.props.generalError) {
      errorText = 'Please upload all required documents';
    } else if (this.props.generalError && !this.props.submitError) {
      errorText = 'Please check previous steps';
    }
    if (this.props.submitError) {
      errorText = 'Something went wrong in the server. Please try again later.';
    }

    return (

      WizardStep({
        title: this.props.title, step: this.props.step, currentStep: this.props.currentStep,
        errorMessage: errorText,
        error: errors || this.props.generalError
      }, [

        Panel({title: "Documents"}, [
          button({
            className: "btn buttonSecondary",
            style: addDocumentBtn,
            onClick: this.addKeyDocuments
          }, ["Add Document"]),
          Table({
            headers: headers,
            data: this.props.keyDocuments,
            sizePerPage: 10,
            paginationSize: 10,
            handleDialogConfirm: this.props.handleDialogConfirm,
            downloadDocumentUrl: this.props.downloadDocumentUrl,
            isAdmin: this.props.user.isAdmin
          })
        ]),


        //
        // documents.map((document, index) => {
        //   return h(Fragment, { key: index }, [
        //     InputFieldFile({
        //       label: document.label,
        //       callback: this.setFilesToUpload(documents, index),
        //       fileName: (document.file != null ? document.file.name : ''),
        //       required: document.required,
        //       error: document.error,
        //       errorMessage: "Required field",
        //       removeHandler:() => this.removeFile(documents, index)
        //     })
        //   ])
        // })


      ])
    )
  }
});
