import { Component } from 'react';
import { button, div, h, h2, hh, p, b, span, i, em, label, br } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { AsyncMultiSelect } from '../components/AsyncMultiSelect';
import { Fundings } from '../components/Fundings';
import { KeyPersonnel } from '../components/KeyPersonnel';
import { AlertMessage } from '../components/AlertMessage';
import RequestClarificationDialog from '../components/RequestClarificationDialog';
import { QuestionnaireWorkflow } from '../components/QuestionnaireWorkflow';
import { InputYesNo } from '../components/InputYesNo';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { Issues, Project, Review, Search, User } from '../util/ajax';
import get from 'lodash/get';
import head from 'lodash/head';
import orderBy from 'lodash/orderBy';
import isEmptyArray from 'lodash/isEmpty';
import { getBoolIfString, getDateString, isEmpty, scrollToTop } from '../util/Utils';
import { initQuestions, getProjectType } from '../util/DeterminationQuestions';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { PI_AFFILIATION, PREFERRED_IRB } from '../util/TypeDescription';
import LoadingWrapper from '../components/LoadingWrapper';
import sanitizeHtml from 'sanitize-html';
import he from 'he';
import html2canvas from 'html2canvas';
import jsPDF from "jspdf";
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import ProjectChangeComparision from './ProjectChangeComparison';
import MultiTab from '../components/MultiTab';
import ProjectVersionsView from './ProjectVersionsView';
import './ProjectReview.css'
import { CoiAttestation } from "../components/CoiAttestation";


const TEXT_SHARING_TYPES = ['open', 'controlled', 'both'];

const ProjectReview = hh(class ProjectReview extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      isAdmin: false,
      generalError: false,
      errorSubmit: false,
      descriptionError: false,
      projectTitleError: false,
      editTypeError: false,
      editDescriptionError: false,
      fundingError: false,
      fundingErrorIndex: [],
      keyPersonnelError: false,
      keyPersonnelErrorIndex: [],
      piListError: false,
      pmListError: false,
      hasKeyPersonnel: false,
      internationalCohortsError: false,
      fundingAwardNumberError: false,
      showDialog: false,
      approveInfoDialog: false,
      projectSubmittedDialog: false,
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
        additionalPm: [{ key: '', label: '', value: '' }],
        additionalPi: [{ key: '', label: '', value: '' }],
        collaborators: [{ key: '', label: '', value: '' }],
        projectExtraProps: {
          irb: '',
          affiliations: [],
          affiliationOther: '',
          accurate: '',
          feeForServiceWork: '',
          projectTitle: '',
          protocol: '',
          projectAvailability: null,
          attestation: '',
          describeEditType: null,
          editDescription: null,
          sharingType: false,
          compliance: false,
          pii: false,
          textSharingType: '',
          textCompliance: '',
          isIdReceive: false,
          projectReviewApproved: false
        },
        fundings: [{
          current: { source: { label: '', value: '' }, sponsor: '', identifier: '' },
          future: { source: { label: '', value: '' }, sponsor: '', identifier: '' }
        }],
        keyPersons: [{
          current: { name: null, role: '', otherRole: '', updatedDate: '' },
          future: { name: null, role: '', otherRole: '', updatedDate: '' }
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
        projectType: '',
        requestor: {
          displayName: '',
          emailAddress: ''
        },
        requestorName: component.user !== undefined ? component.user.displayName : '',
        reporter: component.user !== undefined ? component.user.userName : '',
        requestorEmail: component.user !== undefined ? component.user.email.replace("&#64;", "@") : '',
        projectManager: '',
        piName: '',
        studyDescription: '',
        piList: [{ key: '', label: '', value: '' }],
        pmList: [{ key: '', label: '', value: '' }],
        additionalPm: [{ key: '', label: '', value: '' }],
        additionalPi: [{ key: '', label: '', value: '' }],
        fundings: [{
          current: { source: { label: '', value: '' }, sponsor: '', identifier: '' },
          future: { source: { label: '', value: '' }, sponsor: '', identifier: '' }
        }],
        keyPersons: [{
          current: { name: null, role: '', otherRole: '', updatedDate: '' },
          future: { name: null, role: '', otherRole: '', updatedDate: '' }
        }],
        collaborators: [{ key: '', label: '', value: '' }],
        projectExtraProps: {
          irb: '',
          affiliations: '',
          affiliationOther: '',
          accurate: '',
          feeForServiceWork: '',
          irbProtocolId: '',
          projectTitle: '',
          protocol: '',
          projectAvailability: null,
          attestation: '',
          describeEditType: null,
          editDescription: null,
          sharingType: false,
          compliance: false,
          pii: false,
          textSharingType: '',
          textCompliance: '',
          isIdReceive: false,
          projectReviewApproved: false
        },
      },
      determination: {
        projectType: null,
        questions: [],
        requiredError: false,
        currentQuestionIndex: 0,
        nextQuestionIndex: 1,
        endState: false
      },
      questions: null,
      enabledQuestionsWizard: false,
      sponsorHasError: false,
      identifierHasError: false,
      isCompareChanges: false,
      versionedIssue: {},
      issueVersionList: [],
      activeTab: "current_version",
      coiAttestation: {
        accuracyConfirmed: false,
        authorizationConfirmed: false,
        codedConfirmed: false,
        codedNotApplicable: false,
        dataSharingConfirmed: false,
        financialConfirmed: false,
        financialNotApplicable: false
      },
      allKeyPersons: {
        pi: [],
        pm: [],
        additionalPis: [],
        additionalPms: [],
        KeyPersons: []
      },
      showModal: false,
      modalMessage: ''
    };
    this.state.questions = initQuestions();
    this.rejectProject = this.rejectProject.bind(this);
    this.approveEdits = this.approveEdits.bind(this);
    this.removeEdits = this.removeEdits.bind(this);
    this.discardEdits = this.discardEdits.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.showSpinner();
    this.init();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  init() {
    scrollToTop();
    let current = {};
    let currentStr = {};
    let future = {};
    let futureCopy = {};
    let formData = {};
    Project.getProject(this.props.projectKey).then(
      issue => {
        this.props.initStatusBoxInfo(issue.data);
        current.approvalStatus = issue.data.issue.approvalStatus;
        current.description = isEmpty(issue.data.issue.description) ? '' : he.decode(sanitizeHtml(issue.data.issue.description, { allowedTags: [] }));
        current.affiliationOther = issue.data.issue.affiliationOther;
        current.projectExtraProps = issue.data.extraProperties;
        current.projectExtraProps.irb = isEmpty(current.projectExtraProps.irb) ? '' : JSON.parse(current.projectExtraProps.irb);
        current.projectExtraProps.affiliations = this.getAffiliation(current.projectExtraProps.affiliations);
        const PRIMARY_PI = issue.data.allPis.filter((x) => x.piType === "PRIMARY");
        const SECONDARY_PI = issue.data.allPis.filter((x) => x.piType === "SECONDARY");
        current.piList = this.getUsersArray(PRIMARY_PI);
        current.additionalPi = this.getUsersArray(SECONDARY_PI);
        const PRIMARY_PM = issue.data.allPms.filter((x) => x.pmType === "PRIMARY");
        const SECONDARY_PM = issue.data.allPms.filter((x) => x.pmType === "SECONDARY");
        current.pmList = this.getUsersArray(PRIMARY_PM);
        current.additionalPm = this.getUsersArray(SECONDARY_PM);
        current.collaborators = this.getUsersArray(issue.data.collaborators);
        current.fundings = this.getFundingsArray(issue.data.fundings);
        this.updatePiPmValidationArray({ PRIMARY_PI, SECONDARY_PI, PRIMARY_PM, SECONDARY_PM })
        current.requestor = issue.data.requestor !== null ? issue.data.requestor : this.state.requestor;
        current.sequenceNumber = issue.data.issue.sequenceNumber;
        current.updateUser = issue.data.issue.updateUser;
        current.updateDate = issue.data.issue.updateDate;
        this.projectType = issue.data.issue.type;
        this.updateCoiAttestation(issue.data.extraProperties);

        Project.getKeyPersons(this.props.projectKey).then(
          kpResponse => {

            const keyPersonsData = kpResponse.data.keyPersons || [];
            const hasKeyPersonsData =
              Array.isArray(keyPersonsData) && keyPersonsData.length > 0;

            if (hasKeyPersonsData) {
              current.keyPersons =
                this.getKeyPersonsArray(keyPersonsData);
              this.updateKeyPersonValidationArray(keyPersonsData)
            }
            currentStr = JSON.stringify(current);
            future = JSON.parse(currentStr);
            futureCopy = JSON.parse(currentStr);
            Review.getSuggestions(this.props.projectKey).then(
              data => {
                const urlParams = new URLSearchParams(window.location.search);
                if (urlParams.has('new') && urlParams.get('tab') === 'review') {
                  history.pushState({}, null, window.location.href.split('&')[0]);
                  this.handleProjectSubmittedDialog();
                }
                if (this._isMounted) {
                  if (data.data !== '') {
                    formData = JSON.parse(data.data.suggestions);
                    if (hasKeyPersonsData && (!formData.keyPersons || formData.keyPersons.length === 0)) {
                      formData.keyPersons = current.keyPersons;
                    }
                    this.props.hideSpinner();
                    this.setState(prev => {
                      prev.formData = formData;
                      prev.current = current;
                      prev.future = future;
                      prev.futureCopy = futureCopy;
                      prev.editedForm = JSON.parse(data.data.suggestions);
                      prev.reviewSuggestion = true;
                      prev.isAdmin = component.isAdmin;
                      prev.hasKeyPersonnel = hasKeyPersonsData;
                      return prev;
                    });
                    this.loadReviewFieldValidation(formData)
                    this.props.changeInfoStatus(false);
                  } else {
                    this.props.hideSpinner();
                    formData = JSON.parse(currentStr);
                    this.setState(prev => {
                      prev.formData = formData;
                      prev.current = current;
                      prev.future = future;
                      prev.futureCopy = futureCopy;
                      prev.reviewSuggestion = false;
                      prev.isAdmin = component.isAdmin;
                      prev.hasKeyPersonnel = hasKeyPersonsData;
                      return prev;
                    });
                  }
                }
              }).catch(() => { });
          }).catch(() => {
            // If KeyPersons fail, continue safely without them
            currentStr = JSON.stringify(current);
            future = JSON.parse(currentStr);
            futureCopy = JSON.parse(currentStr);
          });
      }
    ).catch((error) => {
      if (error.response.status === 403) {
        this.props.history.push("/index");
      }
      this.props.hideSpinner();
    });
    this.getIssueVersionList();
  }

  loadReviewFieldValidation = (data) => {
    const { additionalPi, additionalPm, piList, pmList, keyPersons } = data;
    this.setState(prevState => ({
      allKeyPersons: {
        ...prevState.allKeyPersons,
        pi: Array.isArray(piList) ? piList.map(x => x.key) : [piList].map(x => x.key),
        additionalPis: additionalPi ? additionalPi.map(x => x.key) : [],
        pm: Array.isArray(pmList) ? pmList.map(x => x.key) : [pmList].map(x => x.key),
        additionalPms: additionalPm ? additionalPm.map(x => x.key) : [],
        KeyPersons: keyPersons ? keyPersons.filter(x => x && x.future && x.future.name && x.future.name.key).map(x => x.future.name.key) : []
      }
    }))
  }

  updatePiPmValidationArray = (fields) => {
    const { PRIMARY_PI, SECONDARY_PI, PRIMARY_PM, SECONDARY_PM } = fields

    this.setState(prevState => ({
      allKeyPersons: {
        ...prevState.allKeyPersons,
        pi: PRIMARY_PI.map(x => x.userName),
        additionalPis: SECONDARY_PI.map(x => x.userName),
        pm: PRIMARY_PM.map(x => x.userName),
        additionalPms: SECONDARY_PM.map(x => x.userName)
      }
    }));
  }

  updateKeyPersonValidationArray = (fields) => {
    this.setState(prevState => ({
      allKeyPersons: {
        ...prevState.allKeyPersons,
        KeyPersons: fields.map(x => x.userName)
      }
    }))
  }


  getIssueVersionList() {
    Project.getIssueVersionList(this.props.projectKey).then(
      data => {
        this.setState(prev => {
          prev.issueVersionList = data.data;
          return prev;
        });
      }).catch(() => { });
  }

  getReviewSuggestions() {
    this.init();
    Review.getSuggestions(this.props.projectKey).then(
      data => {
        if (this._isMounted) {
          if (data.data !== '') {
            this.setState(prev => {
              prev.formData = JSON.parse(data.data.suggestions);
              prev.editedForm = JSON.parse(data.data.suggestions);
              prev.reviewSuggestion = true;
              return prev;
            });
            this.props.changeInfoStatus(false);
            this.props.hideSpinner();
          } else {
            this.setState(prev => {
              prev.editedForm = {};
              prev.reviewSuggestion = false;
              return prev;
            });
            this.props.changeInfoStatus(true);
            this.props.hideSpinner();
          }
        }
      }).catch((error) => {
        this.props.hideSpinner();
        this.setState(() => { throw error; });
      })
  }

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
    return usersArray;
  }

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

  getKeyPersonsArray(keyPersons) {
    let keyPersonsArray = [];
    if (keyPersons !== undefined && keyPersons !== null && keyPersons.length > 0) {
      keyPersons.map(kp => {
        keyPersonsArray.push({
          current: {
            name: kp.name ? this.getUsersArray([kp])[0] : null,
            role: kp.role ? { label: kp.role, value: kp.role.split(" ").join("_").toLowerCase() } : '',
            otherRole: kp.otherRole || kp.roleOther || '',
            updatedDate: kp.keyPersonCreatedDate || kp.updatedDate || ''
          },
          future: {
            name: kp.name ? this.getUsersArray([kp])[0] : null,
            role: kp.role ? { label: kp.role, value: kp.role.split(" ").join("_").toLowerCase() } : '',
            otherRole: kp.otherRole || kp.roleOther || '',
            updatedDate: kp.keyPersonCreatedDate || kp.updatedDate || ''
          }
        });
      });
    }
    // Return empty array if no data exists (don't create empty entry for old projects)
    return keyPersonsArray;
  }

  approveRevision = () => {
    this.props.showSpinner();
    this.setState({
      disableApproveButton: true,
      approveInfoDialog: false
    });
    const data = {
      projectReviewApproved: true,
      projectReviewDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().padStart(2, '0')
        + '-' + new Date().getDate().toString().padStart(2, '0')
    };
    Project.addExtraProperties(this.props.projectKey, data).then(
      () => {
        this.toggleState('approveInfoDialog');
        this.setState(prev => {
          prev.formData.projectExtraProps.projectReviewApproved = true;
          return prev;
        },
          () => {
            Project.getProject(this.props.projectKey).then(
              issue => {
                this.props.hideSpinner();
                this.props.updateDetailsStatus(issue.data);
              })
          });
      }
    ).catch(error => {
      this.props.hideSpinner();
      this.setState(() => { throw error; });
    });
    if (this.state.reviewSuggestion) {
      let project = this.getProject();
      Project.updateProject(project, this.props.projectKey).then(
        resp => {
          this.verifyProjectkeyChanged(project.type);
        })
        .catch(error => {
          this.props.hideSpinner();
          this.setState(() => { throw error; });
        });
    }
  };

  rejectProject() {
    this.props.showSpinner();
    Project.rejectProject(this.props.projectKey).then(resp => {
      this.setState(prev => {
        prev.rejectProjectDialog = !this.state.rejectProjectDialog;
        return prev;
      });
      this.props.hideSpinner();
      this.props.history.push('/index');
    }).catch(error => {
      this.props.hideSpinner();
      this.setState(() => { throw error; });
    });
  }

  discardEdits() {
    this.setState({ discardEditsDialog: false });
    this.props.showSpinner();
    this.removeEdits('reject');
  }

  approveEdits = () => {
    this.setState((state, props) => {
      return { approveDialog: !state.approveDialog }
    });
    this.props.showSpinner();
    let project = this.getProject();
    project.editsApproved = true;
    project.projectReviewDate = new Date().getFullYear() + '/' + (new Date().getMonth() + 1).toString().padStart(2, '0')
      + '/' + new Date().getDate().toString().padStart(2, '0')
    Project.updateProject(project, this.props.projectKey).then(
      resp => {
        this.verifyProjectkeyChanged(project.type);
      }).catch(error => {
        this.props.hideSpinner();
        this.setState(() => { throw error; });
      })
  };

  verifyProjectkeyChanged(type) {
    const projectKey = this.props.projectKey.split('-');
    const projectType = projectKey[projectKey.length - 2];

    if (!isEmpty(projectType) && !isEmpty(type) &&
      projectType !== type) {
      this.updateProjectkey();
    } else {
      this.removeEdits('approve');
    }
  }

  removeEdits(type) {
    Review.deleteSuggestions(this.props.projectKey, type).then(
      resp => {
        this.props.updateContent();
        this.init();
        this.props.hideSpinner();
      })
      .catch(error => {
        this.props.hideSpinner();
        this.setState(() => { throw error; });
      });
  }

  updateProjectkey() {
    Project.updateProjectkey(this.getProject(), this.props.projectKey).then(
      resp => {
        this.reloadProject(resp.data.message);
        this.props.hideSpinner();
      })
      .catch(error => {
        this.props.hideSpinner();
        this.setState(() => { throw error; });
      });
  }

  getProject() {
    let project = {};
    project.type = getProjectType(this.state.formData.projectType);
    project.description = this.state.formData.description;
    project.summary = this.state.formData.projectExtraProps.projectTitle;
    project.fundings = this.getFundings(this.state.formData.fundings);
    if (this.state.formData.keyPersons && this.state.formData.keyPersons.length > 0) {
      project.keyPersons = this.getKeyPersons(this.state.formData.keyPersons);
    }
    project.attestation = this.state.formData.projectExtraProps.attestation;
    project.projectReviewApproved = this.state.formData.projectExtraProps.projectReviewApproved;
    project.protocol = this.state.formData.projectExtraProps.protocol || "--";
    project.feeForService = this.state.formData.projectExtraProps.feeForService;
    project.broadInvestigator = this.state.formData.projectExtraProps.broadInvestigator;
    project.broadInvestigatorTextValue = this.state.formData.projectExtraProps.broadInvestigatorTextValue;
    project.subjectsDeceased = this.state.formData.projectExtraProps.subjectsDeceased;
    project.interactionSource = this.state.formData.projectExtraProps.interactionSource;
    project.sensitiveInformationSource = this.state.formData.projectExtraProps.sensitiveInformationSource;
    project.isIdReceive = this.state.formData.projectExtraProps.isIdReceive;
    project.isCoPublishing = this.state.formData.projectExtraProps.isCoPublishing;
    project.irbReviewedProtocol = this.state.formData.projectExtraProps.irbReviewedProtocol;
    project.humanSubjects = this.state.formData.projectExtraProps.humanSubjects;
    project.feeForServiceWork = this.state.formData.projectExtraProps.feeForServiceWork;
    project.projectTitle = this.state.formData.projectExtraProps.projectTitle;
    project.projectAvailability = this.state.formData.projectExtraProps.projectAvailability;
    project.editDescription = this.state.formData.projectExtraProps.editDescription;
    project.describeEditType = this.state.formData.projectExtraProps.describeEditType;
    project.sharingType = this.state.formData.projectExtraProps.sharingType;
    project.compliance = this.state.formData.projectExtraProps.compliance;
    project.pii = this.state.formData.projectExtraProps.pii;
    project.affiliations = this.state.formData.projectExtraProps.affiliations == null || (this.state.formData.projectExtraProps.affiliations != null && isEmpty(this.state.formData.projectExtraProps.affiliations.value)) ? null : JSON.stringify(this.state.formData.projectExtraProps.affiliations);
    project.affiliationOther = this.state.formData.projectExtraProps.affiliationOther;
    project.sequenceNumber = this.state.formData.sequenceNumber;
    if (!this.state.formData.projectExtraProps.irb) {
      project.irb = JSON.stringify({ label: "--", value: "--" });
    } else {
      project.irb = isEmpty(this.state.formData.projectExtraProps.irb.value) ? null : JSON.stringify(this.state.formData.projectExtraProps.irb);
    }

    if (this.state.reviewSuggestion) {
      project.editsApproved = true;
    }
    if (TEXT_SHARING_TYPES.some((type) => type === project.sharingType)) {
      project.textSharingType = this.state.formData.projectExtraProps.textSharingType;
    } else {
      project.textSharingType = "";
    }
    if (project.compliance === 'true') {
      project.textCompliance = this.state.formData.projectExtraProps.textCompliance;
    } else {
      project.textCompliance = "";
    }

    // let pmList = [];
    // if (this.state.formData.pmList !== null && this.state.formData.pmList.length > 0) {
    //   this.state.formData.pmList.map((pm, idx) => {
    //     pmList.push(pm.key);
    //   });
    //   project.pm = pmList;
    // }

    const pmListFromForm = this.state.formData.pmList;

    const normalizedPmList = Array.isArray(pmListFromForm)
      ? pmListFromForm
      : pmListFromForm
        ? [pmListFromForm]
        : [];

    project.pm = normalizedPmList.map(pm => pm.key);

    // if (this.state.formData.piList !== null && this.state.formData.piList.length > 0) {
    //   let piList = [];
    //   this.state.formData.piList.map((pi, idx) => {
    //     piList.push(pi.key);
    //   });
    //   project.pi = piList;
    // }

    const piListFromForm = this.state.formData.piList;

    const normalizedPiList = Array.isArray(piListFromForm)
      ? piListFromForm
      : piListFromForm
        ? [piListFromForm]
        : [];

    project.pi = normalizedPiList.map(pi => pi.key);

    project.additionalPms = [];
    project.additionalPis = [];

    if (this.state.formData && this.state.formData.additionalPm && Array.isArray(this.state.formData.additionalPm) && this.state.formData.additionalPm.length > 0) {
      let additionalPm = [];
      this.state.formData.additionalPm.map((pi, idx) => {
        additionalPm.push(pi.key);
      });
      project.additionalPms = additionalPm;
    }

    if (this.state.formData && this.state.formData.additionalPi && Array.isArray(this.state.formData.additionalPi) && this.state.formData.additionalPi.length > 0) {
      let additionalPi = [];
      this.state.formData.additionalPi.map((pi, idx) => {
        additionalPi.push(pi.key);
      });
      project.additionalPis = additionalPi;
    }

    let collaborators = this.state.formData.collaborators;

    if (collaborators !== null && collaborators.length > 0) {
      let collaboratorList = [];
      collaborators.map((collaborator, idx) => {
        collaboratorList.push(collaborator.key);
      });
      project.collaborator = collaboratorList;
    }
    return project;
  }

  getAffiliation(affiliations) {
    if (!isEmptyArray(affiliations)) {
      try {
        let aff = affiliations.map(it => JSON.parse(it));
        return head(orderBy(aff, 'value'));
      } catch (error) {
        return '';
      }
    }
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

  getKeyPersons(keyPersons) {
    let keyPersonsList = [];
    if (keyPersons !== null && keyPersons.length > 0) {
      keyPersons.map((kp, idx) => {
        // Only include entries that have both a name and a role
        const name = kp && kp.future ? kp.future.name : null;
        const role = kp && kp.future ? kp.future.role : null;
        const nameEmpty =
          name === null ||
          name === undefined ||
          (Array.isArray(name) && name.length === 0);
        const roleEmpty = !role || isEmpty(role.value);

        if (!nameEmpty && !roleEmpty) {
          let kpItem = {};
          // Use key (userName) or value as fallback
          kpItem.name = name.key || name.value;
          // Use label or value
          kpItem.role = role.label || role.value;
          // Only include otherRole when role is "other"
          kpItem.otherRole = role.value === "other" ? (kp.future.otherRole || '') : '';
          if (kpItem.name) keyPersonsList.push(kpItem);
        }
      });
    }
    return keyPersonsList;
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
        let x = a.source !== undefined ? a.source.label : '';
        let y = b.source !== undefined ? b.source.label : '';
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }
    return fundings;
  };

  enableEdit = (e) => () => {
    this.props.showSpinner();
    this.getReviewSuggestions();
    this.setState(prev => {
      prev.readOnly = false;
      return prev
    });
  };

  exportPdf = (e) => () => {

    this.props.showSpinner();
    const main = document.getElementById('main');
    disableBodyScroll(main);

    const headerBox = document.getElementById('headerBox');
    const requestor = document.getElementById('requestor');
    const principalInvestigator = document.getElementById('principalInvestigator');
    const funding = document.getElementById('funding');
    const projectSummary = document.getElementById('projectSummary');
    const determinationQuestions = document.getElementById('determinationQuestions');

    let totalHeight = 0;
    scrollToTop();

    html2canvas(headerBox)
      .then((canvas) => {
        var doc = new jsPDF();
        doc = this.canvasToPdf(canvas, doc, totalHeight);
        totalHeight += this.canvasHeight(canvas, doc);
        return doc;
      })
      .then((doc) => {
        html2canvas(requestor).then((canvas) => {
          doc = this.canvasToPdf(canvas, doc, totalHeight);
          if ((totalHeight + canvas.height * this.canvasRatio(canvas, doc)) > doc.internal.pageSize.getHeight()) {
            totalHeight = 0;
          }
          totalHeight += this.canvasHeight(canvas, doc);
          return doc;
        })
          .then((doc) => {
            html2canvas(principalInvestigator).then((canvas) => {
              doc = this.canvasToPdf(canvas, doc, totalHeight);
              if ((totalHeight + canvas.height * this.canvasRatio(canvas, doc)) > doc.internal.pageSize.getHeight()) {
                totalHeight = 0;
              }
              totalHeight += this.canvasHeight(canvas, doc);
              return doc;
            })
              .then((doc) => {
                html2canvas(funding).then((canvas) => {
                  doc = this.canvasToPdf(canvas, doc, totalHeight);
                  if ((totalHeight + canvas.height * this.canvasRatio(canvas, doc)) > doc.internal.pageSize.getHeight()) {
                    totalHeight = 0;
                  }
                  totalHeight += this.canvasHeight(canvas, doc);
                  return doc;
                })
                  .then((doc) => {
                    html2canvas(projectSummary).then((canvas) => {
                      doc = this.canvasToPdf(canvas, doc, totalHeight);
                      if ((totalHeight + canvas.height * this.canvasRatio(canvas, doc)) > doc.internal.pageSize.getHeight()) {
                        totalHeight = 0;
                      }
                      totalHeight += this.canvasHeight(canvas, doc);
                      return doc;
                    })
                      .then((doc) => {
                        html2canvas(determinationQuestions).then((canvas) => {

                          doc = this.canvasToPdf(canvas, doc, totalHeight);
                          doc.save(`${this.props.projectKey} Application.pdf`);
                          this.props.hideSpinner();
                          enableBodyScroll(main);
                        }).catch(error => {
                          this.props.hideSpinner();
                          enableBodyScroll(main);
                        })
                      }).catch(error => {
                        this.props.hideSpinner();
                        enableBodyScroll(main);
                      })
                  }).catch(error => {
                    this.props.hideSpinner();
                    enableBodyScroll(main);
                  })
              }).catch(error => {
                this.props.hideSpinner();
                enableBodyScroll(main);
              })
          }).catch(error => {
            this.props.hideSpinner();
            enableBodyScroll(main);
          })
      });

  };

  canvasToPdf(canvas, doc, totalHeight) {
    const imgData = canvas.toDataURL('image/png');

    var pageHeight = doc.internal.pageSize.getHeight() - 2;
    let ratio = this.canvasRatio(canvas, doc);

    if (canvas.height > 0) {
      if ((totalHeight + (canvas.height * ratio)) > pageHeight) {
        doc.addPage();
        doc.addImage(imgData, "PNG", 2, 2, canvas.width * ratio, canvas.height * ratio);
      } else {
        doc.addImage(imgData, "PNG", 2, totalHeight + 2, canvas.width * ratio, canvas.height * ratio);
      }
    }

    return doc;
  };

  canvasHeight(canvas, doc) {
    return canvas.height * this.canvasRatio(canvas, doc) + 2;
  };

  canvasRatio(canvas, doc) {
    return (doc.internal.pageSize.getWidth() - 4) / canvas.width;
  };

  enableEditResponses = (e) => () => {
    this.setState(prev => {
      prev.enabledQuestionsWizard = true;
      return prev
    });

  };

  cancelEditResponses = (e) => () => {
    this.setState(prev => {
      prev.enabledQuestionsWizard = false;
      return prev
    });
  };

  submitEditResponses = (e) => () => {
    this.setState(prev => {
      let questions = this.state.determination.questions;
      if (questions.length > 1) {
        questions.map(q => {
          if (q.answer !== null) {
            prev.formData.projectExtraProps[q.key] = q.answer;
          } else {
            prev.formData.projectExtraProps[q.key] = '';
          }
          if (q.textValue !== null || q.textValue !== '') {
            prev.formData.projectExtraProps[q.key + "TextValue"] = q.textValue;
          } else {
            prev.formData.projectExtraProps[q.key + "TextValue"] = '';
          }
        });
      }
      if (this.state.determination.endState) {
        prev.formData.projectType = this.state.determination.projectType
      }
      prev.enabledQuestionsWizard = false;
      return prev;
    },
      () => {
        if (this.state.errorSubmit === true) this.isValid()
      });

  };

  cancelEdit = (e) => () => {
    this.init();
    this.setState(prev => {
      prev.formData = this.state.futureCopy;
      prev.current = this.state.futureCopy;
      prev.generalError = false;
      prev.descriptionError = false;
      prev.errorSubmit = false;
      prev.showAlert = false;
      prev.readOnly = true;
      return prev;
    });
  };

  submitEdit = () => () => {
    this.props.showSpinner();
    if (this.isValid()) {
      this.setState(prev => {
        prev.readOnly = true;
        prev.errorSubmit = false;
        prev.enabledQuestionsWizard = false;
        if (get(prev.formData.projectExtraProps, 'affiliations.value', '') !== 'other') {
          prev.formData.projectExtraProps.affiliationOther = '';
        }
        return prev;
      });
      let suggestions = this.state.formData;
      User.getUserSession().then(
        resp => {
          suggestions.editCreator = resp.data.userName;
          suggestions.editCreatorName = resp.data.displayName;
          const data = {
            projectKey: this.props.projectKey,
            suggestions: JSON.stringify(suggestions)
          };

          if (this.state.reviewSuggestion) {
            Review.updateReview(this.props.projectKey, data).then(() =>
              this.getReviewSuggestions()
            ).catch(error => {
              this.getReviewSuggestions();
              this.setState(prev => {
                prev.errorSubmit = true;
                prev.alertMessage = "Something went wrong. Please try again later.";
                return prev;
              });
            });
          } else {
            Review.submitReview(data).then(() =>
              this.getReviewSuggestions()
            ).catch(error => {
              this.getReviewSuggestions();
              this.setState(prev => {
                prev.errorSubmit = true;
                prev.alertMessage = "Something went wrong. Please try again later.";
                return prev;
              });
            });
          }
        }).catch(error => {
          this.props.hideSpinner();
          this.setState(() => { throw error; });
        });
    } else {
      this.setState({
        errorSubmit: true
      }, () => this.props.hideSpinner());
    }
  };

  loadUsersOptions = (query, callback) => {
    if (query.length > 2) {
      Search.getMatchingQuery(query)
        .then(response => {
          let options = response.data.map(function (item) {
            return {
              key: item.id,
              value: item.value,
              label: item.label
            };
          });
          callback(options);
        }).catch(error => {
          this.setState(() => { throw error; });
        });
    }
  };

  handleUpdateFundings = (updated) => {
    let fundings = updated;
    fundings.forEach(element => {
      if (element.future.source.value === 'federal_sub-award' ||
        element.future.source.value === 'federal_prime' ||
        element.future.source.value === 'cost_object'
      ) {
        element.future['identifierError'] = element.future.identifier ? false : true;
        this.setState({
          identifierHasError: element.future.identifier ? false : true
        })
      } else {
        element.future['identifierError'] = false;
      }
      if (element.future.source && element.future.source.value !== 'cost_object') {
        element.future['sponsorError'] = element.future.sponsor ? false : true;
        this.setState({
          sponsorHasError: element.future.sponsor ? false : true
        })
      }
    })
    this.setState(prev => {
      prev.formData.fundings = fundings;
      prev.fundingAwardNumberError = false;
      prev.generalError = false;
      prev.fundingError = false;
      return prev;
    });
  };

  handleUpdateKeyPersonnel = (updated, index) => {
    const prev = (this.state.formData && Array.isArray(this.state.formData.keyPersons))
      ? this.state.formData.keyPersons
      : [];

    // Only warn when the latest change INTRODUCES a duplicate.
    // This allows cleanup of pre-existing (migrated) duplicates without showing the modal.
    const editedKey = updated && updated[index] && updated[index].future && updated[index].future.name
      ? updated[index].future.name.key
      : null;

    const editedWasCleared = !editedKey;
    const introducedDuplicates = this.getIntroducedDuplicateKeys(prev, updated, (kp) => kp && kp.future && kp.future.name && kp.future.name.key);

    if (!editedWasCleared && introducedDuplicates.has(editedKey)) {
      this.showDuplicateModal("User already exists. Please choose another one.")
      updated.splice(index, 1);
    }
    this.setState(prev => {
      prev.formData.keyPersons = updated;
      prev.keyPersonnelError = false;
      prev.keyPersonnelErrorIndex = [];
      prev.generalError = false;
      return prev;
    }, () => {
      this.checkDuplicateKeyPersons(updated, 'keyPersons')
    });
  };

  hasDuplicateNameKey = (arr) => {
    const keys = arr
      .map(item => item.future.name && item.future.name.key)
      .filter(Boolean);
    return keys.length !== new Set(keys).size;
  };

  getDuplicateKeys = (keys) => {
    const counts = new Map();
    (keys || []).forEach((k) => {
      if (!k) return;
      counts.set(k, (counts.get(k) || 0) + 1);
    });
    const dupes = new Set();
    counts.forEach((count, key) => {
      if (count > 1) dupes.add(key);
    });
    return dupes;
  };

  getIntroducedDuplicateKeys = (prevArr, nextArr, getKey) => {
    const prevKeys = (prevArr || []).map(getKey).filter(Boolean);
    const nextKeys = (nextArr || []).map(getKey).filter(Boolean);
    const prevDupes = this.getDuplicateKeys(prevKeys);
    const nextDupes = this.getDuplicateKeys(nextKeys);
    const introduced = new Set();
    nextDupes.forEach((k) => {
      if (!prevDupes.has(k)) introduced.add(k);
    });
    return introduced;
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
        prev.formData.piList = data;
        prev.formData.projectExtraProps.pi = data.key;
      } else {
        prev.formData.piList = [];
      }
      return prev;
    }, () => {
      this.checkDuplicateKeyPersons(data, 'piNames');
      if (this.state.errorSubmit === true) this.isValid();
    });
  };
  handleaddtnPIChange = (data, action) => {
    this.setState(prev => {
      if (data !== null) {
        prev.formData.additionalPi = data;
        prev.formData.projectExtraProps.piaddtn = data.key;
      } else {
        prev.formData.additionalPi = [];
      }
      return prev;
    }, () => {
      this.checkDuplicateKeyPersons(data, 'additionalPis')
    });
  };

  handleProjectManagerChange = (data, action) => {
    this.setState(prev => {
      if (data !== null) {
        prev.formData.pmList = data;
        prev.formData.projectExtraProps.pm = data.key;
      } else {
        prev.formData.pmList = [];
      }
      return prev;
    }, () => {
      this.checkDuplicateKeyPersons(data, 'projectManagers');
      if (this.state.errorSubmit === true) this.isValid();
    });
  };

  handleaddtnProjectManagerChange = (data, action) => {
    this.setState(prev => {
      if (data !== null) {
        prev.formData.additionalPm = data;
        prev.formData.projectExtraProps.pmaddtn = data.key;
      } else {
        prev.formData.additionalPm = [];
      }
      return prev;
    }, () => {
      this.checkDuplicateKeyPersons(data, 'additionalPms')
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

  handleProjectSubmittedDialog = () => {
    this.setState((state, props) => {
      return {
        projectSubmittedDialog: !state.projectSubmittedDialog,
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
    let attestationError = false;
    let editTypeError = false;
    let editDescriptionError = false;
    let fundingErrorIndex = [];
    let keyPersonnelErrorIndex = [];
    let generalError = false;
    let questions = false;
    let fundingAwardNumber = false;
    let fundingAdditionalFieldError = false;
    let keyPersonnelError = false;
    let piListError = false;
    let pmListError = false;
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

    // Validate keyPersons if it exists
    if (this.state.hasKeyPersonnel && this.state.formData.keyPersons) {
      const isFutureEmpty = (kp) => {
        if (!kp || !kp.future) return true;
        const nameEmpty =
          kp.future.name === null ||
          kp.future.name === undefined ||
          (Array.isArray(kp.future.name) && kp.future.name.length === 0);
        const roleEmpty = !kp.future.role || isEmpty(kp.future.role.value);
        const otherEmpty = isEmpty(kp.future.otherRole);
        return nameEmpty && roleEmpty && otherEmpty;
      };

      const activeRows = (this.state.formData.keyPersons || []).filter((kp) => !isFutureEmpty(kp));

      // If all rows are cleared in the "future" state, treat it as a valid delete (like Fundings)
      if (activeRows.length > 0) {
        activeRows.forEach((kp, idx) => {
          let hasError = false;
          if (kp.future.name === null || kp.future.name === undefined || (Array.isArray(kp.future.name) && kp.future.name.length === 0)) {
            hasError = true;
            keyPersonnelError = true;
            generalError = true;
          }
          if (!kp.future.role || isEmpty(kp.future.role.value)) {
            hasError = true;
            keyPersonnelError = true;
            generalError = true;
          }
          if (kp.future.role && kp.future.role.value === "other" && isEmpty(kp.future.otherRole)) {
            hasError = true;
            keyPersonnelError = true;
            generalError = true;
          }
          if (hasError) {
            // Map back to the real index in the underlying array (so UI highlights correct row)
            const realIdx = (this.state.formData.keyPersons || []).indexOf(kp);
            keyPersonnelErrorIndex.push(realIdx >= 0 ? realIdx : idx);
          }
        });
      }
    }

    const checkEmptyKeyPerson = (list) => {
      if (!list) return true;
      if (Array.isArray(list)) {
        if (list.length === 0) return true;
        if (list.length === 1 && isEmpty(list[0].key)) return true;
        return false;
      }
      return isEmpty(list.key);
    };

    if (checkEmptyKeyPerson(this.state.formData.piList)) {
      piListError = true;
      generalError = true;
    }

    if (checkEmptyKeyPerson(this.state.formData.pmList)) {
      pmListError = true;
      generalError = true;
    }

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
    if (this.state.sponsorHasError || this.state.identifierHasError) {
      fundingAdditionalFieldError = true;
      generalError = true;
    }
    this.setState(prev => {
      prev.descriptionError = descriptionError;
      prev.projectTitleError = projectTitleError;
      prev.attestationError = attestationError;
      prev.editDescriptionError = editDescriptionError;
      prev.editTypeError = editTypeError;
      prev.fundingError = fundingError;
      prev.fundingErrorIndex = fundingErrorIndex;
      prev.keyPersonnelError = keyPersonnelError;
      prev.keyPersonnelErrorIndex = keyPersonnelErrorIndex;
      prev.piListError = piListError;
      prev.pmListError = pmListError;
      prev.generalError = generalError;
      prev.fundingAwardNumberError = fundingAwardNumber;
      return prev;
    });

    return !attestationError &&
      !projectTitleError &&
      !descriptionError &&
      !editTypeError &&
      !editDescriptionError &&
      !fundingError &&
      !keyPersonnelError &&
      !piListError &&
      !pmListError &&
      !questions &&
      !fundingAwardNumber &&
      !fundingAdditionalFieldError;
  }

  changeFundingError = () => {
    this.setState(prev => {
      prev.fundingError = !prev.fundingError;
      return prev;
    })
  };

  successNotification = (type, message, time) => {
    setTimeout(this.clearAlertMessage(type), time, null);
    this.props.updateContent();
    this.init();
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

  redirectToConsentGroupTab = async () => {
    window.location.href = [component.serverURL, "project", "main?projectKey=" + this.props.projectKey + "&tab=consent-groups"].join("/");
  };

  reloadProject = async (projectKey) => {
    window.location.href = [component.serverURL, "project", "main?projectKey=" + projectKey].join("/");
  };

  handleAttestationCheck = (e) => {
    const checked = e.target.checked;
    this.setState(prev => {
      prev.formData.projectExtraProps.attestation = checked;
      return prev;
    });
  };

  removeErrorMessage = () => {
    this.setState(prev => {
      prev.generalError = false;
      return prev;
    });
  };

  determinationHandler = (determination) => {
    this.setState(prev => {
      prev.determination = determination;
      if (prev.determination.projectType !== null && prev.showErrorDeterminationQuestions === true) {
        prev.showErrorDeterminationQuestions = false;
      }
      return prev;
    });
  };

  handleCompareChange = () => {
    let versionedIssue = {};
    this.props.showSpinner();
    Project.getProjectByVersion(this.props.projectKey, (this.state.future.sequenceNumber - 1)).then(verIssue => {
      versionedIssue = verIssue.data;
      versionedIssue.projectExtraProps = {};
      versionedIssue.extraProperties.forEach(item => {
        versionedIssue.projectExtraProps[item.name] = item.value
      });
      versionedIssue.projectExtraProps.irb = isEmpty(versionedIssue.projectExtraProps.irb) ? '' : JSON.parse(versionedIssue.projectExtraProps.irb);
      versionedIssue.projectExtraProps.affiliations = !versionedIssue.projectExtraProps.affiliations ? [] : this.getAffiliation([versionedIssue.projectExtraProps.affiliations]);
      const additionalPis = Array.isArray(versionedIssue.pis) ? versionedIssue.pis.filter(pi => pi.piType === "SECONDARY") : []
      const primaryPis = Array.isArray(versionedIssue.pis) ? versionedIssue.pis.filter(pi => pi.piType === "PRIMARY") : []
      const additionalPms = Array.isArray(versionedIssue.pms) ? versionedIssue.pms.filter(pm => pm.pmType === "SECONDARY") : []
      const primaryPms = Array.isArray(versionedIssue.pms) ? versionedIssue.pms.filter(pm => pm.pmType === "PRIMARY") : []
      versionedIssue.piList = this.getUsersArray(primaryPis);
      versionedIssue.pmList = this.getUsersArray(primaryPms);
      versionedIssue.additionalPi = this.getUsersArray(additionalPis);
      versionedIssue.additionalPm = this.getUsersArray(additionalPms);
      versionedIssue.collaborators = this.getUsersArray(versionedIssue.collaborators);
      versionedIssue.fundings = this.getFundingsArray(versionedIssue.fundings);
      const versionedKeyPersons = versionedIssue.keyPersons;
      if (versionedKeyPersons !== undefined && versionedKeyPersons !== null && versionedKeyPersons.length > 0) {
        versionedIssue.keyPersons = this.getKeyPersonsArray(versionedKeyPersons);
      }
      this.setState({
        versionedIssue: versionedIssue,
        isCompareChanges: true
      }, () => this.props.hideSpinner());
    });
  };

  handleTabChange = (tab) => {
    this.setState({ activeTab: tab });
  };

  updateCoiAttestation = (attestations) => {
    this.setState(() => ({
      coiAttestation: {
        accuracyConfirmed: attestations.accuracyConfirmed,
        authorizationConfirmed: attestations.authorizationConfirmed,
        codedConfirmed: attestations.codedConfirmed,
        codedNotApplicable: attestations.codedNotApplicable,
        dataSharingConfirmed: attestations.dataSharingConfirmed,
        financialConfirmed: attestations.financialConfirmed,
        financialNotApplicable: attestations.financialNotApplicable
      }
    }))
  }

  checkDuplicateKeyPersons = (data, field) => {

    if (field === 'piNames' && !data) {
      this.setState((prev) => ({ allKeyPersons: { ...prev.allKeyPersons, pi: [] } }))
      return;
    }

    if (field === 'projectManagers' && !data) {
      this.setState((prev) => ({ allKeyPersons: { ...prev.allKeyPersons, pm: [] } }))
      return;
    }

    // if (field === 'keyPersons' && data.length === 1 && !data[0].name) {
    //   this.setState((prev) => ({ allKeyPersons: { ...prev.allKeyPersons, KeyPersons: [] } }))
    //   return;
    // }

    if (field === 'additionalPis' && data.length === 0) {
      this.setState((prev) => ({ allKeyPersons: { ...prev.allKeyPersons, additionalPis: [] } }))
      return;
    }

    if (field === 'additionalPms' && data.length === 0) {
      this.setState((prev) => ({ allKeyPersons: { ...prev.allKeyPersons, additionalPms: [] } }))
      return;
    }

    const KEYPERSONS = Object.values(this.state.allKeyPersons).flat();

    if (field === 'piNames') {
      // PI and PM can can have Dulicates  entires
      const DUPLICATE_EXIST = KEYPERSONS.find((kp) => kp === data.key);
      let iskeyPersonDuplicate = false;
      if (DUPLICATE_EXIST) {
        // if(data[0].key === (this.state.formData.projectManagers && this.state.formData.projectManagers[0] && this.state.formData.projectManagers[0].key)) iskeyPersonDuplicate = true;
        if ([...this.state.allKeyPersons.pi, ...this.state.allKeyPersons.pm, ...this.state.allKeyPersons.additionalPis, ...this.state.allKeyPersons.additionalPms].includes(data.key)) iskeyPersonDuplicate = true;
      }
      if (!DUPLICATE_EXIST || iskeyPersonDuplicate) {
        this.setState((prev) => ({ allKeyPersons: { ...prev.allKeyPersons, pi: [data.key] } }));
      } else {
        this.showDuplicateModal("User already exists. Please choose another one.");
        this.setState(prev => {
          prev.formData.piList = [{ key: '', label: '', value: '' }];
          return prev;
        });
      }
    }

//    if (field === 'projectManagers') {
//      // PI and PM can can have Dulicates  entires
//      const DUPLICATE_EXIST = KEYPERSONS.find((kp) => kp === data.key);
//      let iskeyPersonDuplicate = false;
//      if (DUPLICATE_EXIST) {
//        // if(data[0].key === (this.state.formData.piNames && this.state.formData.piNames[0] && this.state.formData.piNames[0].key)) isPiDuplicate = true;
//        if ([...this.state.allKeyPersons.pi, ...this.state.allKeyPersons.pm, ...this.state.allKeyPersons.additionalPis, ...this.state.allKeyPersons.additionalPms].includes(data.key)) iskeyPersonDuplicate = true;
//      }
//      if (!DUPLICATE_EXIST || iskeyPersonDuplicate) {
//        this.setState((prev) => ({ allKeyPersons: { ...prev.allKeyPersons, pm: [data.key] } }))
//      } else {
//        this.showDuplicateModal("User already exists. Please choose another one.")
//        this.setState(prev => {
//          prev.formData.pmList = [{ key: '', label: '', value: '' }];
//          return prev;
//        });
//      }
//    }

    if (field === 'additionalPis') {
      // additional Pis allows duplicate with projectManagers,additionalPms,piNames.
      const KEYPERSONS = [...this.state.allKeyPersons.KeyPersons];
      if (this.removeIfKeyExists(data, KEYPERSONS)) {
        this.showDuplicateModal("User already exists. Please choose another one.");
        this.setState((prev) => ({
          allKeyPersons: {
            ...prev.allKeyPersons, additionalPis: data.map(x => x.key)
          }
        }), () => {
          this.setState(prev => {
            prev.formData.additionalPi = data;
            return prev;
          });
        })
      } else {
        this.setState((prev) => ({
          allKeyPersons: {
            ...prev.allKeyPersons, additionalPis: data.map(x => x.key)
          }
        }))
      }
    }

    if (field === 'additionalPms') {
      // additional Pis allows duplicate with projectManagers,additionalPms,piNames.
      const KEYPERSONS = [...this.state.allKeyPersons.KeyPersons];
      if (this.removeIfKeyExists(data, KEYPERSONS)) {
        this.showDuplicateModal("User already exists. Please choose another one.");
        this.setState((prev) => ({
          allKeyPersons: {
            ...prev.allKeyPersons, additionalPms: data.map(x => x.key)
          }
        }), () => {
          this.setState(prev => {
            prev.formData.additionalPm = data;
            return prev;
          });
        })
      } else {
        this.setState((prev) => ({
          allKeyPersons: {
            ...prev.allKeyPersons, additionalPms: data.map(x => x.key)
          }
        }))
      }
    }

    if (field === 'keyPersons') {
      // Here Keyperson(Study Staff) is not spred because data in keyperson cannot have duplicate value
      // handles in handleUpdateKeyPersons function
      const KEYPERSONS = [...this.state.allKeyPersons.pi,...this.state.allKeyPersons.additionalPis, ...this.state.allKeyPersons.additionalPms];
      const IS_DUPLICATE_PRESENT = this.checkAndRemoveDuplicate(KEYPERSONS, data);
      if (IS_DUPLICATE_PRESENT) {
        this.showDuplicateModal("User already exists. Please choose another one.")
      }
      if (data.length === 0) {
        this.setState(prev => {
          prev.formData.keyPersons = [];
          return prev;
        });
      } else {
        this.setState((prevState) => ({
          formData: {
            ...prevState.formData,
            keyPersons: data
          }
        }), () => {
          this.setState((prev) => ({
            allKeyPersons: {
              ...prev.allKeyPersons, KeyPersons: this.state.formData.keyPersons
                .filter(x => x && x.future && x.future.name && x.future.name.key)
                .map(x => x.future.name.key)
            }
          }))
        });
      }
    }

  }

  showDuplicateModal = (message) => {
    this.setState({
      showModal: true,
      modalMessage: message
    })
  }

  removeIfKeyExists = (a, b) => {
    if (!Array.isArray(a) || !Array.isArray(b)) {
      return false;
    }

    const keySet = new Set(b);
    const originalLength = a.length;

    for (let i = a.length - 1; i >= 0; i--) {
      if (keySet.has(a[i].key)) {
        a.splice(i, 1);
      }
    }

    return a.length !== originalLength;
  }

  checkAndRemoveDuplicate = (keyPersons, updatedArray) => {
    for (let i = 0; i < updatedArray.length; i++) {
      for (let j = 0; j < keyPersons.length; j++) {
        if (updatedArray[i] && updatedArray[i].future && updatedArray[i].future.name &&
          updatedArray[i].future.name.key === keyPersons[j]) {
          updatedArray.splice(i, 1);
          return true;
        }
      }
    }
    return false;
  }

  render() {
    const { projectReviewApproved } = this.state.formData.projectExtraProps;
    return (
      div({ className: "headerBoxContainer" }, [
        div({ className: "containerBox" }, [
          div({ className: "project-info-div" }, [
            h2({ style: { margin: 0 } }, ["Project Information"]),
            span({
              isRendered: this.state.activeTab === "current_version",
              className: "project-info-btns"
            }, [
              button({
                className: "btn buttonSecondary",
                onClick: this.redirectToConsentGroupTab,
                isRendered: this.state.readOnly === true && !component.isViewer && !this.state.isCompareChanges
              }, ["Add Sample/Data Cohort"]),
              button({
                className: "btn buttonPrimary",
                onClick: this.handleCompareChange,
                isRendered: this.state.readOnly === true && !isEmpty(this.state.future) && this.state.future.sequenceNumber && !this.state.isCompareChanges && !this.state.reviewSuggestion
              }, ["Compare Changes"]),
              button({
                className: "btn buttonPrimary",
                onClick: this.enableEdit(),
                isRendered: this.state.readOnly === true && !component.isViewer && !this.state.isCompareChanges
              }, ["Edit Information"]),
              button({
                className: "btn buttonPrimary",
                onClick: this.exportPdf(),
                isRendered: this.state.readOnly === true && !component.isViewer && isEmpty(this.state.editedForm) && !this.state.isCompareChanges
              }, ["Print PDF"]),

              button({
                className: "btn buttonSecondary",
                onClick: this.cancelEdit(),
                isRendered: this.state.readOnly === false && !this.state.isCompareChanges
              }, ["Cancel"]),
              button({
                className: "btn buttonSecondary",
                onClick: () => this.setState({ isCompareChanges: false }),
                isRendered: this.state.isCompareChanges
              }, ["Go Back"]),
            ]),

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
            ConfirmationDialog({
              closeModal: this.handleProjectSubmittedDialog,
              show: this.state.projectSubmittedDialog,
              handleOkAction: this.redirectToConsentGroupTab,
              title: 'Project submitted',
              bodyText: [
                p('Your Project was successfully submitted to the Broad Institute’s Office of Research Subject Protection. It will now be reviewed by the ORSP team who will reach out to you if they have any questions.'),
                p({ className: "bold" }, 'Please be sure to add your corresponding cohort/consent group information. Please note that failure to provide this with your initial submission may cause delays in the review and approval of your project. Do you want to add them now?'),
              ],
              actionLabel: 'Yes, add now.'
            }, []),
          ]),
          h(MultiTab, {
            activeTab: this.state.activeTab,
            handleSelect: this.handleTabChange,
          }, [
            div({
              key: "current_version",
              title: "Current Approved Version"
            }, [
              div({}, [
                h(RequestClarificationDialog, {
                  closeModal: this.toggleState('requestClarification'),
                  show: this.state.requestClarification,
                  issueKey: this.props.projectKey,
                  successClarification: this.successNotification,
                }),
                div({ className: "modified-data" }, [
                  span({ className: "pr-2" }, ["Last Modified "]),
                  span({ isRendered: this.state.formData.editCreatorName || this.state.current.updateUser }, [
                    span({ className: "pr-2" }, ["by"]),
                    em({ className: "pr-2 text-bold" }, [this.state.formData.editCreatorName || this.state.current.updateUser]),
                  ]),
                  span({ className: "pr-2" }, ["on"]),
                  em({ className: "text-bold" }, [getDateString(this.state.current.updateDate, 'mmddyyyy')]),
                ]),

                div({ isRendered: !this.state.isCompareChanges }, [
                  div({ id: "principalInvestigator" }, [
                    Panel({ title: "Key Personnel" }, [
                      br(),
                      label({ className: 'inputFieldLabel' },
                        ["Broad Principal Investigator (PI) Responsible for Project Conduct and Oversight",
                          span({ className: 'errorMessage' }, ' *')]
                      ),
                      AsyncMultiSelect({
                        id: "pi_select",
                        name: 'piList',
                        readOnly: this.state.readOnly,
                        loadOptions: this.loadUsersOptions,
                        handleChange: this.handlePIChange,
                        value: this.state.formData.piList,
                        currentValue: this.state.current.piList,
                        isMulti: false,
                        showCurrentValueOnEdit: true,
                        error: this.state.piListError,
                        errorMessage: "Required field"
                      }),
                      // br(),
                      // label({className:'inputFieldLabel'},
                      //   ["Additional Broad Co-Investigators"]
                      // ),
                      // AsyncMultiSelect({
                      //   id: "pi_select_add",
                      //   name: 'additionalPi',
                      //   readOnly: this.state.readOnly,
                      //   loadOptions: this.loadUsersOptions,
                      //   handleChange: this.handleaddtnPIChange,
                      //   value: this.state.formData.additionalPi,
                      //   currentValue: this.state.current.additionalPi,
                      //   isMulti: true
                      // }),
                      br(),
                      label({ className: 'inputFieldLabel' },
                        ["PI’s Primary Institutional Affiliation", span({ className: 'errorMessage' }, ' *')]
                      ),
                      InputFieldSelect({
                        id: "affiliations",
                        name: "affiliations",
                        options: PI_AFFILIATION,
                        value: this.state.formData.projectExtraProps.affiliations,
                        currentValue: this.state.current.projectExtraProps.affiliations,
                        onChange: this.handleSelect("affiliations"),
                        readOnly: this.state.readOnly,
                        placeholder: isEmptyArray(this.state.formData.projectExtraProps.affiliations) && this.state.readOnly ? "--" : "Choose an affiliation...",
                        edit: true
                      }),

                      InputFieldText({
                        isRendered: !isEmpty(this.state.formData.projectExtraProps.affiliations) && this.state.formData.projectExtraProps.affiliations.value === "other",
                        id: "affiliationOther",
                        name: "affiliationOther",
                        label: "Primary Investigator Other Affiliation",
                        value: this.state.formData.projectExtraProps.affiliationOther,
                        currentValue: this.state.current.projectExtraProps.affiliationOther,
                        readOnly: this.state.readOnly,
                        required: false,
                        onChange: this.handleProjectExtraPropsChange,
                        edit: true
                      }),
                      br(),
                      label({ className: 'inputFieldLabel' },
                        ["Key Study Contact (will receive email notifications about this project)", span({ className: 'errorMessage' }, ' *')]
                      ),
                      AsyncMultiSelect({
                        id: "inputProjectManager",
                        name: 'pmList',
                        readOnly: this.state.readOnly,
                        loadOptions: this.loadUsersOptions,
                        handleChange: this.handleProjectManagerChange,
                        value: this.state.formData.pmList,
                        currentValue: this.state.current.pmList,
                        isMulti: false,
                        showCurrentValueOnEdit: true,
                        error: this.state.pmListError,
                        errorMessage: "Required field"
                      }),
                      br(),
                      // label({className:'inputFieldLabel'},
                      //   ["Additional Broad Study Staff &/or Broad individuals"]
                      // ),
                      // AsyncMultiSelect({
                      //   id: "ProjectManager_add",
                      //   name: 'additionalPm',
                      //   readOnly: this.state.readOnly,
                      //   loadOptions: this.loadUsersOptions,
                      //   handleChange: this.handleaddtnProjectManagerChange,
                      //   value: this.state.formData.additionalPm,
                      //   currentValue: this.state.current.additionalPm,
                      //   isMulti: true,
                      //   showCurrentValueOnEdit:true
                      // })
                    ])
                  ]),

                  div({ classNames: 'panel-group', id: "studyAccordion" }, [
                    Panel({
                      title: "Broad Study Staff",
                      collapsible: true,
                      defaultOpen: true,
                      panelId: "studyStaffPanel",
                      accordionParentId: "studyAccordion"
                    }, [
                      KeyPersonnel({
                        keyPersons: this.state.formData.keyPersons,
                        current: this.state.formData.keyPersons,
                        updateKeyPersons: this.handleUpdateKeyPersonnel,
                        readOnly: this.state.readOnly,
                        error: this.state.keyPersonnelError,
                        errorIndex: this.state.keyPersonnelErrorIndex,
                        setError: () => this.setState(prev => { prev.keyPersonnelError = false; return prev; }),
                        errorMessage: "Required field",
                        edit: true,
                        editedForm: this.state.editedForm,
                        isCompareChanges: this.state.isCompareChanges,
                        isProjectReviewApproved: this.state.formData.projectExtraProps,
                        comparisonView: false
                      })
                    ])
                  ]),

                  div({ id: "requestor" }, [
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
                      })
                    ])
                  ]),

                  div({ id: "funding" }, [
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
                    ])
                  ]),

                  div({ id: "projectSummary" }, [
                    Panel({ title: "Project Summary" }, [
                      div({ id: "projectSummaryInputTextArea" }, [
                        div({ isRendered: (this.state.formData.description !== this.state.current.description) || !this.state.readOnly }, [
                          InputFieldTextArea({
                            id: "inputStudyActivitiesDescription",
                            name: "description",
                            label: "Describe Broad study activities* ",
                            moreInfo: "(briefly, in 1-2 paragraphs, with attention to whether or not protected health information will be accessed, and any future data sharing plans)",
                            value: this.state.formData.description,
                            currentValue: this.state.current.description,
                            readOnly: this.state.readOnly,
                            readonly: true,
                            required: true,
                            onChange: this.handleInputChange,
                            error: this.state.descriptionError,
                            errorMessage: "Required field"
                          })
                        ]),

                        div({ isRendered: this.state.readOnly && (this.state.formData.description === this.state.current.description) }, [
                          p({ className: "inputFieldLabel" }, "Broad study activities "),
                          div({ className: "inputFieldReadOnly" }, [
                            div({ className: "inputFieldText", style: { 'whiteSpace': 'break-spaces' } }, this.state.current.description)
                          ])
                        ])
                      ]),

                      // AsyncMultiSelect({
                      //   id: "collaborator_select",
                      //   label: "Broad individuals who require access to this project record",
                      //   isDisabled: false,
                      //   readOnly: this.state.readOnly,
                      //   loadOptions: this.loadUsersOptions,
                      //   handleChange: this.handleProjectCollaboratorChange,
                      //   value: this.state.formData.collaborators,
                      //   currentValue: this.state.current.collaborators,
                      //   placeholder: "Start typing names for project access",
                      //   isMulti: true
                      // }),
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
                      InputFieldSelect({
                        label: "IRB-of-record",
                        id: "irb",
                        name: "irb",
                        options: PREFERRED_IRB,
                        value: (
                          !isEmpty(this.state.formData.projectExtraProps.irb) &&
                          this.state.formData.projectExtraProps.irb.label === 'Other' && this.state.readOnly && this.state.formData.projectExtraProps.irbReferralText
                        ) ? { label: this.state.formData.projectExtraProps.irbReferralText } : this.state.formData.projectExtraProps.irb,
                        currentValue: (
                          !isEmpty(this.state.formData.projectExtraProps.irb) &&
                          this.state.current.projectExtraProps.irb.label === 'Other' && this.state.readOnly && this.state.current.projectExtraProps.irbReferralText
                        ) ? { label: this.state.current.projectExtraProps.irbReferralText } : this.state.current.projectExtraProps.irb,
                        onChange: this.handleSelect("irb"),
                        readOnly: this.state.readOnly,
                        placeholder: isEmpty(this.state.formData.projectExtraProps.irb) && this.state.readOnly ? "--" : "Select...",
                        edit: true,
                        isClearable: true
                      })
                    ])
                  ]),

                  div({ id: "determinationQuestions" }, [
                    Panel({ isRendered: this.state.enabledQuestionsWizard === false, title: "Determination Questions" }, [
                      div({ isRendered: this.state.readOnly === false && this.state.formData.approvalStatus != 'Approved' && this.state.formData.approvalStatus != 'Completed', className: "buttonContainer", style: { 'margin': '0 0 0 0' } }, [
                        button({
                          className: "btn buttonPrimary floatRight",
                          onClick: this.enableEditResponses(),
                          isRendered: this.state.readOnly === false && !component.isViewer
                        }, ["Edit Responses"])
                      ]),
                      div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.feeForService), className: "firstRadioGroup" }, [
                        InputYesNo({
                          id: "radioPII",
                          name: "radioPII",
                          label: 'Is this a “fee for service” project? ',
                          moreInfo: '(Commercial service only, no direct federal funding, no data analysis, no data storage, no dbGaP deposition by Broad.)',
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
                          moreInfo: span({ style: { 'display': 'block' } }, ['Examples of projects that ', b(['DO NOT ']), 'contribute to generalizable knowledge include small case studies and internal technology development/validation projects. ']),
                          label: 'Is a Broad scientist(s) conducting research (generating or contributing to generalizable knowledge, with the intention to publish results)? ',
                          readOnly: true,
                          onChange: () => { }
                        }),
                        InputFieldTextArea({
                          isRendered: this.state.formData.projectExtraProps.broadInvestigator == "false" || this.state.formData.projectExtraProps.broadInvestigator == false,
                          id: "broadInvestigatorTextValue",
                          name: "broadInvestigatorTextValue",
                          label: "Please provide a rationale for why this project/work would not be considered as research",
                          value: this.state.formData.projectExtraProps.broadInvestigatorTextValue,
                          currentValue: this.state.current.projectExtraProps.broadInvestigatorTextValue,
                          readOnly: true,
                          required: false,
                          onChange: this.handleProjectExtraPropsChange,
                          valueEdited: isEmpty(this.state.current.projectExtraProps.broadInvestigatorTextValue) === !isEmpty(this.state.formData.projectExtraProps.broadInvestigatorTextValue),
                          edit: true
                        })
                      ]),

                      div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.subjectsDeceased) }, [
                        InputFieldRadio({
                          id: "subjectsDeceased",
                          label: 'Does this project  involve only specimens or data from deceased individuals?',
                          value: this.state.formData.projectExtraProps.subjectsDeceased,
                          currentValue: this.state.current.projectExtraProps.subjectsDeceased,
                          onChange: () => { },
                          optionValues: ['true', 'false'],
                          optionLabels: [
                            span(['Yes']),
                            span(['No/Unknown'])
                          ],
                          required: false,
                          edit: false,
                          readOnly: true
                        })
                      ]),
                      div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.sensitiveInformationSource) }, [
                        InputFieldRadio({
                          id: "sensitiveInformationSource",
                          label: span(['Will specimens or data be provided to the Broad ', i({ style: { 'color': '#0A3356' } }, ['without ']), 'identifiable information? ']),
                          value: this.state.formData.projectExtraProps.sensitiveInformationSource,
                          onChange: () => { },
                          optionValues: ['false', 'true'],
                          optionLabels: [
                            span(['No']),
                            span(['Yes'])
                          ],
                          required: false,
                          edit: false,
                          readOnly: true
                        })
                      ]),
                      div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.isIdReceive) }, [
                        InputYesNo({
                          id: "isIdReceive",
                          name: 'isIdReceive',
                          value: this.state.formData.projectExtraProps.isIdReceive,
                          currentValue: this.state.current.projectExtraProps.isIdReceive,
                          label: 'Does the sample or data provider have access to identifiers?',
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
                          label: 'Will anyone at the Broad be co-publishing or jointly analyzing data with the sample/data provider who has access to identifiable information about the original sample/data donor?',
                          readOnly: true,
                          onChange: () => { }
                        })
                      ]),

                      div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.irbReviewedProtocol) && (this.state.formData.projectExtraProps.irbReviewedProtocol === 'secondaryResearch' || this.state.formData.projectExtraProps.irbReviewedProtocol === 'sensitiveInformationSource' || this.state.formData.projectExtraProps.irbReviewedProtocol === 'irbReviewedProtocol' || this.state.formData.projectExtraProps.irbReviewedProtocol === 'privateInformation') }, [
                        InputFieldRadio({
                          id: "irbReviewedProtocol",
                          label: 'Please select the option which best describes your research ',
                          value: this.state.formData.projectExtraProps.irbReviewedProtocol,
                          onChange: () => { },
                          optionValues: ['irbReviewedProtocol', 'sensitiveInformationSource', 'secondaryResearch', 'privateInformation'],
                          optionLabels: [
                            span(['This is a project that will be/has been reviewed by an IRB, with Broad listed as a study site.']),
                            span(['This project will include an intervention/interaction with subjects, or identifiable information or identifiable private biospecimens will be used.']),
                            span(['This project is secondary research using data or biospecimens not collected specifically for this study.']),
                            span(['This is not a secondary use study. The Broad scientist/team will obtain coded private information/biospecimens from another institution that retains a link to identifiers, ', b(['AND ']), ' be unable to readily ascertain the identity of subjects, ', b(['AND ']), 'will not receive a direct federal grant/award at Broad.'])
                          ],
                          required: false,
                          edit: false,
                          readOnly: true
                        })
                      ]),
                      div({ isRendered: !isEmpty(this.state.formData.projectExtraProps.humanSubjects) }, [
                        InputYesNo({
                          id: "humanSubjects",
                          name: "humanSubjects",
                          value: this.state.formData.projectExtraProps.humanSubjects,
                          currentValue: this.state.current.projectExtraProps.humanSubjects,
                          label: "",
                          moreInfo: span([
                            span({ style: { 'display': 'block' } }, ["Is this a project that only includes interactions involving ", span({ style: { fontWeight: 'bold', textDecoration: 'underline' } }, ["surveys or interview procedures"]), " (including visual or auditory recording) ", b(["IF AT LEAST ONE OF THE FOLLOWING IS TRUE:"])]),
                            span({ style: { 'display': 'block' } }, ["(i) The information is recorded in such a manner that the identity of the subjects cannot readily be ascertained;"]),
                            span({ style: { 'display': 'block' } }, [b(["OR"])]),
                            span({ style: { 'display': 'block' } }, ["(ii) Any disclosure of the responses outside the research would not reasonably place the subjects at risk of criminal or civil liability or be damaging to the subjects' financial standing, employability, educational advancement, or reputation "])
                          ]),
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
                          label: "Does the statement below accurately describe your project?",
                          moreInfo: span({ style: { 'display': 'block' } }, ["I or another member of the project team (including a collaborator, sample/data contributor, or co-investigator) have recorded study data (including data about biospecimens) in such a way that the identity of the subjects cannot be readily ascertained ",
                            b(["directly or indirectly "]), "through identifiers linked to the subjects; ", b([" AND "]), "no one on the research team will attempt to contact or re-identify subjects."]),
                          readOnly: true,
                          onChange: () => { }
                        })
                      ])
                    ])
                  ]),

                  Panel({ isRendered: this.state.enabledQuestionsWizard === true, title: "Determination Questions" }, [
                    div({ style: { 'marginTop': '55px' } }, [
                      QuestionnaireWorkflow({ questions: this.state.questions, determination: this.state.determination, handler: this.determinationHandler, internationalCohorts: false }),
                      div({ isRendered: this.state.readOnly === false, className: "buttonContainer", style: { 'margin': '0 0 0 0' } }, [
                        button({
                          className: "btn buttonSecondary",
                          onClick: this.cancelEditResponses(),
                          isRendered: this.state.readOnly === false && !component.isViewer
                        }, ["Cancel"]),
                        button({
                          className: "btn buttonPrimary floatRight",
                          onClick: this.submitEditResponses(),
                          disabled: !this.state.determination.endState,
                          isRendered: this.state.readOnly === false && !component.isViewer
                        }, ["Submit"])
                      ]),
                    ])
                  ]),
                ]),

                ProjectChangeComparision({
                  isRendered: this.state.isCompareChanges,
                  formData: this.state.formData,
                  versionedData: this.state.versionedIssue
                }),

                Panel({ title: "Broad Responsible Party (or Designee) Attestation*" }, [
                  div({
                    isRendered: getBoolIfString(this.state.formData.projectExtraProps.attestation)
                  }, [
                    p({}, `I confirm that the information provided above is accurate and complete. The Broad researcher 
                        associated with the project is aware of this application, and I have the authority 
                        to submit it on his/her behalf.`),
                    p({}, `[If obtaining coded specimens/data] I certify that no Broad staff or researchers working on 
                          this project will have access to information that would enable the identification of 
                          individuals from whom coded samples and/or data were derived. I also certify that Broad staff 
                          and researchers will make no attempt to ascertain information about these individuals.`),
                    InputFieldCheckbox({
                      id: "ckb_attestation",
                      name: "attestation",
                      onChange: this.handleAttestationCheck,
                      label: "I confirm",
                      checked: getBoolIfString(this.state.formData.projectExtraProps.attestation),
                      readOnly: true,
                      error: false,
                    })
                  ]),
                  CoiAttestation({
                    isRendered: String(this.state.formData.projectExtraProps.attestation) !== "true",
                    coiAttestation: this.state.coiAttestation,
                    isReadOnly: true,
                  })
                ]),
                AlertMessage({
                  msg: this.state.alertMessage !== '' ? this.state.alertMessage : 'Please complete all required fields',
                  show: this.state.generalError || this.state.showAlert || this.state.showSuccessClarification || this.state.errorSubmit,
                  type: this.state.alertType !== '' ? this.state.alertType : 'danger'
                }),
                div({ className: "buttonContainer", style: { 'margin': '20px 0 40px 0' } }, [
                  button({
                    className: "btn buttonPrimary floatLeft",
                    onClick: this.enableEdit(),
                    isRendered: this.state.readOnly === true && !component.isViewer
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
                      (!this.compareObj("formData", "editedForm") && this.compareObj("formData", "current")) || this.state.enabledQuestionsWizard
                      : this.compareObj("formData", "editedForm") || this.state.enabledQuestionsWizard,
                    isRendered: this.state.readOnly === false && !component.isViewer
                  }, ["Submit Edits"]),

                  /*visible for Admin in readOnly mode and if the project is in "pending" status*/
                  button({
                    className: "btn buttonPrimary floatRight",
                    onClick: this.handleApproveInfoDialog,
                    disabled: this.state.disableApproveButton,
                    isRendered: this.state.isAdmin && projectReviewApproved === false && this.state.readOnly === true
                  }, ["Approve"]),

                  /*visible for Admin in readOnly mode and if there are changes to review*/
                  button({
                    className: "btn buttonPrimary floatRight",
                    onClick: this.handleApproveDialog,
                    isRendered: this.state.isAdmin && this.state.reviewSuggestion && this.state.readOnly === true && projectReviewApproved === true
                  }, ["Approve Edits"]),

                  /*visible for Admin in readOnly mode and if the project is in "pending" status*/
                  button({
                    className: "btn buttonSecondary floatRight",
                    onClick: this.toggleState('rejectProjectDialog'),
                    isRendered: this.state.isAdmin && projectReviewApproved === false && this.state.readOnly === true
                  }, ["Reject"]),

                  /*visible for every user in readOnly mode and if there are changes to review*/
                  button({
                    className: "btn buttonSecondary floatRight",
                    onClick: this.toggleState('discardEditsDialog'),
                    isRendered: this.state.isAdmin && this.state.reviewSuggestion && this.state.readOnly === true
                  }, ["Discard Edits"]),
                  button({
                    className: "btn buttonSecondary floatRight",
                    onClick: this.toggleState('requestClarification'),
                    isRendered: this.state.isAdmin && this.state.readOnly === true
                  }, ["Request Clarification"])
                ])
              ])
            ]),
            div({
              key: "approved_versions",
              title: "Previously Approved Versions",
            }, [
              h(ProjectVersionsView, {
                issueVersionList: this.state.issueVersionList
              })
            ]),
          ])
        ]),
        ConfirmationDialog({
          closeModal: this.state.showModal,
          show: this.state.showModal,
          handleOkAction: () => this.setState({ showModal: false }),
          bodyText: this.state.modalMessage,
          actionLabel: 'close',
          title: 'Duplicate Entry',
          hideCancel: true
        }, [])
      ])

    )
  }
});
export default LoadingWrapper(ProjectReview);
