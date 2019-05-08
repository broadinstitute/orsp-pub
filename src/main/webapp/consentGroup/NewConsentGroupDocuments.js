import { Component, Fragment } from 'react';
import { WizardStep } from '../components/WizardStep';
import { hh, h, h1, a, div, button } from 'react-hyperscript-helpers';
import { InputFieldFile } from '../components/InputFieldFile';
import { DOCUMENT_TYPE } from '../util/DocumentType';
import { AddDocumentDialog } from "../components/AddDocumentDialog";
import { Panel } from "../components/Panel";
import { Table } from "../components/Table";

const styles = {
  addDocumentContainer: {
    display: 'block', height: '40px', marginTop: '15px'
  },
  addDocumentBtn: {
    position: 'relative', float: 'right'
  }
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
      let documents = prev.documents;
      let document = { fileKey: doc.fileKey, file: doc.file, fileName: doc.file.name, id: Math.random() };
      documents.push(document);
      prev.documents = documents;
      return prev;
    }, () => {
      this.props.fileHandler(this.state.documents);
      this.closeModal();
    });
  };

  removeFile = (row) => (e) => {
    let docs = this.state.documents;
    var documentsToUpdate = this.state.documents.filter(doc => doc.id !== row.id);
    this.setState(prev => {
      prev.documents = documentsToUpdate;
      return prev;
    }, () => this.props.fileHandler(this.state.documents));
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
          div({ className: "questionnaireContainerLight" }, [
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
              userName: this.props.userName,
              documentHandler: this.setFilesToUpload
            }),
            div({ style: styles.addDocumentContainer }, [
              button({
                className: "btn buttonSecondary",
                style: styles.addDocumentBtn,
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
              remove: this.removeFile,
              reviewFlow: false
            })
          ])
    )
  }
});
