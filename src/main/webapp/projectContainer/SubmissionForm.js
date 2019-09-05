import { Component } from 'react';
import { div, h1, button, h, a } from 'react-hyperscript-helpers';
import { Panel } from "../components/Panel";
import { Files, ProjectMigration } from "../util/ajax";
import { InputFieldSelect } from "../components/InputFieldSelect";
import InputFieldNumber from "../components/InputFieldNumber";
import { InputFieldTextArea } from "../components/InputFieldTextArea";
import { Table } from "../components/Table";
import { AddDocumentDialog } from "../components/AddDocumentDialog";
import { isEmpty, scrollToTop } from "../util/Utils";
import { spinnerService } from "../util/spinner-service";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { Spinner } from "../components/Spinner";
import { AlertMessage } from "../components/AlertMessage";

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

class SubmissionForm extends Component {

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
    scrollToTop();
    const params = new URLSearchParams(this.props.location.search);
    this.getSubmissionFormInfo(params.get('projectKey'), params.get('type'), params.get('submissionId'));
    this.setState(prev => {
      prev.params.projectKey = params.get('projectKey');
      prev.params.type = params.get('type');
      prev.params.submissionId = params.get('submissionId');
      return prev;
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
    spinnerService.hideAll();
    spinnerService._unregisterAll();
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

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.submissionInfo[field] = value;
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
      spinnerService.showAll();
      const submissionData = {
        type: this.state.submissionInfo.selectedType.value,
        number: this.state.submissionInfo.number,
        comments: this.state.submissionInfo.comments,
        projectKey: this.state.submissionInfo.projectKey
      };

      ProjectMigration.saveSubmission(submissionData, this.state.documents, this.state.params.submissionId).then(resp => {
        this.backToProject();
      }).catch(error => {
        spinnerService.hideAll();
        console.error(error);
        this.setState(prev => {
          prev.errors.serverError = true;
          return prev;
        });
      });
    }
  };

  handleAction = () => {
    spinnerService.showAll();
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
    ProjectMigration.removeSubmissionFile(this.state.params.submissionId, this.state.fileToRemove.uuid).then(prev => {
      const documentsToUpdate = this.state.documents.filter(doc => doc.id !== this.state.fileToRemove.id);
      this.setState(prev => {
        prev.documents = documentsToUpdate;
        return prev;
      });
      spinnerService.hideAll();
    });
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
    spinnerService.showAll();
    ProjectMigration.deleteSubmission(this.state.params.submissionId).then(prev => {
      this.props.history.goBack();
      spinnerService.hideAll();
    }).catch(error => {
      spinnerService.hideAll();
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
        AddDocumentDialog({
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
            readOnly: !component.isAdmin,
            edit: false
          }),
          InputFieldNumber({
            name: "submissionNumber",
            handleChange: this.handleUpdate,
            value: this.state.submissionInfo.number,
            label: "Submission Number",
            min: minimunNumber,
            showLabel: true,
            readOnly: !component.isAdmin,
            edit: false
          }),
          InputFieldTextArea({
            id: "submission-comment",
            name: "comments",
            label: "Description",
            value: this.state.submissionInfo.comments,
            required: false,
            onChange: this.handleInputChange,
            edit: component.isAdmin,
            error: this.state.errors.comment,
            errorMessage: "Required field",
            readOnly: !component.isAdmin,
          }),
        ]),
        Panel({
          title: "Files"
        },[
          div({ style: styles.addDocumentContainer }, [
            button({
              isRendered: component.isAdmin && !component.isViewer,
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

          }),
          button({
            isRendered: component.isAdmin,
            className: "btn buttonPrimary pull-right", style: {'marginTop':'30px', 'marginLeft':'12px'},
            onClick: this.submitSubmission,
          }, [edit ? "Save" : "Submit"]),
          button({
            isRendered: component.isAdmin && edit,
            className: "btn buttonPrimary floatRight", style: {'marginTop':'30px'},
            onClick: this.removeSubmissionDialog
          }, ["Delete"])
        ]),
        AlertMessage({
          msg: 'Something went wrong in the server. Please try again later.',
          show: this.state.errors.serverError
        }),
        h(Spinner, {
          name: "mainSpinner", group: "orsp", loadingImage: component.loadingImage
        })
      ])
    );
  }
}

export default SubmissionForm;
