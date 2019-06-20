import { Component, Fragment } from 'react';
import { Documents } from "../components/Documents";
import { DocumentHandler, ConsentGroup } from "../util/ajax";
import { CONSENT_DOCUMENTS } from '../util/DocumentType';
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { h, hh } from 'react-hyperscript-helpers';
import '../index.css';
import { AlertMessage } from "../components/AlertMessage";
import { Spinner } from '../components/Spinner';

export const ConsentGroupDocuments = hh(class ConsentGroupDocuments extends Component {

  constructor(props) {
    super(props);
    this.state = {
      restrictionId: '',
      restriction: [],
      documents: [],
      keyDocuments: [],
      additional: [],
      showDialog: false,
      action: '',
      uuid: '',
      user: { isAdmin: false },
      serverError: false,
      documentOptions: [],
      associatedProjects: []
    };
  }

  componentDidMount() {
    this.getAttachedDocuments();
    this.getUseRestriction();
    this.loadOptions();
    this.getAssociatedProjects();
  }

  loadOptions() {
    let documentOptions = [];
    CONSENT_DOCUMENTS.forEach(type => {
      documentOptions.push({ value: type, label: type });
    });
    this.setState({ documentOptions: documentOptions });
  };

  getAttachedDocuments = () => {
    DocumentHandler.attachedDocuments(component.attachmentsUrl, component.consentKey).then(resp => {
      this.setState(prev => {
        prev.documents = JSON.parse(resp.data.documents);
        prev.user.isAdmin = component.isAdmin;
        return prev;
        }, () => {
          this.props.updateDocumentsStatus({ attachmentsApproved: resp.data.attachmentsApproved })
        }
      );
    }).catch(error => {
      this.setState({ serverError: true });
      console.error(error);
    });
  };

  getUseRestriction = () => {
    ConsentGroup.getUseRestriction(component.useRestrictionUrl, component.consentKey).then(resp => {
      const newRestrictionId = resp.data.restrictionId ? resp.data.restrictionId : null;
      this.setState(prev => {
        prev.restriction = resp.data.restriction;
        prev.restrictionId = newRestrictionId;
        return prev;
      })
    });
  };

  getAssociatedProjects = () => {
    ConsentGroup.getConsentCollectionLinks(component.serverURL, component.consentKey).then(response => {
      this.setState({ associatedProjects: response.data.collectionLinks })
    }).catch(error => {
      this.setState({ serverError: true });
      console.error(error);
    });
  };

  handleUnlinkProject = (target) => () => {
    ConsentGroup.unlinkProject(component.serverURL, component.consentKey, target).then(result => {
      this.getAssociatedProjects()
    }).catch(error => {
      this.setState({ serverError: true });
      console.error(error);
    });
  };



  approveDocument = (uuid) => {
    DocumentHandler.approveDocument(component.approveDocumentUrl, uuid).then(resp => {
      this.getAttachedDocuments();
    }).catch(error => {
      this.setState({ serverError: true });
      console.error(error);
    });
  };

  rejectDocument = (uuid) => {
    DocumentHandler.approveDocument(component.rejectDocumentUrl, uuid).then(resp => {
      this.getAttachedDocuments();
    }).catch(error => {
      this.setState({ serverError: true });
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
        bodyText: 'Are you sure you want to ' + this.state.action + ' this document?',
        actionLabel: 'Yes'
      }, []),
      Documents({
        documents: this.state.documents,
        handleDialogConfirm: this.handleDialog,
        isAdmin: this.state.isAdmin,
        user: this.state.user,
        downloadDocumentUrl: component.downloadDocumentUrl,
        options: this.state.documentOptions,
        projectKey: component.consentKey,
        attachDocumentsUrl: component.attachDocumentsUrl,
        handleLoadDocuments: this.getAttachedDocuments,
        handleUnlinkProject: this.handleUnlinkProject,
        serverURL: component.serverURL,
        emailUrl: component.emailDulUrl,
        userName: this.state.user.userName,
        restriction: this.state.restriction,
        restrictionId: this.state.restrictionId,
        newRestrictionUrl: component.createRestrictionUrl,
        isConsentGroup: true,
        associatedProjects: this.state.associatedProjects,
        removeDocumentUrl: component.removeDocumentUrl,
        docsClarification: "Please upload any documents related to your specific sample or data cohort, for example: consent forms, assent forms, waivers of consent, attestations, data use letters, and Institutional Certifications."
      }),
      AlertMessage({
        msg: 'Something went wrong in the server. Please try again later.',
        show: this.state.serverError
      }),
      h(Spinner, {
        name: "mainSpinner", group: "orsp", loadingImage: component.loadingImage
      })
    ])
  }
});