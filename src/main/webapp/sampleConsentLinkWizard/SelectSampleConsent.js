import { Component } from 'react';
import { hh, h1, p, button, div } from 'react-hyperscript-helpers';
import { WizardStep } from "../components/WizardStep";
import { InputFieldSelect } from "../components/InputFieldSelect";
import { Panel } from '../components/Panel';
import { AddDocumentDialog } from "../components/AddDocumentDialog";
import { Table } from "../components/Table";
import { DOCUMENT_TYPE } from '../util/DocumentType';

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

export const SelectSampleConsent = hh(class SelectSampleConsent extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      showAddDocuments: false,
      documentOptions: [],
      documents: [],
      sampleCollectionList: {},
      sampleCollections: {},
      consentGroupsList: {},
      collectionSample: {},
      consentGroup: {}
    };
  }

  componentDidMount() {
    this.loadOptions();
  }

  fileHandler = (docs) => {
    this.setState({
      files: docs
    });
  };

  handleSampleCollectionChange = () => (data) => {
    this.setState(prev => {
      prev.sampleCollections = data;
      return prev;
    }, () => this.props.updateForm(this.state.sampleCollections, "sampleCollections"));
    this.props.removeErrorMessage();
  };

  handleConsentGroupChange = () => (data) => {
    this.setState(prev => {
      prev.consentGroup = data;
      return prev;
    }, () => this.props.updateForm(this.state.consentGroup, "consentGroup"));
    this.props.removeErrorMessage();
  };

  closeModal = () => {
    this.setState({ showAddDocuments: !this.state.showAddDocuments });
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------');
    console.log(error, info);
  }

  setFilesToUpload = (doc) => {
    let document = { fileKey: doc.fileKey, file: doc.file, fileName: doc.file.name, id: Math.random() };
    this.setState(prev => {
      let documents = prev.documents;
      documents.push(document);
      prev.documents = documents;
      return prev;
    }, () => {
      this.props.fileHandler(this.state.documents);
      this.closeModal();
    });
  };

  removeFile = (row) => (e) => {
    const documentsToUpdate = this.state.documents.filter(doc => doc.id !== row.id);
    this.setState(prev => {
      prev.documents = documentsToUpdate;
      return prev;
    }, () => this.props.fileHandler(this.state.documents));
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
    let documents = this.props.files;

    return (
      WizardStep({
        title: this.props.title,
        step: 0,
        currentStep: this.props.currentStep,
        error: this.props.errors.collectionSample || this.props.errors.consentGroup,
        errorMessage: 'Please complete all required fields'
      }, [
        Panel({
          title: "Select a Data Cohorts",
        }, [
          InputFieldSelect({
            id: "consentGroup_select",
            label: "Data Cohorts to link",
            isDisabled: false,
            options: this.props.existingConsentGroups,
            onChange: this.handleConsentGroupChange,
            value: this.state.consentGroup,
            placeholder: "Start typing a Data Cohorts",
            error: this.props.errors.consentGroup,
            errorMessage: "Please select a Data Cohorts",
            isMulti: false,
            edit: false
          }),
        ]),
        Panel({
          title: "Select a sample collection",
        }, [
          InputFieldSelect({
            id: "sampleCollection_select",
            label: "Link Sample Collection",
            isDisabled: false,
            options: this.props.sampleCollectionList,
            onChange: this.handleSampleCollectionChange,
            value: this.state.sampleCollections,
            placeholder: "Start typing a Sample Collection",
            isMulti: false,
            edit: false,
            error: this.props.errors.sampleCollection,
            errorMessage: "Please select a Sample Collection"
          }),
        ]),
        Panel({
          title: "Documents"
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
              documentHandler: this.setFilesToUpload,
            }),
            div({ style: styles.addDocumentContainer }, [
              button({
                className: "btn buttonPrimary",
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
            }),
          ])
        ])
      ])
    );
  }
});
