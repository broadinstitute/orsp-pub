import React, { Component } from 'react';
import { h, h1, div, a, li, ul, h2, hh } from 'react-hyperscript-helpers';
import { ConsentCollectionLink, SampleCollections } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from "../components/Spinner";
import { TableComponent } from "../components/TableComponent";
import { styles } from "../util/ReportConstants";
import { handleRedirectToConsentGroup } from "../util/Utils";
import { format } from 'date-fns';

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
        a({ href: handleRedirectToConsentGroup(component.serverURL, row.consentGroupKey) }, [row.consentGroupKey])
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
    if (row.restriction !== null && new Date(row.restriction.vaultExportDate) < new Date(collection.creationDate)) {
      lis.push(li({style:{'color': 'red'}, key: collection.id}, [value]))
    } else {
      lis.push(li({key: collection.id}, [value]))
    }
  });
  return lis;
}

export const SampleCollectionLinks = hh(class SampleCollectionLinks extends Component {

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
    this.init();
  }
  init = () => {
    spinnerService.showAll();
    this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, this.state.currentPage);
  };

  tableHandler = (offset, limit, search, sort, page) => {
    spinnerService.showAll();
    ConsentCollectionLink.findCollectionLinks().then(result => {
      this.setState(prev => {       
        prev.links = result.data;
        return prev;
      }, () => spinnerService.hideAll())
    }).catch(error => {
      spinnerService.hideAll();
      this.setState(() => { throw error });
    });
  };

  printContent = () => {
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
          sizePerPageList: SIZE_PER_PAGE_LIST
        }),
        h(Spinner, {
          name: "sampleCollectionLink", group: "orsp", loadingImage: component.loadingImage
        })
      ])
    )
  }
});
export default SampleCollectionLinks;
