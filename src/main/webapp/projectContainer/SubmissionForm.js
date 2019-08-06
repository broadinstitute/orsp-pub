import { Component, Fragment } from 'react';
import { div, a, hh, h1, button, span } from 'react-hyperscript-helpers';
import { Panel } from "../components/Panel";
import { ProjectMigration } from "../util/ajax";
import { InputFieldSelect } from "../components/InputFieldSelect";
import InputFieldNumber from "../components/InputFieldNumber";
import { InputFieldText } from "../components/InputFieldText";


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
      }
    };
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    this.getSubmissionFormInfo(params.get('projectKey'), params.get('type'));
  }

  getSubmissionFormInfo = (projectKey, type) => {
    ProjectMigration.getSubmissionFormInfo(projectKey, type).then(resp => {
      const submissionInfo = resp.data;
      console.log(submissionInfo);
      this.setState(prev => {
        prev.submissionInfo.typeLabel = submissionInfo.typeLabel;
        prev.submissionInfo.projectKey = submissionInfo.issue.projectKey;
        prev.submissionInfo.selectedType = submissionInfo.defaultType.name;
        prev.submissionInfo.submissionTypes = submissionInfo.submissionTypes;
        prev.submissionInfo.comments = submissionInfo.submission !== null ? submissionInfo.submission : '';
        return prev;
      });
    });
  };

  handleInputChange = (e) => {
    console.log(e.target.value);
  };

  // handleSelectChange = e => {
  //   console.log(e);
  // };

  handleSelectChange = (field) => () => (selectedOption) => {
    this.setState(prev => {
      prev.submissionInfo[field] = selectedOption;
        // prev.formData[field] = selectedOption;
        return prev;
      }, () => {
        // this.props.updateForm(this.state.formData, field);
        // this.props.removeErrorMessage();
      }
    )
  };

  render() {
    return (
      div({}, [
        h1({}, ["Submission for " + `${this.state.submissionInfo.typeLabel}: ${this.state.submissionInfo.projectKey}`]),
        Panel({
          title: "Add new submission",
        }, [
          InputFieldSelect({
            label: "Submission Type",
            id: "submissionType",
            name: "submission-type",
            options: this.state.submissionInfo.submissionTypes,
            value: this.state.submissionInfo.selectedType,
            onChange: this.handleSelectChange("selectedType"),
            placeholder: this.state.submissionInfo.selectedType,
            readOnly: false,
            edit: true
          }),
          InputFieldNumber({
            name: "submissionNumber",
            handleChange: this.handleInputChange,
            value: this.state.submissionInfo.number,
            label: "Submission Number",
            showLabel: true
          }),
          InputFieldText({
            id: "submission-comment",
            name: "submissionComment",
            label: "Description",
            value: this.state.submissionInfo.comments,
            required: false,
            onChange: this.handleInputChange,
            edit: true
          }),
        ])
      ])
    );
  }
}

export default SubmissionForm;
