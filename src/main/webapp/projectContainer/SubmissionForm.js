import { Component } from 'react';
import { div, h1, button } from 'react-hyperscript-helpers';
import { Panel } from "../components/Panel";
import { ProjectMigration } from "../util/ajax";
import { InputFieldSelect } from "../components/InputFieldSelect";
import InputFieldNumber from "../components/InputFieldNumber";
import { InputFieldText } from "../components/InputFieldText";
import { Table } from "../components/Table";
import { AddDocumentDialog } from "../components/AddDocumentDialog";
import {isEmpty} from "../util/Utils";

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
    { name: 'Document Type', value: 'fileKey' },
    { name: 'File Name', value: 'fileName' },
    { name: '', value: 'remove' }
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
      }
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    this.getSubmissionFormInfo(params.get('projectKey'), params.get('type'));
    this.setState(prev => {
      prev.params.projectKey = params.get('projectKey');
      prev.params.type = params.get('type');
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

  getSubmissionFormInfo = (projectKey, type) => {
    ProjectMigration.getSubmissionFormInfo(projectKey, type).then(resp => {
      const submissionInfo = resp.data;
      this.setState(prev => {
        prev.submissionInfo.typeLabel = submissionInfo.typeLabel;
        prev.submissionInfo.projectKey = submissionInfo.issue.projectKey;
        prev.submissionInfo.selectedType = this.getTypeSelected();
        prev.submissionInfo.submissionTypes = this.formatSubmissionType(submissionInfo.submissionTypes);
        prev.submissionInfo.comments = submissionInfo.submission !== null ? submissionInfo.submission : '';
        prev.submissionInfo.submissionNumberMaximums = submissionInfo.submissionNumberMaximums + 1;
        prev.submissionInfo.number = submissionInfo.submissionNumberMaximums[prev.params.type] + 1;
        prev.docTypes = this.loadOptions(submissionInfo.docTypes);
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
      console.log(this.state.submissionInfo);
      const submissionData = {
        type: this.state.submissionInfo.selectedType.value,
        number: this.state.submissionInfo.number,
        comments: this.state.submissionInfo.comments,
        projectKey: this.state.submissionInfo.projectKey
      };
      ProjectMigration.saveSubmission(submissionData, this.state.documents).then(resp => {
        console.log(resp.data);
      });
    }
  };

  validateSubmission = () => {
    return !isEmpty(this.state.submissionInfo.comments);
  };

  removeFile = (row) => (e) => {
    const documentsToUpdate = this.state.documents.filter(doc => doc.id !== row.id);
    this.setState(prev => {
      prev.documents = documentsToUpdate;
      return prev;
    });
  };

  setFilesToUpload = (doc) => {
    this.setState(prev => {
      let document = { fileKey: doc.fileKey, file: doc.file, fileName: doc.file.name, id: Math.random() };
      let documents = prev.documents;
      documents.push(document);
      prev.documents = documents;
      return prev;
    }, () => {
      this.closeModal();
    });
  };

  addDocuments = () => {
    this.setState({
      showAddDocuments: !this.state.showAddDocuments
    });
  };

  closeModal = () => {
    this.setState({ showAddDocuments: !this.state.showAddDocuments });
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
        AddDocumentDialog({
          closeModal: this.closeModal,
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
            edit: true
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
            remove: this.removeFile,
            reviewFlow: false,
            pagination: false
          }),
          button({
            className: "btn buttonPrimary", style: {'marginTop':'20px'},
            onClick: this.submitSubmission,
          }, ["Submit"])
        ])
      ])
    );
  }
}

export default SubmissionForm;
