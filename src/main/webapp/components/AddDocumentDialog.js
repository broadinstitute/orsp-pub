import { Component } from 'react';
import { button, h, hh } from 'react-hyperscript-helpers';
import { Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle } from 'react-bootstrap';
import { InputFieldSelect } from './InputFieldSelect';
import { InputFieldFile } from './InputFieldFile';
import { Files } from '../util/ajax';
import './ConfirmationDialog.css';
import LoadingWrapper from './LoadingWrapper';
import { KeyDocumentsEnum } from "../util/KeyDocuments";

const MAX_SIZE = 15700000;

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
      dropEvent: {}
    };
    this.upload = this.upload.bind(this);
    this.handleTypeSelect = this.handleTypeSelect.bind(this);
    this.setFilesToUpload = this.setFilesToUpload.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    this.setState({
      dropEvent: this.props.dropEvent
    })
    this.setDroppedFilesToUpload();
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
      prev.dropEvent = {}
      return prev;
    });
    this.props.closeModal();
  };

  upload = () => {
    console.log('upload worked')
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
          console.log('Drop event',this.state.dropEvent)
          this.setDroppedFilesToUpload();
          file = { file: this.state.dropEvent, fileKey: this.state.type.label }
        } else {
          console.log('upload else worked')
          file = { file: this.state.file, fileKey: this.state.type.label };
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
    let errorMessage = '';
    if (this.state.submit) {
      if (this.state.file.name === '') {
        fileError = true;
        errorMessage = 'Required File';
      }
      if (this.state.type === '') {
        typeError = true;
      }
      this.setState(prev => {
        prev.typeError = typeError;
        prev.fileError = fileError;
        prev.errorMessage = errorMessage;
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

  setDroppedFilesToUpload = () => (e) => {
    console.log('set dropped files worked')
    let selectedFile = this.state.dropEvent;
    console.log(selectedFile)
    e.target.value = '';
    if(selectedFile.size > MAX_SIZE) {
      this.setState(prev => {
        prev.errorMessage = 'Size exceeded. Max file size 15.7 Mb.';
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

  setFilesToUpload = () => (e) => {
    let selectedFile = e.target.files[0];
    e.target.value = '';
    if(selectedFile.size > MAX_SIZE) {
      this.setState(prev => {
        prev.errorMessage = 'Size exceeded. Max file size 15.7 Mb.';
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
      prev.dropEvent = {}
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
            fileName: this.state.file.name || (this.state.dropEvent && this.state.dropEvent.name),
            required: true,
            error: this.state.fileError,
            errorMessage: this.state.errorMessage,
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
