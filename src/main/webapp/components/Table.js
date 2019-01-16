import { Component } from 'react';
import { a, hh, h, div, p, hr, small } from 'react-hyperscript-helpers';
import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { DropdownButton, MenuItem, ButtonToolbar } from 'react-bootstrap';
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

   formaUrlDocument = (cell, row) => {
     return a({
       href: `${this.props.downloadDocumentUrl}?uuid=${row.uuid}`,
       target: '_blank'
     }, [row.fileName])
   };

   render() {
    return (

       <BootstrapTable data={this.props.data}
                      striped
                      hover
                      className='tableContainer'
                      pagination={true}
                      options={{
                        paginationSize: this.props.paginationSize,
                        paginationPosition: 'bottom',
                        sizePerPage: this.props.sizePerPage
                      }}>
        {
          this.props.headers.map((header, index) => {
            if (index === 0) {
              return <TableHeaderColumn key={header.name} isKey dataField={header.value} dataSort={true}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'status') {
              return <TableHeaderColumn key={header.name}
                                        dataField={header.value}
                                        dataFormat={this.formatStatusColumn}
                                        dataSort={true}>{header.name}</TableHeaderColumn>
            } else if (header.value === 'fileName') {
              return <TableHeaderColumn key={header.name}
                                        dataField={header.value}
                                        dataFormat={this.formaUrlDocument}
                                        dataSort={true}>{header.name}</TableHeaderColumn>
            } else {
              return <TableHeaderColumn key={header.name} dataField={header.value} dataSort={ true }>{header.name}</TableHeaderColumn>
            }
          })
        }
      </BootstrapTable>
    );
  }
});
