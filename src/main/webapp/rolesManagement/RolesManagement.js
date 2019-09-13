import { Component } from 'react';
import { hh, div, h1 } from 'react-hyperscript-helpers';
import { Table } from "../components/Table";
import { RoleManagementEdit } from "../components/RoleManagementEdit";
import { User } from "../util/ajax";
import { TablePaginator } from "../components/TablePaginator";
import LoadingWrapper from "../components/LoadingWrapper";

const tableHeaders =
  [
    { name: 'User Name', value: 'userName' },
    { name: 'Display Name', value: 'displayName' },
    { name: 'Email Address', value: 'emailAddress' },
    { name: 'Roles', value: 'roles' },
  ];

  const stylesHeader = {
    pageTitle: {
      fontWeight: '700', margin: '20px 0', fontSize: '35px', display: 'block'
    }
  };

  const SORT_NAME_INDEX = {
    'userName': 0,
    'displayName': 1,
    'emailAddress': 2
  };

const RolesManagement = hh(class RolesManagement extends Component {

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
      users: [],
      editRoleDialog: false,
      editRoleRowData: {},
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

  editRoleHandler = (data) => () => {
    this.setState(prev => {
      prev.editRoleDialog = !this.state.editRoleDialog;
      if (data !== undefined) {
        prev.editRoleRowData = data;
      }
      return prev;
    });
  };

  closeModal = () => () => {
    this.setState(prev => {
      prev.editRoleDialog = false;
      return prev;
    });
  };

  submit = (userUpdated) => {
    this.setState(prev => {
      prev.editRoleDialog = false;
      prev.users.find(it => it.id === userUpdated.id).roles = userUpdated.roles;
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

    User.getAllUsers(query).then(result => {
      const lastPage = Math.ceil(result.data.recordsFiltered / query.length);
      this.setState(prev => {
        prev.lastPage = lastPage;
        prev.currentPage = page;
        prev.isAdmin = this.state.isAdmin;
        prev.users = result.data.data;
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
        h1({ style: stylesHeader.pageTitle}, ["Roles Management"]),
        Table({
          headers: tableHeaders,
          isAdmin: this.state.isAdmin,
          data: this.state.users,
          editRole: this.editRoleHandler,
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
        RoleManagementEdit({
          closeModal: this.closeModal,
          closeOnSubmit: this.submit,
          show: this.state.editRoleDialog,
          isRendered: this.state.editRoleDialog,
          userData : this.state.editRoleRowData
        })
      ])
    );  
  }
});

export default LoadingWrapper(RolesManagement);
