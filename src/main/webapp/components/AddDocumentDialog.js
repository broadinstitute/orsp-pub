import { Component } from 'react';
import { hh, div, h, button } from 'react-hyperscript-helpers';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import { MultiSelect } from './MultiSelect';
import { InputFieldSelect } from './InputFieldSelect';
import { InputFieldFile } from './InputFieldFile';
import { Files } from "../util/ajax";

import './ConfirmationDialog.css';

export const AddDocumentDialog = hh(class AddDocumentDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      typeError: false,
      fileError: false,
      submit: false,
      uploadError: false,
      type: '',
      error: false,
      file: {
        name: ''
      },
      currentValue: {
        label: ''
      }
    }
    this.upload = this.upload.bind(this);
    this.handleTypeSelect = this.handleTypeSelect.bind(this);
  }

  handleClose = () => {
    this.setState(prev => {
      prev.file = {
        name: ''
      };
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
        let file = { file: this.state.file, fileKey: this.state.type.label };
        let files = [file];
        Files.upload(this.props.attachDocumentsUrl, files, this.props.projectKey, this.props.user.displayName, this.props.user.userName)
          .then(resp => {
            this.setState(prev => {
              prev.submit = false;
              prev.file = { name: '' };
              prev.type = '';
              return prev;
            });
            this.props.handleLoadDocuments();
            this.props.closeModal();
          }).catch(error => {
            this.setState(prev => {
              prev.uploadError = true;
              return prev;
            });
          });
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
      prev.type = selectedOption;
      return prev;
    }, () => this.isValid());
  };

  setFilesToUpload = () => (e) => {
    let selectedFile = e.target.files[0];
    e.target.value = '';
    this.setState(prev => {
      prev.file = selectedFile;
      return prev;
    }, () => this.isValid());
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
      }, [
          h(ModalHeader, {}, [
            h(ModalTitle, { className: "dialogTitle" }, ['Attach Document to ' + this.props.projectKey])
          ]),

          h(ModalBody, { className: "dialogBody" }, [
            InputFieldSelect({
              label: "Type",
              id: "file-type",
              name: "type",
              options: this.props.options,
              value: this.state.type,
              onChange: this.handleTypeSelect,
              currentValue: this.state.currentValue,
              error: this.state.typeError,
              errorMessage: "Required field"
            }),
            InputFieldFile({
              callback: this.setFilesToUpload(documents),
              fileName: this.state.file.name,
              required: true,
              error: this.state.fileError,
              errorMessage: "Required field",
              removeHandler: () => this.removeFile(document)
            })
          ]),

          h(ModalFooter, {}, [
            button({ className: "btn buttonSecondary", onClick: this.handleClose }, ["Cancel"]),
            button({ className: "btn buttonPrimary", onClick: this.upload }, ["Upload"]),
          ])
        ])
    )
  }
});
