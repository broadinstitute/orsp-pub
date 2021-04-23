import { Component } from 'react';
import { div, h1, hh } from 'react-hyperscript-helpers';
import { Table } from '../components/Table';
import { OrganizationManagementEdit } from '../components/OrganizationManagementEdit';
import { Organization } from '../util/ajax';
import { TablePaginator } from '../components/TablePaginator';
import LoadingWrapper from '../components/LoadingWrapper';

const tableHeaders =
  [
    { name: 'Organization Name', value: 'name' }
  ];

  const stylesHeader = {
    pageTitle: {
      fontWeight: '700', margin: '20px 0', fontSize: '35px', display: 'block'
    }
  };

  const SORT_NAME_INDEX = {
    'name': 0
  };

const OrganizationsManagement = hh(class OrganizationsManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sizePerPage: 15,
      search: null,
      sort: {
        sortDirection: 'asc',
        orderColumn: null
      },
      currentPage: 1,
      organizations: [],
      editOrganizationDialog: false,
      editOrganizationRowData: {},
      showError: false,
      isAdmin: true
    };
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    this.props.showSpinner();
    this.setState({ isAdmin: component.isAdmin });
    this.tableHandler(0, this.state.sizePerPage, this.state.search, this.state.sort, this.state.currentPage);
  };

  editOrganizationHandler = (data) => () => {
    this.setState(prev => {
      prev.editOrganizationDialog = !this.state.editOrganizationDialog;
      if (data !== undefined) {
        prev.editOrganizationRowData = data;
      }
      return prev;
    });
  };

  closeModal = () => () => {
    this.setState(prev => {
      prev.editOrganizationDialog = false;
      return prev;
    });
  };

  submit = (rowUpdated) => {
    this.setState(prev => {
      prev.editOrganizationDialog = false;
      prev.organizations.find(it => it.id === rowUpdated.id).name = rowUpdated.name;
      return prev;
    });
  };

  onSearchChange = (search) => {
    this.tableHandler(0, this.state.sizePerPage, search, this.state.sort, 1);
  };

  onPageChange = (page) => {
    const offset = (page - 1) * this.state.sizePerPage;
    this.tableHandler(offset, this.state.sizePerPage, this.state.search, this.state.sort, page);
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
      orderColumn: SORT_NAME_INDEX[sortName]
    };
    this.tableHandler(0, this.state.sizePerPage, null, sort)
  };


  tableHandler = (offset, limit, search, sort, page) => {
    let query = {
        draw: 1,
        start: offset,
        length: limit,
        orderColumn: sort.orderColumn,
        sortDirection: sort.sortDirection,
        searchValue: search,
    };

    Organization.getAllOrganizations(query).then(result => {
      const lastPage = Math.ceil(result.data.recordsFiltered / query.length);
      this.setState(prev => {
        prev.lastPage = lastPage;
        prev.currentPage = page;
        prev.isAdmin = this.state.isAdmin;
        prev.organizations = result.data.data;
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
    }).catch(error => {
      this.setState(() => { throw error });
    });

  };
  

   render() {
    return(
      div({ className: "roles-management" },[
        h1({ style: stylesHeader.pageTitle}, ["Organizations"]),
        Table({
          headers: tableHeaders,
          isAdmin: this.state.isAdmin,
          data: this.state.organizations,
          editOrganization: this.editOrganizationHandler,
          reviewFlow: true,
          pagination: false,
          tableHandler: this.tableHandler,
          onSearchChange: this.onSearchChange,
          onSortChange: this.onSortChange
        }),
        TablePaginator({
          onPageChange: this.onPageChange,
          currentPage: this.state.currentPage,
          lastPage: this.state.lastPage
        }),
        OrganizationManagementEdit({
          closeModal: this.closeModal,
          closeOnSubmit: this.submit,
          show: this.state.editOrganizationDialog,
          isRendered: this.state.editOrganizationDialog,
          organizationData : this.state.editOrganizationRowData
        })
      ])
    );  
  }
});

export default LoadingWrapper(OrganizationsManagement);
