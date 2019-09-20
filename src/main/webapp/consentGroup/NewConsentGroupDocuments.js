import { Component } from 'react';
import { CONSENT_DOCUMENTS } from '../util/DocumentType';
import { button, div, h, h1, hh, p } from 'react-hyperscript-helpers';
import AddDocumentDialog from '../components/AddDocumentDialog';
import { Table } from '../components/Table';

const styles = {
  addDocumentContainer: {
    display: 'block', height: '40px', margin: '5px 0 15px 0'
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

  removeFile = (row) => {
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
    CONSENT_DOCUMENTS.forEach(type => {
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
            p({ className: "col-lg-10 col-md-9 col-sm-9 col-12"},["Please upload any documents related to your specific sample or data cohort, for example: consent forms, assent forms, waivers of consent, attestations, data use letters, and Institutional Certifications."]),
            h(AddDocumentDialog, {
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
              remove: this.removeFile,
              reviewFlow: false,
              pagination: false
            })
          ])
    )
  }
});
