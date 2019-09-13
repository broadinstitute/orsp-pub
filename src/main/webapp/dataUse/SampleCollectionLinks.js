import React, { Component } from 'react';
import { h, h1, div, li, ul, h2, hh } from 'react-hyperscript-helpers';
import { ConsentCollectionLink } from "../util/ajax";
import { TableComponent } from "../components/TableComponent";
import { styles } from "../util/ReportConstants";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { isEmpty } from "../util/Utils";
import LoadingWrapper from "../components/LoadingWrapper";

const SIZE_PER_PAGE_LIST = [
  { text: '50', value: 50 },
  { text: '100', value: 100 },
  { text: '500', value: 500 }
];
const columns = [
  {
    dataField: 'consentGroupKey',
    text: 'Consent Group',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width:  styles.consentCollection.consentKeyWidth};
    },
    formatter: (cell, row, rowIndex, colIndex) =>
      div({}, [
        h(Link, {to: {pathname:'/newConsentGroup/main', search: '?consentKey=' + row.consentGroupKey, state: {issueType: 'consent-group', tab: 'documents', consentKey: row.consentGroupKey}}}, [row.consentGroupKey])
      ])
  },
  {
    dataField: 'id',
    text: 'Sample Collection(s)',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width:  styles.consentCollection.collectionsWidth};
    },
    formatter: (cell, row, rowIndex, colIndex) => 
      div({}, [
        ul({},[getValue(row)])        
      ])    
  },
  {
    dataField: 'vaultExportDate',
    text: 'DUOS Export',
    sort: true,
    formatter: (cell, row, rowIndex, colIndex) =>
      div({}, [
        row.restriction !== null && row.restriction.vaultExportDate ? format(row.restriction.vaultExportDate, 'MM/DD/YYYY') : ''
      ])
  }
];

function getValue(row) {
  let lis = [];
  row.collections.map(collection => {
    let value = collection.sampleCollectionId + ': ' + collection.sampleCollectionName + '(associated on ' + format(collection.creationDate, 'MM/DD/YYYY')  + ')'
    if (row.restriction !== null && !isEmpty(row.restriction.vaultExportDate) && new Date(row.restriction.vaultExportDate) < new Date(collection.creationDate)) {
      lis.push(li({style:{'color': 'red'}, key: collection.id}, [value]))
    } else {
      lis.push(li({key: collection.id}, [value]))
    }
  });
  return lis;
}

const SampleCollectionLinks = hh(class SampleCollectionLinks extends Component {

  _isMount = false;

  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 50,
      search: null,
      sort: {
        sortDirection: 'asc',
        orderColumn: null
      },
      currentPage: 1,
      links: []
    };
  }
  componentDidMount() {
    this._isMount = true;
    this.init();
  }

  componentWillUnmount() {
    this._isMount = false;
  }

  init = () => {
    this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, this.state.currentPage);
  };

  tableHandler = (offset, limit, search, sort, page) => {
    this.props.showSpinner();
    ConsentCollectionLink.findCollectionLinks().then(result => {
      if (this._isMount) {
        this.setState(prev => {
          prev.links = result.data;
          return prev;
        }, () => this.props.hideSpinner())
      }
    }).catch(() => {
      this.props.hideSpinner();
    });
  };

  render() {
    return (
      div({}, [
        h1({style: {'marginBottom':'0'}}, ["Consent Groups and Sample Collections"]),
        h2({}, ["The following consent groups have sample collection associations."]),
        TableComponent({
          remoteProp: false,
          data: this.state.links,
          columns: columns,
          keyField: 'consentGroupKey',
          search: true,
          fileName: 'ORSP',
          showPrintButton: false,
          printComments: this.printComments,
          showExportButtons: false,
          showSearchBar: true,
          sizePerPageList: SIZE_PER_PAGE_LIST,
          pagination: true
        })
      ])
    )
  }
});
export default LoadingWrapper(SampleCollectionLinks);
