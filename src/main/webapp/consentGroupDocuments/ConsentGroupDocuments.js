import { Component, Fragment } from 'react';
import { Documents } from '../components/Documents';
import { ConsentGroup, DocumentHandler, User } from '../util/ajax';
import { CONSENT_DOCUMENTS } from '../util/DocumentType';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { h, hh } from 'react-hyperscript-helpers';
import '../index.css';
import { AlertMessage } from '../components/AlertMessage';
import LoadingWrapper from '../components/LoadingWrapper';

const ConsentGroupDocuments = hh(class ConsentGroupDocuments extends Component {

  _isMounted = false;

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
    this._isMounted = true;
    this.getAttachedDocuments();
    this.getUseRestriction();
    this.loadOptions();
    this.getAssociatedProjects();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadOptions() {
    let documentOptions = [];
    CONSENT_DOCUMENTS.forEach(type => {
      documentOptions.push({ value: type, label: type });
    });
    if (this._isMounted) {
      this.setState({ documentOptions: documentOptions });
    }
  };

  getAttachedDocuments = () => {
    DocumentHandler.attachedDocuments(this.props.consentKey).then(resp => {
      User.getUserSession().then(user => {
        if (this._isMounted) {
          this.setState(prev => {
              prev.documents = JSON.parse(resp.data.documents);
              prev.user = user.data;
              return prev;
            }, () => {
              this.props.updateDocumentsStatus({ attachmentsApproved: resp.data.attachmentsApproved })
            }
          );
        }
      });
    }).catch(() => {
    });
  };

  getUseRestriction = () => {
    ConsentGroup.getUseRestriction(this.props.consentKey).then(resp => {
      const newRestrictionId = resp.data.restrictionId ? resp.data.restrictionId : null;
      if (this._isMounted) {
        this.setState(prev => {
          prev.restriction = resp.data.restriction;
          prev.restrictionId = newRestrictionId;
          return prev;
        });
      }
    }).catch( () => {});
  };

  getAssociatedProjects = () => {
    ConsentGroup.getConsentCollectionLinks(this.props.consentKey).then(response => {
      if (this._isMounted) {
        this.setState({ associatedProjects: response.data.collectionLinks })
      }
    }).catch(() => { });
  };

  handleUnlinkProject = (target) => () => {
    ConsentGroup.unlinkProject(this.props.consentKey, target).then(result => {
      this.getAssociatedProjects()
    }).catch(error => {
      this.setState({ serverError: true });
      console.error(error);
    });
  };

  approveDocument = (uuid) => {
    DocumentHandler.approveDocument(uuid).then(resp => {
      this.getAttachedDocuments();
    }).catch(error => {
      this.setState({ serverError: true });
      console.error(error);
    });
  };

  rejectDocument = (uuid) => {
    DocumentHandler.rejectDocument(uuid).then(resp => {
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
        options: this.state.documentOptions,
        projectKey: this.props.consentKey,
        handleLoadDocuments: this.getAttachedDocuments,
        handleUnlinkProject: this.handleUnlinkProject,
        userName: this.state.user.userName,
        restriction: this.state.restriction,
        restrictionId: this.state.restrictionId,
        isConsentGroup: true,
        associatedProjects: this.state.associatedProjects,
        docsClarification: "Please upload any documents related to your specific sample or data cohort, for example: consent forms, assent forms, waivers of consent, attestations, data use letters, and Institutional Certifications."
      }),
      AlertMessage({
        msg: 'Something went wrong in the server. Please try again later.',
        show: this.state.serverError
      })
    ])
  }
});

export default LoadingWrapper(ConsentGroupDocuments);
