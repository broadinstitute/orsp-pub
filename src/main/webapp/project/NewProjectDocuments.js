import { Component } from 'react';
import { WizardStep } from '../components/WizardStep';
import { button, div, h, h1, hh, p, small, span } from 'react-hyperscript-helpers';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { InputYesNo } from '../components/InputYesNo';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { Panel } from '../components/Panel';
import { Table } from '../components/Table';
import AddDocumentDialog from '../components/AddDocumentDialog'


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


export const NewProjectDocuments = hh(class NewProjectDocuments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        attestation: false,
        financialRelationshipSponsor: '',
        financialRelationshipBusiness: '',
        otherFinancialRelationship: ''
      },
      errors: {
        attestation: false,
        errorFinancialRelationshipSponsor: false,
        errorFinancialRelationshipBusiness: false,
        errorOtherFinancialRelationship: false
      },
      documents: [],
      showAddDocuments: false
    };
    this.setFilesToUpload = this.setFilesToUpload.bind(this);
    this.removeFile = this.removeFile.bind(this);
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

  removeFile = (row) => {
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

  handleRadioChange = (e, field, value) => {
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => this.props.updateForm(this.state.formData, field));
    this.props.removeErrorMessage();
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
      errorMessage = "Something went wrong in the server. Please verify that you don't exceed 100Mb total in files to upload.";
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
            p({ className: "col-lg-10 col-md-9 col-sm-9 col-12"},["Please upload any documents related to your overall project, for example: IRB application form, protocol, Continuing Review form, etc. Documents related to a specific cohort, such as consent forms or attestations, should be uploaded in the Sample/Data Cohort tab."]),
            h(AddDocumentDialog, {
              closeModal: this.closeModal,
              show: this.state.showAddDocuments,
              options: this.props.options,
              projectKey: this.props.projectKey,
              user: this.props.user,
              handleLoadDocuments: this.props.handleLoadDocuments,
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
            }),
            div({ style: { 'marginTop': '25px' }}, [
              Panel({ title: "Conflicts of Interest*" }, [
                InputFieldRadio({
                  id: "radioFinancialRelationshipSponsor",
                  name: "financialRelationshipSponsor",
                  value: this.state.formData.financialRelationshipSponsor,
                  label: "Does the Principal Investigator/Co-Investigator have a role and/or financial relationship with the sponsor of this research? (e.g., consulting fees, employment, stock/equity, etc.)*",
                  readOnly: this.state.readOnly,
                  onChange: this.handleRadioChange,
                  optionValues: ["yes", "no", "maybe"],
                  optionLabels: [
                    span({}, ["Yes"]),
                    span({}, ["No"]),
                    span({}, ["Maybe"])
                  ],
                  error: this.props.errors.errorFinancialRelationshipSponsor,
                  errorMessage: "Required Field",
                  required: true
                }),
                InputFieldRadio({
                  id: "radioFinancialRelationshipBusiness",
                  name: "financialRelationshipBusiness",
                  value: this.state.formData.financialRelationshipBusiness,
                  label: "Does the Principal Investigator/Co-Investigator have a role and/or financial relationship with a business whose technology is being studied as part of this research?*",
                  readOnly: this.state.readOnly,
                  onChange: this.handleRadioChange,
                  optionValues: ["yes", "no", "maybe"],
                  optionLabels: [
                    span({}, ["Yes"]),
                    span({}, ["No"]),
                    span({}, ["Maybe"])
                  ],
                  error: this.props.errors.errorFinancialRelationshipBusiness,
                  errorMessage: "Required Field"
                }),
                InputFieldRadio({
                  id: "radioOtherFinancialRelationship",
                  name: "otherFinancialRelationship",
                  value: this.state.formData.otherFinancialRelationship,
                  label: "Does the Principal Investigator/Co-Investigator have any other financial interest that could directly benefit from the outcomes of this research?*",
                  readOnly: this.state.readOnly,
                  onChange: this.handleRadioChange,
                  optionValues: ["yes", "no", "maybe"],
                  optionLabels: [
                    span({}, ["Yes"]),
                    span({}, ["No"]),
                    span({}, ["Maybe"])
                  ],
                  error: this.props.errors.errorOtherFinancialRelationship,
                  errorMessage: "Required Field"
                }),
              ])
            ]),
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
