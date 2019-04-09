import { Component } from 'react';
import { h, hh, p, div, h2, span, a, button } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { MultiSelect } from '../components/MultiSelect';
import { Fundings } from '../components/Fundings';
import { AlertMessage } from '../components/AlertMessage';
import { RequestClarificationDialog } from "../components/RequestClarificationDialog";
import { InputYesNo } from '../components/InputYesNo';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { spinnerService } from "../util/spinner-service";
import { Project, Search, Review } from "../util/ajax";
import { Spinner } from "../components/Spinner";
import get from 'lodash/get';
import { SecurityReview } from "../components/SecurityReview";
import { isEmpty } from '../util/Utils';
import { IntCohortsReview } from "../components/IntCohortsReview";
import { InputFieldSelect } from "../components/InputFieldSelect";
import { PREFERRED_IRB } from "../util/TypeDescription";

class ProjectReview extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isInfoSecurityValid: false,
      generalError: false,
      uploadConsentGroupError: false,
      subjectProtectionError: false,
      descriptionError: false,
      projectTitleError: false,
      editTypeError: false,
      editDescriptionError: false,
      uploadConsentGroup: false,
      subjectProtection: false,
      fundingError: false,
      fundingErrorIndex: [],
      internationalCohortsError: false,
      fundingAwardNumberError: false,
      showDialog: false,
      approveInfoDialog: false,
      discardEditsDialog: false,
      approveDialog: false,
      rejectProjectDialog: false,
      requestClarification: false,
      readOnly: true,
      editedForm: {},
      alertType: '',
      alertMessage: '',
      showAlert: false,
      showSubmissionAlert: false,
      showSuccessClarification: false,
      formData: {
        approvalStatus: '',
        description: '',
        projectType: '',
        piList: [{ key: '', label: '', value: '' }],
        pmList: [{ key: '', label: '', value: '' }],
        collaborators: [{ key: '', label: '', value: '' }],
        projectExtraProps: {
          irbReferral: '',
          feeForServiceWork: '',
          projectTitle: '',
          protocol: '',
          uploadConsentGroup: null,
          notCGSpecify: '',
          subjectProtection: null,
          projectAvailability: null,
          describeEditType: null,
          editDescription: null,
          accessible: false,
          compliance: false,
          pii: false,
          sensitive: false,
          textAccessible: '',
          textCompliance: '',
          textSensitive: '',
          isIdReceive: false,
          projectReviewApproved: false
        },
        fundings: [{
          current: { source: { label: '', value: '' }, sponsor: '', identifier: '' },
          future: { source: { label: '', value: '' }, sponsor: '', identifier: '' }
        }],
        requestor: {
          displayName: '',
          emailAddress: ''
        }
      },
      disableApproveButton: false,
      reviewSuggestion: false,
      futureCopy: {},
      current: {
        approvalStatus: '',
        requestor: {
          displayName: '',
          emailAddress: ''
        },
        requestorName: this.props.user !== undefined ? this.props.user.displayName : '',
        reporter: this.props.user !== undefined ? this.props.user.userName : '',
        requestorEmail: this.props.user !== undefined ? this.props.user.email.replace("&#64;", "@") : '',
        projectManager: '',
        piName: '',
        studyDescription: '',
        piList: [{ key: '', label: '', value: '' }],
        pmList: [{ key: '', label: '', value: '' }],
        fundings: [{
          current: { source: { label: '', value: '' }, sponsor: '', identifier: '' },
          future: { source: { label: '', value: '' }, sponsor: '', identifier: '' }
        }],
        collaborators: [{ key: '', label: '', value: '' }],
        projectExtraProps: {
          irbReferral: '',
          feeForServiceWork: '',
          irbProtocolId: '',
          projectTitle: '',
          protocol: '',
          uploadConsentGroup: null,
          notCGSpecify: '',
          subjectProtection: null,
          projectAvailability: null,
          describeEditType: null,
          editDescription: null,
          accessible: false,
          compliance: false,
          pii: false,
          sensitive: false,
          textAccessible: '',
          textCompliance: '',
          textSensitive: '',
          isIdReceive: false,
          projectReviewApproved: false
        },
        showInfoSecurityError: false,
      },
      infoSecurityErrors: {
        sensitive: false,
        accessible: false,
        compliance: false,
        pii: false,
        textSensitive: false,
        textAccessible: false,
        textCompliance: false
      },
      determination: {
        projectType: null,
        questions: [],
        requiredError: false,
        currentQuestionIndex: 0,
        nextQuestionIndex: 1,
        endState: false
      },
      intCohortsAnswers: [],
      intCohortsQuestions: [],
      resetIntCohorts: false,
      intCohortsModified: false,
      questions: [],
    };
    this.rejectProject = this.rejectProject.bind(this);
    this.approveEdits = this.approveEdits.bind(this);
    this.removeEdits = this.removeEdits.bind(this);
    this.discardEdits = this.discardEdits.bind(this);
    this.resetHandler = this.resetHandler.bind(this);
    this.handleInfoSecurityValidity = this.handleInfoSecurityValidity.bind(this);
    this.updateInfoSecurityFormData = this.updateInfoSecurityFormData.bind(this);
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

    componentDidMount() {
    this.init();
  }

  init() {
    let current = {};
    let currentStr = {};
    let future = {};
    let futureCopy = {};
    let formData = {};
    Project.getProject(this.props.projectUrl, this.props.projectKey).then(
      issue => {
        // store current issue info here ....
        current.approvalStatus = issue.data.issue.approvalStatus;
        current.description = issue.data.issue.description.replace(/<\/?[^>]+(>|$)/g, "");
        current.projectExtraProps = issue.data.extraProperties;
        current.projectExtraProps.irbReferral = isEmpty(current.projectExtraProps.irbReferral) ? '' : JSON.parse(current.projectExtraProps.irbReferral),
        current.piList = this.getUsersArray(issue.data.pis);
        current.pmList = this.getUsersArray(issue.data.pms);
        current.collaborators = this.getUsersArray(issue.data.collaborators);
        current.fundings = this.getFundingsArray(issue.data.fundings);
        current.requestor = issue.data.requestor !== null ? issue.data.requestor : this.state.requestor;
        currentStr = JSON.stringify(current);
        future = JSON.parse((currentStr));
        futureCopy = JSON.parse(currentStr);
        this.projectType = issue.data.issue.type;

        const intCohortsQuestions = [
          {key: 'individualDataSourced', answer: null },
          {key: 'isLinkMaintained', answer: null},
          {key: 'feeForServiceWork', answer: null},
          {key: 'areSamplesComingFromEEAA', answer: null},
          {key: 'isCollaboratorProvidingGoodService', answer: null},
          {key: 'isConsentUnambiguous', answer: null}
        ];

        let intCohortsAnswers = [];
        intCohortsQuestions.forEach(it => {
          if (current.projectExtraProps[it.key] !== undefined) {
            intCohortsAnswers.push({
              key: it.key,
              answer: current.projectExtraProps[it.key]
            });
          }
        });

        Review.getSuggestions(this.props.serverURL, this.props.projectKey).then(
          data => {
            if (new URLSearchParams(window.location.search).has('new')) {
              this.successNotification('showSubmissionAlert', 'Your Project was successfully submitted to the Broad Institute’s Office of Research Subject Protection. It will now be reviewed by the ORSP team who will reach out to you if they have any questions.', 8000);
            }
            if (data.data !== '') {
              formData = JSON.parse(data.data.suggestions);

              this.setState(prev => {
                prev.formData = formData;
                prev.current = current;
                prev.future = future;
                prev.futureCopy = futureCopy;
                prev.editedForm = JSON.parse(data.data.suggestions);
                prev.reviewSuggestion = true;
                prev.intCohortsQuestions = intCohortsQuestions;
                prev.intCohortsAnswers = intCohortsAnswers;
                return prev;
              });
            } else {
              formData = JSON.parse(currentStr);
              this.setState(prev => {
                prev.formData = formData;
                prev.current = current;
                prev.future = future;
                prev.futureCopy = futureCopy;
                prev.reviewSuggestion = false;
                prev.intCohortsQuestions = intCohortsQuestions;
                prev.intCohortsAnswers = intCohortsAnswers;
                return prev;
              });
            }
          });
      });
  }

  getReviewSuggestions() {
    Review.getSuggestions(this.props.serverURL, this.props.projectKey).then(
      data => {
        if (data.data !== '') {
          this.setState(prev => {
            prev.formData = JSON.parse(data.data.suggestions);
            prev.editedForm = JSON.parse(data.data.suggestions);
            prev.reviewSuggestion = true;
            return prev;
          });
        } else {
          this.setState(prev => {
            prev.editedForm = {};
            prev.reviewSuggestion = false;
            return prev;
          });
        }
      });
  }

  isAdmin() {
    return this.props.isAdmin === "true";
  }

  parseIntCohorts = () => {
    let intCohortsAnswers = [];
    this.state.intCohortsAnswers.forEach(it => {
      if (this.state.formData.projectExtraProps[it.key] !== undefined) {
        intCohortsAnswers.push({
          key: it.key,
          answer: this.state.formData.projectExtraProps[it.key]
        });
      }
    });
    return intCohortsAnswers;
  };

  validateQuestionnaire = () => {
    let isValid = true;
    const determination = this.state.determination;
    if (this.state.current.approvalStatus === 'Legacy') {
      // if current project is Legacy, international Cohorts is not required, but if the questionnaire workflow has started will be required to complete it.
      isValid = determination.questions.length === 0 || determination.endState === true;
    } else if (this.state.intCohortsAnswers.every(element => element.answer === null)) {
      // if current project is not Legacy but doesn't have international Cohorts completed
      isValid = determination.questions.length !== 0 && determination.endState === true;
    } else if (this.state.intCohortsModified) {
      // if current project started int cohorts questionnaire but is not completed
      isValid = determination.endState === true;
    }
    return isValid;
  };

  resetHandler () {
    this.setState(prev => {
      prev.resetIntCohorts = false;
      prev.determination = this.resetIntCohortsDetermination();
      return prev;
    })
  }

  resetIntCohortsDetermination() {
    return {
      projectType: null,
      questions: [],
      requiredError: false,
      currentQuestionIndex: 0,
      nextQuestionIndex: 1,
      endState: false
    }
  }

  determinationHandler = (determination) => {
    let newValues = {};
    const answers = [];
    this.clearAlertMessage('showAlert');
    determination.questions.forEach(question => {

      if (question.answer !== null) {
        let singleAnswer = {};
        singleAnswer.key = question.key;
        singleAnswer.answer = question.answer;
        answers.push(singleAnswer);
      }
      newValues[question.key] = question.answer;
    });
    this.setState(prev => {
      Object.keys(newValues).forEach(key => {
        prev.formData.projectExtraProps[key] = newValues[key];
      });
      prev.resetIntCohorts = false;
      prev.intCohortsModified = true;
      prev.intCohortsAnswers = [...answers];
      prev.determination = determination;
      prev.internationalCohortsError = false;
      return prev;
    });
  };

  cleanAnswersIntCohorts = (questionIndex) => {
    this.setState(prev => {
      this.state.intCohortsQuestions.forEach((q, index) => {
        if (index > questionIndex.currentQuestionIndex) {
          prev.formData.projectExtraProps[q.key] = null;
        }
      });
      return prev;
    })
  };

  getUsersArray(array) {
    let usersArray = [];
    if (array !== undefined && array !== null && array.length > 0) {
      array.map(element => {
        usersArray.push({
          key: element.userName,
          label: element.displayName + " (" + element.emailAddress + ") ",
          value: element.displayName
        });
      });
    }
    return usersArray
  }

  // Todo: handle data structure in Fundings component
  getFundingsArray(fundings) {
    let fundingsArray = [];
    if (fundings !== undefined && fundings !== null && fundings.length > 0) {
      fundings.map(funding => {
        fundingsArray.push({
          current: {
            source: {
              label: funding.source,
              value: funding.source.split(" ").join("_").toLowerCase()
            },
            sponsor: funding.name,
            identifier: funding.awardNumber !== null ? funding.awardNumber : ''
          },
          future: {
            source: {
              label: funding.source,
              value: funding.source.split(" ").join("_").toLowerCase()
            },
            sponsor: funding.name,
            identifier: funding.awardNumber !== null ? funding.awardNumber : ''
          }
        });
      });
    }
    return fundingsArray;
  }

  approveRevision = () => {
    this.setState({
      disableApproveButton: true,
      approveInfoDialog: false
    });
    const data = { projectReviewApproved: true };
    Project.addExtraProperties(this.props.addExtraPropUrl, this.props.projectKey, data).then(
      () => {
        this.toggleState('approveInfoDialog');
        this.setState(prev => {
          prev.formData.projectExtraProps.projectReviewApproved = true;
          return prev;
        });
      }
    );
    if (this.state.reviewSuggestion) {
      let project = this.getProject();
      Project.updateProject(this.props.updateProjectUrl, project, this.props.projectKey).then(
        resp => {
          this.removeEdits();
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  rejectProject() {
    spinnerService.showAll();
    Project.rejectProject(this.props.rejectProjectUrl, this.props.projectKey).then(resp => {
      this.setState(prev => {
        prev.rejectProjectDialog = !this.state.rejectProjectDialog;
        return prev;
      });
      window.location.href = [this.props.serverURL, "index"].join("/");
      spinnerService.hideAll();
    })
      .catch(error => {
        spinnerService.hideAll();
        console.error(error);
      });
  }

  discardEdits() {
    spinnerService.showAll();
    this.setState({ discardEditsDialog: false });
    this.removeEdits();
  }

  approveEdits = () => {
    spinnerService.showAll();
    let project = this.getProject();
    Project.updateProject(this.props.updateProjectUrl, project, this.props.projectKey).then(
      resp => {
        this.removeEdits();
        this.setState((state, props) => {
          return { approveDialog: !state.approveDialog }
        });
      })
      .catch(error => {
        spinnerService.hideAll();
        console.error(error);
      });
  };

  removeEdits() {
    Review.deleteSuggestions(this.props.discardReviewUrl, this.props.projectKey).then(
      resp => {
        this.init();
        spinnerService.hideAll();
      })
      .catch(error => {
        spinnerService.hideAll();
        console.error(error);
      });
  }

  getProject() {
    let project = {};
    project.description = this.state.formData.description;
    project.summary = this.state.formData.projectExtraProps.projectTitle;
    project.fundings = this.getFundings(this.state.formData.fundings);
    project.uploadConsentGroup = this.state.formData.projectExtraProps.uploadConsentGroup;
    project.notCGSpecify = this.state.formData.projectExtraProps.uploadConsentGroup !== 'notUpload' ? null : this.state.formData.projectExtraProps.notCGSpecify;
    project.subjectProtection = this.state.formData.projectExtraProps.subjectProtection;
    project.projectReviewApproved = this.state.formData.projectExtraProps.projectReviewApproved;
    project.protocol = this.state.formData.projectExtraProps.protocol;
    project.feeForService = this.state.formData.projectExtraProps.feeForService;
    project.feeForServiceWork = this.state.formData.projectExtraProps.feeForServiceWork;
    project.projectTitle = this.state.formData.projectExtraProps.projectTitle;
    project.projectAvailability = this.state.formData.projectExtraProps.projectAvailability;
    project.editDescription = this.state.formData.projectExtraProps.editDescription;
    project.describeEditType = this.state.formData.projectExtraProps.describeEditType;
    project.accessible = this.state.formData.projectExtraProps.accessible;
    project.compliance = this.state.formData.projectExtraProps.compliance;
    project.pii = this.state.formData.projectExtraProps.pii;
    project.sensitive = this.state.formData.projectExtraProps.sensitive;
    project.irbReferral = isEmpty(this.state.formData.projectExtraProps.irbReferral.value) ? null : JSON.stringify(this.state.formData.projectExtraProps.irbReferral);

    if (project.accessible === 'true') {
      project.textAccessible = this.state.formData.projectExtraProps.textAccessible;
    } else {
      project.textAccessible = "";
    }
    if (project.sensitive === 'true') {
      project.textSensitive = this.state.formData.projectExtraProps.textSensitive;
    } else {
      project.textSensitive = "";
    }
    if (project.compliance === 'true') {
      project.textCompliance = this.state.formData.projectExtraProps.textCompliance;
    } else {
      project.textCompliance = "";
    }

    let collaborators = this.state.formData.collaborators;
    let pmList = [];
    if (this.state.formData.pmList !== null && this.state.formData.pmList.length > 0) {
      this.state.formData.pmList.map((pm, idx) => {
        pmList.push(pm.key);
      });
      project.pm = pmList;
    }

    if (this.state.formData.piList !== null && this.state.formData.piList.length > 0) {
      let piList = [];
      this.state.formData.piList.map((pi, idx) => {
        piList.push(pi.key);
      });
      project.pi = piList;
    }

    const questions = this.parseIntCohorts();
    if (questions !== null && questions.length > 0) {
      questions.map((q, idx) => {
        if (q.answer !== null) {
          project[q.key] = q.answer;
        }
      });
    }

    if (collaborators !== null && collaborators.length > 0) {
      let collaboratorList = [];
      collaborators.map((collaborator, idx) => {
        collaboratorList.push(collaborator.key);
      });
      project.collaborator = collaboratorList;
    }
    return project;
  }

  getFundings(fundings) {
    let fundingList = [];
    if (fundings !== null && fundings.length > 0) {
      fundings.map((f, idx) => {
        let funding = {};
        if (!isEmpty(f.future.source.label)) {
          funding.source = f.future.source.label;
          funding.award = f.future.identifier;
          funding.name = f.future.sponsor;
          fundingList.push(funding);
        }
      });
    }
    return fundingList;
  }

  compareObj(obj1, obj2) {
    let form1 = JSON.parse(JSON.stringify(this.state[obj1]));
    let form2 = JSON.parse(JSON.stringify(this.state[obj2]));
    form1.fundings = this.sortFundingsBySource(get(form1, 'fundings', ''));
    form2.fundings = this.sortFundingsBySource(get(form2, 'fundings', ''));
    return JSON.stringify(form1) === JSON.stringify(form2);
  }

  sortFundingsBySource = (fundings) => {
    if (!isEmpty(fundings)) {
      return fundings.sort(function (a, b) {
        let x = a.future.source.label;
        let y = b.future.source.label;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }
    return fundings;
  };

  enableEdit = (e) => () => {
    this.getReviewSuggestions();
    this.setState(prev => {
      prev.intCohortsModified = false;
      prev.resetIntCohorts = true;
      prev.readOnly = false;
      return prev
    });
  };

  cancelEdit = (e) => () => {
    this.init();
    this.setState(prev => {
      prev.intCohortsModified = false;
      prev.resetIntCohorts = false;
      prev.formData = this.state.futureCopy;
      prev.current = this.state.futureCopy;
      prev.errorSubmit = false;
      prev.showAlert = false;
      prev.readOnly = true;
      return prev;
    });
  };

  submitEdit = (e) => () => {
    if (this.validateQuestionnaire()) {
      if (this.isValid()) {
        this.setState(prev => {
          prev.resetIntCohorts = false;
          prev.readOnly = true;
          prev.errorSubmit = false;
          return prev;
        });
        const data = {
          projectKey: this.props.projectKey,
          suggestions: JSON.stringify(this.state.formData)
        };
        if (this.state.reviewSuggestion) {
          Review.updateReview(this.props.serverURL, this.props.projectKey, data).then(() =>
            this.getReviewSuggestions()
          );
        } else {
          Review.submitReview(this.props.serverURL, data).then(() =>
            this.getReviewSuggestions()
          );
        }
      } else {
        this.setState({
          errorSubmit: true
        });
      }
    } else {
      this.setState(prev => {
        prev.errorSubmit = true;
        prev.showAlert = true;
        prev.alertMessage = 'Please complete International Cohorts';
        return prev;
      });
    }
  };

  loadUsersOptions = (query, callback) => {
    if (query.length > 2) {
      Search.getMatchingUsers(this.props.searchUsersURL, query)
        .then(response => {
          let options = response.data.map(function (item) {
            return {
              key: item.id,
              value: item.value,
              label: item.label
            };
          });
          callback(options);
        });
    }
  };

  handleUpdateFundings = (updated) => {
    this.setState(prev => {
      prev.formData.fundings = updated;
      prev.fundingAwardNumberError = false;
      prev.generalError = false;
      prev.fundingError = false;
      return prev;
    });
  };

  handleProjectCollaboratorChange = (data, action) => {
    this.setState(prev => {
      prev.formData.collaborators = data;
      return prev;
    });
  };

  handlePIChange = (data, action) => {
    this.setState(prev => {
      if (data !== null) {
        prev.formData.piList = [data];
        prev.formData.projectExtraProps.pi = data.key;
      } else {
        prev.formData.piList = [];
      }
      return prev;
    });
  };

  handleProjectManagerChange = (data, action) => {
    this.setState(prev => {
      if (data !== null) {
        prev.formData.pmList = [data];
        prev.formData.projectExtraProps.pm = data.key;
      } else {
        prev.formData.pmList = [];
      }
      return prev;
    });
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    },
      () => {
        if (this.state.errorSubmit == true) this.isValid()
      });
  };

  handleProjectExtraPropsChangeRadio = (e, field, value) => {
    this.setState(prev => {
      prev.formData.projectExtraProps[field] = value;
      return prev;
    },
      () => {
        if (this.state.errorSubmit === true) this.isValid()
      });
  };

  handleProjectExtraPropsChange = (e) => {
    const field = e.currentTarget.name;
    const value = e.currentTarget.value;
    this.setState(prev => {
      prev.formData.projectExtraProps[field] = value;
      return prev;
    },
      () => {
        if (this.state.errorSubmit === true) this.isValid()
      });
  };

  handleApproveDialog = () => {
    this.setState((state, props) => {
      return {
        approveDialog: !state.approveDialog,
        editedForm: {},
        errorSubmit: false
      }
    });
  };

  handleApproveInfoDialog = () => {
    this.setState((state, props) => {
      return {
        approveInfoDialog: !state.approveInfoDialog,
        errorSubmit: false
      }
    });
  };

  handleSelect = (field) => () => (selectedOption) => {
    this.setState(prev => {
      prev.formData.projectExtraProps[field] = selectedOption;
      return prev;
    })
  };

  toggleState = (e) => () => {
    this.setState((state, props) => {
      return { [e]: !state[e] }
    });
  };

  isValid() {
    let descriptionError = false;
    let projectTitleError = false;
    let uploadConsentGroupError = false;
    let subjectProtectionError = false;
    let editTypeError = false;
    let editDescriptionError = false;
    let fundingErrorIndex = [];
    let generalError = false;
    let intCohortsAnswers = false;
    let questions = false;
    let fundingAwardNumber = false;
    let fundingError = this.state.formData.fundings.filter((obj, idx) => {
      if (isEmpty(obj.future.source.label) && (!isEmpty(obj.future.sponsor) || !isEmpty(obj.future.identifier))
        || (idx === 0 && isEmpty(obj.future.source.label) && isEmpty(obj.current.source.label))) {
        fundingErrorIndex.push(idx);
        return true
      } else if (obj.future.source.value === 'federal_prime' && isEmpty(obj.future.identifier)) {
        fundingAwardNumber = obj.future.source.value === 'federal_prime' && isEmpty(obj.future.identifier);
        return true;
      } else {
        return false;
      }
    }).length > 0;
    if (fundingError) generalError = true;
    if (this.state.projectType === "IRB Project" && isEmpty(this.state.formData.projectExtraProps.editDescription)) {
      editDescriptionError = true;
      generalError = true;
    }
    if (this.state.projectType === "IRB Project" && isEmpty(this.state.formData.projectExtraProps.describeEditType)) {
      editTypeError = true;
      generalError = true;
    }
    if (isEmpty(this.state.formData.description)) {
      descriptionError = true;
      generalError = true;
    }
    if (isEmpty(this.state.formData.projectExtraProps.projectTitle)) {
      projectTitleError = true;
      generalError = true;
    }
    if (isEmpty(this.state.formData.projectExtraProps.uploadConsentGroup)) {
      uploadConsentGroupError = true;
      generalError = true;
    }
    if (isEmpty(this.state.formData.projectExtraProps.subjectProtection)) {
      subjectProtectionError = true;
      generalError = true;
    }
    if (!this.validateQuestionnaire()) {
      questions = true;
    }
    if (this.state.current.approvalStatus !== 'Legacy' && this.state.intCohortsAnswers.length === 0) {
      intCohortsAnswers = true;
    }

    const infoSecValidate = !this.validateInfoSecurity();
    if (infoSecValidate) {
      generalError = true;
    }
    this.setState(prev => {
      prev.descriptionError = descriptionError;
      prev.projectTitleError = projectTitleError;
      prev.uploadConsentGroupError = uploadConsentGroupError;
      prev.subjectProtectionError = subjectProtectionError;
      prev.editDescriptionError = editDescriptionError;
      prev.editTypeError = editTypeError;
      prev.fundingError = fundingError;
      prev.fundingErrorIndex = fundingErrorIndex;
      prev.generalError = generalError;
      prev.showInfoSecurityError = infoSecValidate;
      prev.internationalCohortsError = intCohortsAnswers;
      prev.fundingAwardNumberError = fundingAwardNumber;
      return prev;
    });

    return !uploadConsentGroupError &&
      !subjectProtectionError &&
      !projectTitleError &&
      !descriptionError &&
      !editTypeError &&
      !editDescriptionError &&
      !fundingError &&
      !questions &&
      !fundingAwardNumber &&
      this.validateInfoSecurity();
  }

  changeFundingError = () => {
    this.setState(prev => {
      prev.fundingError = !prev.fundingError;
      return prev;
    })
  };

  successNotification = (type, message, time) => {
    setTimeout(this.clearAlertMessage(type), time, null);
    this.setState(prev => {
      prev[type] = true;
      prev.alertMessage = message;
      prev.alertType = 'success';
      return prev;
    });
  };

  clearAlertMessage = (type) => () => {
    this.setState(prev => {
      prev[type] = false;
      prev.alertMessage = '';
      prev.alertType = '';
      return prev;
    });
  };
  redirectToNewConsentGroup = () => {
    window.location.href = this.props.serverURL + '/api/consent-group?projectKey=' + this.props.projectKey;
  };

  handleInfoSecurityValidity(isValid) {
    this.setState({ isInfoSecurityValid: isValid });
  }

  validateInfoSecurity = (field) => {
    let pii = false;
    let compliance = false;
    let sensitive = false;
    let accessible = false;
    let isValid = true;
    let textCompliance = false;
    let textSensitive = false;
    let textAccessible = false;

    if (this.state.current.approvalStatus !== 'Legacy') {
      if (isEmpty(this.state.formData.projectExtraProps.pii)) {
        pii = true;
        isValid = false;
      }
      if (isEmpty(this.state.formData.projectExtraProps.compliance)) {
        compliance = true;
        isValid = false;
      }

      if (!isEmpty(this.state.formData.projectExtraProps.compliance)
        && this.state.formData.projectExtraProps.compliance === "true"
        && isEmpty(this.state.formData.projectExtraProps.textCompliance)) {
        textCompliance = true;
        isValid = false;
      }
      if (isEmpty(this.state.formData.projectExtraProps.sensitive)) {
        sensitive = true;
        isValid = false;
      }
      if (!isEmpty(this.state.formData.projectExtraProps.sensitive)
        && this.state.formData.projectExtraProps.sensitive === "true"
        && isEmpty(this.state.formData.projectExtraProps.textSensitive)) {
        textSensitive = true;
        isValid = false;
      }
      if (isEmpty(this.state.formData.projectExtraProps.accessible)) {
        accessible = true;
        isValid = false;
      }
      if (!isEmpty(this.state.formData.projectExtraProps.accessible)
        && this.state.formData.projectExtraProps.accessible === "true"
        && isEmpty(this.state.formData.projectExtraProps.textAccessible)) {
        textAccessible = true;
        isValid = false;
      }
    }
    if (field === undefined || field === null || field === 3) {
      this.setState(prev => {
        prev.infoSecurityErrors.pii = pii;
        prev.infoSecurityErrors.compliance = compliance;
        prev.infoSecurityErrors.sensitive = sensitive;
        prev.infoSecurityErrors.accessible = accessible;
        prev.infoSecurityErrors.textCompliance = textCompliance;
        prev.infoSecurityErrors.textSensitive = textSensitive;
        prev.infoSecurityErrors.textAccessible = textAccessible;
        return prev;
      });
    }
    return isValid;
  };

  updateInfoSecurityForm = (field, value) => {
    this.setState(prev => {
      prev.formData.projectExtraProps[field] = value;
      prev.generalError = false;
      return prev;
    }, () => {
      this.validateInfoSecurity();
    });
  };

  updateInfoSecurityFormData = (updatedForm, field, value) => {
    this.setState(prev => {
      if (updatedForm[field] !== '' && value === undefined) {
        prev.formData.projectExtraProps[field] = updatedForm[field];
      } else if (value !== undefined) {
        prev.formData.projectExtraProps[field] = value;
      }
      prev.showInfoSecurityError = false;
      prev.generalError = false;
      return prev;
    });
  };

  removeErrorMessage = () => {
    this.setState(prev => {
      prev.generalError = false;
      return prev;
    });
  };

  render() {
    const { projectReviewApproved } = this.state.formData.projectExtraProps;
    return (
      div({}, [
        h2({ className: "stepTitle" }, ["Project Information"]),
        ConfirmationDialog({
          closeModal: this.toggleState('rejectProjectDialog'),
          show: this.state.rejectProjectDialog,
          handleOkAction: this.rejectProject,
          title: 'Remove Project Confirmation',
          bodyText: 'Are you sure you want to remove this project?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.toggleState('discardEditsDialog'),
          show: this.state.discardEditsDialog,
          handleOkAction: this.discardEdits,
          title: 'Discard Edits Confirmation',
          bodyText: 'Are you sure you want to remove these edits?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.toggleState('approveDialog'),
          show: this.state.approveDialog,
          handleOkAction: this.approveEdits,
          title: 'Approve Edits Confirmation',
          bodyText: 'Are you sure you want to approve these edits?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.handleApproveInfoDialog,
          show: this.state.approveInfoDialog,
          handleOkAction: this.approveRevision,
          title: 'Approve Project Information',
          bodyText: 'Are you sure you want to approve Project Information?',
          actionLabel: 'Yes'
        }, []),
        RequestClarificationDialog({
          closeModal: this.toggleState('requestClarification'),
          show: this.state.requestClarification,
          issueKey: this.props.projectKey,
          user: this.props.user,
          emailUrl: this.props.emailUrl,
          userName: this.props.userName,
          clarificationUrl: this.props.clarificationUrl,
          successClarification: this.successNotification
        }),
        
        button({
          className: "btn buttonPrimary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.enableEdit(),
          isRendered: this.state.readOnly === true
        }, ["Edit Information"]),
        button({
          className: "btn buttonSecondary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.redirectToNewConsentGroup,
          isRendered: this.state.readOnly === true,
        }, ["Add New Consent Group"]),

        button({
          className: "btn buttonSecondary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.cancelEdit(),
          isRendered: this.state.readOnly === false
        }, ["Cancel"]),

        AlertMessage({
          msg: 'Your Project was successfully submitted to the Broad Institute’s Office of Research Subject Protection. It will now be reviewed by the ORSP team who will reach out to you if they have any questions.',
          show: this.state.showSubmissionAlert,
          type: 'success'
        }),

        Panel({ title: "Notes to ORSP", isRendered: this.state.readOnly === false || !isEmpty(this.state.formData.projectExtraProps.editDescription) }, [
          div({ isRendered: this.projectType === "IRB Project" }, [
            InputFieldRadio({
              id: "radioDescribeEdits",
              name: "describeEditType",
              currentValue: this.state.current.projectExtraProps.describeEditType,
              label: "Please choose one of the following to describe the proposed edits: ",
              value: this.state.formData.projectExtraProps.describeEditType,
              optionValues: ["newAmendment", "requestingAssistance"],
              optionLabels: [
                "I am informing Broad's ORSP of a new amendment I already submitted to my IRB of record",
                "I am requesting assistance in updating and existing project"
              ],
              onChange: this.handleProjectExtraPropsChangeRadio,
              readOnly: this.state.readOnly,
              required: true,
              error: this.state.editTypeError,
              errorMessage: "Required field"
            })
          ]),
          InputFieldTextArea({
            id: "inputDescribeEdits",
            name: "editDescription",
            label: "Please use the space below to describe any additional edits or clarifications to the edits above",
            currentValue: this.state.current.projectExtraProps.editDescription,
            value: this.state.formData.projectExtraProps.editDescription === null ? undefined : this.state.formData.projectExtraProps.editDescription,
            readOnly: this.state.readOnly,
            required: true,
            onChange: this.handleProjectExtraPropsChange,
            error: this.state.editDescriptionError,
            errorMessage: "Required field"
          })
        ]),
        Panel({ title: "Requestor" }, [
          InputFieldText({
            id: "inputRequestorName",
            name: "requestorName",
            label: "Requestor Name",
            value: this.state.formData.requestor.displayName,
            currentValue: this.state.current.requestor.displayName,
            readOnly: true,
            required: true,
            onChange: () => { }
          }),
          InputFieldText({
            id: "inputRequestorEmail",
            name: "requestorEmail",
            label: "Requestor Email Address",
            value: this.state.formData.requestor.emailAddress,
            currentValue: this.state.current.requestor.emailAddress,
            readOnly: true,
            required: true,
            onChange: () => { }
          })
        ]),

        Panel({ title: "Principal Investigator" }, [
          MultiSelect({
            id: "pi_select",
            label: "Broad PI",
            name: 'piList',
            readOnly: this.state.readOnly,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handlePIChange,
            value: this.state.formData.piList,
            currentValue: this.state.current.piList,
            isMulti: false
          }),

          MultiSelect({
            id: "inputProjectManager",
            label: "Broad Project Manager",
            name: 'pmList',
            readOnly: this.state.readOnly,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handleProjectManagerChange,
            value: this.state.formData.pmList,
            currentValue: this.state.current.pmList,
            isMulti: false
          })
        ]),
        Panel({ title: "Funding" }, [
          Fundings({
            fundings: this.state.formData.fundings,
            current: this.state.formData.fundings,
            updateFundings: this.handleUpdateFundings,
            readOnly: this.state.readOnly,
            error: this.state.fundingError,
            errorIndex: this.state.fundingErrorIndex,
            fundingAwardNumberError: this.state.fundingAwardNumberError,
            setError: this.changeFundingError,
            errorMessage: "Required field",
            edit: true
          })
        ]),

        Panel({ title: "Project Summary" }, [
          InputFieldTextArea({
            id: "inputStudyActivitiesDescription",
            name: "description",
            label: "Broad study activities",
            value: this.state.formData.description,
            currentValue: this.state.current.description,
            readOnly: this.state.readOnly,
            readonly: true,
            required: true,
            onChange: this.handleInputChange,
            error: this.state.descriptionError,
            errorMessage: "Required field"
          }),

          MultiSelect({
            id: "collaborator_select",
            label: "Broad individuals who require access to this project record",
            isDisabled: false,
            readOnly: this.state.readOnly,
            loadOptions: this.loadUsersOptions,
            handleChange: this.handleProjectCollaboratorChange,
            value: this.state.formData.collaborators,
            currentValue: this.state.current.collaborators,
            placeholder: "Start typing names for project access",
            isMulti: true
          }),

          InputFieldText({
            id: "inputPTitle",
            name: "projectTitle",
            label: "Title of project/protocol",
            value: this.state.formData.projectExtraProps.projectTitle,
            currentValue: this.state.current.projectExtraProps.projectTitle,
            readOnly: this.state.readOnly,
            required: false,
            onChange: this.handleProjectExtraPropsChange,
            error: this.state.projectTitleError,
            errorMessage: "Required field",
            edit: true
          }),
          InputFieldText({
            id: "inputIrbProtocolId",
            name: "protocol",
            label: "Protocol # at Broad IRB-of-record ",
            value: this.state.formData.projectExtraProps.protocol,
            currentValue: this.state.current.projectExtraProps.protocol,
            readOnly: this.state.readOnly,
            required: false,
            onChange: this.handleProjectExtraPropsChange,
            valueEdited: isEmpty(this.state.current.projectExtraProps.protocol) === !isEmpty(this.state.formData.projectExtraProps.protocol),
            edit: true
          }),
          InputFieldRadio({
            id: "radioUploadConsentGroup",
            name: "uploadConsentGroup",
            label: "Will you be uploading a Consent Group?",
            value: this.state.formData.projectExtraProps.uploadConsentGroup,
            currentValue: this.state.current.projectExtraProps.uploadConsentGroup,
            optionValues: ["uploadNow", "uploadLater", "notUpload"],
            optionLabels: [
              span({}, ["Yes, I will upload a Consent Group ", span({ className: "bold" }, ["now"])]),
              span({}, ["Yes, I will upload a Consent Group ", span({ className: "bold" }, ["later"])]),
              "No, I will not upload a Consent Group"
            ],
            onChange: this.handleProjectExtraPropsChangeRadio,
            required: true,
            readOnly: this.state.readOnly,
            error: this.state.uploadConsentGroupError,
            errorMessage: "Required field"
          }),
          div({ isRendered: this.state.formData.projectExtraProps.uploadConsentGroup === "notUpload" }, [
            InputFieldText({
              id: "inputNotCGSpecify",
              name: "notCGSpecify",
              label: "Please specify",
              value: this.state.formData.projectExtraProps.notCGSpecify,
              currentValue: this.state.current.projectExtraProps.notCGSpecify,
              readOnly: this.state.readOnly,
              required: false,
              onChange: this.handleProjectExtraPropsChange,
              valueEdited: isEmpty(this.state.current.projectExtraProps.notCGSpecify) === !isEmpty(this.state.formData.projectExtraProps.notCGSpecify),
              edit: true
            })
          ]),
          InputFieldRadio({
            id: "radioSubjectProtection",
            name: "subjectProtection",
            label: "For this project, are you requesting that Broad’s ORSP assume responsibility for submitting regulatory documentation to an outside IRB ",
            moreInfo: "(as opposed to the study team independently managing the submissions)?",
            value: this.state.formData.projectExtraProps.subjectProtection,
            currentValue: this.state.current.projectExtraProps.subjectProtection,
            optionValues: ["true", "false", "notapplicable"],
            optionLabels: [
              "Yes",
              "No",
              "N/A - No IRB submission required"
            ],
            onChange: this.handleProjectExtraPropsChangeRadio,
            required: true,
            readOnly: this.state.readOnly,
            error: this.state.subjectProtectionError,
            errorMessage: "Required field"
          }),

          /*IMPORTANT: These questions will appear on Edit mode, once project has been approved*/

          InputFieldRadio({
            isRendered: false,
            id: "radioProjectAvailability",
            name: "projectAvailability",
            label: "Project Availability",
            value: this.state.formData.projectExtraProps.projectAvailability,
            currentValue: this.state.current.projectExtraProps.projectAvailability,
            optionValues: ["available", "onHold"],
            optionLabels: [
              "Available",
              "On Hold"
            ],
            onChange: this.handleProjectExtraPropsChangeRadio,
            readOnly: this.state.readOnly
          }),
          InputFieldSelect({
            label: "Irb Referral",
            id: "irbReferral",
            name: "irbReferral",
            options: PREFERRED_IRB,
            value: this.state.formData.projectExtraProps.irbReferral,
            currentValue: this.state.current.projectExtraProps.irbReferral,
            onChange: this.handleSelect("irbReferral"),
            readOnly: this.state.readOnly,
            placeholder: isEmpty(this.state.formData.projectExtraProps.irbReferral) && this.state.readOnly ? "--" : "Select...",
            edit: true
          })
        ]),

        /*UNTIL HERE*/
        Panel({ title: "Security" }, [
          SecurityReview({
            user: this.state.user,
            searchUsersURL: this.props.searchUsersURL,
            updateForm: this.updateInfoSecurityForm,
            showErrorInfoSecurity: this.state.showInfoSecurityError,
            removeErrorMessage: this.removeErrorMessage,
            handleSecurityValidity: this.handleInfoSecurityValidity,
            readOnly: this.state.readOnly,
            current: this.state.current,
            formData: this.state.formData,
            infoSecurityErrors: this.state.infoSecurityErrors,
            edit: true,
            review: true,
          }),
        ]),
        Panel({ title: "Determination Questions" }, [
          div({ isRendered: this.state.readOnly === false }, [
            AlertMessage({
              type: 'info',
              msg: "If changes need to be made to any of these questions, please submit a new project request",
              show: true
            })
          ]),
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.feeForService), className: "firstRadioGroup" }, [
            InputYesNo({
              id: "radioPII",
              name: "radioPII",
              label: 'Is this a "fee-for-service" project? ',
              moreInfo: '(commercial service only, no Broad publication privileges)',
              value: this.state.formData.projectExtraProps.feeForService,
              currentValue: this.state.current.projectExtraProps.feeForService,
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.broadInvestigator) }, [
            InputYesNo({
              id: "broadInvestigator",
              name: "broadInvestigator",
              value: this.state.formData.projectExtraProps.broadInvestigator,
              currentValue: this.state.current.projectExtraProps.broadInvestigator,
              moreInfo: '(generating, contributing to generalizable knowledge)? Examples of projects that DO NOT contribute to generalizable knowledge include case studies, internal technology development projects.',
              label: 'Is a Broad investigator conducting research ',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.subjectsDeceased) }, [
            InputYesNo({
              id: "subjectsDeceased",
              name: "subjectsDeceased",
              value: this.state.formData.projectExtraProps.subjectsDeceased,
              currentValue: this.state.current.projectExtraProps.subjectsDeceased,
              label: 'Are all subjects who provided samples and/or data now deceased?',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.sensitiveInformationSource) }, [
            InputYesNo({
              id: "sensitiveInformationSource",
              name: "sensitiveInformationSource",
              value: this.state.formData.projectExtraProps.sensitiveInformationSource,
              currentValue: this.state.current.projectExtraProps.sensitiveInformationSource,
              moreInfo: '(Coded data are considered identifiable if researcher has access to key)',
              label: 'Is Broad investigator/staff a) obtaining information or biospecimens through an interaction with living human subjects or, b) obtaining/analyzing/generating identifiable private information or identifiable biospecimens ',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.interactionSource) }, [
            InputYesNo({
              id: "interactionSource",
              name: "interactionSource",
              value: this.state.formData.projectExtraProps.interactionSource,
              currentValue: this.state.current.projectExtraProps.interactionSource,
              label: 'Are samples/data being provided by an investigator who has access to identifiers or obtains samples through an intervention or interaction?',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.isIdReceive) }, [
            InputYesNo({
              id: "isIdReceive",
              name: "isIdReceive",
              value: this.state.formData.projectExtraProps.isIdReceive,
              currentValue: this.state.current.projectExtraProps.isIdReceive,
              label: 'Is the Broad receiving subject identifiers?',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.isCoPublishing) }, [
            InputYesNo({
              id: "isCoPublishing",
              name: 'isCoPublishing',
              value: this.state.formData.projectExtraProps.isCoPublishing,
              currentValue: this.state.current.projectExtraProps.isCoPublishing,
              label: 'Is the Broad researcher co-publishing or doing joint analysis with investigator who has access to identifiers?',
              readOnly: true,
              onChange: () => { }
            })
          ]),
          div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.federalFunding) }, [
            InputYesNo({
              id: "federalFunding",
              name: 'federalFunding',
              value: this.state.formData.projectExtraProps.federalFunding,
              currentValue: this.state.current.projectExtraProps.federalFunding,
              label: 'Is Broad receiving direct federal funding?',
              readOnly: true,
              onChange: () => { }
            })
          ])
        ]),
        Panel({ title: "International Cohorts"}, [
          IntCohortsReview({
            future: get(this.state.formData, 'projectExtraProps', ''),
            current: this.state.current.projectExtraProps,
            readOnly: this.state.readOnly,
            determination: this.state.determination,
            resetHandler: this.resetHandler,
            handler: this.determinationHandler,
            cleanQuestionsUnanswered: this.cleanAnswersIntCohorts,
            resetIntCohorts: this.state.resetIntCohorts,
            origin: "project"
          })
        ]),
        AlertMessage({
          msg: this.state.alertMessage !== '' ? this.state.alertMessage : 'Please complete all required fields',
          show: this.state.generalError || this.state.showAlert || this.state.showSuccessClarification,
          type: this.state.alertType !== '' ? this.state.alertType : 'danger'
        }),
        div({ className: "buttonContainer", style: { 'margin': '20px 0 40px 0' } }, [
          button({
            className: "btn buttonPrimary floatLeft",
            onClick: this.enableEdit(),
            isRendered: this.state.readOnly === true
          }, ["Edit Information"]),

          button({
            className: "btn buttonSecondary",
            onClick: this.cancelEdit(),
            isRendered: this.state.readOnly === false
          }, ["Cancel"]),

          /*visible for every user in edit mode and disabled until some edit has been made*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.submitEdit(),
            disabled: isEmpty(this.state.editedForm) ?
              !this.compareObj("formData", "editedForm") && this.compareObj("formData", "current")
              : this.compareObj("formData", "editedForm"),
            isRendered: this.state.readOnly === false
          }, ["Submit Edits"]),

          /*visible for Admin in readOnly mode and if the project is in "pending" status*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveInfoDialog,
            disabled: this.state.disableApproveButton,
            isRendered: this.isAdmin() && projectReviewApproved === false && this.state.readOnly === true
          }, ["Approve"]),

          /*visible for Admin in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveDialog,
            isRendered: this.isAdmin() && this.state.reviewSuggestion && this.state.readOnly === true && projectReviewApproved === true
          }, ["Approve Edits"]),

          /*visible for Admin in readOnly mode and if the project is in "pending" status*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.toggleState('rejectProjectDialog'),
            isRendered: this.isAdmin() && projectReviewApproved === false && this.state.readOnly === true
          }, ["Reject"]),

          /*visible for every user in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.toggleState('discardEditsDialog'),
            isRendered: this.isAdmin() && this.state.reviewSuggestion && this.state.readOnly === true
          }, ["Discard Edits"]),
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.toggleState('requestClarification'),
            isRendered: this.isAdmin() && this.state.readOnly === true
          }, ["Request Clarification"])
        ]),
        h(Spinner, {
          name: "mainSpinner", group: "orsp", loadingImage: this.props.loadingImage
        })
      ])
    )
  }
}

export default ProjectReview;
