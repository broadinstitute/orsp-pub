import { Component } from 'react';
import { WizardStep } from '../components/WizardStep';
import { hh, h1, button, div, p, small } from 'react-hyperscript-helpers';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { Panel } from "../components/Panel";
import { Table } from "../components/Table";
import { AddDocumentDialog } from '../components/AddDocumentDialog'


const styles = {
  addDocumentContainer: {
    display: 'block', height: '40px', margin: '15px 0 10px 0'
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

const instructionalText = "Please upload any documents related to your overall project, for example: " +
  "IRB application form, protocol, Continuing Review form, etc. Documents related to a specific cohort, " +
  "such a consent forms or attestations, should be uploaded in the Sample/Data Cohort Info tab.";

export const NewProjectDocuments = hh(class NewProjectDocuments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        attestation: false
      },
      errors: {
        attestation: false
      },
      documents: [],
      showAddDocuments: false
    };
    this.setFilesToUpload = this.setFilesToUpload.bind(this);
    this.removeFile = this.removeFile.bind(this);
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }


  setFilesToUpload(doc) {
    this.setState(prev => {
      let document = { fileKey: doc.fileKey, file: doc.file, fileName: doc.file.name, id: Math.random() };
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

  handleAttestationCheck = (e) => {
    const value = e.target.checked;

    this.setState(prev => {
      prev.formData.attestation = value;
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'attestation'));
    this.props.removeErrorMessage();
  };

  closeModal = () => {
    this.setState({ showAddDocuments: !this.state.showAddDocuments });
  };

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    let documents = this.props.files;
    let errorMessage = '';
    if(!this.props.errors.attestation && this.props.generalError) {
      errorMessage = 'Please check previous steps';
    } else if (this.props.submitError) {
      errorMessage =  'Something went wrong. Please try again.';
    } else {
      errorMessage = 'Please complete all required fields';
    }
    return (

      WizardStep({
        title: this.props.title, step: this.props.step, currentStep: this.props.currentStep,
        errorMessage: errorMessage,
        error: this.props.generalError || this.props.errors.attestation || this.props.submitError
      }, [
          div({ className: "questionnaireContainerLight" }, [
            p({ className: "col-lg-10 col-md-9 col-sm-9 col-12"},["Please upload any documents related to your overall project, for example: IRB application form, protocol, Continuing Review form, etc. Documents related to a specific cohort, such a consent forms or attestations, should be uploaded in the Sample/Data Cohort Info tab."]),
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
              instructionalText: instructionalText,
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
            }),
            div({ style: { 'marginTop': '25px' }}, [
              Panel({ title: "Broad Responsible Party (or Designee) Attestation*" }, [
                p({}, 'I confirm that the information provided above is accurate and complete. The Broad researcher associated with the project is aware of this application, and I have the authority to submit it on his/her behalf.'),
                p({}, '[If obtaining coded specimens/data] I certify that no Broad staff or researchers working on this project will have access to information that would enable the identification of individuals from whom coded samples and/or data were derived. I also certify that Broad staff and researchers will make no attempt to ascertain information about these individuals.'),
                InputFieldCheckbox({
                  id: "ckb_attestation",
                  name: "attestation",
                  onChange: this.handleAttestationCheck,
                  label: "I confirm",
                  checked: this.props.formData.attestation,
                  required: true
                }),
                small({ isRendered: this.props.errors.attestation, className: "errorMessage" }, 'Required Field')
              ])
            ])
          ])
        ])
    )
  }
});
