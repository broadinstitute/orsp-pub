import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewProjectGeneralData } from './NewProjectGeneralData';
import { NewProjectDetermination } from './NewProjectDetermination';
import { NewProjectDocuments } from './NewProjectDocuments';
import { NE, NHSR, IRB } from './NewProjectDetermination';
import { Files, Project } from "../util/ajax";
import { span } from 'react-hyperscript-helpers';

class NewProject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showErrorStep2: false,
      showErrorStep3: false,
      isReadyToSubmit: false,
      generalError: false,
      formSubmitted: false,
      submitError: false,
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
      },
      formerProjectType: null
    };
    this.updateStep1FormData = this.updateStep1FormData.bind(this);
    this.isValid = this.isValid.bind(this);
    this.submitNewProject = this.submitNewProject.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.removeErrorMessage = this.removeErrorMessage.bind(this);
    this.changeStateSubmitButton = this.changeStateSubmitButton.bind(this);
    this.toggleTrueSubmitError = this.toggleTrueSubmitError.bind(this);
    this.toggleFalseSubmitError = this.toggleFalseSubmitError.bind(this);
  }

  submitNewProject = () => {
    this.toggleFalseSubmitError();

    if (this.validateStep3()) {

      if (this.validateStep2() && this.validateStep1()) {
        this.changeStateSubmitButton();

        Project.createProject(this.props.createProjectURL, this.getProject()).then(resp => {
          this.uploadFiles(resp.data.message.projectKey);
        }).catch(error => {
          this.changeStateSubmitButton();
          this.toggleTrueSubmitError();
          console.error(error);
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

  toggleTrueSubmitError = () => {
    this.setState(prev => {
      prev.submitError = true;
      prev.generalError = true;
      return prev;
    });
  };

  toggleFalseSubmitError = () => {
    this.setState(prev => {
      prev.submitError = false;
      prev.generalError = false;
      return prev;
    });
  };

  changeStateSubmitButton = () => {
    this.setState(prev => {
      prev.formSubmitted = !prev.formSubmitted;
      return prev;
    });
  };

  getProject() {
    let project = {};
    project.type = this.getProjectType(project);
    project.summary = this.state.step1FormData.pTitle !== '' ? this.state.step1FormData.pTitle : null;
    project.reporter = this.props.user.userName;
    project.description = this.state.step1FormData.studyDescription !== '' ? this.state.step1FormData.studyDescription : null;
    project.fundings = this.getFundings(this.state.step1FormData.fundings);
    let extraProperties = [];
    extraProperties.push({name: 'pm', value: this.state.step1FormData.projectManager !== '' ? this.state.step1FormData.projectManager.key : null});
    extraProperties.push({name: 'pi', value: this.state.step1FormData.piName.value !== '' ? this.state.step1FormData.piName.key : null});
    extraProperties.push({name: 'projectTitle', value: this.state.step1FormData.pTitle !== '' ? this.state.step1FormData.pTitle : null});
    extraProperties.push({name: 'protocol', value: this.state.step1FormData.irbProtocolId !== '' ? this.state.step1FormData.irbProtocolId : null});
    extraProperties.push({name: 'description', value: this.state.step1FormData.subjectProtection !== '' ? this.state.step1FormData.subjectProtection : null});
    extraProperties.push({name: 'subjectProtection', value: this.state.step1FormData.subjectProtection !== '' ? this.state.step1FormData.subjectProtection : null});
    let collaborators = this.state.step1FormData.collaborators;
    if (collaborators !== null && collaborators.length > 0) {
        collaborators.map((collaborator, idx) => {
          extraProperties.push({name: 'collaborator', value: collaborator.key});
        });
    }
    let questions = this.state.determination.questions;
    if (questions !== null && questions.length > 1) {
        questions.map((q, idx) => {
          if (q.answer !== null) {
            extraProperties.push({name: q.key, value: q.answer});
          }
        });
    }
    project.extraProperties = extraProperties;
    return project;
  }

  getFundings(fundings) {
    let fundingList = [];
    if (fundings !== null && fundings.length > 0) {
      fundings.map((f, idx) => {
        let funding = {};
        funding.source = f.source.label;
        funding.awardNumber = f.identifier;
        funding.name = f.sponsor;
        fundingList.push(funding);
      });
    }
    return fundingList;
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
    let isValid = true;

    let docs = [];
    if (this.state.files !== null) {
      this.state.files.forEach(file => {
        if (file.required === true && file.file === null) {
          file.error = true;
          isValid = false;
        } else {
          file.error = false;
        }
        docs.push(file);
      });
    }
    else {
      isValid = false;
    }

    this.setState(prev => {
      prev.files = docs;
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
    this.setState(prev => {
        prev.files = [];
        prev.determination = determination;
        if (prev.determination.projectType !== null && prev.showErrorStep2 === true) {
          prev.showErrorStep2 = false;
        }
        return prev;
      },
      () => {
        this.initDocuments(this.state.determination.projectType);
      });
  };

  initDocuments(projectType) {

    if (projectType !== this.state.formerProjectType) {

      let documents = [];

      switch (projectType) {
        case IRB:
          documents.push({ required: true, fileKey: 'IRB Approval Doc', label: span({}, ["Upload the ", span({ className: "bold" }, ["IRB Approval "]), "for this Project here*"]), file: null, fileName: null, error: false });
          documents.push({ required: true, fileKey: 'IRB Application Doc', label: span({}, ["Upload the ", span({ className: "bold" }, ["IRB Application "]), "for this Project here*"]), file: null, fileName: null, error: false });
          break;

        case NE:
          documents.push({ required: true, fileKey: 'NE Approval Doc', label: span({}, ["Upload the ", span({ className: "bold" }, ["NE Approval "]), "for this Project here*"]), file: null, fileName: null, error: false });
          documents.push({ required: true, fileKey: 'NE Application Doc', label: span({}, ["Upload the ", span({ className: "bold" }, ["NE Application "]), "for this Project here*"]), file: null, fileName: null, error: false });
          documents.push({ required: false, fileKey: 'NE Consent Doc', label: span({}, ["Upload the ", span({ className: "bold" }, ["Consent Document "]), "for this Project here ", span({ className: "italic" }, ["(if applicable)"])]), file: null, fileName: null, error: false });
          break;

        case NHSR:
          documents.push({ required: true, fileKey: 'NHSR Application Doc', label: span({}, ["Upload the ", span({ className: "bold" }, ["NHSR Application "]), "for this Project here*"]), file: null, fileName: null, error: false });
          break;

        default:
          break;
      }

      this.setState({
        files: documents,
        projectType: projectType,
        formerProjectType: projectType
      });

    }
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  fileHandler = (docs) => {
    this.setState({
      files: docs
    });
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
        window.location.href = this.getRedirectUrl(projectKey);

      }).catch(error => {
        this.toggleTrueSubmitError();
        this.changeStateSubmitButton();
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

  enableSubmit = () => {
    this.setState(prev => {
      prev.formSubmitted = true;
      return prev;
    });
  };

  removeErrorMessage() {
    this.setState(prev => {
      prev.generalError = false;
      return prev;
    });
  }

  getRedirectUrl(projectKey) {
    let key = projectKey.split("-");
    let projectType = '';
    if (key.length === 3) {
      projectType = key[1].toLowerCase();
    } else {
      projectType = key[0].toLowerCase();
    }
    return [this.props.serverURL, projectType, "show", projectKey,"?tab=details"].join("/");
  }

  render() {

    const { currentStep, determination } = this.state;
    const { user = { email: 'test@broadinstitute.org' } } = this.props;
    let projectType = determination.projectType;
    return (
      Wizard({
        title: "New Project",
        stepChanged: this.stepChanged,
        isValid: this.isValid,
        submitHandler: this.submitNewProject,
        showSubmit: this.showSubmit,
        disabledSubmit: this.state.formSubmitted
      }, [
        NewProjectGeneralData({
          title: "General Data",
          currentStep: currentStep,
          user: user,
          searchUsersURL: this.props.searchUsersURL,
          updateForm: this.updateStep1FormData,
          errors: this.state.errors,
          removeErrorMessage: this.removeErrorMessage
        }),
        NewProjectDetermination({
          title: "Determination Questions",
          currentStep: currentStep,
          determination: this.state.determination,
          handler: this.determinationHandler,
          errors: this.state.showErrorStep2
        }),
        NewProjectDocuments({
          title: "Documents",
          currentStep: currentStep,
          fileHandler: this.fileHandler,
          projectType: projectType,
          files: this.state.files,
          errors: this.state.showErrorStep3,
          generalError: this.state.generalError,
          submitError: this.state.submitError
        }),
      ])
    );
  }
}

export default NewProject;
