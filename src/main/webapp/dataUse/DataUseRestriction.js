import React, { Component } from 'react';
import { h, h1, div, a, hh } from 'react-hyperscript-helpers';
import { DataUse } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { Spinner } from "../components/Spinner";
import { TableComponent } from "../components/TableComponent";
import { RESTRICTION_SORT_NAME_INDEX, styles } from "../util/ReportConstants";
import { TABLE_ACTIONS } from "../util/TableUtil";
import  { UrlConstants }  from '../util/UrlConstants';
import { isEmpty } from "../util/Utils";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const SIZE_PER_PAGE_LIST = [
  { text: '50', value: 50 },
  { text: '100', value: 100 },
  { text: '500', value: 500 }];

const columns = [
  {
    dataField: 'consentGroupKey',
    text: 'Consent Group',
    sort: true,
    formatter: (cell, row, rowIndex, colIndex) =>
    div({},[
      h(Link, {to: {pathname:'/newConsentGroup/main', search: '?consentKey=' + row.consentGroupKey, state: {issueType: 'consent-group', tab: 'documents', consentKey: row.consentGroupKey}}}, [row.consentGroupKey])
    ])
  },
  {
    dataField: 'id',
    text: 'View Restrictions',
    sort: false,
    formatter: (cell, row, rowIndex, colIndex) =>
    div({},[
      h(Link, {to: {pathname: UrlConstants.showRestrictionUrl, search: '?restrictionId=' + row.id, state: {restrictionId: row.id}}}, ['View Restriction'])
    ])
  },
  {
    dataField: 'vaultExportDate',
    text: 'DUOS Export',
    sort: true,
    formatter: (cell, row, rowIndex, colIndex) =>
    div({},[
      !isEmpty(row.vaultExportDate) ? format(new Date(row.vaultExportDate), 'MM/DD/YYYY') : ''
    ])
  }
];
export const DataUseRestriction = hh(class DataUseRestriction extends Component {
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
      categories: []
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
    let query = {
      draw: 1,
      start: offset,
      length: limit,
      orderColumn: sort.orderColumn,
      sortDirection: sort.sortDirection,
      searchValue: search
    };
    spinnerService.showAll();
    DataUse.getRestrictions(query).then(result => {
      const lastPage = Math.ceil(result.data.recordsTotal / query.length);
      this.setState(prev => {
        prev.lastPage = lastPage;
        prev.currentPage = page;
        prev.categories = result.data.data;
        prev.recordsTotal = result.data.recordsTotal;
        prev.recordsFiltered = result.data.recordsFiltered;
        prev.sizePerPage = query.length;
        prev.search = query.searchValue;
        prev.sort = {
          orderColumn : query.orderColumn,
          sortDirection: query.sortDirection
        };
        return prev;
      }, () => spinnerService.hideAll())
    }).catch(error => {
      spinnerService.hideAll();
      this.setState(() => { throw error });
    });
  };

  onSearchChange = (search) => {
    this.tableHandler(0, this.state.sizePerPage, search, this.state.sort, 1);
  };

  onPageChange = (page, sizePerPage) => {
    const offset = (page - 1) * sizePerPage;
    this.tableHandler(offset, sizePerPage, this.state.search, this.state.sort, page);
  };

  onSizePerPageListHandler = (size) => {
    this.setState(prev => {
      prev.query.length = size;
      return prev;
    }, () =>{
      this.tableHandler(this.state.query);
    });
  };

  onSortChange = (sortName, sortOrder) => {
    const sort = {
      sortDirection: sortOrder,
      orderColumn: RESTRICTION_SORT_NAME_INDEX[sortName]
    };
    this.tableHandler(0, this.state.sizePerPage, null, sort)
  };

  onTableChange = (type, newState) => {
    switch(type) {
      case TABLE_ACTIONS.SEARCH: {
        this.onSearchChange(newState.searchText);
        break
      }
      case TABLE_ACTIONS.FILTER: {
        // Not implemented
        break;
      }
      case TABLE_ACTIONS.PAGINATION: {
        this.onPageChange(newState.page, newState.sizePerPage);
        break;
      }
      case TABLE_ACTIONS.SORT: {
        this.onSortChange(newState.sortField, newState.sortOrder);
        break;
      }
    }
  };

  printContent = () => {
  };

  render() {
    return(
      div({},[
        h1({}, ["Data Use Restrictions"]),
        TableComponent({
          remoteProp: true,
          onTableChange: this.onTableChange,
          data: this.state.categories,
          columns: columns,
          keyField: 'consentGroupKey',
          search: true,
          fileName: 'Data Use Restrictions',
          showPrintButton: false,
          printComments: this.printContent,
          sizePerPageList: SIZE_PER_PAGE_LIST,
          page: this.state.currentPage,
          totalSize: this.state.recordsFiltered,
          showExportButtons: false,
          showSearchBar: true,
          pagination: true
        }),
        h(Spinner, {
          name: "mainSpinner", group: "orsp", loadingImage: component.loadingImage
        })
      ])
    )
  }
});
export default DataUseRestriction;
