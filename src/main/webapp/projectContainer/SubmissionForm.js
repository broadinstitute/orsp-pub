import { Component } from 'react';
import { a, button, div, h, h1, hh, small, p, br } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { Files, ProjectMigration, User } from '../util/ajax';
import { InputFieldSelect } from '../components/InputFieldSelect';
import InputFieldNumber from '../components/InputFieldNumber';
import { Table } from '../components/Table';
import AddDocumentDialog from '../components/AddDocumentDialog';
import { isEmpty, scrollToTop } from '../util/Utils';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { AlertMessage } from '../components/AlertMessage';
import LoadingWrapper from '../components/LoadingWrapper';
import { Editor } from '@tinymce/tinymce-react';

const errorBorderStyle = {
  border: "1px solid red",
  marginTop:'4px'
};

const styles = {
  addDocumentContainer: {
    display: 'block', height: '50px', margin: '15px 0 10px 0'
  },
  addDocumentBtn: {
    position: 'relative', float: 'right'
  },
  deleteSubmission: {
    position: 'absolute',
    right: '30px',
    top: '46px'
  },
};
const headers =
  [
    { name: 'Document Type', value: 'fileType' },
    { name: 'File Name', value: 'fileName' },
    { name: 'Document Description', value: 'fileDescription' },
    { name: 'Author', value: 'displayName' },
    { name: 'Created On', value: 'createdDate' },
    { name: 'Remove', value: 'removeFile' },
  ];

const SubmissionForm = hh(class SubmissionForm extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      submissionInfo: {
        typeLabel: '',
        docTypes: [],
        submissionTypes: [],
        submissionNumberMaximums: {},
        selectedType: '',
        number: 1,
        editedNumber: 0,
        comments: '',
      },
      showAddDocuments: false,
      documents: [],
      params: {
        projectKey: '',
        type: ''
      },
      showDialog: false,
      fileToRemove: {},
      action: '',
      errors: {
        comment: false,
        serverError: false,
        number: false,
        numberType: 'Required field'
      },
      dropEvent: null,
      viewDocDetails: []
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.showSpinner();
    scrollToTop();
    const params = new URLSearchParams(this.props.location.search);
    this.getSubmissionFormInfo(params.get('projectKey'), params.get('type'), params.get('submissionId'));
    this.setState(prev => {
      prev.params.projectKey = params.get('projectKey');
      prev.params.type = params.get('type');
      prev.params.submissionId = params.get('submissionId');
      return prev;
    });
    this.props.hideSpinner();
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.props.hideSpinner();
  }

  getTypeSelected() {
    const params = new URLSearchParams(this.props.location.search);
    return { label: params.get('type'), value: params.get('type') };
  }

  formatSubmissionType(submissionTypes) {
    return submissionTypes.map(type => {
      return {
        label: type,
        value: type
      }
    });
  };

  getSubmissionFormInfo = (projectKey, type, submissionId = '') => {
    this.props.showSpinner();
    ProjectMigration.getSubmissionFormInfo(projectKey, type, submissionId).then(resp => {
      this.props.hideSpinner();
      const submissionInfo = resp.data;
      if (this._isMounted) {
        this.setState(prev => {
          prev.submissionInfo.typeLabel = submissionInfo.typeLabel;
          prev.submissionInfo.projectKey = submissionInfo.issue.projectKey;
          prev.submissionInfo.selectedType = this.getTypeSelected();
          prev.submissionInfo.submissionTypes = this.formatSubmissionType(submissionInfo.submissionTypes);
          prev.submissionInfo.comments = submissionInfo.submission !== null ? submissionInfo.submission.comments : '';
          prev.submissionInfo.submissionNumber = this.maximumNumber(submissionInfo.submissionNumberMaximums, prev.params.type, prev.params.submissionId);
          prev.submissionInfo.submissionNumberMaximums = submissionInfo.submissionNumberMaximums;
          prev.submissionInfo.number = isEmpty(submissionInfo.submission) ?
            this.maximumNumber(submissionInfo.submissionNumberMaximums, prev.params.type, prev.params.submissionId) :
            submissionInfo.submission.number;
          prev.submissionInfo.editedNumber = isEmpty(submissionInfo.submission) ?
            this.maximumNumber(submissionInfo.submissionNumberMaximums, prev.params.type, prev.params.submissionId) :
            submissionInfo.submission.number;
          prev.docTypes = this.loadOptions(submissionInfo.docTypes);
          prev.documents = isEmpty(submissionInfo.documents) ? [] : [...submissionInfo.documents];
          !isEmpty(submissionInfo.documents) ? submissionInfo.documents.forEach(doc => {
            doc['fileDescription'] = doc.description;
            doc['displayName'] = doc.creator;
            doc['createdDate'] = new Date(doc.creationDate).toISOString().substring(0,10);
          }) : [];
          prev.viewDocDetails = isEmpty(submissionInfo.documents) ? [] : [...submissionInfo.documents];
          return prev;
        });
      }
    });
  };

  maximumNumber(submissionMax, type, submissionId) {
    if (isEmpty(submissionMax[type])) {
      return 1;
    } else if (isEmpty(submissionId) && !isEmpty(submissionMax[type])) {
      return submissionMax[type] + 1;
    } else {
      return submissionMax[type];
    }
  }

  loadOptions(docTypes) {
    return  docTypes.map(type => { return { value: type, label: type } });
  };

  handleInputChange = (comment, editor) => {
    this.setState(prev => {
      prev.submissionInfo.comments = comment;
      prev.errors.comment = false;
      return prev;
    });
  };

  handleUpdate = (value) => {
    this.setState(prev => {
      prev.submissionInfo.editedNumber = value;
      prev.errors.number = false;
      return prev;
    });
  };

  handleSelectChange = (field) => () => (value) => {
    this.setState(prev => {
      if (field === "selectedType") {
        const maxNumber = this.maximumNumber(prev.submissionInfo.submissionNumberMaximums, value.value, this.state.params.submissionId);
        prev.submissionInfo.number =  maxNumber;
        prev.submissionInfo.submissionNumber = maxNumber;
        prev.errors.number = false;
      }
      prev.submissionInfo[field] = value;
      return prev;
    });
  };

  submitSubmission = async () => {
    if(await this.validateSubmission()) {
      this.props.showSpinner();
      const submissionData = {
        type: this.state.submissionInfo.selectedType.value,
        number: this.state.submissionInfo.editedNumber !== this.state.submissionInfo.number ? this.state.submissionInfo.editedNumber : this.state.submissionInfo.number,
        comments: this.state.submissionInfo.comments,
        projectKey: this.state.submissionInfo.projectKey
      };
      let editedDocs = this.state.viewDocDetails;
      let documents = this.state.documents
      editedDocs.forEach(editedDoc => {
        documents.forEach(doc => {
          if (doc.id === editedDoc.id && doc.fileDescription !== editedDoc.fileDescription) {
            doc.fileDescription = editedDoc.fileDescription
          }
        })
      })
      this.setState({
        documents: documents
      })

      ProjectMigration.saveSubmission(submissionData, this.state.documents, this.state.params.submissionId).then(resp => {
        this.backToProject();
      }).catch(error => {
        this.props.hideSpinner();
        console.error(error);
        this.setState(prev => {
          prev.errors.serverError = true;
          return prev;
        });
      });
    }
  };

  handleAction = () => {
    this.props.showSpinner();
    this.closeModal('showDialog');
    if (this.state.action === 'document') {
      this.removeFile();
    } else {
      this.deleteSubmission();
    }
  };

  validateSubmission = async () => {
    let numberError = true;
    let comment = true;
    if (isEmpty(this.state.submissionInfo.editedNumber)) {
      this.setState(prev => {
        prev.errors.number = true;
        prev.errors.numberType = 'Required field';
        return prev;
      });
      numberError = false;
    }
    if (isEmpty(this.state.submissionInfo.comments)) {
      this.setState(prev => {
        prev.errors.comment = true;
        return prev;
      });
      comment = false;
    }

    if (this.state.submissionInfo.selectedType.value !== this.getTypeSelected().value
      || this.state.submissionInfo.editedNumber != this.state.submissionInfo.number) {
      const validNumber = await ProjectMigration.getSubmissionValidateNumber(
        this.state.params.projectKey,
        this.state.submissionInfo.selectedType.value,
        this.state.submissionInfo.editedNumber);
      if (!validNumber.data.valid) {
        this.setState(prev => {
          prev.errors.number = true;
          prev.errors.numberType = 'This number is already used';
          return prev;
        });
        numberError = false;
      }
    }

    return numberError && comment;
  };

  removeFileDialog = (data) => {
    this.setState(prev => {
      prev.showDialog = true;
      prev.fileToRemove = data;
      prev.action = 'document';
      return prev;
    });
  };

  removeSubmissionDialog = () => {
    this.setState(prev => {
      prev.showDialog = true;
      prev.action = 'submission';
      return prev;
    });
  };

  removeFile = () => {
    if(!isEmpty(this.state.fileToRemove.uuid)) {
      ProjectMigration.removeSubmissionFile(this.state.params.submissionId, this.state.fileToRemove.uuid).then(prev => {
        this.updateDocuments();
      }).catch(error => {
        console.error(error);
        this.setState(prev => {
          prev.errors.serverError = true;
          return prev;
        });
        this.props.hideSpinner();
      });
    } else {
      this.updateDocuments();
    }
  };

  updateDocuments = () => {
    this.setState(prev => {
      prev.documents = prev.documents.filter(doc => doc.id !== this.state.fileToRemove.id);
      prev.viewDocDetails = prev.viewDocDetails.filter(doc => doc.id !== this.state.fileToRemove.id);
      return prev;
    });
    this.props.hideSpinner();
  };

  setFilesToUpload = async (doc) => {
    let name, createdDate;
    await User.getUserSession().then(user => {
      name = user.data.displayName;
      createdDate = new Date().toISOString().substring(0,10);
    })
    let viewDocDetail = {};
    this.setState(prev => {
    
      let document = { fileType: doc.fileKey, file: doc.file, fileName: doc.file.name, id: Math.random(), fileDescription: doc.fileDescription };
      viewDocDetail['fileType'] = doc.fileKey;
      viewDocDetail['file'] = doc.file;
      viewDocDetail['fileName'] = doc.file.name;
      viewDocDetail['fileDescription'] = doc.fileDescription;
      viewDocDetail['displayName'] = name;
      viewDocDetail['createdDate'] = createdDate;
      viewDocDetail['id'] = document.id;
      let documents = prev.documents;
      documents.push(document);
      prev.documents = documents;
      let viewDocDetails = prev.viewDocDetails;
      viewDocDetails.push(viewDocDetail);
      prev.viewDocDetails = viewDocDetails;
      return prev;
    }, () => {
      this.closeModal("showAddDocuments");
    });
  };

  addDocuments = () => {
    this.setState({
      showAddDocuments: !this.state.showAddDocuments
    });
  };

  closeModal = (type) => {
    this.setState(prev => {
      prev[type] = !this.state[type];
      prev.dropEvent = null;
      return prev;
    });
  };

  deleteSubmission = () => {
    this.props.showSpinner();
    ProjectMigration.deleteSubmission(this.state.params.submissionId).then(prev => {
      this.props.history.goBack();
      this.props.hideSpinner();
    }).catch(error => {
      this.props.hideSpinner();
      console.error(error);
      this.setState(prev => {
        prev.errors.serverError = true;
        return prev;
      });
    });
  };

  dropHandler = (event) => {
    event.preventDefault();
    let file
    if (event.dataTransfer.items) {
        [...event.dataTransfer.items].forEach((item, i) => {
            if (item.kind === 'file') {
                file = item.getAsFile();
            }
        })
    }
    this.setState(prev => {
      prev.dropEvent = file;
    }, () => {
      this.addDocuments();
    })
  }

  dragOverHandler(event) {
    event.preventDefault();
  }

  backToProject = () => {
    this.props.history.push('/project/main?projectKey=' + this.state.params.projectKey + '&tab=submissions', {tab: 'submissions'});
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    const minimunNumber = this.state.submissionInfo.submissionNumber;
    const edit = !isEmpty(this.state.params.submissionId);

    return (
      div({}, [
        ConfirmationDialog({
          closeModal: () => this.closeModal("showDialog"),
          show: this.state.showDialog,
          handleOkAction: this.handleAction,
          title: 'Delete Confirmation',
          bodyText: `Are you sure you want to delete this ${this.state.action}?`,
          actionLabel: 'Yes'
        }),
        h(AddDocumentDialog, {
          isRendered: this.state.showAddDocuments,
          closeModal: () => this.closeModal("showAddDocuments"),
          show: this.state.showAddDocuments,
          options: this.state.docTypes,
          projectKey: this.props.projectKey,
          user: this.props.user,
          handleLoadDocuments: this.props.handleLoadDocuments,
          emailUrl: this.props.emailUrl,
          userName: this.props.userName,
          documentHandler: this.setFilesToUpload,
          dropEvent: this.state.dropEvent
        }),
          h1({
            style: {'marginBottom':'20px'}
          }, [
            "Submission for ", h(a, {
              onClick: () => this.backToProject(),
              style: {'cursor': 'pointer'}
            }, [`${this.state.submissionInfo.typeLabel}: ${this.state.submissionInfo.projectKey}`]),
          ]),
        Panel({
          title: "Add new submission",
        }, [
          InputFieldSelect({
            label: "Submission Type",
            id: "submissionType",
            name: "selectedType",
            options: this.state.submissionInfo.submissionTypes,
            value: this.state.submissionInfo.selectedType,
            onChange: this.handleSelectChange("selectedType"),
            placeholder: this.state.submissionInfo.selectedType,
            readOnly: component.isViewer,
            edit: false
          }),
            InputFieldNumber({
              name: "submissionNumber",
              handleChange: this.handleUpdate,
              value: this.state.submissionInfo.editedNumber,
              label: "Submission Number",
              min: minimunNumber,
              showLabel: true,
              readOnly: component.isViewer,
              edit: false,
              error: this.state.errors.number
            }),
            small({ isRendered: this.state.errors.number, className: "errorMessage" }, [this.state.errors.numberType]),
          div({className: "inputField"}, [
            p({ className: "inputFieldLabel" }, [
              "Description"
            ]),
            div({
              style: this.state.errors.comment ? errorBorderStyle : null
            }, [
              h(Editor, {
                disabled: !component.isAdmin,
                init: {
                  width: '100%',
                  menubar: false,
                  statusbar: false,
                  plugins: "paste",
                  paste_data_images: false
                },
                value: this.state.submissionInfo.comments,
                onEditorChange: this.handleInputChange
              })
            ]),
            small({ isRendered: this.state.errors.comment, className: "errorMessage" }, ['Required field'])
          ])
        ]),
        Panel({
          title: "Files"
        },[
          div({ style: styles.addDocumentContainer }, [
            div({
              isRendered: !component.isViewer,
              id: 'drop_zone',
              onDrop: this.dropHandler,
              onDragOver: this.dragOverHandler,
              style: {padding: '10px 0 10px 0', textAlign: 'center', border: '1px solid #ddd', width: '100%'}
            }, [
              p(['Drag and drop your document here or ', a({onClick:() => {this.addDocuments()}}, ['click here to add documents'])])
            ])
          ]),br(),
          Table({
            headers: headers,
            data: this.state.viewDocDetails,
            sizePerPage: 10,
            paginationSize: 10,
            remove: this.removeFileDialog,
            reviewFlow: false,
            pagination: false,
            isAdmin: component.isAdmin,
            style: {top: '10px'}
          }),
          button({
            isRendered: !component.isViewer,
            className: "btn buttonPrimary pull-right buttonContainer", style: {'marginTop':'30px', 'marginLeft':'12px'},
            onClick: this.submitSubmission,
          }, [edit ? "Save" : "Submit"]),
          button({
            isRendered: !component.isViewer && edit,
            className: "btn buttonPrimary floatRight buttonContainer", style: {'marginTop':'30px'},
            onClick: this.removeSubmissionDialog
          }, ["Delete"])
        ]),
        AlertMessage({
          msg: "Something went wrong in the server. Please verify that you don't exceed 100Mb total in files to upload.",
          show: this.state.errors.serverError
        })
      ])
    );
  }
});

export default LoadingWrapper(SubmissionForm);
