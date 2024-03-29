import { Component } from 'react';
import { CONSENT_DOCUMENTS } from '../util/DocumentType';
import { button, div, h, h1, hh, p, a, br } from 'react-hyperscript-helpers';
import AddDocumentDialog from '../components/AddDocumentDialog';
import { Table } from '../components/Table';
import { User } from '../util/ajax';

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
    { name: 'Document Type', value: 'fileType' },
    { name: 'File Name', value: 'fileName' },
    { name: 'File Description', value: 'fileDescription' },
    { name: 'Author', value: 'displayName' },
    { name: 'Created On', value: 'createdDate' },
    { name: '', value: 'remove' }
  ];

export const NewConsentGroupDocuments = hh(class NewConsentGroupDocuments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      documents: [],
      showAddDocuments: false,
      documentOptions: [],
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

  componentDidMount() {
    this.loadOptions();
  }

  async setFilesToUpload(doc) {
    let name, createdDate;
    await User.getUserSession().then(user => {
      name = user.data.displayName;
      createdDate = new Date().toISOString().substring(0,10);
    });
    let viewDocDetail = {};
    this.setState(prev => {
      let documents = prev.documents;
      let document = { fileKey: doc.fileKey, file: doc.file, fileName: doc.file.name, id: Math.random(), fileDescription: doc.fileDescription };
      viewDocDetail['fileType'] = doc.fileKey;
      viewDocDetail['file'] = doc.file;
      viewDocDetail['fileName'] = doc.file.name;
      viewDocDetail['fileDescription'] = doc.fileDescription;
      viewDocDetail['displayName'] = name;
      viewDocDetail['createdDate'] = createdDate;
      viewDocDetail['id'] = document.id;
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
    let docs = this.state.documents;
    var documentsToUpdate = this.state.documents.filter(doc => doc.id !== row.id);
    this.setState(prev => {
      prev.documents = documentsToUpdate;
      prev.viewDocDetails = prev.viewDocDetails.filter(doc => doc.id !== row.id);
      return prev;
    }, () => this.props.fileHandler(this.state.documents));
  }

  closeModal = () => {
    this.setState({ 
      showAddDocuments: !this.state.showAddDocuments,
      dropEvent: null
    });
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
      prev.dropEvent = file;
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
    let errors = false;
    return (
          div({ className: "questionnaireContainerLight" }, [
            p({ className: "col-12"},["Please upload any documents related to your specific sample or data cohort, for example: consent forms, assent forms, waivers of consent, attestations, data use letters, and Institutional Certifications."]),
            h(AddDocumentDialog, {
              isRendered: this.state.showAddDocuments,
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
            })
          ])
    )
  }
});
