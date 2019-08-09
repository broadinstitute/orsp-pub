import { Component } from 'react';
import { div, h1, button, h } from 'react-hyperscript-helpers';
import { Panel } from "../components/Panel";
import {Files, ProjectMigration} from "../util/ajax";
import { InputFieldSelect } from "../components/InputFieldSelect";
import InputFieldNumber from "../components/InputFieldNumber";
import { InputFieldText } from "../components/InputFieldText";
import { Table } from "../components/Table";
import { AddDocumentDialog } from "../components/AddDocumentDialog";
import { isEmpty } from "../util/Utils";
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
  }
};
const headers =
  [
    { name: 'Document Type', value: 'fileType' },
    { name: 'File Name', value: 'fileName' },
    { name: 'Remove', value: 'remove' }
  ];

class SubmissionForm extends Component {
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
      errors: {
        comment: false,
        serverError: false
      },
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    this.getSubmissionFormInfo(params.get('projectKey'), params.get('type'), params.get('submissionId'));
    this.setState(prev => {
      prev.params.projectKey = params.get('projectKey');
      prev.params.type = params.get('type');
      prev.params.submissionId = params.get('submissionId');
      return prev;
    });
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
      console.log(submissionInfo);
      this.setState(prev => {
        prev.submissionInfo.typeLabel = submissionInfo.typeLabel;
        prev.submissionInfo.projectKey = submissionInfo.issue.projectKey;
        prev.submissionInfo.selectedType = this.getTypeSelected();
        prev.submissionInfo.submissionTypes = this.formatSubmissionType(submissionInfo.submissionTypes);
        prev.submissionInfo.comments = submissionInfo.submission !== null ? submissionInfo.submission.comments : '';
        prev.submissionInfo.submissionNumberMaximums =
          isEmpty(submissionInfo.submissionNumberMaximums[prev.params.type]) ? {[prev.params.type]: 1}: submissionInfo.submissionNumberMaximums[prev.params.type] + 1;
        prev.submissionInfo.number =
          isEmpty(submissionInfo.submissionNumberMaximums[prev.params.type]) ? 1 : submissionInfo.submissionNumberMaximums[prev.params.type] + 1;
        prev.docTypes = this.loadOptions(submissionInfo.docTypes);
        prev.documents = isEmpty(submissionInfo.documents) ? [] : submissionInfo.documents;
        return prev;
      });
    });
  };

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
        this.props.history.goBack();
      });
    }
  };

  handleAction = () => {
    spinnerService.showAll();
    this.closeModal("showDialog");
    this.removeFile();
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

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    const type = this.state.submissionInfo.selectedType;
    const minimunNumber = this.state.submissionInfo.submissionNumberMaximums[type.label];

    return (
      div({}, [
        ConfirmationDialog({
          closeModal: () => this.closeModal("showDialog"),
          show: this.state.showDialog,
          handleOkAction: this.handleAction,
          title: 'Delete Confirmation',
          bodyText: 'Are you sure you want to delete this document?',
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
        h1({style: {'marginBottom':'20px'}}, ["Submission for " + `${this.state.submissionInfo.typeLabel}: ${this.state.submissionInfo.projectKey}`]),
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
            readOnly: false,
            edit: false
          }),
          InputFieldNumber({
            name: "submissionNumber",
            handleChange: this.handleUpdate,
            value: this.state.submissionInfo.number,
            label: "Submission Number",
            min: minimunNumber,
            showLabel: true
          }),
          InputFieldText({
            id: "submission-comment",
            name: "comments",
            label: "Description",
            value: this.state.submissionInfo.comments,
            required: false,
            onChange: this.handleInputChange,
            edit: true,
            error: this.state.errors.comment,
            errorMessage: "Required field"
          }),
        ]),
        Panel({
          title: "Files"
        },[
          div({ style: styles.addDocumentContainer }, [
            button({
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
            className: "btn buttonPrimary", style: {'marginTop':'20px'},
            onClick: this.submitSubmission,
          }, ["Submit"]),
          button({
            isRendered: component.isAdmin,
            className: "btn buttonPrimary", style: {'marginTop':'20px'},
            onClick: this.deleteSubmission,
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
