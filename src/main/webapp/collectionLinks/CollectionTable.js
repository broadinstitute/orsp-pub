import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { a, div } from 'react-hyperscript-helpers';

function projectLinkFormatter(cell, row) {
  return a({href: '../project/main?projectKey=' + row.project_key}, [row.project_key]);
}

function consentLinkFormatter(cell, row) {
  return a({href: '../consentGroup/show/' + row.consent_key}, [row.consent_key]);
}

export default class CollectionTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data
    }
  }

  render() {
    return (
      div([<BootstrapTable data={this.state.data}
                           striped
                           hover
                           pagination={true}
                           options={{
                             noDataText: 'No data available',
                             paginationSize: 10,
                             paginationPosition: 'bottom',
                             sizePerPage: 50
                           }}>
        <TableHeaderColumn dataFormat={projectLinkFormatter} filter={ { type: 'TextFilter', delay: 1000 } } dataField='project_key' isKey width={'20%'} dataSort={ true }>Project</TableHeaderColumn>
        <TableHeaderColumn dataFormat={consentLinkFormatter} filter={ { type: 'TextFilter', delay: 1000 } } dataField='consent_key' width={'20%'} dataSort={ true }>Consent</TableHeaderColumn>
        <TableHeaderColumn filter={ { type: 'TextFilter', delay: 1000 } } dataField='sample_collection_id' width={'60%'} dataSort={ true }>Sample Collection</TableHeaderColumn>
      </BootstrapTable>])
    )
  }
}
