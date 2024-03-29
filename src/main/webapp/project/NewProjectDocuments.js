import { Component } from 'react';
import { WizardStep } from '../components/WizardStep';
import { button, div, h, h1, hh, p, small, a, br } from 'react-hyperscript-helpers';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { Panel } from '../components/Panel';
import { Table } from '../components/Table';
import AddDocumentDialog from '../components/AddDocumentDialog'
import { User } from '../util/ajax';


const styles = {
  addDocumentContainer: {
    display: 'block', height: '50px', margin: '15px 0 10px 0'
  },
  addDocumentBtn: {
    position: 'relative', float: 'right'
  }
};
const headers =
  [
    { name: 'Document Type', value: 'fileType' },
    { name: 'File Name', value: 'fileName' },
    { name: 'File Description', value: 'fileDescription' },
    { name: 'Author', value: 'displayName' },
    { name: 'Created On', value: 'createdDate' },
    { name: '', value: 'remove' }
  ];


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
      showAddDocuments: false,
      dropEvent: null,
      viewDocDetails: []
    };
    this.setFilesToUpload = this.setFilesToUpload.bind(this);
    this.removeFile = this.removeFile.bind(this);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }


  async setFilesToUpload(doc) {
    let name, createdDate;
    await User.getUserSession().then(user => {
      name = user.data.displayName;
      createdDate = new Date().toISOString().substring(0,10);
    })
    let viewDocDetail = {};
    this.setState(prev => {
      let document = { fileKey: doc.fileKey, file: doc.file, fileName: doc.file.name, id: Math.random(), fileDescription: doc.fileDescription };
      viewDocDetail['fileType'] = doc.fileKey;
      viewDocDetail['file'] = doc.file;
      viewDocDetail['fileName'] = doc.file.name;
      viewDocDetail['fileDescription'] = doc.fileDescription;
      viewDocDetail['displayName'] = name;
      viewDocDetail['createdDate'] = createdDate;
      viewDocDetail['id'] = document.id;
      let documents = prev.documents;
      documents.push(document);
      prev.documents = documents;
      let viewDocDetails = prev.viewDocDetails;
      viewDocDetails.push(viewDocDetail);
      prev.viewDocDetails = viewDocDetails;
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
      prev.viewDocDetails = prev.viewDocDetails.filter(doc => doc.id !== row.id);
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
    this.setState({
      showAddDocuments: !this.state.showAddDocuments,
      dropEvent: null
    });
  };

  dropHandler = (event) => {
    event.preventDefault();
    let file
    if (event.dataTransfer.items) {
        [...event.dataTransfer.items].forEach((item, i) => {
            if (item.kind === 'file') {
                file = item.getAsFile();
            }
        })
    }
    this.setState(prev => {
      prev.dropEvent = file
    }, () => {
      this.addDocuments();
    })
  }

  dragOverHandler(event) {
    event.preventDefault();
  }

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
            p({ className: "col-12"},["Please upload any documents related to your overall project, for example: IRB application form, protocol, Continuing Review form, etc. Documents related to a specific cohort, such as consent forms or attestations, should be uploaded in the Sample/Data Cohort tab."]),
            h(AddDocumentDialog, {
              isRendered: this.state.showAddDocuments,
              closeModal: this.closeModal,
              show: this.state.showAddDocuments,
              options: this.props.options,
              projectKey: this.props.projectKey,
              user: this.props.user,
              handleLoadDocuments: this.props.handleLoadDocuments,
              emailUrl: this.props.emailUrl,
              userName: this.props.userName,
              documentHandler: this.setFilesToUpload,
              dropEvent: this.state.dropEvent
            }),
            div({ style: styles.addDocumentContainer }, [
              div({
                isRendered: !component.isViewer,
                id: 'drop_zone',
                onDrop: this.dropHandler,
                onDragOver: this.dragOverHandler,
                style: {padding: '10px 0 10px 0', textAlign: 'center', border: '1px solid #ddd', width: '100%'}
              }, [
                p(['Drag and drop your documents here or ', a({onClick:() => {this.addDocuments()}}, ['click here to add documents'])])
              ]),
            ]),br(),
            Table({
              headers: headers,
              data: this.state.viewDocDetails,
              sizePerPage: 10,
              paginationSize: 10,
              handleDialogConfirm: this.props.handleDialogConfirm,
              remove: this.removeFile,
              reviewFlow: false,
              pagination: false
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
