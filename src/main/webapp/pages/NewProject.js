import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewProjectGeneralData } from './NewProjectGeneralData';
import { NewProjectDetermination } from './NewProjectDetermination';
import { NewProjectDocuments } from './NewProjectDocuments';

class NewProject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      determination: {
        projectType: 400
      },
      formData : {},
      currentStep: 0,
      files: []
    }

    this.updateFormData = this.updateFormData.bind(this);
  }

  submitNewProject = () => {

  }

  stepChanged = (newStep) => {
    console.log(newStep);
    let previousStep = this.state.currentStep;
    this.setState({
      currentStep: newStep
    });
    this.props.stepChanged(previousStep);
  }

  determinationHandler = (determination) => {
    this.setState({
      files: [],
      determination: determination
    }, () => {
      console.log("project determination ", determination);
    });
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  fileHandler =  (file) => {
    if (file.fileData !== undefined && file.fileData) {
      let result = this.state.files.filter(element => element.fileKey !== file.fileKey);
      result.push(file);
      this.setState(prev => {
        prev.files = result;
        return prev
      });
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  updateFormData = (updatedForm) => () => {
  console.log(updatedForm);
    this.setState(prev => {
      prev.formData = updatedForm;
      return prev;
    }, () => console.log("UPDATED FORM : ", this.state.formData));
  }
  render() {

    const { currentStep, determination } = this.state;

    let projectType = determination.projectType;

    return (
      Wizard({ title: "New Project", style: { "margin": "5px 5px 15px 5px", "padding": "5px 5px 15px 5px" }, stepChanged: this.stepChanged }, [
        NewProjectGeneralData({ title: "General Data", currentStep: currentStep, user: this.props.user, searchUsersURL: this.props.searchUsersURL, updateForm: this.updateFormData, stepChanged: this.stepChanged}),
        NewProjectDetermination({ title: "Determination Questions", currentStep: currentStep, handler: this.determinationHandler }),
        NewProjectDocuments({ title:"Documents", currentStep: currentStep, fileHandler: this.fileHandler, projectType: projectType, files: this.state.files}),
      ])
    );
  }
}

export default NewProject;