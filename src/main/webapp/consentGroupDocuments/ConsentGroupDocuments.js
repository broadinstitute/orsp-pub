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
      isAdmin: false,
      serverError: false
    };
  }

  componentDidMount() {
    this.getAttachedDocuments();
    this.isCurrentUserAdmin();
  }

  isCurrentUserAdmin() {
    User.getUserSession(this.props.sessionUserUrl).then(resp => {
        this.setState({isAdmin: resp.data.isAdmin});
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
        keyDocuments.push(documentData);
      } else {
        additionalDocuments.push(documentData);
      }
    });

    this.setState({
      keyDocuments: keyDocuments,
      additionalDocuments: additionalDocuments
    })
  };

  handleChangeStatus = (uuid, status) => {
    const formerStateKeyDoc = this.state.keyDocuments.slice();
    formerStateKeyDoc.forEach(doc => {
      if (uuid === doc.uuid) {
        doc.status = status;
      }
    });
    this.setState({ keyDocuments: formerStateKeyDoc });

    const formerAdditionalDoc = this.state.additionalDocuments.slice();
    formerAdditionalDoc.forEach(doc => {
      if (uuid === doc.uuid) {
        doc.status = status;
      }
    });
    this.setState({ additionalDocuments: formerAdditionalDoc });
  };

  approveDocument = (uuid) => {
    DocumentHandler.approveDocument(this.props.approveDocumentUrl, uuid).then(resp => {
      this.handleChangeStatus(uuid, 'Approved');
    }).catch(error => {
      this.setState({serverError: true});
      console.error(error);
    });
  };

  rejectDocument = (uuid) => {
    DocumentHandler.approveDocument(this.props.rejectDocumentUrl, uuid).then(resp => {
      this.handleChangeStatus(uuid, 'Rejected');
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
        isAdmin: this.state.isAdmin,
        downloadDocumentUrl: this.props.downloadDocumentUrl
      }),
      AlertMessage({
        msg: 'Something went wrong in the server. Please try again later.',
        show: this.state.serverError
      })
    ])
  }
}

export default ConsentGroupDocuments;
