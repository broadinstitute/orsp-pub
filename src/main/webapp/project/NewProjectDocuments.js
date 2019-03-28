import { Component, Fragment } from 'react';
import { WizardStep } from '../components/WizardStep';
import { hh, h, h1, span, button } from 'react-hyperscript-helpers';
import { InputFieldFile } from '../components/InputFieldFile';
import { Panel } from "../components/Panel";
import { Table } from "../components/Table";
import { IRB, NHSR, NE } from '../util/DocumentType';
import { AddDocumentDialog } from '../components/AddDocumentDialog'

const addDocumentBtn = {
  position: 'absolute', right: '15px', zIndex: '1'
};


const headers =
  [
    { name: 'Document Type', value: 'fileType' },
    { name: 'File Name', value: 'fileName' }
  ];

export const NewProjectDocuments = hh(class NewProjectDocuments extends Component {

  state = {
    documents: [],
    showAddDocuments: false
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
  
  addDocuments = () => {
    this.setState({
      showAddDocuments: !this.state.showAddDocuments
    });
  };

  closeModal = () => {
    this.setState({ showAddKeyDocuments: !this.state.showAddKeyDocuments });
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
        AddDocumentDialog({
          closeModal: this.closeModal,
          show: this.state.showAddDocuments,
          options: this.props.options,
          attachDocumentsUrl: this.props.attachDocumentsUrl,
          projectKey: this.props.projectKey,
          user: this.props.user,
          handleLoadDocuments: this.props.handleLoadDocuments,
          serverURL: this.props.serverURL,
          emailUrl: this.props.emailUrl,
          userName: this.props.userName
        }),
        Panel({title: "Documents"}, [
          button({
            className: "btn buttonSecondary",
            style: addDocumentBtn,
            onClick: this.addDocuments
          }, ["Add Document"]),
          Table({
            headers: headers,
            data: this.props.keyDocuments,
            sizePerPage: 10,
            paginationSize: 10,
            handleDialogConfirm: this.props.handleDialogConfirm,
            downloadDocumentUrl: this.props.downloadDocumentUrl
          })
        ])
      ])
    )
  }
});
