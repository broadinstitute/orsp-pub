import { Component } from 'react';
import { button, div, h, hh } from 'react-hyperscript-helpers';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { AlertMessage } from './AlertMessage';
import { Project, Search } from '../util/ajax';
import { isEmpty } from '../util/Utils';
import './ConfirmationDialog.css';
import LoadingWrapper from './LoadingWrapper';

const UserListDialog = hh(class UserListDialog extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      submit: false,
      orspAdmins: [],
      assignedAdmin: null
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.loadORSPAdmins();
  }

  componentWillUnmount() {
    this._isMounted = false;
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
      prev.assignedAdmin = { key: '', value: '', label: '' }
      return prev;
    })
    this.props.closeModal();
  };

  submit = async ()  => {
    this.setState(prev => {
      prev.submit = true;
      return prev;
    });
    const data = { assignedAdmin: this.state.assignedAdmin.key };
    await Project.addExtraProperties(this.props.issueKey, data);
    this.handleClose();
    this.props.success();
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
          }),
          div({ style: { 'marginTop': '15px' } }, [
            AlertMessage({
              msg: this.state.alertMessage,
              show: this.state.showAlert
            }),
          ])
        ]),

        h(ModalFooter, {}, [
          button({ className: "btn buttonSecondary", disabled: this.state.disableBtn, onClick: this.handleClose }, ["Cancel"]),
          button({ className: "btn buttonPrimary", disabled: this.state.disableBtn, onClick: this.submit }, ["Submit"])
        ])
      ])
    )
  }
});

export default LoadingWrapper(UserListDialog, true);
