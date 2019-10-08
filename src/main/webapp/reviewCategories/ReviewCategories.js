import React, { Component } from 'react';
import { a, div, h1, hh, span, h } from 'react-hyperscript-helpers';
import { Reports } from '../util/ajax';
import { TableComponent } from '../components/TableComponent';
import { CATEGORY_SORT_NAME_INDEX, styles } from '../util/ReportConstants';
import { TABLE_ACTIONS } from '../util/TableUtil';
import { handleRedirectToProject } from '../util/Utils';
import LoadingWrapper from '../components/LoadingWrapper';
import { Link } from 'react-router-dom';

const stylesHeader = {
  pageTitle: {
    fontWeight: '700', margin: '20px 0', fontSize: '35px', display: 'block'
  }
};

const SIZE_PER_PAGE_LIST = [
  { text: '50', value: 50 },
  { text: '100', value: 100 },
  { text: '500', value: 500 }];

const columns = [
  {
    dataField: 'id',
    text: 'id',
    hidden: true,
    csvExport : false
  } ,
  {
    dataField: 'projectKey',
    text: 'Project',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: styles.reviewCategories.projectKeyWidth};
    },
    formatter: (cell, row, rowIndex, colIndex) => {
      if (row.type === "Consent Group") {
        return div({}, [
          h(Link, {to: { pathname:'/newConsentGroup/main', search: '?consentKey=' + row.projectKey, state: {issueType: 'consent-group', tab: 'documents', consentKey: row.projectKey}}}, [row.projectKey])
        ])
      } else {
        return div({}, [
          h(Link, { to: { pathname: '/project/main', search: '?projectKey=' + row.projectKey, state: { issueType: 'project', projectKey: row.projectKey } } }, [row.projectKey])
        ])
      }
    }
  },
  {
    dataField: 'summary',
    text: 'Summary',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: styles.reviewCategories.summaryWidth};
    },
    formatter: (cell, row, rowIndex, colIndex) =>
    span({title: row.summary},[row.summary])
  }, {
  dataField: 'status',
    text: 'Status',
    sort: true,
    headerStyle: (column, colIndex) => {
      return { width: styles.reviewCategories.statusWidth};
    },
    formatter: (cell, row, rowIndex, colIndex) =>
    span({title: row.status},[row.status]) 
  }, {
    dataField: 'reviewCategory',
    text: 'Review Category',
    sort: false,
    headerStyle: (column, colIndex) => {
      return { width: styles.reviewCategories.reviewCategoryWidth};
    } ,
    formatter: (cell, row, rowIndex, colIndex) =>
    span({title: row.reviewCategory},[row.reviewCategory]) 
  }
];

export const linkFormatter = (row)  => {
  if (row.type === "Consent Group") {
    return h(Link, {to: {pathname:'/newConsentGroup/main', search: '?consentKey=' + row.project, state: {issueType: 'consent-group', tab: 'review', consentKey: row.project}}}, [row.project])
  }
  return h(Link, {to: {pathname:'/project/main', search: '?projectKey=' + row.project, state: {issueType: 'project', tab: 'review', projectKey: row.project}}}, [row.project])
}

const ReviewCategories = hh(class ReviewCategories extends Component {

  _isMounted = false;

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
    this._isMounted = true;
    this.init();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  init = () => {
    this.props.showSpinner();
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
    this.props.showSpinner();
    Reports.getReviewCategory(query).then(result => {
      const lastPage = Math.ceil(result.data.recordsTotal / query.length);
      if (this._isMounted) {
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
        }, () => this.props.hideSpinner())
      }
    }).catch(error => {
      this.props.hideSpinner();
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
      orderColumn: CATEGORY_SORT_NAME_INDEX[sortName]
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
        h1({ style: stylesHeader.pageTitle}, ["Review Category Report"]),
        TableComponent({
          remoteProp: true,
          onTableChange: this.onTableChange,
          data: this.state.categories,
          columns: columns,
          keyField: 'projectKey',
          search: true,
          fileName: 'Review Categories Report',
          showPrintButton: false,
          printComments: this.printContent,
          sizePerPageList: SIZE_PER_PAGE_LIST,
          page: this.state.currentPage,
          totalSize: this.state.recordsFiltered,
          showExportButtons: false,
          showSearchBar: true,
          pagination: true
        })
      ])
    )
  }
});

export default LoadingWrapper(ReviewCategories);
