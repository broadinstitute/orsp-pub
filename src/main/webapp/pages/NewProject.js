import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewProjectGeneralData } from './NewProjectGeneralData';
import { NewProjectDetermination } from './NewProjectDetermination';
import { NewProjectDocuments } from './NewProjectDocuments';
import { NE, NHSR, IRB } from './NewProjectDetermination';
import {Files, Project} from "../util/ajax";

class NewProject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showErrorStep2: false,
      showErrorStep3: false,
      isReadyToSubmit: false,
      generalError: false,
      formSubmitted: false,
      determination: {
        projectType: 400,
        questions: [],
        requiredError: false,
        currentQuestionIndex: 0,
        nextQuestionIndex: 1,
        endState: false
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
    this.updateStep1FormData = this.updateStep1FormData.bind(this);
    this.isValid = this.isValid.bind(this);
    this.submitNewProject = this.submitNewProject.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  submitNewProject = () => {
     if (this.validateStep3()) {
       if (this.validateStep2() || this.validateStep1()) {
         console.log(JSON.stringify(this.getProject(), null, 2));
         this.setState(prev => {
           prev.formSubmitted = true;
           return prev;
         });
         Project.createProject(this.props.createProjectURL, this.getProject()).then(resp => {
           this.uploadFiles(resp.message.projectKey);
         });
       } else {
         this.setState(prev => {
           prev.generalError = true;
           return prev;
         });
       }
    } else {
       this.setState(prev => {
         prev.showErrorStep3 = true;
         return prev;
       });
     }
  };

  getProject(){
    let project = {};
    project.type = this.getProjectType(project);
    project.status = 'Open';
    project.summary = this.state.step1FormData.pTitle !== '' ? this.state.step1FormData.pTitle : null;
    project.studyDescription = this.state.step1FormData.studyDescription !== '' ? this.state.step1FormData.studyDescription : null;
    project.reporter = this.state.step1FormData.userName;
    project.projectManager = this.state.step1FormData.projectManager !== '' ? this.state.step1FormData.projectManager.key : null;
    project.piName = this.state.step1FormData.piName.value !== '' ? this.state.step1FormData.piName.value : null;
    project.pTitle = this.state.step1FormData.pTitle !== '' ? this.state.step1FormData.pTitle : null;
    project.irbProtocolId = this.state.step1FormData.irbProtocolId !== '' ? this.state.step1FormData.irbProtocolId : null;
    project.subjectProtection = this.state.step1FormData.subjectProtection !== '' ? this.state.step1FormData.subjectProtection : null;
    project.questions = this.getQuestions(this.state.determination.questions);
    project.collaborators = this.getCollaborators(this.state.step1FormData.collaborators);
    project.fundings = this.getFundings(this.state.step1FormData.fundings);
    return project;
  }

  getFundings(fundings) {
    let fundingList = [];
    if (fundings !== null && fundings.length > 1) {
      fundings.map((f, idx) => {
        let funding = {};
        funding.source = f.source.label;
        funding.awardNumber = f.identifier;
        funding.name = f.sponsor;
        fundingList.push(f);
      });
    }
    return fundingList;
  }

  getCollaborators(collaborators) {
    let collaboratorList = [];
    if (collaborators !== null && collaborators.length > 1) {
      collaborators.map((collaborator, idx) => {
        collaboratorList.push(collaborator.key);
      });
    }
    return collaboratorList;
  }

  getQuestions(questions) {
    let questionList = [];
    if (questions !== undefined && questions !== null && questions.length > 1) {
      questions.map((q, idx) => {
        if (q.answer !== null) {
          let question = {};
          question.key = q.key;
          question.answer = q.answer;
          questionList.push(question);
        }
      });  
    }
    return questionList;
  }

  getProjectType(project) {
    let type = '';
    if (this.state.determination.projectType === NE) {
      type = 'NE';
    }
    else if (this.state.determination.projectType === NHSR) {
      type = 'NHSR';
    }
    else if (this.state.determination.projectType === IRB) {
      type = 'IRB';
    }
    return type;
  }

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
    else if (this.state.currentStep === 1) {
      isValid = this.validateStep2();
    }
    return isValid;
  };

  validateStep2() {
    let isValid = true;
    if (this.state.determination.requiredError || this.state.determination.endState == false) {
      isValid = false;
    }
    this.setState(prev => {
      prev.showErrorStep2 = !isValid;
      return prev;
    });
    return isValid;
  }

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
    else if (field === 'fundings' || field === 'studyDescription' ||
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

  validateStep3() {
    let isValid = false;
    if (this.state.files !== null) {
      if (this.state.determination.projectType === NE &&
        this.state.files.length > 1 &&
        this.state.files[0].fileData !== null &&
        this.state.files[1].fileData !== null) {
        isValid = true;
      } else if (this.state.determination.projectType === NHSR &&
        this.state.files.length === 1 &&
        this.state.files[0].fileData !== null) {
        isValid = true;
      } else if (this.state.determination.projectType === IRB &&
        this.state.files.length === 2 &&
        this.state.files[0].fileData !== null &&
        this.state.files[1].fileData !== null) {
        isValid = true;
      }
    } else {
      isValid = false;
    }
    this.setState(prev => {
      prev.showErrorStep3 = !isValid;
      return prev;
    });
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

  uploadFiles = (projectKey) => {
    Files.upload(this.props.attachDocumentsURL, this.state.files, projectKey, this.props.user.displayName, this.props.user.userName)
      .then(resp => {
        console.log(resp);
        window.location.href = this.props.serverURL;
      }).catch(error => {
      console.error(error);
    });
  };

  showSubmit = (currentStep) => {
    let renderSubmit = false;
    if (currentStep === 2) {
      renderSubmit = true;
    }
    return renderSubmit;
  };

  render() {

    const { currentStep, determination } = this.state;
    const { user = { email: 'test@broadinstitute.org' } } = this.props;
    let projectType = determination.projectType;
    return (
      Wizard({ title: "New Project", stepChanged: this.stepChanged, isValid: this.isValid, submitHandler: this.submitNewProject, showSubmit: this.showSubmit,  }, [
        NewProjectGeneralData({ title: "General Data", currentStep: currentStep, user: user, searchUsersURL: this.props.searchUsersURL, updateForm: this.updateStep1FormData, errors: this.state.errors }),
        NewProjectDetermination({ title: "Determination Questions", currentStep: currentStep, determination: this.state.determination, handler: this.determinationHandler, errors: this.state.showErrorStep2 }),
        NewProjectDocuments({ title: "Documents", currentStep: currentStep, fileHandler: this.fileHandler, projectType: projectType, files: this.state.files, errors: this.state.showErrorStep3, generalError: this.state.generalError }),
      ])
    );
  }
}

export default NewProject;