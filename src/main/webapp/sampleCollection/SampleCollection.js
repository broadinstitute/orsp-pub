import React, { Component } from 'react';
import { a, div, h1, hh, span, h } from 'react-hyperscript-helpers';
import { LoginText, Reports } from '../util/ajax';
import { TableComponent } from '../components/TableComponent';
import { SAMPLE_COLLECTION_SORT_NAME_INDEX } from '../util/ReportConstants';
import { TABLE_ACTIONS, formatDataPrintableFormat } from '../util/TableUtil';
import LoadingWrapper from '../components/LoadingWrapper';
import { Link } from 'react-router-dom';
import { exportData, isEmpty } from '../util/Utils';
import { About } from '../components/About';

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
    csvExport: false
  },
  {
    dataField: 'projectKey',
    text: 'Project',
    sort: true,
    formatter: (cell, row, rowIndex, colIndex) => {
      return div({}, [
        h(Link, { to: { pathname: '/project/main', search: '?projectKey=' + row.projectKey}}, [row.projectKey])
      ])
    }
  },
  {
    dataField: 'consentKey',
    text: 'Consent',
    sort: true,
    formatter: (cell, row, rowIndex, colIndex) => {
      return div({}, [
        h(Link, { to: { pathname: '/newConsentGroup/main', search: '?consentKey=' + row.consentKey}}, [row.consentKey])
      ])
    }
  },
  {
    dataField: 'sampleCollectionId',
    text: 'Sample Collection',
    sort: true,
    csvFormatter: (cell, row, rowIndex, colIndex) =>
     !isEmpty(cell) ? cell : ''
  }, 
  {
    dataField: 'status',
    text: 'Status',
    sort: true,
    formatter: (cell, row, rowIndex, colIndex) =>
      span({ title: row.status }, [row.status]),
    csvFormatter: (cell, row, rowIndex, colIndex) =>
     !isEmpty(cell) ? cell : ''
  }
];

const SampleCollection = hh(class SampleCollection extends Component {

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
      collections: [],
      defaultValueCheckForAbout: ''
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.checkDefault();
    this.init();
    this.checkDefault();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  init = () => {
    this.props.showSpinner();
    this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, this.state.currentPage);
  };

  async checkDefault() {
    await LoginText.getLoginText().then(loginText => {
      let data = loginText.data[0];
      if(data[3] === 'default') {
        this.setState({
          defaultValueCheckForAbout: 'default'
        })
      } else {
        this.setState({
          defaultValueCheckForAbout: ''
        })
      }
    })
  }

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
    Reports.getCollectionLinksReport(query).then(result => {
      const lastPage = Math.ceil(result.data.recordsTotal / query.length);
      if (this._isMounted) {
        this.setState(prev => {
          prev.lastPage = lastPage;
          prev.currentPage = page;
          prev.collections = result.data.data;
          prev.recordsTotal = result.data.recordsTotal;
          prev.recordsFiltered = result.data.recordsFiltered;
          prev.sizePerPage = query.length;
          prev.search = query.searchValue;
          prev.sort = {
            orderColumn: query.orderColumn,
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
    }, () => {
      this.tableHandler(this.state.query);
    });
  };

  onSortChange = (sortName, sortOrder) => {
    const sort = {
      sortDirection: sortOrder,
      orderColumn: SAMPLE_COLLECTION_SORT_NAME_INDEX[sortName]
    };
    this.tableHandler(0, this.state.sizePerPage, null, sort)
  };

  onTableChange = (type, newState) => {
    switch (type) {
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
    let cols = columns.filter(el => el.dataField !== 'id');
    let collections = formatDataPrintableFormat(this.state.collections, cols);
    const tableColumnsWidth = [100, 100,'*',80 ,'*','*','*','*','*'];
    const titleText = "Consent Collection Links";
    exportData('print' , null, collections, titleText, '', tableColumnsWidth, 'A3', 'landscape');
  };

  render() {
    return (
      div({}, [
        About({
          isRendered: this.state.defaultValueCheckForAbout !== 'default',
          showWarning: false
        }),
        h1({ style: stylesHeader.pageTitle }, ["Consent Collection Links"]),
        TableComponent({
          remoteProp: true,
          onTableChange: this.onTableChange,
          data: this.state.collections,
          columns: columns,
          keyField: 'id',
          search: true,
          fileName: 'Consent Collection Links',
          showPrintButton: false,
          printComments: this.printContent,
          sizePerPageList: SIZE_PER_PAGE_LIST,
          page: this.state.currentPage,
          totalSize: this.state.recordsFiltered,
          showExportButtons: true,
          showSearchBar: true,
          pagination: true
        })
      ])
    )
  }
});

export default LoadingWrapper(SampleCollection);
