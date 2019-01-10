import { Component, Fragment } from 'react';
import { input, hh, h, div, p, hr, small } from 'react-hyperscript-helpers';
import React from 'react';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

export const Table = hh(class Table extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BootstrapTable data={this.props.data}
        striped
        hover
        search={this.props.search}
        pagination={true}
        options={{
          paginationSize: this.props.paginationSize,
          paginationPosition: 'bottom',
          sizePerPage: this.props.sizePerPage
        }}>
        {
          this.props.headers.map((header, index) => {
            if (index == 0) {
              return <TableHeaderColumn key={header.name} isKey dataField={header.value} dataSort={ true }>{header.name}</TableHeaderColumn>
            } else {
              return <TableHeaderColumn key={header.name} dataField={header.value} dataSort={ true }>{header.name}</TableHeaderColumn>
            }
          })
        }
      </BootstrapTable>
    );
  }
})
