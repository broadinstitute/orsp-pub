import { Component, Fragment } from 'react';
import { input, hh, h, h3, div, p, hr, small, button, ul, li, br, span } from 'react-hyperscript-helpers';
import { Table } from './Table';
import { Panel } from './Panel';
import { AddDocumentDialog } from './AddDocumentDialog'
import { KeyDocumentsEnum } from '../util/KeyDocuments';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { DocumentHandler, DUL, ConsentGroup } from '../util/ajax';
import { AlertMessage } from './AlertMessage';
import { InputFieldText } from './InputFieldText';
import { validateEmail } from "../util/Utils";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from '../components/Spinner';
import './Documents.css';

const headers =
  [
    { name: 'Document Type', value: 'fileType' },
    { name: 'File Name', value: 'fileName' },
    { name: 'Author', value: 'creator' },
    { name: 'Version', value: 'docVersion' },
    { name: 'Status', value: 'status' },
    { name: 'Created', value: 'creationDate' },
    { name: '', value: 'remove' }
  ];

const associatedProjectsHeaders = [
  { name: 'Type', value: 'type' },
  { name: 'Summary', value: 'summary' }
];

const addDocumentBtn = {
  position: 'absolute', right: '15px', zIndex: '1'
};

export const Documents = hh(class Documents extends Component {

  constructor(props) {
    super(props);
    this.state = {
      alertMessage: '',
      showAlert: false,
      showAddKeyDocuments: false,
      showAddAdditionalDocuments: false,
      showRemoveDocuments: false,
      documentToRemove: null,
      error: false,
      alertType: 'success',
      invalidEmail: false,
      collaboratorEmail: '',
    }
    this.removeDocument = this.removeDocument.bind(this);
    this.getShareableLink = this.getShareableLink.bind(this);
  }

  getShareableLink = () => {
    let data = {
      consentGroupKey: this.props.projectKey,
      creator: this.props.user.userName
    };
    DUL.generateRedirectLink(data, component.serverURL).then(resp => {
      navigator.clipboard.writeText(component.serverURL + "/dataUseLetter/show?id=" + resp.data.dulToken);
      this.successTimeAlert();
    }).catch(error => {
      this.setState(prev => {
        prev.disableBtn = false;
        prev.alertType = "danger";
        prev.alertMessage = 'Something went wrong. Please try again.';
        prev.showAlert = true;
        return prev;
      });
    });
  };

  successTimeAlert = () => {
    setTimeout(this.removeAlertMessage, 3000, null);
    this.setState(prev => {
      prev.alertType = "success";
      prev.alertMessage = "Link copied to clipboard!";
      prev.showAlert = true;
      return prev;
    });
  };

  removeAlertMessage = () => {
    this.setState(prev => {
      prev.alertType = "success";
      prev.alertMessage = "";
      prev.showAlert = false;
      return prev;
    });
  };

  validEmail = (email) => {
    if (validateEmail(email)) {
      return true;
    } else {
      this.setState({ invalidEmail: true });
    }
  };

  send = () => {
    spinnerService.showAll();
    const collaboratorEmail = this.state.collaboratorEmail;
    if (this.validEmail(collaboratorEmail)) {
      this.setState({ alertMessage: '', collaboratorEmail: '', showAlert: false });
      ConsentGroup.sendEmailDul(this.props.emailUrl, this.props.projectKey, this.props.userName, this.state.collaboratorEmail).then(resp => {
        setTimeout(this.removeAlertMessage, 5000, null);
        this.setState(prev => {
          prev.alertType = 'success';
          prev.alertMessage = 'Email sent to: ' + collaboratorEmail;
          prev.showAlert = true;
          prev.collaboratorEmail = '';
          return prev;
        }, () => spinnerService.hideAll());
      }).catch(error => {
        spinnerService.hideAll();
        this.setState(prev => {
          prev.alertType = 'danger';
          prev.alertMessage = 'Error sending email to: ' + collaboratorEmail + '. Please try again later.';
          prev.showAlert = true;
          prev.collaboratorEmail = '';
          return prev;
        });
      });
    } else spinnerService.hideAll();
  };

  addDocuments = () => {
    this.setState({
      showAddKeyDocuments: !this.state.showAddKeyDocuments
    });
  };

  newRestriction = () => {
    window.location.href = this.props.newRestrictionUrl + '?create=true&id=' + this.props.projectKey;
  };

  editRestriction = () => {
    window.location.href = component.serverURL + "/dataUse/edit/" + this.props.restrictionId;
  };

  showRestriction = () => {
    window.location.href = component.serverURL + "/dataUse/show/" + this.props.restrictionId;
  };

  closeRemoveModal = () => {
    this.setState({ showRemoveDocuments: !this.state.showRemoveDocuments });
  };

  closeModal = () => {
    this.setState({ showAddKeyDocuments: !this.state.showAddKeyDocuments });
  };
  closeAdditionalModal = () => {
    this.setState({ showAddAdditionalDocuments: !this.state.showAddAdditionalDocuments });
  };

  remove = (row) => (e) => {
    this.setState({
      showRemoveDocuments: !this.state.showRemoveDocuments,
      documentToRemove: row
    });
  };

  removeDocument() {
   DocumentHandler.delete(component.removeDocumentUrl, this.state.documentToRemove.id).
    then(resp => {
      this.closeRemoveModal();
      this.props.handleLoadDocuments();
    }).catch(error => {
      this.setState(() => { throw error; });
    });   
  }

  findDul = () => {
    let dulPresent = false;
    if (this.props.documents.length !== 0) {
      this.props.documents.forEach(docs => {
        if (docs.fileType === KeyDocumentsEnum.DATA_USE_LETTER) {
          dulPresent = true;
        }
      });
    }
    return dulPresent;
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.fileError = false;
      prev[field] = value;
      if (field === 'collaboratorEmail') {
        prev.invalidEmail = false;
      }
      return prev;
    })
  };

  render() {
    const { restriction = [] } = this.props;
    return div({}, [
      AddDocumentDialog({
        closeModal: this.closeModal,
        show: this.state.showAddKeyDocuments,
        options: this.props.options,
        attachDocumentsUrl: component.attachDocumentsUrl,
        projectKey: this.props.projectKey,
        user: this.props.user,
        handleLoadDocuments: this.props.handleLoadDocuments,
        emailUrl: this.props.emailUrl,
        userName: this.props.userName,
        isConsentGroup: this.props.isConsentGroup
      }),
      ConfirmationDialog({
        closeModal: this.closeRemoveModal,
        show: this.state.showRemoveDocuments,
        handleOkAction: this.removeDocument,
        title: 'Remove Document Confirmation',
        bodyText: 'Are you sure you want to remove this document?',
        actionLabel: 'Yes'
      }, []),

      Panel({ title: "Documents" }, [
        p({ isRendered: this.props.docsClarification }, [this.props.docsClarification]),
        button({
          className: "btn buttonSecondary",
          style: addDocumentBtn,
          onClick: this.addDocuments,
          isRendered: !component.isViewer,
        }, ["Add Document"]),
        Table({
          headers: headers,
          data: this.props.documents,
          sizePerPage: 10,
          paginationSize: 10,
          handleDialogConfirm: this.props.handleDialogConfirm,
          isAdmin: component.isAdmin,
          isViewer: component.isViewer,
          reviewFlow: true,
          pagination: true,
          remove: this.remove
        })
      ]),

      Panel({ title: "Data Use Letter" }, [
        div({ style: { 'marginTop': '10px' } }, [
          p({ className: "bold" }, [
            "Do you want to send a Data Use Letter form directly to your Collaborator for their IRB's completion?",
            span({ className: "data-use-clarification" }, ["You can either insert the email below and a link will be sent to them directly or click to get a shareable link."])
          ]),
          div({ className: "collaborator-email-container row" }, [
            div({ className: "col-xs-12 col-sm-6 col-md-8" }, [
              InputFieldText({
                id: "inputCollaboratorEmail",
                name: "collaboratorEmail",
                label: "Collaborator Email",
                value: this.state.collaboratorEmail,
                disabled: false,
                required: false,
                placeholder: "Enter email address...",
                onChange: this.handleInputChange,
                error: this.state.invalidEmail,
                errorMessage: 'Invalid email address'
              }),
              button({ className: "btn buttonPrimary", disabled: this.state.collaboratorEmail === '', onClick: this.send }, ["Send"])
            ]),
            div({ className: "col-xs-12 col-sm-6 col-md-4 shareable-link" }, [
              button({
                className: "btn buttonPrimary",
                onClick: this.getShareableLink,
                name: "getLink",
                disabled: false,
                id: 'shareable-link'
              }, [
                  span({ className: "glyphicon glyphicon-link", style: { 'marginRight': '5px' } }, []),
                  "Get shareable link"
                ]),
            ])
          ]),

          div({ className: "row" }, [
            div({ className: "col-xs-12" }, [
              div({ style: { 'marginTop': '30px' } }, [
                AlertMessage({
                  type: this.state.alertType,
                  msg: this.state.alertMessage,
                  show: this.state.showAlert
                }),
              ])
            ])
          ])
        ])
      ]),

      div({ isRendered: this.props.restriction !== undefined }, [
        Panel({
          title: "Data Use Restrictions",
          isRendered: (component.isAdmin || component.isViewer) && this.findDul()
        }, [
          h3({
            style: {'marginTop': '10px'},
            isRendered: this.props.restrictionId !== null
          }, ["Summary"]),
          div({
            isRendered: restriction.length > 1
          }, [
            restriction.map((elem, index) => {
              return h(Fragment, {key: index}, [
                div({style: {'marginBottom': '10px'}}, [
                  div({style: {'marginTop': '10px'}, className: index === 0 ? 'first' : 'indented'}, [elem])
                ]),
              ]);
            }),
          ]),
          div({}, [
            button({
                className: "btn buttonSecondary",
                style: { 'marginRight': '15px' },
                onClick: this.newRestriction,
                isRendered: this.props.restrictionId === null && this.findDul() && !component.isViewer,
              },
              ["Create Restriction"]),
            button({
                className: "btn buttonSecondary",
                style: { 'marginRight': '15px' },
                onClick: this.editRestriction,
                isRendered: this.props.restrictionId !== null && !component.isViewer,
              },
              ["Edit Restrictions"]),
            button({
                className: "btn buttonSecondary",
                onClick: this.showRestriction,
                isRendered: this.props.restrictionId !== null,
              },
                ["View Restrictions"])
            ]),
          ])
      ]),

      div({ isRendered: this.props.isConsentGroup === true && this.props.associatedProjects.length > 0 }, [
        Panel({ title: "Associated Projects" }, [
          Table({
            serverURL: this.props.serverURL,
            headers: associatedProjectsHeaders,
            data: this.props.associatedProjects,
            sizePerPage: 10,
            paginationSize: 10,
            unlinkProject: this.props.handleUnlinkProject,
            handleRedirectToInfoLink: this.props.handleRedirectToInfoLink,
            isAdmin: component.isAdmin,
            isViewer: component.isViewer
          })
        ])
      ]),

      h(Spinner, {
        name: "mainSpinner", group: "orsp", loadingImage: component.loadingImage
      })

    ])
  }
});