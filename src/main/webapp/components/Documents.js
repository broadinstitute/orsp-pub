import { Component, Fragment } from 'react';
import { hh, h, h3, div, p, button } from 'react-hyperscript-helpers';
import { Table } from './Table';
import { Panel } from './Panel';
import { AddDocumentDialog } from './AddDocumentDialog'
import { KeyDocumentsEnum } from '../util/KeyDocuments';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { DocumentHandler } from '../util/ajax';
import { DataUseLetter } from './DataUseLetterLink';
import './Documents.css';
import { UrlConstants } from "../util/UrlConstants";
import { Link } from 'react-router-dom';

const styles = {
  buttonWithLink: {
    textDecoration: 'none',
    color: '#FFFFFF',
    marginRight: '15px'
  }
};

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
      documentToRemove: null,
      error: false
    }
    this.removeDocument = this.removeDocument.bind(this);
  }

  addDocuments = () => {
    this.setState({
      showAddKeyDocuments: !this.state.showAddKeyDocuments
    });
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
    DocumentHandler.delete(this.state.documentToRemove.id).
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
    const { restriction = [] } = this.props;
    return div({}, [
      AddDocumentDialog({
        showSpinner: this.props.showSpinner,
        hideSpinner: this.props.hideSpinner,
        closeModal: this.closeModal,
        show: this.state.showAddKeyDocuments,
        options: this.props.options,
        projectKey: this.props.projectKey,
        user: this.props.user,
        handleLoadDocuments: this.props.handleLoadDocuments,
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

      Panel({
        title: "Data Use Limitation Record Request",
        isRendered: this.props.isConsentGroup === true
      }, [
          DataUseLetter({
            showSpinner: this.props.showSpinner,
            hideSpinner: this.props.hideSpinner,
            userName: this.props.userName,
            projectKey: this.props.projectKey,
          })
        ]),

      div({ isRendered: this.props.restriction !== undefined }, [
        Panel({
          title: "Data Use Restrictions",
          isRendered: (component.isAdmin || component.isViewer) && this.findDul()
        }, [
            h3({
              style: { 'marginTop': '10px' },
              isRendered: this.props.restrictionId !== null
            }, ["Summary"]),
            div({
              isRendered: restriction.length > 1
            }, [
                restriction.map((elem, index) => {
                  return h(Fragment, { key: index }, [
                    div({ style: { 'marginBottom': '10px' } }, [
                      div({ style: { 'marginTop': '10px' }, className: index === 0 ? 'first' : 'indented' }, [elem])
                    ]),
                  ]);
                }),
              ]),
            div({ className: "row", style: { "marginTop": "20px" } }, [
              div({ className: "col-xs-12" }, [
                h(Link, {
                  isRendered: this.props.restrictionId === null && this.findDul() && !component.isViewer, className: "btn buttonPrimary floatLeft",
                  to: { pathname: UrlConstants.restrictionUrl, search: '?create=true&consentKey=' + this.props.projectKey }, style: styles.buttonWithLink
                }, ["Create Restriction"]),
                h(Link, {
                  isRendered: this.props.restrictionId !== null && !component.isViewer, className: "btn buttonPrimary floatLeft",
                  to: { pathname: UrlConstants.restrictionUrl, search: '?restrictionId=' + this.props.restrictionId + '&consentKey=' + this.props.projectKey }, style: styles.buttonWithLink
                }, ["Edit Restriction"]),
                h(Link, {
                  isRendered: this.props.restrictionId !== null, className: "btn buttonPrimary floatLeft",
                  to: { pathname: UrlConstants.showRestrictionUrl, search: '?restrictionId=' + this.props.restrictionId }, style: styles.buttonWithLink
                }, ["View Restrictions"])
              ])
            ]),
          ])
      ]),
      div({ isRendered: this.props.isConsentGroup === true && this.props.associatedProjects.length > 0 }, [
        Panel({ title: "Associated Projects" }, [
          Table({
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
      ])
    ])
  }
});
