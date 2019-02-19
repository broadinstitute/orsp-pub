import { Component, Fragment } from 'react';
import { Documents } from "../components/Documents";
import { User } from "../util/ajax";
import { DocumentHandler } from "../util/ajax";
import { ConsentGroupKeyDocuments } from "../util/KeyDocuments";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { h } from 'react-hyperscript-helpers';
import '../index.css';
import { AlertMessage } from "../components/AlertMessage";

class ConsentGroupDocuments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      documentsCollection: [],
      keyDocuments: [],
      additional: [],
      showDialog: false,
      action: '',
      uuid: '',
      user: {isAdmin: false},
      serverError: false,
      documentKeyOptions: [],
      documentAdditionalOptions: []
    };
  }

  componentDidMount() {
    this.getAttachedDocuments();
    this.isCurrentUserAdmin();
    this.loadKeyOptions();
    this.loadAdditionalOptions();
  }

  loadKeyOptions() {
    let documentOptions = [];
    ConsentGroupKeyDocuments.forEach(type => {
        documentOptions.push({value: type, label: type});
      }); 
    this.setState({documentKeyOptions: documentOptions});
  }

  loadAdditionalOptions() {
    let documentOptions = [];
    documentOptions.push({value: 'Other', label: 'Other'});
    this.setState({documentAdditionalOptions: documentOptions});
  }

  isCurrentUserAdmin() {
    User.getUserSession(this.props.sessionUserUrl).then(resp => {
        this.setState({user: resp.data});
    });
  }

  getAttachedDocuments = () => {
    DocumentHandler.attachedDocuments(this.props.attachmentsUrl, this.props.projectKey).then(resp => {
      this.setKeyDocuments(JSON.parse(resp.data.documents));
    }).catch(error => {
      this.setState({serverError: true});
      console.error(error);
    });
  };

  setKeyDocuments = (documentsCollection) => {
    const keyDocuments = [];
    const additionalDocuments = [];
    documentsCollection.forEach(documentData => {
      if (ConsentGroupKeyDocuments.lastIndexOf(documentData.fileType) !== -1) {
        if(documentData.documentType === 'key') {
          keyDocuments.push(documentData);
        } else {
          additionalDocuments.push(documentData);
        }
      } else {
        additionalDocuments.push(documentData);
      }
    });

    this.setState({
      keyDocuments: keyDocuments,
      additionalDocuments: additionalDocuments
    })
  };


  approveDocument = (uuid) => {
    DocumentHandler.approveDocument(this.props.approveDocumentUrl, uuid).then(resp => {
      this.getAttachedDocuments();
    }).catch(error => {
      this.setState({serverError: true});
      console.error(error);
    });
  };

  rejectDocument = (uuid) => {
    DocumentHandler.approveDocument(this.props.rejectDocumentUrl, uuid).then(resp => {
      this.getAttachedDocuments();
    }).catch(error => {
      this.setState({serverError: true});
      console.error(error);
    });
  };

  handleDialog = (uuid, action) => {
    this.setState({
      showDialog: !this.state.showDialog,
      action: action,
      uuid: uuid
    });
  };

  handleAction = () => {
    switch (this.state.action) {
      case 'Approve':
        this.approveDocument(this.state.uuid);
        break;
      case 'Reject':
        this.rejectDocument(this.state.uuid);
        break;
    }
    this.closeModal();
  };

  closeModal = () => {
    this.setState({ showDialog: !this.state.showDialog });
  };

  render() {
    console.log("props de consentgroupdocument ", this.props);
    return h(Fragment, {}, [
      ConfirmationDialog({
        closeModal: this.closeModal,
        show: this.state.showDialog,
        handleOkAction: this.handleAction,
        title: this.state.action + ' Confirmation',
        bodyText: 'Are you sure yo want to ' + this.state.action + ' this document?',
        actionLabel: 'Yes'
      }, []),
      Documents({
        keyDocuments: this.state.keyDocuments,
        additionalDocuments: this.state.additionalDocuments,
        handleDialogConfirm: this.handleDialog,
        user: this.state.user,
        downloadDocumentUrl: this.props.downloadDocumentUrl,
        keyOptions: this.state.documentKeyOptions,
        additionalOptions: this.state.documentAdditionalOptions,
        projectKey: this.props.projectKey,
        attachDocumentsUrl: this.props.attachDocumentsUrl,
        handleLoadDocuments: this.getAttachedDocuments,
        serverURL: this.props.serverURL
      }),
      AlertMessage({
        msg: 'Something went wrong in the server. Please try again later.',
        show: this.state.serverError
      })
    ])
  }
}

export default ConsentGroupDocuments;
