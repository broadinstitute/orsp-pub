import { Component } from 'react';
import { hh, div, h, p, small, span, br, button } from 'react-hyperscript-helpers';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import { MultiSelect } from './MultiSelect';
import { InputFieldSelect } from './InputFieldSelect';
import { InputFieldFile } from './InputFieldFile';
import { AlertMessage } from './AlertMessage';
import { InputFieldText } from './InputFieldText';
import { Files } from "../util/ajax";

import './ConfirmationDialog.css';

export const AddDocumentDialog = hh(class AddDocumentDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      documents: '',
      disableBtn: false,
      typeError: false,
      fileError: false,
      submit: false,
      uploadError: false,
      type: '',
      error: false,
      file: {
        name: ''
      },
      collaboratorEmail: '',
      currentValue: {
        label: ''
      }
    }
    this.upload = this.upload.bind(this);
    this.handleTypeSelect = this.handleTypeSelect.bind(this);
  }

  getShareableLink = () => {
  };

  redirectToDul = () => {
  };


  handleClose = () => {
    this.setState(prev => {
      prev.file = {
        name: ''
      };
      prev.typeError = false;
      prev.fileError = false;
      prev.uploadError = false;
      prev.disableBtn = false;
      prev.errorMessage = '';
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
        Files.upload(this.props.attachDocumentsUrl, files, this.props.projectKey, this.props.user.displayName, this.props.user.userName)
          .then(resp => {
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
            this.setState(prev => {
              prev.errorMessage = 'Something went wrong. Please try again.';
              prev.uploadError = true;
              prev.submit = false;
              prev.disableBtn = false;
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

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev[field] = value;
      return prev;
    })
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
            h(ModalTitle, { className: "dialogTitle" }, ['Add ' + this.props.title + 'Document to ' + this.props.projectKey])
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
            AlertMessage({
              msg: this.state.errorMessage,
              show: this.state.uploadError
            }),

            div({ isRendered: this.state.type.value === 'Data Use Letter', style: { 'marginTop': '10px' } }, [
              p({ className: "bold" }, [
                "Do you want to send a Data Use Letter form directly to your Collaborator for their IRB's completion?",
                br({}),
                small({ className: "normal" }, ["You can either insert their emails below and a link will be sent to them directly, get a shareable link, or click to be redirected to the Data Use Letter form."])
              ]),
              InputFieldText({
                id: "inputCollaboratorEmail",
                name: "collaboratorEmail",
                label: "Collaborator Email",
                value: this.state.collaboratorEmail,
                disabled: false,
                required: false,
                placeholder: "Enter email address...",
                onChange: this.handleInputChange
              }),
              div({ className: "row" }, [
                div({ className: "col-lg-6 col-md-6 col-sm-6 col-6" }, [
                  button({ className: "btn buttonSecondary fullWidth", disabled: this.state.disableBttn, onClick: this.getShareableLink }, [
                    span({ className: "glyphicon glyphicon-link", style: { 'marginRight': '5px' } }, []),
                    "Get shareable link"
                  ])
                ]),
                div({ className: "col-lg-6 col-md-6 col-sm-6 col-6" }, [
                  button({ className: "btn buttonSecondary fullWidth", disabled: this.state.disableBttn, onClick: this.redirectToDul }, ["Complete Data Use Letter form"]),
                ])
              ])
            ])
          ]),

          h(ModalFooter, {}, [
            button({ className: "btn buttonSecondary", disabled: this.state.disableBtn, onClick: this.handleClose }, ["Cancel"]),
            button({ className: "btn buttonPrimary", disabled: this.state.disableBtn, onClick: this.upload }, ["Upload"]),
          ])
        ])
    )
  }
});
