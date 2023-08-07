import { Component } from 'react';
import { button, h, hh, br } from 'react-hyperscript-helpers';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import { InputFieldSelect } from './InputFieldSelect';
import { InputFieldFile } from './InputFieldFile';
import { Files, User } from '../util/ajax';
import './ConfirmationDialog.css';
import LoadingWrapper from './LoadingWrapper';
import { KeyDocumentsEnum } from "../util/KeyDocuments";
import { InputFieldText } from './InputFieldText';

const MAX_SIZE = 524288000;

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
      errorMessage: '',
      file: {
        name: ''
      },
      currentValue: {
        label: ''
      },
      dropEvent: null,
      description: '',
      descriptionError: false
    };
    this.upload = this.upload.bind(this);
    this.handleTypeSelect = this.handleTypeSelect.bind(this);
    this.setFilesToUpload = this.setFilesToUpload.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    this.setState(prev => {
      prev.dropEvent= this.props.dropEvent
    }, () => this.setDroppedFilesToUpload())
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
      prev.dropEvent = null;
      prev.descriptionError = false;
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
        let file;
        if (this.state.dropEvent) {
          this.setDroppedFilesToUpload();
          file = { file: this.state.dropEvent, fileKey: this.state.type.label, fileDescription: this.state.description }
        } else {
          file = { file: this.state.file, fileKey: this.state.type.label, fileDescription: this.state.description };
        }
        let files = [file];
        if(this.props.projectKey !== undefined) {
          this.props.showSpinner();
          Files.upload(files, this.props.projectKey, this.props.user.displayName, this.props.user.userName)
            .then(resp => {
              if (this.props.deleteNoConsentReason !== undefined && file.fileKey === KeyDocumentsEnum.CONSENT_DOCUMENT) {
                this.props.deleteNoConsentReason();
              }
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
    let descriptionError = false;
    let errorMessage = '';
    if (this.state.submit) {
      if (this.state.file.name === '') {
        fileError = true;
        errorMessage = 'Required File';
      }
      if (this.state.type === '') {
        typeError = true;
      }
      if (this.state.description === '') {
        descriptionError = true
      }
      this.setState(prev => {
        prev.typeError = typeError;
        prev.fileError = fileError;
        prev.errorMessage = errorMessage;
        prev.descriptionError = descriptionError;
        return prev;
      });
    }
    return !typeError && !fileError && !descriptionError;
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

  handleDescriptionChange = (e) => {
    this.setState({
      description: e.target.value,
      descriptionError: false
    })
  }

  setDroppedFilesToUpload = () => {
    if(this.state.dropEvent) {
      let selectedFile = this.state.dropEvent;
      if(selectedFile.size > MAX_SIZE) {
        this.setState(prev => {
          prev.errorMessage = 'Size exceeded. Max file size 500 Mb.';
          prev.fileError = true;
          prev.file = { name: '' };
          return prev;
        });
      } else {      
        this.setState(prev => {
          prev.alertMessage = '';
          prev.errorMessage = '';
          prev.disableBtn = false;
          prev.showAlert = false;
          prev.fileError = false;
          prev.file = selectedFile;
          return prev;
        });
      }
    }
  };

  setFilesToUpload = () => (e) => {
    let selectedFile = e.target.files[0];
    e.target.value = '';
    if(selectedFile.size > MAX_SIZE) {
      this.setState(prev => {
        prev.errorMessage = 'Size exceeded. Max file size 500 Mb.';
        prev.fileError = true;
        prev.file = { name: '' };
        return prev;
      });
    } else {      

      this.setState(prev => {
        prev.alertMessage = '';
        prev.errorMessage = '';
        prev.disableBtn = false;
        prev.showAlert = false;
        prev.fileError = false;
        prev.file = selectedFile;
        return prev;
      });
    }
  };

  removeFile() {
    this.setState(prev => {
      prev.file = {
        name: ''
      };
      prev.dropEvent = null;
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
            readOnly: false,
            error: this.state.typeError,
            errorMessage: "Required field",
          }),
          InputFieldText({
            id: "docDescription",
            name: "description",
            label: "Document Description",
            value: this.state.description,
            disabled: false,
            require: false,
            onChange: this.handleDescriptionChange,
            error: this.state.descriptionError,
            errorMessage: 'Required field'
          }),
          InputFieldFile({
            label: "File ",
            moreInfo: "(Max file size 500 Mb)",
            id: "documentFile",
            name: "documentFile",
            callback: this.setFilesToUpload(this.state.documents),
            fileName: this.state.file.name || (this.state.dropEvent && this.state.dropEvent.name),
            required: true,
            error: this.state.fileError,
            errorMessage: this.state.errorMessage,
            removeHandler: () => this.removeFile(document)
          }),
        ]),
        h(ModalFooter, {}, [
          button({ 
            ref: el => {
              if(el) {
                  el.style.setProperty('background', 'none', 'important');
                  el.style.setProperty('color', '#000000', 'important');
              }
            },
            className: "btn buttonSecondary", disabled: this.state.disableBtn, onClick: this.handleClose,
        }, ["Cancel"]),
          button({ className: "btn buttonPrimary", disabled: this.state.disableBtn, onClick: this.upload }, [this.props.projectKey !== undefined ? "Upload" : "Add Document"])
        ])
      ])
    )
  }
});

export default LoadingWrapper(AddDocumentDialog, true);
