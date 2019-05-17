import { Component } from 'react';
import React from 'react';
import { format } from 'date-fns';
import { a, hh, button, span } from 'react-hyperscript-helpers';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DropdownButton, MenuItem, ButtonToolbar } from 'react-bootstrap';
import { Btn } from './Btn';
import './Table.css';

export const Table = hh(class Table extends Component {

  constructor(props) {
    super(props);
    this.formatUrlDocument = this.formatUrlDocument.bind(this);
  }

  formatStatusColumn = (cell, row) => {
    if (row.status === 'Pending' && this.props.isAdmin) {
      return this.renderDropdownButton(row.uuid);
    } else {
      return row.status;
    }
  };

  parseDate = (date) => {
    if (date !== null) {
      const simpleDate = new Date(date);
      return format(simpleDate, 'M/D/YY h:m A')
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

  actionApprove = (uuid) => {
    this.props.handleDialogConfirm(uuid, 'Approve');
  };

  actionReject = (uuid) => {
    this.props.handleDialogConfirm(uuid, 'Reject');
  };

  formatUrlDocument = (cell, row) => {
    if (this.props.reviewFlow) {
      return a({
        href: `${this.props.downloadDocumentUrl}?uuid=${row.uuid}`,
        target: '_blank'
      }, [row.fileName])
    } else {
      return span({}, [row.fileName])
    }
  };

  formatRemoveBtn = (cell, row) => {
    return Btn({
      action: {
        labelClass: "glyphicon glyphicon-remove",
        handler: this.props.remove(row)
      },
    })
  };

  unlinkProject = (row) => {
    return button({
      className: "btn btn-xs",
      onClick: this.props.unlinkProject(row),
      disabled: !this.props.isAdmin
    }, ["Unlink"])
  };

  redirectToProject = (cell, row) => {
    const url = this.props.handleRedirectToProject(row.projectKey);
    return a({
      href: url,
      target: '_blank'
    }, [row.projectKey + ": " + row.summary])
  };

  redirectToInfoLink = (cell, row) => {
    const url = this.props.handleRedirectToInfoLink(row.projectKey);
    return a({
      href: url,
      target: '_blank'
    }, ["Info Link"])
  };

  render() {
    let isKey = false;

    return (
      <BootstrapTable data={this.props.data}
        striped
        hover
        className='tableContainer'
        pagination={this.props.reviewFlow}
        search={this.props.reviewFlow}
        options={{
          paginationSize: this.props.paginationSize,
          paginationPosition: 'bottom',
          sizePerPage: this.props.sizePerPage
        }}>
        {
          this.props.headers.map((header, index) => {
            isKey = (index === 0);
            if (header.value === 'status') {
              return <TableHeaderColumn key={header.name}
                dataField={header.value}
                dataFormat={this.formatStatusColumn}
                dataSort={true}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'fileName') {
              return <TableHeaderColumn key={header.name}
                dataField={header.value}
                dataFormat={this.formatUrlDocument}
                dataSort={true}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'projectKey') {
              return <TableHeaderColumn isKey={isKey}
                key={header.name}
                dataField={header.value}
                dataFormat={this.unlinkProject}
                dataSort={true}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'summary') {
              return <TableHeaderColumn isKey={isKey}
                key={header.name}
                dataField={header.value}
                dataFormat={this.redirectToProject}
                dataSort={ true }>{header.name}</TableHeaderColumn>
            } else if (header.value === 'infoLink') {
              return <TableHeaderColumn isKey={isKey}
                key={header.name}
                dataField={header.value}
                dataFormat={this.redirectToInfoLink}
                dataSort={ true }>{header.name}</TableHeaderColumn>
            } else if (header.value === 'creationDate') {
              return <TableHeaderColumn isKey={isKey}
                key={header.name}
                dataField={header.value}
                dataFormat={this.parseDate}
                dataSort={ true }>{header.name}</TableHeaderColumn>
            } else if (header.value === 'remove') {
              return <TableHeaderColumn isKey={isKey}
                dataField={header.value}
                key={header.value}
                dataFormat={this.formatRemoveBtn}
                width={'45px'}>{header.name}</TableHeaderColumn>
            } else {
              return <TableHeaderColumn isKey={isKey}
                key={header.name}
                dataField={header.value}
                dataSort={true}>{header.name}</TableHeaderColumn>
            }
          })
        }
      </BootstrapTable>
    );
  }
});
