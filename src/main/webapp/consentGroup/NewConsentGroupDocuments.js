import { Component, Fragment } from 'react';
import { WizardStep } from '../components/WizardStep';
import { hh, h, h1, a, div, button } from 'react-hyperscript-helpers';
import { InputFieldFile } from '../components/InputFieldFile';
import { DOCUMENT_TYPE } from '../util/DocumentType';
import { AddDocumentDialog } from "../components/AddDocumentDialog";
import { Panel } from "../components/Panel";
import { Table } from "../components/Table";
const addDocumentBtn = {
  position: 'absolute', right: '15px', zIndex: '1'
};

const headers =
  [
    { name: '',  value:'remove' },
    { name: 'Document Type', value: 'fileType' },
    { name: 'File Name', value: 'fileName' }
  ];

export const NewConsentGroupDocuments = hh(class NewConsentGroupDocuments extends Component {

  state = {
    documents: [],
    showAddDocuments: false,
    showAddKeyDocuments: false,
    documentOptions: [],
    keyDocuments: [{
      creationDate:"3/26/19 4:56 PM",
      creator:"Leo Forconesi",
      docVersion:1,
      documentType: "key",
      fileName: "images.jpeg",
      fileType: "NHSR Application",
      gorm_logical_delete_LogicalDelete__deleted:false,
      id:14442,
      mimeType: "image/jpeg",
      projectKey:"DEV-NHSR-5314",
      status:"Pending",
      username:"lforcone",
      uuid:"acc08f5a-61ef-498b-a245-7e50b6b8ad45",
      version:0
    }]
  };

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------');
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidMount() {
    this.loadOptions();
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

  closeModal = () => {
    this.setState({ showAddKeyDocuments: !this.state.showAddKeyDocuments });
  };

  addDocuments = () => {
    this.setState({
      showAddDocuments: !this.state.showAddDocuments
    });
  };

  loadOptions () {
    let documentOptions = [];
    DOCUMENT_TYPE.forEach(type => {
      documentOptions.push({value: type, label: type});
    });
    this.setState({documentOptions: documentOptions});
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

      WizardStep({
        title: this.props.title, step: 1, currentStep: this.props.currentStep,
        errorMessage: 'Please upload all required documents',
        error: errors || this.props.generalError
      }, [

        AddDocumentDialog({
          closeModal: this.closeModal,
          show: this.state.showAddDocuments,
          options: this.state.documentOptions,
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
            data: this.state.keyDocuments,
            sizePerPage: 10,
            paginationSize: 10,
            handleDialogConfirm: this.props.handleDialogConfirm,
            downloadDocumentUrl: this.props.downloadDocumentUrl
          })
        ])
          //
          // div({ className: "positionRelative" }, [
          //   documents.map((document, index) => {
          //     return h(Fragment, { key: index }, [
          //       InputFieldFile({
          //         label: document.label,
          //         callback: this.setFilesToUpload(documents, index),
          //         fileName: (document.file != null ? document.file.name : ''),
          //         required: document.required,
          //         error: document.error,
          //         errorMessage: "Required field",
          //         removeHandler: () => this.removeFile(documents, index)
          //       }),
          //       document.link != null ? document.link : null
          //     ])
          //   })
          // ])
          //


        ])
    )
  }
});
