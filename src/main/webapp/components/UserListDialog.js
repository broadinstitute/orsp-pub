import { Component } from 'react';
import { button, div, h, hh } from 'react-hyperscript-helpers';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { Project, Search } from '../util/ajax';
import './ConfirmationDialog.css';
import LoadingWrapper from './LoadingWrapper';
import isEmpty from 'lodash/isEmpty';

const UserListDialog = hh(class UserListDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      submit: false,
      orspAdmins: [],
      assignedAdmin: null
    };
  }

  componentDidMount() {
    this.loadORSPAdmins();
  }

  loadORSPAdmins() {
    Search.getORSPAdmins().then(response => {
      let orspAdmins = response.data.map(function (item) {
        return {
          key: item.id,
          value: item.value,
          label: item.label
        };
      })
      this.setState(prev => {
        prev.orspAdmins = orspAdmins;
        return prev;
      })
    });
  }

  handleClose = () => {
    this.setState(prev => {
      prev.assignedAdmin = null;
      return prev;
    })
    this.props.closeModal();
  };

  submit = async ()  => {
    this.setState(prev => {
      prev.submit = true;
      return prev;
    });
    const assignedAdmin = this.state.assignedAdmin;
    const issueKey = this.props.issueKey;
    const data = { actor: assignedAdmin.key };
    await Project.addExtraProperties(issueKey, data);
    this.handleClose();
    this.props.success(issueKey, assignedAdmin.value);
  }


  handleSelect = (field) => () => (selectedOption) => {
    this.setState(prev => {
      prev.assignedAdmin = selectedOption;
      return prev;
    });
  };

  render() {

    return (
      h(Modal, {
        show: this.props.show
      }, [
        h(ModalHeader, {}, [
          h(ModalTitle, { className: "dialogTitle" }, ['Assign an Admin to ' + this.props.issueKey])
        ]),
        h(ModalBody, { className: "dialogBody" }, [
          InputFieldSelect({
            label: "Admin:",
            id: "assignedAdmin",
            name: "assignedAdmin",
            options: this.state.orspAdmins,
            value: this.state.assignedAdmin,
            onChange: this.handleSelect("assignedAdmin"),
            placeholder: "Select...",
            readOnly: false,
            edit: false
          })
        ]),

        h(ModalFooter, {}, [
          button({ className: "btn buttonSecondary", onClick: this.handleClose }, ["Cancel"]),
          button({ className: "btn buttonPrimary", disabled: isEmpty(this.state.assignedAdmin), onClick: this.submit }, ["Submit"])
        ])
      ])
    )
  }
});

export default LoadingWrapper(UserListDialog, true);
