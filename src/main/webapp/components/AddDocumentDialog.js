import { Component } from 'react';
import { hh, div, h, p, small, span, br, button, textarea } from 'react-hyperscript-helpers';
import { Modal, ModalHeader, ModalTitle, ModalFooter, ModalBody } from 'react-bootstrap';
import { InputFieldSelect } from './InputFieldSelect';
import { InputFieldFile } from './InputFieldFile';
import { AlertMessage } from './AlertMessage';
import { InputFieldText } from './InputFieldText';
import { ConsentGroup, Files, DUL } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";
import { validateEmail } from "../util/Utils";
import './ConfirmationDialog.css';

export const AddDocumentDialog = hh(class AddDocumentDialog extends Component {
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
      invalidEmail: false,
      file: {
        name: ''
      },
      collaboratorEmail: '',
      currentValue: {
        label: ''
      }
    };
    this.upload = this.upload.bind(this);
    this.handleTypeSelect = this.handleTypeSelect.bind(this);
    this.setFilesToUpload = this.setFilesToUpload.bind(this);
    this.getShareableLink = this.getShareableLink.bind(this);
  }

  getShareableLink = () => {
    let data = {
      consentGroupKey: this.props.projectKey,
      creator: this.props.user.userName
    };
    DUL.generateRedirectLink(data, this.props.serverURL).then(resp => {
      navigator.clipboard.writeText(this.props.serverURL + "/dataUseLetter/show?id=" + resp.data.dulToken);
      this.successTimeAlert();
    }).catch(error => {
      this.setState(prev => {
        prev.disableBtn = false;
        prev.alertType = "danger";
        prev.alertMessage = 'Something went wrong. Please try again.';
        prev.showAlert = true;
        return prev;
      });
    });
  };

  successTimeAlert = () => {
    setTimeout(this.removeAlertMessage, 3000, null);
    this.setState(prev => {
      prev.alertType = "success";
      prev.alertMessage = "Link copied to clipboard!";
      prev.showAlert = true;
      return prev;
    });
  };

  removeAlertMessage = () => {
    this.setState(prev => {
      prev.alertType = "success";
      prev.alertMessage = "";
      prev.showAlert = false;
      return prev;
    });
  };

  redirectToDul = () => {
    let data = {
      consentGroupKey: this.props.projectKey,
      creator: this.props.user.userName
    };
    DUL.generateRedirectLink(data, this.props.serverURL).then(data => {
      window.location.href = this.props.serverURL + "/dataUseLetter/show?id=" + data.data.dulToken;
    }).catch(
      error => {
        this.setState(prev => {
          prev.disableBtn = false;
          prev.alertType ="danger";
          prev.alertMessage = 'Something went wrong. Please try again.';
          prev.showAlert = true;
          return prev;
        })
      }
    );
  };

  handleClose = () => {
    this.setState(prev => {
      prev.file = {
        name: ''
      };
      prev.typeError = false;
      prev.fileError = false;
      prev.invalidEmail = false;
      prev.showAlert = false;
      prev.disableBtn = false;
      prev.disableSendBtn = false;
      prev.alertMessage = '';
      prev.type = '';
      prev.collaboratorEmail = '';
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
          spinnerService.showAll();
          Files.upload(this.props.attachDocumentsUrl, files, this.props.projectKey, this.props.user.displayName, this.props.user.userName)
          .then(resp => {
            spinnerService.hideAll();
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
            spinnerService.hideAll();
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

  validEmail = (email) => {
    if (validateEmail(email)) {
      return true;
    } else {
      this.setState({ invalidEmail: true });
    }
  };

  send = () => {
    spinnerService.showAll();
    const collaboratorEmail = this.state.collaboratorEmail;
    if (this.validEmail(collaboratorEmail)){
      this.setState({alertMessage: '', collaboratorEmail: '', showAlert: false});
      ConsentGroup.sendEmailDul(this.props.emailUrl, this.props.projectKey, this.props.userName, this.state.collaboratorEmail).then( resp => {
        this.setState(prev => {
          prev.alertType = 'success';
          prev.alertMessage = 'Email sent to: ' + collaboratorEmail;
          prev.showAlert = true;
          prev.collaboratorEmail = '';
          return prev;
        });
      }).catch( error => {
        spinnerService.hideAll();
        this.setState(prev => {
          prev.alertType = 'danger';
          prev.alertMessage = 'Error sending email sent to: ' + collaboratorEmail + '. Please try again later.';
          prev.showAlert = false;
          prev.collaboratorEmail = '';
          return prev;
        });
      });
    }
    spinnerService.hideAll();
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
      prev.invalidEmail = false;
      prev.fileError = false;
      prev.type = selectedOption;
      return prev;
    });
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.fileError = false;
      prev[field] = value;
      if (field === 'collaboratorEmail') {
        prev.invalidEmail = false;
      }
      return prev;
    })
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
      }, [
          h(ModalHeader, {}, [
            h(ModalTitle, { className: "dialogTitle" }, [this.props.projectKey !== undefined ? 'Add Document to ' + this.props.projectKey : 'Add Document'])
          ]),
          h(ModalBody, { className: "dialogBody" }, [
            p({}, [
              "Please upload any documents related to your overall project, for example: IRB application form, protocol, " +
              "Continuing Review form, etc. Documents related to a specific cohort, such a consent forms or attestations, " +
              "should be uploaded in the Sample/Data Cohort Info tab."
            ]),
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
            div({ isRendered: this.state.type.value === 'Data Use Letter' && this.props.isConsentGroup === true, style: { 'marginTop': '10px' } }, [
              p({ className: "bold" }, [
                "Do you want to send a Data Use Letter form directly to your Collaborator for their IRB's completion?",
                br({}),
                small({ className: "normal" }, ["You can either insert their emails below and a link will be sent to them directly, get a shareable link, or click to be redirected to the Data Use Letter form."])
              ]),
              div({ className: "row positionRelative" }, [
                div({ className: "col-lg-10 col-md-9 col-sm-9 col-9" }, [
                  InputFieldText({
                    id: "inputCollaboratorEmail",
                    name: "collaboratorEmail",
                    label: "Collaborator Email",
                    value: this.state.collaboratorEmail,
                    disabled: false,
                    required: false,
                    placeholder: "Enter email address...",
                    onChange: this.handleInputChange,
                    error: this.state.invalidEmail,
                    errorMessage: 'Invalid email address'
                  })
                ]),
                div({ className: "col-lg-2 col-md-3 col-sm-3 col-3 positionAbsolute", style: {'top': '25px', 'right': '0'} }, [
                    button({ className: "btn buttonPrimary fullWidth", disabled: this.state.collaboratorEmail === '', onClick: this.send }, ["Send"])
                ]),
              ]),
              div({ className: "row" }, [
                div({ className: "col-lg-6 col-md-6 col-sm-6 col-6" }, [
                  button({
                    className: "btn buttonSecondary fullWidth",
                    onClick: this.getShareableLink,
                    name: "getLink",
                    disabled: false,
                    id: 'shareable-link'
                  }, [
                    span({ className: "glyphicon glyphicon-link", style: { 'marginRight': '5px' } }, []),
                    "Get shareable link"
                  ])
                ])
              ])
            ]),
            div({ style: { 'marginTop': '15px' } }, [
              AlertMessage({
                type: this.state.alertType,
                msg: this.state.alertMessage,
                show: this.state.showAlert
              }),
            ])
          ]),

          h(ModalFooter, {}, [
            button({ className: "btn buttonSecondary", disabled: this.state.disableBtn, onClick: this.handleClose }, ["Cancel"]),
            button({ className: "btn buttonPrimary", disabled: this.state.disableBtn, onClick: this.upload }, [this.props.projectKey !== undefined ? "Upload" : "Add Document"])
          ])
        ])
    )
  }
});
