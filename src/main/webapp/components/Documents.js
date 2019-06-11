import { Component, Fragment } from 'react';
import { input, hh, h, h3, div, p, hr, small, button, ul, li } from 'react-hyperscript-helpers';
import { Table } from './Table';
import { Panel } from './Panel';
import { AddDocumentDialog } from './AddDocumentDialog'
import { KeyDocumentsEnum } from '../util/KeyDocuments';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { DocumentHandler } from  '../util/ajax';

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
      showAddKeyDocuments: false,
      showAddAdditionalDocuments: false,
      showRemoveDocuments: false,
      documentToRemove: null
    }
    this.removeDocument = this.removeDocument.bind(this);
  }

  addDocuments = () => {
    this.setState({
      showAddKeyDocuments: !this.state.showAddKeyDocuments
    });
  };

  newRestriction = () => {
    window.location.href = this.props.newRestrictionUrl + '?create=true&id=' + this.props.projectKey;
  };

  editRestriction = () => {
    window.location.href =  this.props.serverURL + "/dataUse/edit/" + this.props.restrictionId;
  };

  showRestriction = () => {
    window.location.href =  this.props.serverURL + "/dataUse/show/" + this.props.restrictionId;
  };

  closeRemoveModal = () => {
    this.setState({ showRemoveDocuments: !this.state.showRemoveDocuments });
  };

  closeModal = () => {
    this.setState({showAddKeyDocuments: !this.state.showAddKeyDocuments});
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
   DocumentHandler.delete(this.props.removeDocumentUrl, this.state.documentToRemove.id).
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

  render() {
    const {restriction = []} = this.props;

    return div({}, [
      AddDocumentDialog({
        closeModal: this.closeModal,
        show: this.state.showAddKeyDocuments,
        options: this.props.options,
        attachDocumentsUrl: this.props.attachDocumentsUrl,
        projectKey: this.props.projectKey,
        user: this.props.user,
        handleLoadDocuments: this.props.handleLoadDocuments,
        serverURL: this.props.serverURL,
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
      Panel({title: "Documents"}, [
        p({ isRendered: this.props.docsClarification },[this.props.docsClarification]),
        button({
          className: "btn buttonSecondary",
          style: addDocumentBtn,
          onClick: this.addDocuments,
          isRendered: !this.props.user.isViewer,
        }, ["Add Document"]),
        Table({
          headers: headers,
          data: this.props.documents,
          sizePerPage: 10,
          paginationSize: 10,
          handleDialogConfirm: this.props.handleDialogConfirm,
          downloadDocumentUrl: this.props.downloadDocumentUrl,
          isAdmin: this.props.user.isAdmin,
          isViewer: this.props.user.isViewer,
          reviewFlow: true,
          remove: this.remove
        })
      ]),
      div({
        isRendered: this.props.restriction !== undefined
      }, [
        Panel({
          title: "Data Use Restrictions",
          isRendered: (this.props.user.isAdmin || this.props.user.isViewer) && this.findDul()
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
                style: {'marginRight': '15px'},
                onClick: this.newRestriction,
                isRendered: this.props.restrictionId === null && this.findDul() && !this.props.user.isViewer,
              },
              ["Create Restriction"]),
            button({
                className: "btn buttonSecondary",
                style: {'marginRight': '15px'},
                onClick: this.editRestriction,
                isRendered: this.props.restrictionId !== null && !this.props.user.isViewer,
              },
              ["Edit Restrictions"]),
            button({
                className: "btn buttonSecondary",
                onClick: this.showRestriction,
                isRendered: this.props.restrictionId !== null,
              },
              ["View Restrictions"])
          ]),
        ]),
        div({isRendered: this.props.isConsentGroup === true && this.props.associatedProjects.length > 0}, [
          Panel({title: "Associated Projects"}, [
            Table({
              serverURL: this.props.serverURL,
              headers: associatedProjectsHeaders,
              data: this.props.associatedProjects,
              sizePerPage: 10,
              paginationSize: 10,
              unlinkProject: this.props.handleUnlinkProject,
              handleRedirectToInfoLink: this.props.handleRedirectToInfoLink,
              isAdmin: this.props.user.isAdmin,
              isViewer: this.props.user.isViewer
            })
          ])
        ])
      ])
    ])
  }
});
