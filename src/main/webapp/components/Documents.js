import React, { Component, Fragment } from 'react';
import { button, div, h, h3, hh, p } from 'react-hyperscript-helpers';
import { Table } from './Table';
import { Panel } from './Panel';
import AddDocumentDialog from './AddDocumentDialog'
import { KeyDocumentsEnum } from '../util/KeyDocuments';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { DocumentHandler } from '../util/ajax';
import DataUseLetter from './DataUseLetterLink';
import './Documents.css';
import { UrlConstants } from '../util/UrlConstants';
import { Link } from 'react-router-dom';
import { TableComponent } from './TableComponent';
import { DEFAULT_SORTED } from '../util/TableUtil';
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import moment from 'moment';
import { Btn } from './Btn';

const styles = {
  buttonWithLink: {
    textDecoration: 'none',
    color: '#FFFFFF',
    document: {
      documentTypeWidth: '179px',
      documentFileNameWidth: '323px',
      documentCreatorWidth: '130px',
      documentVersionWidth: '90px',
      documentStatusWidth: '140px',
      documentCreationDateWidth: '140px',
      documentDeleteDocWidth: '80px'
    }
  }
};

const columnsStyles = {
  document: {
    documentTypeWidth: '179px',
    documentFileNameWidth: '323px',
    documentCreatorWidth: '130px',
    documentVersionWidth: '90px',
    documentStatusWidth: '140px',
    documentCreationDateWidth: '140px'
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
    { name: '', value: 'removeFile' }
  ];

const columns = (_this) => [{
  dataField: 'id',
  text: 'Id',
  hidden: true,
  csvExport : false
}, {
  dataField: 'fileType',
  text: 'Document Type',
  sort: true,
  headerStyle: (column, colIndex) => {
    return { width: columnsStyles.document.documentTypeWidth };
  }
}, {
  dataField: 'fileName',
  text: 'File Name',
  sort: true,
  headerStyle: (column, colIndex) => {
    return { width: columnsStyles.document.documentFileNameWidth };
  },
  formatter: (cell, row, rowIndex, colIndex) => {
    return h(Link, {to: '/'},[cell])
  }
}, {
  dataField: 'creator',
  text: 'Author',
  sort: true,
  headerStyle: (column, colIndex) => {
    return { width: columnsStyles.document.documentCreatorWidth };
  }

}, {
  dataField: 'docVersion',
  text: 'Version',
  sort: true,
  headerStyle: (column, colIndex) => {
    return { width: columnsStyles.document.documentVersionWidth };
  }
}, {
  dataField: 'status',
  text: 'Status',
  sort: true,
  headerStyle: (column, colIndex) => {
    return { width: columnsStyles.document.documentStatusWidth };
  },
  formatter: (cell, row, rowIndex, colIndex) => {
    if (row.status === 'Pending' && component.isAdmin) {
      return h(ButtonToolbar, {}, [
        h(DropdownButton, {
          style:{ boxShadow: 'none', padding: '4px 10px', outline: 'none', marginLeft: '5px' },
          bsStyle: 'default',
          title: 'Pending',
          key: 0,
          id: `dropdown-basic-0`
        },[
          h(MenuItem, { onSelect: _this.actionApprove, eventKey: row.uuid },['Approve']),
          h(MenuItem, { onSelect: _this.actionReject, eventKey: row.uuid },['Reject'])
        ])
      ])
    } else {
      return row.status;
    }
  }
}, {
  dataField: 'creationDate',
  text: 'Created',
  sort: true,
  sortFunc: (a, b, order, dataField, rowA, rowB) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    if (order === 'asc') {
      return dateA > dateB ? -1 : dateA < dateB ? 1 : 0
    }
    else return dateB > dateA ? -1 : dateB < dateA ? 1 : 0
  },
  headerStyle: (column, colIndex) => {
    return { width: columnsStyles.document.documentCreationDateWidth };
  },
  formatter: (cell, row, rowIndex, colIndex) => {
    return moment(cell).format('MM/DD/YY')
  }
}, {
  dataField: '',
  text: '',
  align: 'center',
  headerStyle: (column, colIndex) => {
    return { width: columnsStyles.document.documentDeleteDocWidth };
  },
  formatter: (cell, row, rowIndex, colIndex) => {
    return Btn({
      action: {
        labelClass: "glyphicon glyphicon-remove",
        handler: () => _this.remove(row)
      }
    })
  }
}];

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
    };
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

  remove = (row) => {
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

  actionApprove = (uuid) => {
    this.props.handleDialogConfirm(uuid, 'Approve');
  };

  actionReject = (uuid) => {
    this.props.handleDialogConfirm(uuid, 'Reject');
  };

  render() {
    const { restriction = [] } = this.props;
    return div({}, [
      h(AddDocumentDialog, {
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
        TableComponent({
          remoteProp: false,
          data: this.props.documents,
          columns: columns(this),
          keyField: 'id',
          search: true,
          fileName: 'ORSP',
          showPrintButton: false,
          printComments: this.printComments,
          defaultSorted: DEFAULT_SORTED,
          pagination: true,
          showExportButtons: false,
          hideXlsxColumns: [],
          showSearchBar: true
        })
      ]),

      Panel({
        title: "Data Use Limitation Record Request",
        isRendered: this.props.isConsentGroup === true && !component.isViewer
      }, [
          h(DataUseLetter, {
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
