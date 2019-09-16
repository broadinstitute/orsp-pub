import { Component } from 'react';
import { button, h, hh } from 'react-hyperscript-helpers';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import { InputFieldSelect } from './InputFieldSelect';
import { InputFieldFile } from './InputFieldFile';
import { Files } from '../util/ajax';
import './ConfirmationDialog.css';
import LoadingWrapper from './LoadingWrapper';

const AddDocumentDialog = hh(class AddDocumentDialog extends Component{
    constructor(props) {
    super(props);
    this.state = {
      alertMessage: '',
      documents: '',
      disableBtn: false,
      disableSendBtn: false,
      typeError: false,
      fileError: false,
      submit: false,
      showAlert: false,
      type: '',
      error: false,
      alertType: 'success',
      file: {
        name: ''
      },
      currentValue: {
        label: ''
      }
    };
    this.upload = this.upload.bind(this);
    this.handleTypeSelect = this.handleTypeSelect.bind(this);
    this.setFilesToUpload = this.setFilesToUpload.bind(this);
  }

  handleClose = () => {
    this.setState(prev => {
      prev.file = {
        name: ''
      };
      prev.typeError = false;
      prev.fileError = false;
      prev.showAlert = false;
      prev.disableBtn = false;
      prev.disableSendBtn = false;
      prev.alertMessage = '';
      prev.type = '';
      return prev;
    });
    this.props.closeModal();
  };

  upload = () => {
    this.setState(prev => {
      prev.submit = true;
      return prev;
    }, () => {
      if (this.isValid()) {
        this.setState(prev => {
          prev.disableBtn = true;
          return prev;
        });
        let file = { file: this.state.file, fileKey: this.state.type.label };
        let files = [file];
        if(this.props.projectKey !== undefined) {
          this.props.showSpinner();
          Files.upload(files, this.props.projectKey, this.props.user.displayName, this.props.user.userName)
          .then(resp => {
            this.props.hideSpinner();
            this.setState(prev => {
              prev.submit = false;
              prev.disableBtn = false;
              prev.file = { name: '' };
              prev.type = '';
              return prev;
            });
            this.props.handleLoadDocuments();
            this.props.closeModal();
          }).catch(error => {
            this.props.hideSpinner();
            this.setState(prev => {
              prev.alertType = 'danger';
              prev.alertMessage = 'Something went wrong. Please try again.';
              prev.showAlert = true;
              prev.submit = false;
              prev.disableBtn = false;
              return prev;
            });
          });
        } else {
          this.props.documentHandler(file);
          this.setState(prev => {
            prev.submit = false;
            prev.disableBtn = false;
            prev.file = { name: '' };
            prev.type = '';
            return prev;
          });
        }

      }
    });
  };

  isValid() {
    let typeError = false;
    let fileError = false;
    if (this.state.submit) {
      if (this.state.file.name === '') {
        fileError = true;
      }
      if (this.state.type === '') {
        typeError = true;
      }
      this.setState(prev => {
        prev.typeError = typeError;
        prev.fileError = fileError;
        return prev;
      });
    }
    return !typeError && !fileError;
  }

  handleTypeSelect = () => (selectedOption) => {
    this.setState(prev => {
      prev.disableBtn = false;
      prev.alertMessage = '';
      prev.typeError = false;
      prev.showAlert = false;
      prev.fileError = false;
      prev.type = selectedOption;
      return prev;
    });
  };

  setFilesToUpload = () => (e) => {
    let selectedFile = e.target.files[0];
    e.target.value = '';
    this.setState(prev => {
      prev.alertMessage = '';
      prev.disableBtn = false;
      prev.showAlert = false;
      prev.fileError = false;
      prev.file = selectedFile;
      return prev;
    });
  };

  removeFile() {
    this.setState(prev => {
      prev.file = {
        name: ''
      };
      return prev;
    });
  }

  render() {

    return (
      h(Modal, {
        show: this.props.show
      },[
          h(ModalHeader, {}, [
            h(ModalTitle, { className: "dialogTitle" }, [this.props.projectKey !== undefined ? 'Add Document to ' + this.props.projectKey : 'Add Document'])
          ]),
          h(ModalBody, { className: "dialogBody" }, [
            InputFieldSelect({
              label: "Type",
              id: "documentType",
              name: "documentType",
              options: this.props.options,
              value: this.state.type,
              onChange: this.handleTypeSelect,
              currentValue: this.state.currentValue,
              error: this.state.typeError,
              errorMessage: "Required field"
            }),
            InputFieldFile({
              label: "File ",
              moreInfo: "(Max file size 15.7 Mb)",
              id: "documentFile",
              name: "documentFile",
              callback: this.setFilesToUpload(this.state.documents),
              fileName: this.state.file.name,
              required: true,
              error: this.state.fileError,
              errorMessage: "Required field",
              removeHandler: () => this.removeFile(document)
            }),
          ]),
          h(ModalFooter, {}, [
            button({ className: "btn buttonSecondary", disabled: this.state.disableBtn, onClick: this.handleClose }, ["Cancel"]),
            button({ className: "btn buttonPrimary", disabled: this.state.disableBtn, onClick: this.upload }, [this.props.projectKey !== undefined ? "Upload" : "Add Document"])
          ])
        ])
    )
  }
});

export default LoadingWrapper(AddDocumentDialog, true);
