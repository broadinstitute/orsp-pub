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
import { DataSharing } from "../components/DataSharing";
import { Security } from '../components/Security';

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
      showErrorInfoSecurity: false,
      isInfoSecurityValid: false,
      showErrorDocuments: false,
      showErrorDataSharing: false,
      isDataSharingValid: false,
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
      generalDataFormData: {},
      securityInfoFormData: {},
      dataSharingFormData: {},
      currentStep: 0,
      files: [],
      errors: {
        studyDescription: false,
        pTitle: false,
        uploadConsentGroup: false,
        subjectProtection: false,
        fundings: false
      },
      formerProjectType: null,
      infoSecurityErrors: {
        sensitive: false,
        accessible: false,
        compliance: false,
        pii: false,
        textSensitive: false,
        textAccessible: false,
        textCompliance: false
      }
    };
    this.updateGeneralDataFormData = this.updateGeneralDataFormData.bind(this);
    this.isValid = this.isValid.bind(this);
    this.submitNewProject = this.submitNewProject.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
    this.removeErrorMessage = this.removeErrorMessage.bind(this);
    this.changeStateSubmitButton = this.changeStateSubmitButton.bind(this);
    this.toggleTrueSubmitError = this.toggleTrueSubmitError.bind(this);
    this.toggleFalseSubmitError = this.toggleFalseSubmitError.bind(this);
    this.handleInfoSecurityValidity = this.handleInfoSecurityValidity.bind(this);
    this.updateInfoSecurity = this.updateInfoSecurity.bind(this);
  }

  componentDidMount() {
    User.getUserSession(this.props.getUserUrl).then(resp =>
      this.setState({ user: resp.data })
    );
  }

  submitNewProject = () => {
    this.toggleFalseSubmitError();

    spinnerService.showAll();
    if (this.validateDocuments()) {
      if (this.validateForm()) {
        this.changeStateSubmitButton();
        Project.createProject(this.props.createProjectURL, this.getProject()).then(resp => {
          this.uploadFiles(resp.data.message.projectKey);
        }).catch(error => {
          this.changeStateSubmitButton();
          this.toggleTrueSubmitError();
          spinnerService.hideAll();
          console.error(error);
        });
      } else {
        this.setState(prev => {
          prev.generalError = true;
          return prev;
        }, () => {
          spinnerService.hideAll();
        });
      }
    } else {
        spinnerService.hideAll();
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
    project.summary = this.state.generalDataFormData.pTitle !== '' ? this.state.generalDataFormData.pTitle : null;
    project.reporter = this.state.user.userName;
    project.description = this.state.generalDataFormData.studyDescription !== '' ? this.state.generalDataFormData.studyDescription : null;
    project.fundings = this.getFundings(this.state.generalDataFormData.fundings);
    let extraProperties = [];

    extraProperties.push({name: 'pm', value: this.state.generalDataFormData.projectManager !== '' ? this.state.generalDataFormData.projectManager.key : null});
    extraProperties.push({name: 'pi', value: this.state.generalDataFormData.piName.value !== '' ? this.state.generalDataFormData.piName.key : null});
    extraProperties.push({name: 'projectTitle', value: this.state.generalDataFormData.pTitle !== '' ? this.state.generalDataFormData.pTitle : null});
    extraProperties.push({name: 'protocol', value: this.state.generalDataFormData.irbProtocolId !== '' ? this.state.generalDataFormData.irbProtocolId : null});
    extraProperties.push({name: 'uploadConsentGroup', value: this.state.generalDataFormData.uploadConsentGroup !== '' ? this.state.generalDataFormData.uploadConsentGroup : null});
    extraProperties.push({name: 'notCGSpecify', value: this.state.generalDataFormData.notCGSpecify !== '' ? this.state.generalDataFormData.notCGSpecify : null});
    extraProperties.push({name: 'subjectProtection', value: this.state.generalDataFormData.subjectProtection !== '' ? this.state.generalDataFormData.subjectProtection : null});
    extraProperties.push({name: 'projectAvailability', value: 'available'});

    extraProperties.push({ name: 'pii', value: this.state.securityInfoFormData.pii });
    extraProperties.push({ name: 'compliance', value: this.state.securityInfoFormData.compliance });
    extraProperties.push({ name: 'textCompliance', value: this.state.securityInfoFormData.textCompliance });
    extraProperties.push({ name: 'sensitive', value: this.state.securityInfoFormData.sensitive });
    extraProperties.push({ name: 'textSensitive', value: this.state.securityInfoFormData.textSensitive });
    extraProperties.push({ name: 'accessible', value: this.state.securityInfoFormData.accessible });
    extraProperties.push({ name: 'textAccessible', value: this.state.securityInfoFormData.textAccessible });

    extraProperties.push({ name: 'sharingPlan', value: this.state.dataSharingFormData.sharingPlan });
    extraProperties.push({ name: 'databaseControlled', value: this.state.dataSharingFormData.databaseControlled });
    extraProperties.push({ name: 'databaseOpen', value: this.state.dataSharingFormData.databaseOpen });

    let collaborators = this.state.generalDataFormData.collaborators;
    if (collaborators !== null && collaborators.length > 0) {
        collaborators.map((collaborator, idx) => {
          extraProperties.push({name: 'collaborator', value: collaborator.key});
        });
    }
    let questions = this.state.determination.questions;
    if (questions.length > 1) {
        questions.map(q => {
          if (q.answer !== null) {
            extraProperties.push({name: q.key, value: q.answer});
          }
        });
    }

    let internationalCohortsQuestions = this.state.intCohortsDetermination.questions;
    if (internationalCohortsQuestions.length > 1) {
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

  getProjectType() {
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
    } else if (this.state.currentStep === 2) {
      isValid = this.validateInternationalCohorts();
    } else if (this.state.currentStep === 3) {
      isValid = this.validateInfoSecurity();
    } else if (this.state.currentStep === 4) {
      isValid = this.validateDataSharing();
    }
    return isValid;
  };

  validateInfoSecurity() {
    this.setState(prev => {
      prev.showErrorInfoSecurity = !this.state.isInfoSecurityValid;
      return prev;
    });
    return this.state.isInfoSecurityValid;
  }

  validateForm = () => {
    const isDeterminationQuestionsValid = this.validateDeterminationQuestions();
    const isGeneralDataValid = this.validateGeneralData();
    const isInternationalCohortsValid = this.validateInternationalCohorts();
    const isDataSharingValid = this.validateDataSharing();
    const isInfoSecurityValid = this.validateInfoSecurity();
    return isDeterminationQuestionsValid && isGeneralDataValid && isInternationalCohortsValid && isInfoSecurityValid && isDataSharingValid
  };

  validateDeterminationQuestions() {
    let isValid = true;
    if (this.state.determination.requiredError || this.state.determination.endState === false) {
      isValid = false;
    }
    this.setState(prev => {
      prev.showErrorDeterminationQuestions = !isValid;
      return prev;
    });
    return isValid;
  }

  validateDataSharing() {
    this.setState(prev => {
      prev.showErrorDataSharing = !this.state.isDataSharingValid;
      return prev;
    });
    return this.state.isDataSharingValid;
  }

  validateGeneralData(field) {
    let studyDescription = false;
    let pTitle = false;
    let uploadConsentGroup = false;
    let subjectProtection = false;
    let isValid = true;
    let fundings = false;
    if (isEmpty(this.state.generalDataFormData.studyDescription)) {
      studyDescription = true;
      isValid = false;
    }
    if (this.state.generalDataFormData.uploadConsentGroup === undefined || this.state.generalDataFormData.uploadConsentGroup === '') {
      uploadConsentGroup = true;
      isValid = false;
    }
    if (this.state.generalDataFormData.subjectProtection === undefined || this.state.generalDataFormData.subjectProtection === '') {
      subjectProtection = true;
      isValid = false;
    }
    if (isEmpty(this.state.generalDataFormData.pTitle)) {
      pTitle = true;
      isValid = false;
    }
    if (this.state.generalDataFormData.fundings === undefined) {
      fundings = true;
      isValid = false;
    } else {
      this.state.generalDataFormData.fundings.forEach(funding => {
        if (isEmpty(funding.source.label)) {
          fundings = true;
          isValid = false;
        }
      });
    }
    if (field === undefined || field === null || field === 0) {
      this.setState(prev => {
        prev.errors.studyDescription = studyDescription;
        prev.errors.uploadConsentGroup = uploadConsentGroup;
        prev.errors.subjectProtection = subjectProtection;
        prev.errors.pTitle = pTitle;
        prev.errors.fundings = fundings;
        return prev;
      });
    }
    else if (field === 'fundings' || field === 'studyDescription' ||
      field === 'uploadConsentGroup' || field === 'subjectProtection' || field === 'pTitle') {

      this.setState(prev => {
        if (field === 'fundings') {
          prev.errors.fundings = fundings;
        }
        else if (field === 'studyDescription') {
          prev.errors.studyDescription = studyDescription;
        }
        else if (field === 'uploadConsentGroup') {
          prev.errors.uploadConsentGroup = uploadConsentGroup;
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
    if (this.state.intCohortsDetermination.requiredError || this.state.intCohortsDetermination.endState === false) {
      isValid = false;
    }
    this.setState(prev => {
      prev.showErrorIntCohorts = !isValid;
      return prev;
    });
    return isValid;
  }

  handleInfoSecurityValidity(isValid) {
    this.setState({isInfoSecurityValid: isValid})
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
      prev.showErrorDocuments = isValid;
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
      }, () => this.initDocuments(this.state.determination.projectType));
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

      switch (projectType) {
        case IRB:
          documents.push({ required: true, fileKey: 'IRB Approval', label: span({}, ["Upload the ", span({ className: "bold" }, ["IRB Approval "]), "for this Project here*"]), file: null, fileName: null, error: false });
          documents.push({ required: true, fileKey: 'IRB Application', label: span({}, ["Upload the ", span({ className: "bold" }, ["IRB Application "]), "for this Project here*"]), file: null, fileName: null, error: false });
          break;

        case NE:
          documents.push({ required: true, fileKey: 'NE Approval', label: span({}, ["Upload the ", span({ className: "bold" }, ["NE Approval "]), "for this Project here*"]), file: null, fileName: null, error: false });
          documents.push({ required: true, fileKey: 'NE Application', label: span({}, ["Upload the ", span({ className: "bold" }, ["NE Application "]), "for this Project here*"]), file: null, fileName: null, error: false });
          documents.push({ required: false, fileKey: 'Consent Document', label: span({}, ["Upload the ", span({ className: "bold" }, ["Consent Document "]), "for this Project here ", span({ className: "italic" }, ["(if applicable)"])]), file: null, fileName: null, error: false });
          break;

        case NHSR:
          documents.push({ required: true, fileKey: 'NHSR Application', label: span({}, ["Upload the ", span({ className: "bold" }, ["NHSR Application "]), "for this Project here*"]), file: null, fileName: null, error: false });
          break;

        default:
          break;
      }
      this.setState({
        files: documents,
        projectType: projectType,
        formerProjectType: projectType,
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
      prev.generalDataFormData = updatedForm;
      return prev;
    }, () => this.isValid(field));
  };

  updateDataSharingFormData = (updatedForm, field) => {
    this.setState(prev => {
      prev.dataSharingFormData = updatedForm;
      return prev;
    }, () => {
      this.isValid(field);
    })
  };

  handleDataSharingValidity = (isValid) => {
    this.setState({ isDataSharingValid: isValid })
  };

  updateInfoSecurity = (updatedForm, field) => {
    this.setState(prev => {
      prev.securityInfoFormData = updatedForm;
      return prev;
    })
  };

  uploadFiles = (projectKey) => {
    Files.upload(this.props.attachDocumentsURL, this.state.files, projectKey, this.state.user.displayName, this.state.user.userName, true)
      .then(resp => {
        Project.getProjectType(this.props.serverURL, projectKey).then(type => {
          window.location.href =  [this.props.serverURL, type.data.projectType, "show", projectKey, "?tab=review"].join("/");
        });
      }).catch(error => {
        spinnerService.hideAll();
        this.toggleTrueSubmitError();
        this.changeStateSubmitButton();
        console.error(error);
      });
  };

  showSubmit = (currentStep) => {
    let renderSubmit = false;
    if (currentStep === 5) {
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

  render() {
    const { currentStep, determination } = this.state;
    let projectType = determination.projectType;
    return (
      Wizard({
        title: "New Project",
        note: "Note that this application cannot be saved and returned to for completion later. However, allowing the page to remain open in your browser will permit you to return to the application at any time.",
        stepChanged: this.stepChanged,
        isValid: this.isValid,
        submitHandler: this.submitNewProject,
        showSubmit: this.showSubmit,
        disabledSubmit: this.state.formSubmitted,
        loadingImage: this.props.loadingImage,
      }, [
        NewProjectGeneralData({
          title: "General Data",
          currentStep: currentStep,
          user: this.state.user,
          searchUsersURL: this.props.searchUsersURL,
          updateForm: this.updateGeneralDataFormData,
          errors: this.state.errors,
          removeErrorMessage: this.removeErrorMessage
        }),
        NewProjectDetermination({
          title: "Determination Questions",
          currentStep: currentStep,
          determination: this.state.determination,
          handler: this.determinationHandler,
          errors: this.state.showErrorDeterminationQuestions
        }),
        InternationalCohorts({
          title: "International Cohorts",
          currentStep: currentStep,
          handler: this.intCohortsDeterminationHandler,
          determination: this.state.intCohortsDetermination,
          showErrorIntCohorts: this.state.showErrorIntCohorts,
          origin: 'newProject'
        }),
        Security({
          title: "Security",
          step: 3,
          currentStep: currentStep,
          user: this.state.user,
          searchUsersURL: this.props.searchUsersURL,
          updateForm: this.updateInfoSecurity,
          showErrorInfoSecurity: this.state.showErrorInfoSecurity,
          removeErrorMessage: this.removeErrorMessage,
          handleSecurityValidity: this.handleInfoSecurityValidity
        }),
        DataSharing({
          title: "Data Sharing",
          currentStep: currentStep,
          step: 4,
          user: this.state.user,
          searchUsersURL: this.props.searchUsersURL,
          updateForm: this.updateDataSharingFormData,
          removeErrorMessage: this.removeErrorMessage,
          generalError: this.state.generalError,
          submitError: this.state.submitError,
          showErrorDataSharing: this.state.showErrorDataSharing,
          handleDataSharingValidity: this.handleDataSharingValidity
        }),
        NewProjectDocuments({
          title: "Documents",
          currentStep: currentStep,
          step: 5,
          fileHandler: this.fileHandler,
          projectType: projectType,
          files: this.state.files,
          errors: this.state.showErrorDocuments,
          generalError: this.state.generalError,
          submitError: this.state.submitError
        })
      ])
    );
  }
}

export default NewProject;
