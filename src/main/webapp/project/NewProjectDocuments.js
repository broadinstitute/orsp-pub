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


  setFilesToUpload(file) {
    this.setState(prev => {
      prev.documents = prev.documents.push({ fileKey: file.fileKey, file: file.file});
      return prev;
    }, this.props.fileHandler(docs));
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
          userName: this.props.userName,
          documentHandler: this.setFilesToUpload
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
