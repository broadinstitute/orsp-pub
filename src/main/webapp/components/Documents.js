import React, { Component, Fragment } from 'react';
import { button, div, h, h3, hh, p, a, br } from 'react-hyperscript-helpers';
import { Panel } from './Panel';
import AddDocumentDialog from './AddDocumentDialog'
import { KeyDocumentsEnum } from '../util/KeyDocuments';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { DocumentDescription, DocumentHandler, User } from '../util/ajax';
import DataUseLetter from './DataUseLetterLink';
import './Documents.css';
import './Table.css';
import { UrlConstants } from '../util/UrlConstants';
import { Link } from 'react-router-dom';
import { TableComponent } from './TableComponent';
import { createLinkToProject, DEFAULT_SORTED, downloadUrlDocument } from '../util/TableUtil';
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import moment from 'moment';
import { Btn } from './Btn';
import LoadingWrapper from './LoadingWrapper';

const styles = {
  buttonWithLink: {
    textDecoration: 'none',
    color: '#FFFFFF'
  },
  dropDownBtn: {
    padding: '2px 10px'
  }
};

const tableStyles = {
  columns: {
    documentTypeWidth: '140px',
    documentFileNameWidth: '240px',
    documentDescrptionNameWidth: '170px',
    documentCreatorWidth: '130px',
    documentVersionWidth: '90px',
    documentStatusWidth: '100px',
    documentCreationDateWidth: '120px'
  },
  buttonToolbarCell: {
    position: 'absolute',
    marginTop: '-2px'
  }
};

const buttonToolbarCell = {
  position: 'absolute',
  marginTop: '-2px'
};

const columns = [
  {
    dataField: 'id',
    text: 'Id',
    hidden: true,
    editable: false,
    csvExport : false
  }, {
    dataField: 'fileType',
    text: 'Document Type',
    sort: true,
    editable: false,
    headerStyle: (column, colIndex) => {
      return { width: tableStyles.columns.documentTypeWidth };
    }
  }, {
    dataField: 'fileName',
    text: 'File Name',
    sort: true,
    editable: false,
    headerStyle: (column, colIndex) => {
      return { width: tableStyles.columns.documentFileNameWidth };
    },
    formatter: (cell, row, rowIndex, colIndex) => {
      return downloadUrlDocument(cell, row)
    }
  }, {
    dataField: 'description',
    text: 'File Description',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: tableStyles.columns.documentDescrptionNameWidth };
    }
  }, {
    dataField: 'creator',
    text: 'Author',
    sort: true,
    editable: false,
    headerStyle: (column, colIndex) => {
      return { width: tableStyles.columns.documentCreatorWidth };
    }
  }, {
    dataField: 'docVersion',
    text: 'Version',
    sort: true,
    editable: false,
    headerStyle: (column, colIndex) => {
      return { width: tableStyles.columns.documentVersionWidth };
    }
  }, {
    dataField: 'status',
    text: 'Status',
    sort: true,
    editable: false,
    headerStyle: (column, colIndex) => {
      return { width: tableStyles.columns.documentStatusWidth };
    },
    formatter: (cell, row, rowIndex, colIndex) => {
      if (row.status === 'Pending' && component.isAdmin) {
        return h(ButtonToolbar, { style: buttonToolbarCell }, [
          h(DropdownButton, {
            style: styles.dropDownBtn,
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
    text: 'Created On',
    sort: true,
    editable: false,
    sortFunc: (a, b, order, dataField, rowA, rowB) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      if (order === 'asc') {
        return dateA > dateB ? -1 : dateA < dateB ? 1 : 0
      }
      else return dateB > dateA ? -1 : dateB < dateA ? 1 : 0
    },
    headerStyle: (column, colIndex) => {
      return { width: tableStyles.columns.documentCreationDateWidth };
    },
    formatter: (cell, row, rowIndex, colIndex) => {
      return moment(cell).format('MM/DD/YY')
    }
  }, {
    dataField: '',
    text: '',
    align: 'center',
    editable: false,
    formatter: (cell, row, rowIndex, colIndex) => {
      return Btn({
        action: {
          labelClass: "glyphicon glyphicon-remove",
          handler: () => _this.remove(row)
        }
      })
    }
  }
];

const associatedProjectColumns = [
  {
    dataField: 'id',
    text: 'Id',
    hidden: true,
    editable: false
  },
  {
    dataField: 'type',
    text: 'Type',
    sort: true,
    editable: false
  },
  {
    dataField: 'summary',
    text: 'Summary',
    sort: true,
    editable: false,
    formatter: (cell, row, rowIndex, colIndex) => {
      return createLinkToProject(cell, row)
    }
  }
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
      error: false,
      dropEvent: null,
      showSaveAndCancel: false,
      columns: (_this) => [
        {
          dataField: 'id',
          text: 'Id',
          hidden: true,
          editable: false,
          csvExport : false
        }, {
          dataField: 'fileType',
          text: 'Document Type',
          sort: true,
          editable: false,
          headerStyle: (column, colIndex) => {
            return { width: tableStyles.columns.documentTypeWidth };
          }
        }, {
          dataField: 'fileName',
          text: 'File Name',
          sort: true,
          editable: false,
          headerStyle: (column, colIndex) => {
            return { width: tableStyles.columns.documentFileNameWidth };
          },
          formatter: (cell, row, rowIndex, colIndex) => {
            return downloadUrlDocument(cell, row)
          }
        }, {
          dataField: 'description',
          text: 'File Description',
          sort: true,
          headerStyle: (column, colIndex) => {
            return { width: tableStyles.columns.documentDescrptionNameWidth };
          },
          events: {
            onClick: (e) => {
              e.detail === 2 ? this.saveAndCancelShow() : undefined
            }
          }
        }, {
          dataField: 'creator',
          text: 'Author',
          sort: true,
          editable: false,
          headerStyle: (column, colIndex) => {
            return { width: tableStyles.columns.documentCreatorWidth };
          }
        }, {
          dataField: 'docVersion',
          text: 'Version',
          sort: true,
          editable: false,
          headerStyle: (column, colIndex) => {
            return { width: tableStyles.columns.documentVersionWidth };
          }
        }, {
          dataField: 'status',
          text: 'Status',
          sort: true,
          editable: false,
          headerStyle: (column, colIndex) => {
            return { width: tableStyles.columns.documentStatusWidth };
          },
          formatter: (cell, row, rowIndex, colIndex) => {
            if (row.status === 'Pending' && component.isAdmin) {
              return h(ButtonToolbar, { style: buttonToolbarCell }, [
                h(DropdownButton, {
                  style: styles.dropDownBtn,
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
          text: 'Created On',
          sort: true,
          editable: false,
          sortFunc: (a, b, order, dataField, rowA, rowB) => {
            const dateA = new Date(a);
            const dateB = new Date(b);
            if (order === 'asc') {
              return dateA > dateB ? -1 : dateA < dateB ? 1 : 0
            }
            else return dateB > dateA ? -1 : dateB < dateA ? 1 : 0
          },
          headerStyle: (column, colIndex) => {
            return { width: tableStyles.columns.documentCreationDateWidth };
          },
          formatter: (cell, row, rowIndex, colIndex) => {
            return moment(cell).format('MM/DD/YY')
          }
        }, {
          dataField: '',
          text: '',
          align: 'center',
          editable: false,
          formatter: (cell, row, rowIndex, colIndex) => {
            return Btn({
              action: {
                labelClass: "glyphicon glyphicon-remove",
                handler: () => _this.remove(row)
              }
            })
          }
        }
      ]
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
    this.setState({ 
      showAddKeyDocuments: !this.state.showAddKeyDocuments,
      dropEvent: null
    }, () => console.log(this.props.documents));
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

  dropHandler = (event) => {
    event.preventDefault();
    let file
    if (event.dataTransfer.items) {
        [...event.dataTransfer.items].forEach((item, i) => {
            if (item.kind === 'file') {
                file = item.getAsFile();
            }
        })
    }
    this.setState(prev => {
      prev.dropEvent = file;
    }, () => {
      this.addDocuments();
    })
  }

  dragOverHandler(event) {
    event.preventDefault();
  }

  saveAndCancelShow() {
    this.setState({
      showSaveAndCancel: true
    })
  }

  saveHandler = (data) => {
    this.setState({
      showSaveAndCancel: false
    }, async () => {
      let name;
      let documents = this.props.documents
      await User.getUserSession().then(user => {
        name = user.data.displayName;
      })
      if (documents) 
        documents.forEach(doc => {
          data.forEach(editedDoc => {
            if (doc.uuid === editedDoc.uuid) {
              if (doc.description !== editedDoc.description) {
                console.log(editedDoc);
                DocumentDescription.updateDocumentDescription(editedDoc.uuid, editedDoc.description, editedDoc.projectKey, name)
                .catch(err => {
                  console.log(err)
                  throw err;
                })
              }
            }
          })
        })
      }
    })
  }

  cancelHandler = () => {
    this.setState({
      showSaveAndCancel: false
    })
  }

  render() {
    const { restriction = [] } = this.props;
    return div({}, [
      h(AddDocumentDialog, {
        isRendered: this.state.showAddKeyDocuments,
        closeModal: this.closeModal,
        show: this.state.showAddKeyDocuments,
        options: this.props.options,
        projectKey: this.props.projectKey,
        user: this.props.user,
        handleLoadDocuments: this.props.handleLoadDocuments,
        userName: this.props.userName,
        isConsentGroup: this.props.isConsentGroup,
        deleteNoConsentReason: this.props.deleteNoConsentReason,
        dropEvent: this.state.dropEvent,
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
        br(),
        div({
          isRendered: !component.isViewer,
          id: 'drop_zone',
          onDrop: this.dropHandler,
          onDragOver: this.dragOverHandler,
          style: {padding: '10px 0 10px 0', textAlign: 'center', border: '1px solid #ddd', width: '100%'}
        }, [
          p(['Drag and drop your documents here or ', a({onClick:() => {this.addDocuments()}}, ['click here to add documents'])])
        ]),br(),
        TableComponent({
          remoteProp: false,
          data: this.props.documents,
          columns: this.state.columns(this),
          keyField: 'id',
          search: true,
          fileName: 'ORSP',
          showPrintButton: false,
          printComments: () => {},
          defaultSorted: DEFAULT_SORTED,
          pagination: true,
          showExportButtons: false,
          hideXlsxColumns: [],
          showSearchBar: true,
          showSaveAndCancel: this.state.showSaveAndCancel,
          saveHandler: this.saveHandler,
          cancelHandler: this.cancelHandler 
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
                ])
              ]);
            })
          ]),
          div({ className: "row", style: { "marginTop": "20px" } }, [
            div({ className: "col-xs-12" }, [
              h(Link, {
                isRendered: this.props.restrictionId === null && this.findDul() && !component.isViewer, className: "btn buttonPrimary floatLeft",
                to: { pathname: UrlConstants.restrictionUrl, search: '?create=true&consentKey=' + this.props.projectKey }, style: styles.buttonWithLink
              }, ["Create Restriction"]),
              h(Link, {
                isRendered: this.props.restrictionId !== null && !component.isViewer, className: "btn buttonPrimary floatLeft",
                to: { pathname: UrlConstants.restrictionUrl, search: '?restrictionId=' + this.props.restrictionId + '&consentKey=' + this.props.projectKey, state: { fromConsentGroup: true }}, style: styles.buttonWithLink
              }, ["Edit Restriction"]),
              h(Link, {
                isRendered: this.props.restrictionId !== null, className: "btn buttonPrimary floatLeft",
                to: { pathname: UrlConstants.showRestrictionUrl, search: '?restrictionId=' + this.props.restrictionId }, style: styles.buttonWithLink
              }, ["View Restrictions"])
            ])
          ])
        ])
      ]),
      div({ isRendered: this.props.isConsentGroup === true && this.props.associatedProjects.length > 0 }, [
        Panel({ title: "Associated Projects" }, [
          TableComponent({
            remoteProp: false,
            data: this.props.associatedProjects,
            columns: associatedProjectColumns,
            keyField: 'id',
            search: true,
            fileName: 'ORSP',
            showPrintButton: false,
            printComments: () => {},
            defaultSorted: DEFAULT_SORTED,
            pagination: true,
            showExportButtons: false,
            hideXlsxColumns: [],
            showSearchBar: false
          })
        ])
      ])
    ])
  }
});

