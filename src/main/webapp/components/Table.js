import { Component } from 'react';
import { a, hh, small, button, span } from 'react-hyperscript-helpers';
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { DropdownButton, MenuItem, ButtonToolbar } from 'react-bootstrap';
import { Btn } from './Btn';
import './Table.css';

export const Table = hh(class Table extends Component {

  constructor(props) {
    super(props);
  }

  formatStatusColumn = (cell, row) => {
    if (row.status === 'Pending' && this.props.isAdmin) {
      return this.renderDropdownButton(row.uuid);
    } else {
      return row.status;
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
    if (false) {
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
  }

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


  render() {
    let isKey = false;

    return (
      <BootstrapTable data={this.props.data}
        striped
        hover
        className='tableContainer'
        pagination={false} // if creationFlow = true
        search={false} // if creationFlow = true
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
                dataSort={true}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'remove') {
              return <TableHeaderColumn dataField={header.value}
                key={header.value}
                dataFormat={this.formatRemoveBtn}
                width={'45px'}></TableHeaderColumn>
            }
            else {
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
