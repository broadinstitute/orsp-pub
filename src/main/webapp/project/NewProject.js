import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewProjectGeneralData } from './NewProjectGeneralData';
import { NewProjectDetermination } from './NewProjectDetermination';
import { NewProjectDocuments } from './NewProjectDocuments';
import { PROJECT_DOCUMENTS } from '../util/DocumentType';
import { DETERMINATION } from '../util/TypeDescription';
import { LoginText, Project, Reviewer, User } from '../util/ajax';
import { handleUnauthorized, isEmpty } from '../util/Utils';
import { getProjectType } from '../util/DeterminationQuestions';
import { hh, div } from 'react-hyperscript-helpers';
import 'regenerator-runtime/runtime';
import LoadingWrapper from '../components/LoadingWrapper';
import { PortalMessage } from '../components/PortalMessage';

const LAST_STEP = 2;

const NewProject = hh(class NewProject extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: {
        displayName: '',
        userName: '',
        emailAddress: ''
      },
      showErrorDeterminationQuestions: false,
      showErrorDocuments: false,
      isReadyToSubmit: false,
      generalError: false,
      formSubmitted: false,
      submitError: false,
      determination: {
        projectType: null,
        questions: [],
        requiredError: false,
        currentQuestionIndex: 0,
        nextQuestionIndex: 1,
        endState: false
      },
      generalDataFormData: {},
      attestationFormData: {
        attestation: false
      },
      currentStep: 0,
      files: [],
      errors: {
        studyDescription: false,
        pTitle: false,
        fundings: false,
        attestation: false,
        fundingAwardNumber: false
      },
      formerProjectType: null,
      defaultValueForAbout: 'default',
      reviewersData: [],
      assignedCount: 0
    };
    this.updateGeneralDataFormData = this.updateGeneralDataFormData.bind(this);
    this.updateAttestationFormData = this.updateAttestationFormData.bind(this);
    this.isValid = this.isValid.bind(this);
    this.submitNewProject = this.submitNewProject.bind(this);
    this.removeErrorMessage = this.removeErrorMessage.bind(this);
    this.changeStateSubmitButton = this.changeStateSubmitButton.bind(this);
    this.toggleTrueSubmitError = this.toggleTrueSubmitError.bind(this);
    this.toggleFalseSubmitError = this.toggleFalseSubmitError.bind(this);
  }

  componentDidMount() {
    User.getUserSession().then(resp =>
      this.setState({ user: resp.data })
    ).catch(error => {
      this.setState(() => { throw error; });
    });
    this.loadOptions();
    this.checkDefault();
    this.getReviewerDetails();
  }

  async checkDefault() {
    await LoginText.getLoginText().then(loginText => {
      let data = loginText.data[0];
      if(data[3] === 'default') {
        this.setState({
          defaultValueForAbout: 'default'
        })
      } else {
        this.setState({
          defaultValueForAbout: ''
        })
      }
    })
  }

  loadOptions() {
    let documentOptions = [];
    PROJECT_DOCUMENTS.forEach(type => {
      documentOptions.push({ value: type, label: type });
    });
    this.setState({ documentOptions: documentOptions });
  };

  getReviewerDetails = () => {
    Reviewer.getReviewerAssignedCount().then(data => {
      let assignedCount = data.data;
      Reviewer.getReviewers().then(response => {
        let reviewersArray = response.data;
        // sort data in order
        reviewersArray = reviewersArray.sort((a,b) => a[3] - b[3]);
        let reviewerData = [];
        // converting array of array into array of json
        // after checking endDate
        reviewersArray.forEach((dataArray, i) => {
          if (dataArray[2] === 'Y') {
            if (!dataArray[7]) {
              reviewerData.push({
                id: i + 1,
                name: dataArray[1],
                active: dataArray[2],
                order: dataArray[3],
                userjson: dataArray[4],
                createdAt: dataArray[5],
                startDate: dataArray[6],
                endDate: dataArray[7]
              })
            } else {
              if (new Date(dataArray[7]) > new Date()) {
                reviewerData.push({
                  id: i + 1,
                  name: dataArray[1],
                  active: dataArray[2],
                  order: dataArray[3],
                  userjson: dataArray[4],
                  createdAt: dataArray[5],
                  startDate: dataArray[6],
                  endDate: dataArray[7]
                })
              }
            }
          }
        });
        this.setState({
          reviewersData: reviewerData,
          assignedCount: assignedCount
        });
      })
    })
  };

  submitNewProject = () => {
    this.toggleFalseSubmitError();
    this.props.showSpinner();
    if (this.validateForm()) {
      this.changeStateSubmitButton();
      let projectData = this.getProject();
      let reviewer = '';
      projectData.extraProperties.forEach(item => {
        if (item.name === 'assignedAdmin') {
          reviewer = item.value;
        }
      })
      Project.createProject(
        projectData,
        this.state.files,
        this.state.user.displayName,
        this.state.user.userName,
        reviewer
        ).then(resp => {
          this.props.history.push('/project/main?projectKey=' + resp.data.message.projectKey + '&tab=review&new');
        }).catch(error => {
        if (error.response != null && error.response.status === 401) {
          handleUnauthorized(this.props.history.location);
        } else {
          this.changeStateSubmitButton();
          this.toggleTrueSubmitError();
          this.props.hideSpinner();
          console.error(error);
        }
      });
    } else {
      this.setState(prev => {
        prev.generalError = true;
        return prev;
      }, () => {
        this.props.hideSpinner();
      });
    }
  };

  toggleTrueSubmitError = () => {
    this.setState(prev => {
      prev.submitError = true;
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
    project.type = getProjectType(this.state.determination.projectType);
    project.summary = this.state.generalDataFormData.pTitle !== '' ? this.state.generalDataFormData.pTitle : null;
    project.reporter = this.state.user.userName;
    project.description = this.state.generalDataFormData.studyDescription !== '' ? this.state.generalDataFormData.studyDescription : null;
    project.fundings = this.getFundings(this.state.generalDataFormData.fundings);
    project.attestation = this.state.attestationFormData.attestation;
    let extraProperties = [];

    extraProperties.push({name: 'affiliations', value: isEmpty(this.state.generalDataFormData.affiliations.value) ? null : JSON.stringify(this.state.generalDataFormData.affiliations)});
    extraProperties.push({name: 'affiliationOther', value: this.state.generalDataFormData.affiliationOther !== '' ? this.state.generalDataFormData.affiliationOther : null});
    extraProperties.push({name: 'projectTitle', value: this.state.generalDataFormData.pTitle !== '' ? this.state.generalDataFormData.pTitle : null});
    extraProperties.push({name: 'protocol', value: this.state.generalDataFormData.irbProtocolId !== '' ? this.state.generalDataFormData.irbProtocolId : null});
    extraProperties.push({name: 'notCGSpecify', value: this.state.generalDataFormData.notCGSpecify !== '' ? this.state.generalDataFormData.notCGSpecify : null});
    extraProperties.push({name: 'attestation', value: this.state.attestationFormData.attestation !== '' ? this.state.attestationFormData.attestation : null});
    extraProperties.push({name: 'projectAvailability', value: 'available'});
    if (!this.state.generalDataFormData.irb) {
      extraProperties.push({name: 'irb', value: null})
    } else {
      extraProperties.push({name: 'irb', value: isEmpty(this.state.generalDataFormData.irb.value) ? null : JSON.stringify(this.state.generalDataFormData.irb)});
    }
    let pis = this.state.generalDataFormData.piNames;
    if (pis !== null && pis.length > 0) {
      pis.map((pi, idx) => {
        extraProperties.push({ name: 'pi', value: pi.key });
      });
    }

    let pms = this.state.generalDataFormData.projectManagers;
    if (pms !== null && pms.length > 0) {
      pms.map((pi, idx) => {
        extraProperties.push({ name: 'pm', value: pi.key });
      });
    }

    let collaborators = this.state.generalDataFormData.collaborators;
    if (collaborators !== null && collaborators.length > 0) {
      collaborators.map((collaborator, idx) => {
        extraProperties.push({ name: 'collaborator', value: collaborator.key });
      });
    }
    let questions = this.state.determination.questions;
    if (questions.length > 1) {
      questions.map(q => {
        if (q.answer !== null) {
          extraProperties.push({ name: q.key, value: q.answer });
        }
        if (q.textValue !== null  || q.textValue !== '') {
          extraProperties.push({name: q.key+"TextValue", value: q.textValue});
        }
      });
    }

    // Auto assign reviewers
    if (this.state.assignedCount === 0) {
      extraProperties.push({name: 'assignedAdmin', value: this.state.reviewersData[0].userjson});
      extraProperties.push({name: 'reviewerAssigned', value: this.state.reviewersData[0].name});
    } else {
      let assignableReviewerOrder = this.state.assignedCount % this.state.reviewersData.length;
      extraProperties.push({name: 'assignedAdmin', value: this.state.reviewersData[assignableReviewerOrder].userjson});
      extraProperties.push({name: 'reviewerAssigned', value: this.state.reviewersData[assignableReviewerOrder].name});
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
      isValid = this.validateAttestationForm(field);
    }
    return isValid;
  };

  validateForm = () => {
    const isDeterminationQuestionsValid = this.validateDeterminationQuestions();
    const isGeneralDataValid = this.validateGeneralData();
    const isAttestationFormValid = this.validateAttestationForm();
    return isDeterminationQuestionsValid && isGeneralDataValid && isAttestationFormValid
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

  validateAttestationForm(field) {
    let attestation = false;
    let isValid = true;

    if (this.state.attestationFormData.attestation === undefined ||
      this.state.attestationFormData.attestation === '' ||
      this.state.attestationFormData.attestation === false) {
      attestation = true;
      isValid = false;
    }

    if (field === undefined || field === null || field === 0) {
      this.setState(prev => {
        prev.errors.attestation = attestation;
        return prev;
      });
    }
    else if (field === 'attestation') {

      this.setState(prev => {
        if (field === 'attestation') {
          prev.errors.attestation = attestation;
        }
        return prev;
      });
    }
    return isValid;
  }

  validateGeneralData(field) {
    let studyDescription = false;
    let pTitle = false;
    let isValid = true;
    let fundings = false;
    let fundingAwardNumber = false;

    if (isEmpty(this.state.generalDataFormData.studyDescription)) {
      studyDescription = true;
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
        if (!fundings && (funding.source.value === 'federal_prime' || funding.source.value === 'federal_sub-award') && isEmpty(funding.identifier)) {
          fundingAwardNumber = true;
          isValid = false;
        }
        if (!funding.sponsor) {
          fundingAwardNumber = true;
          isValid = false;
        }
      });
    }
    if (field === undefined || field === null || field === 0) {
      this.setState(prev => {
        prev.errors.studyDescription = studyDescription;
        prev.errors.pTitle = pTitle;
        prev.errors.fundings = fundings;
        prev.errors.fundingAwardNumber = fundingAwardNumber;
        return prev;
      });
    }
    else if (field === 'fundings' || field === 'studyDescription' || field === 'pTitle') {

      this.setState(prev => {
        if (field === 'fundings') {
          prev.errors.fundings = fundings;
          prev.errors.fundingAwardNumber = fundingAwardNumber;
        }
        else if (field === 'studyDescription') {
          prev.errors.studyDescription = studyDescription;
        }
        else if (field === 'pTitle') {
          prev.errors.pTitle = pTitle;
        }
        return prev;
      });
    }
    return isValid;
  }

  determinationHandler = (determination) => {
    this.setState(prev => {
      prev.determination = determination;
      if (prev.determination.projectType !== null && prev.showErrorDeterminationQuestions === true) {
        prev.showErrorDeterminationQuestions = false;
      }
      return prev;
    });
  };

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
    if (this.state.currentStep === 0) {
      this.validateGeneralData(field);
    }
    this.setState(prev => {
      prev.generalDataFormData = updatedForm;
      return prev;
    }, () => this.isValid(field));
  };

  updateAttestationFormData = (updatedForm, field) => {
    if (this.state.currentStep === 4) {
      this.validateAttestationForm(field);
    }
    this.setState(prev => {
      prev.attestationFormData = updatedForm;
      return prev;
    }, () => this.isValid(field));
  };

  showSubmit = (currentStep) => {
    let renderSubmit = false;
    if (currentStep === LAST_STEP) {
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
      div({}, [
        PortalMessage({}),
        Wizard({
          title: "New Project",
          note: "Note that this application cannot be saved and returned to for completion later.",
          stepChanged: this.stepChanged,
          isValid: this.isValid,
          submitHandler: this.submitNewProject,
          showSubmit: this.showSubmit,
          disabledSubmit: this.state.formSubmitted,
        }, [
            NewProjectGeneralData({
              title: "Project Details",
              currentStep: currentStep,
              user: this.state.user,
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
            NewProjectDocuments({
              title: "Documents",
              currentStep: currentStep,
              step: LAST_STEP,
              fileHandler: this.fileHandler,
              projectType: projectType,
              files: this.state.files,
              errors: this.state.errors,
              generalError: this.state.generalError,
              submitError: this.state.submitError,
              options: this.state.documentOptions,
              removeErrorMessage: this.removeErrorMessage,
              updateForm: this.updateAttestationFormData,
              formData: this.state.attestationFormData
            })
        ])
      ])
    );
  }
});

export default LoadingWrapper(NewProject);
