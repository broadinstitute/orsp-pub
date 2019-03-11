import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewProjectGeneralData } from './NewProjectGeneralData';
import { NewProjectDetermination } from './NewProjectDetermination';
import { NewProjectDocuments } from './NewProjectDocuments';
import { NE, NHSR, IRB } from './NewProjectDetermination';
import { Files, Project, User } from '../util/ajax';
import { isEmpty } from '../util/Utils';
import { span } from 'react-hyperscript-helpers';
import { spinnerService } from '../util/spinner-service';
import { InternationalCohorts } from '../components/InternationalCohorts';

class NewProject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        displayName: '',
        userName: '',
        emailAddress: ''
      },
      showErrorDeterminationQuestions: false,
      showErrorIntCohorts: false,
      showErrorDocuments: false,
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
      intCohortsDetermination: {
        projectType: 900,
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
      formerProjectType: null,
      enableIntCohortsQuestions: false
    };
    this.updateGeneralDataFormData = this.updateGeneralDataFormData.bind(this);
    this.isValid = this.isValid.bind(this);
    this.submitNewProject = this.submitNewProject.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.removeErrorMessage = this.removeErrorMessage.bind(this);
    this.changeStateSubmitButton = this.changeStateSubmitButton.bind(this);
    this.toggleTrueSubmitError = this.toggleTrueSubmitError.bind(this);
    this.toggleFalseSubmitError = this.toggleFalseSubmitError.bind(this);
  }

  componentDidMount() {
     User.getUserSession(this.props.getUserUrl).then(
       resp => this.setState({ user : resp.data })
     )
  }

  submitNewProject = () => {
    this.toggleFalseSubmitError();

    spinnerService.showAll();
    if (this.validateDocuments() && this.validateInternationalCohorts()) {
      if (this.validateDeterminationQuestions() && this.validateGeneralData()) {
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
        prev.generalError = true;
        prev.showErrorDocuments = true;
        return prev;
      }, () => {
        spinnerService.hideAll();
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
    project.reporter = this.state.user.userName;
    project.description = this.state.step1FormData.studyDescription !== '' ? this.state.step1FormData.studyDescription : null;
    project.fundings = this.getFundings(this.state.step1FormData.fundings);
    let extraProperties = [];
    extraProperties.push({name: 'pm', value: this.state.step1FormData.projectManager !== '' ? this.state.step1FormData.projectManager.key : null});
    extraProperties.push({name: 'pi', value: this.state.step1FormData.piName.value !== '' ? this.state.step1FormData.piName.key : null});
    extraProperties.push({name: 'projectTitle', value: this.state.step1FormData.pTitle !== '' ? this.state.step1FormData.pTitle : null});
    extraProperties.push({name: 'protocol', value: this.state.step1FormData.irbProtocolId !== '' ? this.state.step1FormData.irbProtocolId : null});
    extraProperties.push({name: 'description', value: this.state.step1FormData.subjectProtection !== '' ? this.state.step1FormData.subjectProtection : null});
    extraProperties.push({name: 'subjectProtection', value: this.state.step1FormData.subjectProtection !== '' ? this.state.step1FormData.subjectProtection : null});
    extraProperties.push({name: 'projectAvailability', value: 'available'});
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

    let internationalCohortsQuestions = this.state.intCohortsDetermination.questions;
    if (internationalCohortsQuestions !== null && internationalCohortsQuestions.length > 1) {
      internationalCohortsQuestions.map((q, idx) => {
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
      isValid = this.validateGeneralData(field);
    } else if (this.state.currentStep === 1) {
      isValid = this.validateDeterminationQuestions();
    } else if (this.state.currentStep === 2 && this.state.enableIntCohortsQuestions === true) {
      isValid = this.validateInternationalCohorts();
    }
    return isValid;
  };

  validateDeterminationQuestions() {
    let isValid = true;
    if (this.state.determination.requiredError || this.state.determination.endState == false) {
      isValid = false;
    }
    this.setState(prev => {
      prev.showErrorDeterminationQuestions = !isValid;
      return prev;
    });
    return isValid;
  }

  validateGeneralData(field) {
    let studyDescription = false;
    let pTitle = false;
    let subjectProtection = false;
    let isValid = true;
    let fundings = false;
    if (isEmpty(this.state.step1FormData.studyDescription)) {
      studyDescription = true;
      isValid = false;
    }
    if (this.state.step1FormData.subjectProtection !== true && this.state.step1FormData.subjectProtection !== false) {
      subjectProtection = true;
      isValid = false;
    }
    if (isEmpty(this.state.step1FormData.pTitle)) {
      pTitle = true;
      isValid = false;
    }
    if (this.state.step1FormData.fundings === undefined) {
      fundings = true;
      isValid = false;
    } else {
      this.state.step1FormData.fundings.forEach(funding => {
        if (isEmpty(funding.source.label)) {
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

  validateInternationalCohorts() {
    let isValid = true;
    if (this.state.enableIntCohortsQuestions === true && (this.state.intCohortsDetermination.requiredError || this.state.intCohortsDetermination.endState === false)) {
      isValid = false;
    }
    this.setState(prev => {
      prev.showErrorIntCohorts = !isValid;
      return prev;
    });
    return isValid;
  }

  validateDocuments() {
    let isValid = true;

    let docs = [];
    if (this.state.files !== null && this.state.files.length > 0) {
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

  determinationHandler = (determination) => {
    this.setState(prev => {
        prev.files = [];
        prev.determination = determination;
        if (prev.determination.projectType !== null && prev.showErrorDeterminationQuestions === true) {
          prev.showErrorDeterminationQuestions = false;
        }
        return prev;
      },
      () => {
        this.initDocuments(this.state.determination.projectType);
      });
  };

  intCohortsDeterminationHandler = (determination) => {
    this.setState(prev => {
      prev.intCohortsDetermination = determination;
      if (this.state.intCohortsDetermination.projectType !== null && this.state.showErrorIntCohorts === true) {
        prev.showErrorIntCohorts = false;
      }
      return prev;
    });
  };

  initDocuments(projectType) {

    if (projectType !== this.state.formerProjectType) {

      let documents = [];
      let enableIntCohortsQuestions = false;

      switch (projectType) {
        case IRB:
          documents.push({ required: true, fileKey: 'IRB Approval', label: span({}, ["Upload the ", span({ className: "bold" }, ["IRB Approval "]), "for this Project here*"]), file: null, fileName: null, error: false });
          documents.push({ required: true, fileKey: 'IRB Application', label: span({}, ["Upload the ", span({ className: "bold" }, ["IRB Application "]), "for this Project here*"]), file: null, fileName: null, error: false });
          enableIntCohortsQuestions = false;
          break;

        case NE:
          documents.push({ required: true, fileKey: 'NE Approval', label: span({}, ["Upload the ", span({ className: "bold" }, ["NE Approval "]), "for this Project here*"]), file: null, fileName: null, error: false });
          documents.push({ required: true, fileKey: 'NE Application', label: span({}, ["Upload the ", span({ className: "bold" }, ["NE Application "]), "for this Project here*"]), file: null, fileName: null, error: false });
          documents.push({ required: false, fileKey: 'Consent Document', label: span({}, ["Upload the ", span({ className: "bold" }, ["Consent Document "]), "for this Project here ", span({ className: "italic" }, ["(if applicable)"])]), file: null, fileName: null, error: false });
          enableIntCohortsQuestions = true;
          break;

        case NHSR:
          documents.push({ required: true, fileKey: 'NHSR Application', label: span({}, ["Upload the ", span({ className: "bold" }, ["NHSR Application "]), "for this Project here*"]), file: null, fileName: null, error: false });
          enableIntCohortsQuestions = true;
          break;

        default:
          break;
      }
      this.setState({
        files: documents,
        projectType: projectType,
        formerProjectType: projectType,
        enableIntCohortsQuestions : enableIntCohortsQuestions,
        intCohortsDetermination: {
          projectType: 900,
          questions: [],
          requiredError: false,
          currentQuestionIndex: 0,
          nextQuestionIndex: 1,
          endState: false
        }
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

  updateGeneralDataFormData = (updatedForm, field) => {
    if (this.currentStep === 0) {
      this.validateGeneralData(field);
    }
    this.setState(prev => {
      prev.step1FormData = updatedForm;
      return prev;
    }, () => this.isValid(field));
  };

  uploadFiles = (projectKey) => {
    Files.upload(this.props.attachDocumentsURL, this.state.files, projectKey, this.state.user.displayName, this.state.user.userName)
      .then(resp => {
        window.location.href = this.getRedirectUrl(projectKey);

      }).catch(error => {
        spinnerService.hideAll();
        this.toggleTrueSubmitError();
        this.changeStateSubmitButton();
        console.error(error);
      });
  };

  showSubmit = (currentStep) => {
    let renderSubmit = false;
    if (this.state.enableIntCohortsQuestions && currentStep === 3 || !this.state.enableIntCohortsQuestions && currentStep === 2) {
      renderSubmit = true;
    }
    return renderSubmit;
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
    return [this.props.serverURL, projectType, "show", projectKey,"?tab=review"].join("/");
  }

  newProjectContent = (currentStep, user, projectType) => {
    let components = [];
    components.push(NewProjectGeneralData({
      key: 1,
      title: "General Data",
      currentStep: currentStep,
      user: this.state.user,
      searchUsersURL: this.props.searchUsersURL,
      updateForm: this.updateGeneralDataFormData,
      errors: this.state.errors,
      removeErrorMessage: this.removeErrorMessage
    }));
    components.push(NewProjectDetermination({
      key: 2,
      title: "Determination Questions",
      currentStep: currentStep,
      determination: this.state.determination,
      handler: this.determinationHandler,
      errors: this.state.showErrorDeterminationQuestions
    }));
    if (this.state.enableIntCohortsQuestions === true) {
      components.push(InternationalCohorts({
        key: 3,
        title: "International Cohorts",
        currentStep: currentStep,
        handler: this.intCohortsDeterminationHandler,
        determination: this.state.intCohortsDetermination,
        errors: this.state.showErrorIntCohorts,
      }))
    }
    components.push(NewProjectDocuments({
      key: 4,
      title: "Documents",
      currentStep: this.state.enableIntCohortsQuestions === true ? currentStep : currentStep + 1,
      fileHandler: this.fileHandler,
      projectType: projectType,
      files: this.state.files,
      errors: this.state.showErrorDocuments,
      generalError: this.state.generalError,
      submitError: this.state.submitError
    }));
    return components
  };

  render() {

    const { currentStep, determination } = this.state;
    const { user = { emailAddress: 'test@broadinstitute.org', displayName: '' } } = this.state;
    let projectType = determination.projectType;
    return (
      Wizard({
        title: "New Project",
        stepChanged: this.stepChanged,
        isValid: this.isValid,
        submitHandler: this.submitNewProject,
        showSubmit: this.showSubmit,
        disabledSubmit: this.state.formSubmitted,
        loadingImage: this.props.loadingImage,
      }, [
        this.newProjectContent(currentStep, user, projectType),
      ])
    );
  }
}

export default NewProject;
