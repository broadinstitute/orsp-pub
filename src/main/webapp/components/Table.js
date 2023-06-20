import React, { Component, Fragment } from 'react';
import { format } from 'date-fns';
import { a, button, div, hh, span, h } from 'react-hyperscript-helpers';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap';
import { Btn } from './Btn';
import './Table.css';
import { downloadSelectedFile, handleRedirectToProject } from "../util/Utils";
import { formatRoleName } from "../util/roles";
import { UrlConstants } from "../util/UrlConstants";
import { isEmpty } from "../util/Utils";
import { Link } from 'react-router-dom';

const styles = { 
  statusWidth: '140',
  fileTypeWidth: '170',
  fileDescription: '7%',
  fileName: '5%',
  userNameWidth: '180',
  docVersionWidth: '90',
  creatorWidth: '130',
  infoLinkWidth: '96',
  creationDateWidth: '140',
  removeWidth: '50',
  removeWidthFile: '80',
  unlinkSampleCollectionWidth: '80',
  collectionNameWidth: '270',
  numberWidth: '2%',
  createDateWidth: '15',
  submissionDocumentsWidth: '200',
  submissionComments: '20%',
  submissionActions: '3%',
  createdWidth: '4%',
  linkOverflowEllipsis: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#337ab7'
  },
  numberColumnWidth: '2%',
  descColumnWidth: '20%',
  fileNameColumnWidth: '5%',
  fileDescColumnWidth: '7%',
  authorColumnWidth: '4%',
  createdColumnWidth: '3%',
  actionsColumnWidth: '3%'
};

export const Table = hh(class Table extends Component {

  constructor(props) {
    super(props);
    this.state = {
      cellEditProp: {
        mode: 'dbclick',
        blurToSave: true,
        afterSaveCell: this.props.onAfterSaveCell  //  a hook for after saving cell
      }
    }
    this.formatUrlDocument = this.formatUrlDocument.bind(this);
  }

  formatStatusColumn = (cell, row) => {
    if (row.status === 'Pending' && this.props.isAdmin) {
      return this.renderDropdownButton(row.uuid);
    } else {
      return row.status;
    }
  };

  parseCreateDate = (date) => {
    if (!isEmpty(date)) {
      const simpleDate = new Date(date);
      return format(simpleDate, 'MM/DD/YY')
    }
  };

  renderDropdownButton = (uuid) => {
    return (
      <ButtonToolbar>
        <DropdownButton
          className={'dropdownButton'}
          bsStyle={'default'}
          title={'Pending'}
          key={0}
          id={`dropdown-basic-0`}
        >
          <MenuItem onSelect={this.actionApprove} eventKey={uuid} >Approve</MenuItem>
          <MenuItem onSelect={this.actionReject} eventKey={uuid} >Reject</MenuItem>
        </DropdownButton>
      </ButtonToolbar>
    );

  };

  formatTooltip = (cell, row) => {
    return span ({
      title: row.collectionName
    },
    [row.collectionName]
    );
  };

  actionApprove = (uuid) => {
    this.props.handleDialogConfirm(uuid, 'Approve');
  };

  actionReject = (uuid) => {
    this.props.handleDialogConfirm(uuid, 'Reject');
  };

  formatUrlDocument = (cell, row) => {
    let urlObject = {};
    if (isEmpty(row.uuid)) {
      urlObject = downloadSelectedFile(row.file);
    }

    return a({
      href: isEmpty(row.uuid) ? urlObject :`${UrlConstants.downloadDocumentUrl}?uuid=${row.uuid}`,
      target: '_blank',
      title: row.fileName,
      download: row.fileName,
    }, [row.fileName])
  };

  formatRemoveBtn = (cell, row) => {
    let btn = component.isViewer ? null :
     Btn({
      action: {
        labelClass: "glyphicon glyphicon-remove",
        handler: () => this.props.remove(row)
      },
    });

    return btn;
  };

  unlinkProject = (row) => {
    let btn = this.props.isViewer ? null : 
    button({
      className: "btn btn-xs",
      onClick: this.props.unlinkProject(row),
      disabled: !this.props.isAdmin
    }, ["Unlink"]);

    return btn;
  };

  redirectToProject = (cell, row) => {
    const url = handleRedirectToProject(component.serverURL, row.projectKey);
    return a({
      href: url,
      target: '_blank'
    }, [row.projectKey + ": " + row.summary])
  };

  redirectToInfoLink = (cell, row) => {
    const url = this.props.handleRedirectToInfoLink(row.id, row.linkedProjectKey);
    return h(Link, {
      to: url,
      target:"_blank"
    }, ["Info Link"])
  };

  documentLink = (cell, row) => {
    let documents = [];
    cell.forEach(data => {
      if (data.document !== undefined) {
        documents.push([
          div({style: styles.linkOverflowEllipsis, key: data.document.id}, [
            a({
              href: `${UrlConstants.downloadDocumentUrl}?uuid=${data.document.uuid}`,
              target: '_blank',
              title: data.document.fileType,
            }, [
              span({
                className: 'glyphicon glyphicon-download submission-download'
              }, []), " ",
              data.document.fileName
            ])
          ])
        ]);
      }
    });
    return h(Fragment, {} , [...documents]) ;
  };

  submissionEdit = (cell, row) => {
    return this.props.submissionEdit(row);
  };

  redirectToSampleCollectionLinkedProject = (cell, row) => {
    const url = handleRedirectToProject(component.serverURL, row.linkedProjectKey);
    return a({
      href: url,
      target: '_blank'
    }, [row.linkedProjectKey])
  };

  unlinkSampleCollectionButton = (cell, row) => {
    const btn = this.props.isViewer ? null :
      button({
        className: "btn btn-xs",
        onClick: this.unlinkSampleCollection(row),
        disabled: !this.props.isAdmin
      }, ["Unlink"]);
    return btn;
  };

  roleSelection = (cell,row) => {
    return this.props.isViewer ? null :
      div({className : "roles-container"}, [
        span({}, [formatRoleName(row.roles)]),
        button({
            className: "btn btn-default btn-sm edit",
            onClick: this.props.editRole(row),
            disabled: !this.props.isAdmin,
            title: "Edit"
          }, [
            span({className: "glyphicon glyphicon-pencil"}, [])
          ]
      )]);
  };

  organizationSelection = (cell,row) => {
    return this.props.isViewer ? null :
      div({className : "roles-container"}, [
        span({}, [row.name]),
        button({
          style: { 'marginLeft': '10px'},
          className: "btn btn-default btn-sm edit",
          onClick: this.props.deleteOrganization(row),
          disabled: !this.props.isAdmin,
          title: "Delete"
          }, [
            span({className: "glyphicon glyphicon-trash"}, [])
        ]),
        button({
            className: "btn btn-default btn-sm edit",
            onClick: this.props.editOrganization(row),
            disabled: !this.props.isAdmin,
            title: "Edit"
          }, [
            span({className: "glyphicon glyphicon-pencil"}, [])
          ]
       )
    ]);
  };

  unlinkSampleCollection = (data) => (e) => {
    this.props.unlinkSampleCollection(data);
  };

  render() {
    let isKey = false;
    return (
      <BootstrapTable data={this.props.data}
        cellEdit={ !component.isViewer ? this.state.cellEditProp : false }
        striped
        hover
        className='tableContainer'
        pagination={this.props.pagination}
        search={this.props.reviewFlow}
        options={{
          paginationSize: this.props.paginationSize,
          paginationPosition: 'bottom',
          sizePerPage: this.props.sizePerPage,
          onSizePerPageList: this.props.onSizePerPageListHandler,
          onPageChange: this.props.onPageChange,
          onSearchChange: this.props.onSearchChange,
          onSortChange: this.props.onSortChange
        }}>
        {
          this.props.headers.map((header, index) => {
            isKey = (index === 0);
            if(header.value === 'fileDescription') {
              return <TableHeaderColumn
                key={header.name}
                dataField={header.value}
                dataSort={true}
                width={styles.fileDescription}>{header.name}</TableHeaderColumn>
            }
            if(header.value === 'submissionsFileDesc') {
              return <TableHeaderColumn
                key={header.name}
                dataField={header.value}
                dataSort={true}
              width={styles.fileDescColumnWidth}>{header.name}</TableHeaderColumn>
            }
            if (header.value === 'status') {
              return <TableHeaderColumn key={header.name}
                dataField={header.value}
                dataFormat={this.formatStatusColumn}
                dataSort={true}
                editable={ false }
                width={styles.statusWidth}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'fileType') {
              return <TableHeaderColumn 
                isKey={isKey}
                key={header.name}
                dataField={header.value}
                dataSort={true}
                editable={ false }
                width={styles.fileTypeWidth}>{header.name}</TableHeaderColumn>
            } 
            else if (header.value === 'docVersion') {
              return <TableHeaderColumn 
                isKey={isKey}
                key={header.name}
                dataField={header.value}
                dataSort={true}
                editable={ false }
                width={styles.docVersionWidth}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'creator') {
              return <TableHeaderColumn 
                isKey={isKey}
                key={header.name}
                dataField={header.value}
                dataSort={true}
                editable={ false }
                width={styles.creatorWidth}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'submissionsAuthor') {
              return <TableHeaderColumn 
                isKey={isKey}
                key={header.name}
                dataField={header.value}
                dataSort={true}
                editable={ false }
                width={styles.authorColumnWidth}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'userName') {
              return <TableHeaderColumn 
                isKey={isKey}
                key={header.name}
                dataField={header.value}
                editable={ false }
                width={styles.userNameWidth}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'fileName') {
              return <TableHeaderColumn key={header.name}
                dataField={header.value}
                dataFormat={this.formatUrlDocument}
                editable={ false }
                dataSort={true}
                width={styles.fileName}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'projectKey') {
              return <TableHeaderColumn isKey={isKey}
                key={header.name}
                dataField={header.value}
                dataFormat={this.unlinkProject}
                editable={ false }
                dataSort={true}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'summary') {
              return <TableHeaderColumn isKey={isKey}
                key={header.name}
                dataField={header.value}
                dataFormat={this.redirectToProject}
                editable={ false }
                dataSort={ true }>{header.name}</TableHeaderColumn>
            } else if (header.value === 'infoLink') {
              return <TableHeaderColumn isKey={isKey}
                key={header.name}
                dataField={header.value}
                dataFormat={this.redirectToInfoLink}
                dataSort={ true }
                editable={ false }
                width={styles.infoLinkWidth}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'creationDate') {
              return <TableHeaderColumn isKey={isKey}
                key={header.name}
                dataField={header.value}
                dataFormat={this.parseCreateDate}
                dataSort={ true }
                editable={ false }
                width={styles.creationDateWidth}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'remove') {
              return <TableHeaderColumn isKey={isKey}
                dataField={header.value}
                key={header.value}
                dataFormat={this.formatRemoveBtn}
                editable={ false }
                width={styles.removeWidth}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'removeFile') {
              return <TableHeaderColumn isKey={isKey}
                dataField={header.value}
                key={header.value}
                dataFormat={this.formatRemoveBtn}
                editable={ false }
                width={styles.removeWidthFile}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'unlinkSampleCollection') {
              return <TableHeaderColumn isKey={isKey}
                key={index.toString()}
                dataField={header.value}
                dataFormat={this.unlinkSampleCollectionButton}
                editable={ false }
                width={styles.unlinkSampleCollectionWidth}>{"Unlink"}</TableHeaderColumn>
            } else if (header.value === 'linkedProjectKey') {
              return <TableHeaderColumn isKey= {isKey}
                key={header.name}
                dataField={header.value}
                editable={ false }
                dataFormat={this.redirectToSampleCollectionLinkedProject}
                dataSort={ true }>{header.name}</TableHeaderColumn>
            } else if (header.value === 'roles') {
              return <TableHeaderColumn isKey= {isKey}
                key={header.name}
                dataField={header.value}
                editable={ false }
                dataFormat={this.roleSelection}
                >{header.name}</TableHeaderColumn>
            } else if (header.value === 'name') {
                return <TableHeaderColumn isKey= {isKey}
                  key={header.name}
                  dataField={header.value}
                  editable={ false }
                  dataFormat={this.organizationSelection}
                  >{header.name}</TableHeaderColumn>
            } else if (header.value ==='collectionName') {
                return <TableHeaderColumn isKey={isKey}
                dataField={header.value}
                dataFormat={this.formatTooltip}
                key={header.value}
                editable={ false }
                width={styles.collectionNameWidth}>{header.name}</TableHeaderColumn>
            } else if (header.value ==='number') {
              return <TableHeaderColumn isKey={isKey}
                key={header.value}
                dataField={header.value}
                editable={ false }
                dataSort={ true }
                width={styles.numberWidth}>{header.name}</TableHeaderColumn>
            } else if (header.value ==='submissionsNumber') {
              return <TableHeaderColumn isKey={isKey}
                key={header.value}
                dataField={header.value}
                editable={ false }
                dataSort={ true }
                width={styles.numberColumnWidth}>{header.name}</TableHeaderColumn>            
            } else if (header.value === 'comments') {
              return <TableHeaderColumn isKey={isKey}
                key={header.value}
                dataField={header.value}
                editable={ false }
                dataFormat={this.submissionEdit}
                dataSort={ true }
                width={styles.submissionComments}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'submissionsDesc') {
              return <TableHeaderColumn isKey={isKey}
                key={header.value}
                dataField={header.value}
                editable={ false }
                dataFormat={this.submissionEdit}
                dataSort={ true }
                width={styles.descColumnWidth}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'documents') {
              return <TableHeaderColumn
                key={header.value}
                dataField={header.value}
                editable={ false }
                dataFormat={this.documentLink}
                dataSort={ true }
                width={styles.submissionDocumentsWidth}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'submissionsFilename') {
              return <TableHeaderColumn
                key={header.value}
                dataField={header.value}
                editable={ false }
                dataFormat={this.documentLink}
                dataSort={ true }
                width={styles.fileNameColumnWidth}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'createDate') {
              return <TableHeaderColumn isKey={isKey}
                key={header.value}
                dataField={header.value}
                editable={ false }
                dataFormat={this.parseCreateDate}
                dataSort={ true }
                width={styles.createdWidth}>{header.name}</TableHeaderColumn>
            } else {
              return <TableHeaderColumn isKey={isKey}
                key={header.name}
                dataField={header.value}
                editable={ false }
                dataSort={true}>{header.name}</TableHeaderColumn>
            }
          })
        }
      </BootstrapTable>
    );
  }
});
