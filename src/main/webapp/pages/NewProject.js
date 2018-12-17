import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewProjectGeneralData } from './NewProjectGeneralData';
import { NewProjectDetermination } from './NewProjectDetermination';
import { NewProjectDocuments } from './NewProjectDocuments';
import { Files } from '../util/ajax';

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
        subjectProtection: false
      }
    }

    this.updateStep1FormData = this.updateStep1FormData.bind(this);
  }

  submitNewProject = () => {

  };

  stepChanged = (newStep) => {
    this.setState({
      currentStep: newStep
    });
  }

  isValid = (currentSep) => {
    let isValid = true;
    if (currentSep === 0) {
      isValid = this.isStep1Valid();
    }
    return isValid;
  }

  isStep1Valid() {
    let studyDescription = false;
    let pTitle = false;
    let subjectProtection = false;
    let isValid = true;
    let fundings = false;
    if (!this.isTextValid(this.state.step1FormData.studyDescription)) {
      studyDescription = true;
    }
    if (!this.isTextValid(this.state.step1FormData.subjectProtection)) {
      subjectProtection = true;
    }
    if (!this.isTextValid(this.state.step1FormData.pTitle)) {
      pTitle = true;
    }
    if (this.state.step1FormData.fundings === undefined) {
      fundings = false;
    } else {
      this.state.step1FormData.fundings.forEach(funding => {
        if (funding.source.label !== 'None' &&
            (!this.isTextValid(funding.sponsor) || !this.isTextValid(funding.identifier))) {
          fundings = true;
        }
      });
    }
    if (studyDescription || pTitle || subjectProtection || fundings) {
      this.setState(prev => {
        prev.errors.studyDescription = studyDescription;
        prev.errors.subjectProtection = subjectProtection;
        prev.errors.pTitle = pTitle;
        prev.errors.fundings = fundings;
        return prev;
      });
      isValid = false;
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
  }

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
      }, () => {
        if (this.state.files.length === 3) {
          this.uploadFiles();
        }
      });
    }
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  updateStep1FormData = (updatedForm) => {
    this.setState(prev => {
      prev.step1FormData = updatedForm;
      return prev;
    }
    );
  };

  uploadFiles(projectKey) {
    Files.upload(`/dev/api/project/attach-document`, this.state.files, projectKey).then(resp => {
      console.log(resp);
    }).catch(err => {
      console.error(err);
    });
  }

  render() {

    const { currentStep, determination } = this.state;

    let projectType = determination.projectType;

    return (
      Wizard({ title: "New Project", stepChanged: this.stepChanged, isValid: this.isValid }, [
        NewProjectGeneralData({ title: "General Data", currentStep: currentStep, user: this.props.user, searchUsersURL: this.props.searchUsersURL, updateForm: this.updateStep1FormData, errors: this.state.errors }),
        NewProjectDetermination({ title: "Determination Questions", currentStep: currentStep, handler: this.determinationHandler }),
        NewProjectDocuments({ title: "Documents", currentStep: currentStep, fileHandler: this.fileHandler, projectType: projectType, files: this.state.files }),
      ])
    );
  }
}

export default NewProject;