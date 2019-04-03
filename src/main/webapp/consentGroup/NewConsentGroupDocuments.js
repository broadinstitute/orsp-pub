import { Component, Fragment } from 'react';
import { WizardStep } from '../components/WizardStep';
import { hh, h, h1, a, div, button } from 'react-hyperscript-helpers';
import { InputFieldFile } from '../components/InputFieldFile';
import { DOCUMENT_TYPE } from '../util/DocumentType';
import { AddDocumentDialog } from "../components/AddDocumentDialog";
import { Panel } from "../components/Panel";
import { Table } from "../components/Table";

const addDocumentContainer = {
  display: 'block', height: '40px', marginTop: '15px'
};

const addDocumentBtn = {
  position: 'relative', float: 'right'
};

const headers =
  [
    { name: 'Document Type', value: 'fileKey' },
    { name: 'File Name', value: 'fileName' },
    { name: '', value: 'remove' }
  ];

export const NewConsentGroupDocuments = hh(class NewConsentGroupDocuments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      showAddDocuments: false,
      documentOptions: []
    };
    this.setFilesToUpload = this.setFilesToUpload.bind(this);
    this.removeFile = this.removeFile.bind(this);
  }

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

  setFilesToUpload(doc) {
    this.setState(prev => {
      let document = { fileKey: doc.fileKey, file: doc.file, fileName: doc.file.name };
      let documents = prev.documents;
      documents.push(document);
      prev.documents = documents;
      return prev;
    }, () => {
      this.props.fileHandler(this.state.documents);
      this.closeModal();
    });
  };

  removeFile(docs) {
    let documents = this.state.documents;
    console.log(docs);
  }

  closeModal = () => {
    this.setState({ showAddDocuments: !this.state.showAddDocuments });
  };

  addDocuments = () => {
    this.setState({
      showAddDocuments: !this.state.showAddDocuments
    });
  };

  loadOptions() {
    let documentOptions = [];
    DOCUMENT_TYPE.forEach(type => {
      documentOptions.push({ value: type, label: type });
    });
    this.setState({ documentOptions: documentOptions });
  };

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    let documents = this.props.files;
    let errors = false;
    return (

      WizardStep({
        title: this.props.title, step: 1, currentStep: this.props.currentStep,
        errorMessage: 'Please upload all required documents',
        error: errors || this.props.generalError
      }, [
          div({ className: "questionnaireContainer" }, [
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
            div({ style: addDocumentContainer }, [
              button({
                className: "btn buttonSecondary",
                style: addDocumentBtn,
                onClick: this.addDocuments
              }, ["Add Document"])
            ]),
            Table({
              headers: headers,
              data: documents,
              sizePerPage: 10,
              paginationSize: 10,
              handleDialogConfirm: this.props.handleDialogConfirm,
              downloadDocumentUrl: this.props.downloadDocumentUrl,
              remove: this.removeFile
            })
          ])
        ])
    )
  }
});
