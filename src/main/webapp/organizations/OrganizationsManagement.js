import { Component } from 'react';
import { a, div, h1, hh } from 'react-hyperscript-helpers';
import { Table } from '../components/Table';
import { OrganizationManagementEdit } from '../components/OrganizationManagementEdit';
import { Organization } from '../util/ajax';
import { Panel } from '../components/Panel';
import LoadingWrapper from '../components/LoadingWrapper';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { About } from '../components/About';

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

  const styles = {

    add: {
      position: 'absolute', right: '15px', zIndex: '1'
    }
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
      rowData: {},
      showError: false,
      isAdmin: true,
      showRemoveModal: false,
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
        prev.rowData = data;
      }
      return prev;
    });
  };
  
  deleteOrganizationHandler = (data) => () => {
    this.setState(prev => {
      prev.showRemoveModal = !this.state.showRemoveModal;
      if (data !== undefined) {
        prev.rowData = data;
      }
      return prev;
    });
  };

  deleteOrganization = () => {
    Organization.deleteOrganization(this.state.rowData.id).
      then(resp => {
        this.closeRemoveModal();
        this.init();
      }).catch(error => {
        this.setState(() => { throw error; });
      });
  };

  closeRemoveModal = () => {
    this.setState({ showRemoveModal: !this.state.showRemoveModal });
  };

  closeModal = () => () => {
    this.setState(prev => {
      prev.editOrganizationDialog = false;
      return prev;
    });
  };

  submit = (rowUpdated) => {
    if (rowUpdated.id) {
      this.setState(prev => {
        prev.editOrganizationDialog = false;
        prev.organizations.find(it => it.id === rowUpdated.id).name = rowUpdated.name;
        return prev;
      });
    } else {
      this.setState(prev => {
        prev.editOrganizationDialog = false;
        return prev;
      });
      this.init();
    }
    
  };

  addOrganizationHandler = () => {
    this.setState(prev => {
      prev.editOrganizationDialog = !this.state.editOrganizationDialog;
      const data = {id: null, name: '', active: true, deleted: false};
      prev.rowData = data;
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
        prev.organizations = result.data;
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
      div({}, [
        About({showWarning: false}),
        Panel({ title: "Organizations" }, [
        div({ className: "roles-management" },[
          a({
            isRendered: this.state.isAdmin,
            onClick: this.addOrganizationHandler,
            className: "btn btn-primary",
            style: styles.add
          }, ["Add"]),
          Table({
            headers: tableHeaders,
            isAdmin: this.state.isAdmin,
            data: this.state.organizations,
            editOrganization: this.editOrganizationHandler,
            deleteOrganization: this.deleteOrganizationHandler,
            reviewFlow: true,
            pagination: false,
            tableHandler: this.tableHandler,
            onSearchChange: this.onSearchChange,
            onSortChange: this.onSortChange
          }),
          ConfirmationDialog({
            closeModal: this.closeRemoveModal,
            show: this.state.showRemoveModal,
            handleOkAction: this.deleteOrganization,
            title: 'Delete Organization',
            bodyText: 'Are you sure you want to delete this organization?',
            actionLabel: 'Yes'
          }, []),
          OrganizationManagementEdit({
            closeModal: this.closeModal,
            closeOnSubmit: this.submit,
            show: this.state.editOrganizationDialog,
            isRendered: this.state.editOrganizationDialog,
            organizationData : this.state.rowData
          })
        ])
      ])
    ])
    );  
  }
});

export default LoadingWrapper(OrganizationsManagement);
