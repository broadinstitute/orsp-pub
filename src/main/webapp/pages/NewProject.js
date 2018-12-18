import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewProjectGeneralData } from './NewProjectGeneralData';
import { NewProjectDetermination } from './NewProjectDetermination';
import { NewProjectDocuments } from './NewProjectDocuments';
import { Files, Project } from '../util/ajax';

class NewProject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      determination: {
        projectType: 400
      },
      step1FormData: {},
      currentStep: 0,
      files: [],
      errors: {
        studyDescription: false,
        pTitle: false,
        subjectProtection: false,
        fundings: false
      }
    };

    console.log('save project url', this.props.createProjectURL);
    this.updateStep1FormData = this.updateStep1FormData.bind(this);
    this.isValid = this.isValid.bind(this);
    this.submitNewProject = this.submitNewProject.bind(this);
  }

  submitNewProject = () => {
    if (this.state.isValid) {
      Project.createProject(this.props.createProjectURL, this.state).then(resp => {
        console.log(resp);
        // this.uploadFiles() TODO add key-project
      });
    }
  };

  stepChanged = (newStep) => {
    this.setState({
      currentStep: newStep
    });
  };

  isValid = (field) => {
    let isValid = true;
    if (this.state.currentStep === 0) {
      isValid = this.validateStep1(field);
    }
    return isValid;
  };

  validateStep1(field) {
    let studyDescription = false;
    let pTitle = false;
    let subjectProtection = false;
    let isValid = true;
    let fundings = false;
    if (!this.isTextValid(this.state.step1FormData.studyDescription)) {
      studyDescription = true;
      isValid = false;
    }
    if (this.state.step1FormData.subjectProtection !== true && this.state.step1FormData.subjectProtection !== false) {
      subjectProtection = true;
      isValid = false;
    }
    if (!this.isTextValid(this.state.step1FormData.pTitle)) {
      pTitle = true;
      isValid = false;
    }
    if (this.state.step1FormData.fundings === undefined) {
      fundings = true;
      isValid = false;
    } else {
      this.state.step1FormData.fundings.forEach(funding => {
        if (!this.isTextValid(funding.source.label)) {
          fundings = true;
          isValid = false;
        }
      });
    }
    if (field === undefined || field === null || field === 0) {
      this.setState(prev => {
        prev.errors.studyDescription = studyDescription;
        prev.errors.subjectProtection = subjectProtection;
        prev.errors.pTitle = pTitle;
        prev.errors.fundings = fundings;
        return prev;
      });
    } 
    else if(field === 'fundings' || field === 'studyDescription' || 
            field === 'subjectProtection' || field === 'pTitle') {

      this.setState(prev => {
        if (field === 'fundings') {
          prev.errors.fundings = fundings;
        }
        else if (field === 'studyDescription') {
          prev.errors.studyDescription = studyDescription;
        }
        else if (field === 'subjectProtection') {
          prev.errors.subjectProtection = subjectProtection;
        }
        else if (field === 'pTitle') {
          prev.errors.pTitle = pTitle;
        }
        return prev;
      });
    }
    return isValid;
  }

  isTextValid(value) {
    let isValid = false;
    if (value !== '' && value !== null && value !== undefined) {
      isValid = true;
    }
    return isValid;
  };

  determinationHandler = (determination) => {
    this.setState({
      files: [],
      determination: determination
    }, () => {
      console.log("project determination ", determination);
    });
  };

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  fileHandler = (file) => {
    if (file.fileData !== undefined && file.fileData) {
      let result = this.state.files.filter(element => element.fileKey !== file.fileKey);
      result.push(file);
      this.setState(prev => {
        prev.files = result;
        return prev
      });
    }
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  updateStep1FormData = (updatedForm, field) => {
    if (this.currentStep === 0) {
      this.validateStep1(field);
    }
    this.setState(prev => {
      prev.step1FormData = updatedForm;
      return prev;
    }, () => this.isValid(field));
  };

  uploadFiles(projectKey) {
    Files.upload(this.props.attachDocumentsURL, this.state.files, projectKey).then(resp => {
      console.log(resp);
    }).catch(err => {
      console.error(err);
    });
  }

  render() {

    const { currentStep, determination } = this.state;

    let projectType = determination.projectType;

    return (
      Wizard({ title: "New Project", stepChanged: this.stepChanged, isValid: this.isValid, submitHandler: this.submitNewProject}, [
        NewProjectGeneralData({ title: "General Data", currentStep: currentStep, user: this.props.user, searchUsersURL: this.props.searchUsersURL, updateForm: this.updateStep1FormData, errors: this.state.errors }),
        NewProjectDetermination({ title: "Determination Questions", currentStep: currentStep, handler: this.determinationHandler }),
        NewProjectDocuments({ title: "Documents", currentStep: currentStep, fileHandler: this.fileHandler, projectType: projectType, files: this.state.files }),
      ])
    );
  }
}

export default NewProject;