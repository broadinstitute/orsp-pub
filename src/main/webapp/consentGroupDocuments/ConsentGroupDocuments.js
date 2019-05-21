import { Component, Fragment } from 'react';
import { Documents } from "../components/Documents";
import { DocumentHandler, User, ConsentGroup } from "../util/ajax";
import { CONSENT_DOCUMENTS } from '../util/DocumentType';
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { h } from 'react-hyperscript-helpers';
import '../index.css';
import { AlertMessage } from "../components/AlertMessage";
import { Spinner } from '../components/Spinner';

class ConsentGroupDocuments extends Component {

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
      user: {isAdmin: false},
      serverError: false,
      documentOptions: [],
      associatedProjects: []
    };
  }

  componentDidMount() {
    this.getAttachedDocuments();
    this.getUseRestriction();
    this.isCurrentUserAdmin();
    this.loadOptions();
    this.getAssociatedProjects();
  }

  loadOptions () {
    let documentOptions = [];
    CONSENT_DOCUMENTS.forEach(type => {
      documentOptions.push({value: type, label: type});
    });
    this.setState({documentOptions: documentOptions});
  };


  isCurrentUserAdmin() {
    User.getUserSession(this.props.sessionUserUrl).then(resp => {
      this.setState({user: resp.data});
    });
  }

  getAttachedDocuments = () => {
    DocumentHandler.attachedDocuments(this.props.attachmentsUrl, this.props.projectKey).then(resp => {
      this.setState({documents: JSON.parse(resp.data.documents)});
    }).catch(error => {
      this.setState({serverError: true});
      console.error(error);
    });
  };

  getUseRestriction = () => {
    ConsentGroup.getUseRestriction(this.props.useRestrictionUrl, this.props.projectKey).then(resp => {
      const newRestrictionId = resp.data.restrictionId ? resp.data.restrictionId : null;
      this.setState(prev => {
        prev.restriction = resp.data.restriction;
        prev.restrictionId = newRestrictionId;
        return prev;
      })
    });
  };

  getAssociatedProjects = () => {
    ConsentGroup.getConsentCollectionLinks(this.props.serverURL, this.props.projectKey).then(response => {
      this.setState({ associatedProjects: response.data.collectionLinks })
    }).catch(error => {
      this.setState({serverError: true});
      console.error(error);
    });
  };

  handleUnlinkProject = (target) => () => {
    ConsentGroup.unlinkProject(this.props.serverURL, this.props.projectKey, target).then(result => {
      this.getAssociatedProjects()
    }).catch(error => {
      this.setState({serverError: true});
      console.error(error);
    });
  };

  redirectToProject = (projectKey) => {
    let key = projectKey.split("-");
    let projectType = '';
    if (key.length === 3) {
      projectType = key[1].toLowerCase();
    } else {
      projectType = key[0].toLowerCase();
    }
    return [this.props.serverURL, projectType, "show", projectKey,"?tab=review"].join("/");
  };

  redirectToInfoLink = (projectKey) => {
    let key = projectKey.split("-");
    let projectType = '';
    if (key.length === 3) {
      projectType = key[1].toLowerCase();
    } else {
      projectType = key[0].toLowerCase();
    }
    return [this.props.serverURL, "infoLink", "showInfoLink?projectKey=" + projectKey + "&consentKey=" + this.props.projectKey].join("/");
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
        user: this.state.user,
        downloadDocumentUrl: this.props.downloadDocumentUrl,
        options: this.state.documentOptions,
        projectKey: this.props.projectKey,
        attachDocumentsUrl: this.props.attachDocumentsUrl,
        handleLoadDocuments: this.getAttachedDocuments,
        handleUnlinkProject: this.handleUnlinkProject,
        handleRedirectToProject: this.redirectToProject,
        handleRedirectToInfoLink: this.redirectToInfoLink,
        serverURL: this.props.serverURL,
        emailUrl: this.props.emailDulUrl,
        userName: this.state.user.userName,
        restriction: this.state.restriction,
        restrictionId: this.state.restrictionId,
        newRestrictionUrl: this.props.createRestrictionUrl,
        isConsentGroup: true,
        associatedProjects: this.state.associatedProjects,
        removeDocumentUrl: this.props.removeDocumentUrl,
        docsClarification: "Please upload any documents related to your specific sample or data cohort, for example: consent forms, assent forms, waivers of consent, attestations, data use letters, and Institutional Certifications."
      }),
      AlertMessage({
        msg: 'Something went wrong in the server. Please try again later.',
        show: this.state.serverError
      }),
      h(Spinner, {
        name: "mainSpinner", group: "orsp", loadingImage: this.props.loadingImage
      })
    ])
  }
}

export default ConsentGroupDocuments;
