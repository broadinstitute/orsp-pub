import { Component } from 'react';
import { a, button, div, h, h1, hh, small, p } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { Files, ProjectMigration } from '../util/ajax';
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
    display: 'block', height: '40px', margin: '15px 0 10px 0'
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
    { name: 'Remove', value: 'removeFile' }
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
        serverError: false
      },
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
    ProjectMigration.getSubmissionFormInfo(projectKey, type, submissionId).then(resp => {
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
          prev.submissionInfo.number = this.maximumNumber(submissionInfo.submissionNumberMaximums, prev.params.type, prev.params.submissionId);
          prev.docTypes = this.loadOptions(submissionInfo.docTypes);
          prev.documents = isEmpty(submissionInfo.documents) ? [] : submissionInfo.documents;
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
      prev.submissionInfo.number = value;
      return prev;
    });
  };

  handleSelectChange = (field) => () => (value) => {
    this.setState(prev => {
      if (field === "selectedType") {
        const maxNumber = this.maximumNumber(prev.submissionInfo.submissionNumberMaximums, value.value, this.state.params.submissionId);
        prev.submissionInfo.number =  maxNumber;
        prev.submissionInfo.submissionNumber = maxNumber;
      }
      prev.submissionInfo[field] = value;
      return prev;
    });
  };

  submitSubmission = () => {
    if(this.validateSubmission()) {
      this.props.showSpinner();
      const submissionData = {
        type: this.state.submissionInfo.selectedType.value,
        number: this.state.submissionInfo.number,
        comments: this.state.submissionInfo.comments,
        projectKey: this.state.submissionInfo.projectKey
      };

      ProjectMigration.saveSubmission(submissionData, this.state.documents, this.state.params.submissionId).then(resp => {
        if (resp != null) {
          this.backToProject();
        }
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

  validateSubmission = () => {
    if (isEmpty(this.state.submissionInfo.comments)) {
      this.setState(prev => {
        prev.errors.comment = true;
        return prev;
      });
      return false;
    }
    return true;
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
      return prev;
    });
    this.props.hideSpinner();
  };

  setFilesToUpload = (doc) => {
    this.setState(prev => {
      let document = { fileType: doc.fileKey, file: doc.file, fileName: doc.file.name, id: Math.random() };
      let documents = prev.documents;
      documents.push(document);
      prev.documents = documents;
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
      return prev;
    });
  };

  deleteSubmission = () => {
    this.props.showSpinner();
    ProjectMigration.deleteSubmission(this.state.params.submissionId).then(prev => {
      if (prev != null) {
        this.props.history.goBack();
        this.props.hideSpinner();
      }
    }).catch(error => {
      this.props.hideSpinner();
      console.error(error);
      this.setState(prev => {
        prev.errors.serverError = true;
        return prev;
      });
    });
  };

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
          closeModal: () => this.closeModal("showAddDocuments"),
          show: this.state.showAddDocuments,
          options: this.state.docTypes,
          projectKey: this.props.projectKey,
          user: this.props.user,
          handleLoadDocuments: this.props.handleLoadDocuments,
          emailUrl: this.props.emailUrl,
          userName: this.props.userName,
          documentHandler: this.setFilesToUpload
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
            value: this.state.submissionInfo.number,
            label: "Submission Number",
            min: minimunNumber,
            showLabel: true,
            readOnly: component.isViewer,
            edit: false
          }),
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
            button({
              isRendered: !component.isViewer,
              className: "btn buttonSecondary",
              style: styles.addDocumentBtn,
              onClick: this.addDocuments
            }, ["Add Document"])
          ]),
          Table({
            headers: headers,
            data: this.state.documents,
            sizePerPage: 10,
            paginationSize: 10,
            remove: this.removeFileDialog,
            reviewFlow: false,
            pagination: false,
            isAdmin: component.isAdmin,
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
          msg: 'Something went wrong in the server. Please try again later.',
          show: this.state.errors.serverError
        })
      ])
    );
  }
});

export default LoadingWrapper(SubmissionForm);
