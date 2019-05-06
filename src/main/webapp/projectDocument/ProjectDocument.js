import { Component, Fragment } from 'react';
import { Documents } from '../components/Documents'
import { DocumentHandler } from "../util/ajax";
import { User } from "../util/ajax";
import { ProjectKeyDocuments } from '../util/KeyDocuments';
import { DOCUMENT_TYPE } from '../util/DocumentType';
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { h } from 'react-hyperscript-helpers';
import { AlertMessage } from "../components/AlertMessage";
import { Spinner } from '../components/Spinner';


class ProjectDocument extends Component {

  constructor(props) {
    super(props);
    this.state = {
      documentsCollection: [],
      documents: [],
      additional: [],
      showDialog: false,
      action: '',
      uuid: '',
      user: {isAdmin: false},
      serverError: false,
      documentOptions: [],
      documentAdditionalOptions: []
    };
  }

  componentDidMount() {
    this.getAttachedDocuments();
    this.isCurrentUserAdmin();
    this.loadOptions();
  }

  isCurrentUserAdmin() {
    User.getUserSession(this.props.sessionUserUrl).then(resp => {
      console.log(resp.data);
      this.setState({user: resp.data});
    });
  }

  getAttachedDocuments = () => {
    DocumentHandler.attachedDocuments(this.props.attachedDocumentsUrl, this.props.projectKey).then(resp => {
      this.setState({documents: JSON.parse(resp.data.documents)});
    }).catch(error => {
      this.setState({serverError: true});
      console.error(error);
    });
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

  removeDocument = (documentId) => {
    DocumentHandler.delete(this.props.removeDocumentUrl, documentId).then(resp => {
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
    this.setState({showDialog: !this.state.showDialog});
  };

  loadOptions () {
    let documentOptions = [];
    DOCUMENT_TYPE.forEach(type => {
      documentOptions.push({value: type, label: type});
    });
    this.setState({documentOptions: documentOptions});
  };
  

  render() {
    return (
      h( Fragment, {},[
        ConfirmationDialog({
          closeModal: this.closeModal,
          show: this.state.showDialog,
          handleOkAction: this.handleAction,
          title: this.state.action + ' Confirmation',
          bodyText: 'Are you sure you want to ' + this.state.action + ' this document?',
          actionLabel: 'Yes'
        }, []),
        Documents({
          documents: this.state.documents,
          handleDialogConfirm: this.handleDialog,
          user: this.state.user,
          downloadDocumentUrl: this.props.downloadDocumentUrl,
          options: this.state.documentOptions,
          projectKey: this.props.projectKey,
          attachDocumentsUrl: this.props.attachDocumentsUrl,
          handleLoadDocuments: this.getAttachedDocuments,
          removeDocumentUrl: this.props.removeDocumentUrl
        }),
        AlertMessage({
          msg: 'Something went wrong in the server. Please try again later.',
          show: this.state.serverError
        }),
        h(Spinner, {
          name: "mainSpinner", group: "orsp", loadingImage: this.props.loadingImage
        })
      ])
    )}

}
export default ProjectDocument