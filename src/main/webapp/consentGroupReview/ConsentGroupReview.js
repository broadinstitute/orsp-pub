import { Component } from 'react';
import { hh, p, div, h2, input, label, span, a, button } from 'react-hyperscript-helpers';

import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { InputYesNo } from '../components/InputYesNo';
import { InstitutionalSource } from '../components/InstitutionalSource';
import { ConsentGroup, SampleCollections, User, Review } from "../util/ajax";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { spinnerService } from "../util/spinner-service";
import { QuestionnaireWorkflow } from "../components/QuestionnaireWorkflow";
import { AlertMessage } from "../components/AlertMessage";

const EXIT = 500;
const DPA = 600;
const RA = 700;
const CTC = 800;
const OSAP = 900;

class ConsentGroupReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      showDiscardEditsDialog: false,
      showApproveDialog: false,
      showRejectProjectDialog: false,
      readOnly: true,
      isAdmin: false,
      disableApproveButton: false,
      reviewSuggestion: false,
      consentForm: {
        summary: '',
        approvalStatus: 'Pending'
      },
      determination: {
        projectType: 900,
        questions: [],
        requiredError: false,
        currentQuestionIndex: 0,
        nextQuestionIndex: 1,
        endState: false
      },

      consentExtraProps: {
        consent: '',
        protocol: '',
        collInst: '',
        collContact: '',
        describeConsentGroup: '',
        requireMta: '',

        startDate: null,
        endDate: null,
        onGoingProcess: false,

        individualDataSourced: null,
        isLinkMaintained: null,
        feeForService: null,
        areSamplesComingFromEEAA: null,
        isCollaboratorProvidingGoodService: null,
        isConsentUnambiguous: null,
        pii: null,
        compliance: null,
        textCompliance: null,
        sensitive: null,
        textSensitive: null,
        accessible: null,
        textAccessible: null,
        sharingPlan: null,
        databaseControlled: null,
        databaseOpen: null,
        instSources: []
      },
      errorSubmit: false,
      errors: {
        sampleCollections: false,
        consent: false,
        protocol: false,
        consentGroupName: false,
        collInst: false,
        describeConsentGroup: false,
        requireMta: false,
        institutionalSourcesName: false,
        institutionalSourcesCountry: false,
        pii: false,
        compliance: false,
        sensitive: false,
        accessible: false,
        textCompliance: false,
        textSensitive: false,
        textAccessible: false,
        sharingPlan: false
      },
      formData: {
        consentExtraProps: {},
        consentForm: {},
        sampleCollections: [],
      },
      current: {
        consentExtraProps: {
        },
        consentForm: {
        }
      },
      suggestions: {},
      suggestionsCopy: {},
      questions: [],
      questionsIds: [],

      singleErrorMessage: 'Required field',

      showError: false,
      errorMessage: 'Please complete required fields',
      detailsError: false,
      sampleCollectionsError: false,
      institutionalSourceError: false,
      internationalCohortsError: false,
      securityError: false,
      dataSharingError: false,

      intCohortsAnswers: [],
    };
    this.rejectConsentGroup = this.rejectConsentGroup.bind(this);
  }

  componentDidMount() {
    this.isCurrentUserAdmin();
    this.init();
  }

  init = () => {
    let current = {};
    let currentStr = {};
    let future = {};
    let futureCopy = {};
    let futureStr = {};
    let formData = {};
    let formDataStr = {};
    let sampleCollectionList = [];

    ConsentGroup.getConsentGroup(this.props.consentGroupUrl, this.props.consentKey).then(
      element => {
        let sampleCollections = [];
        SampleCollections.getSampleCollections(this.props.sampleSearchUrl).then(
          resp => {

            sampleCollections = resp.data.map(item => {
              return {
                key: item.id,
                value: item.collectionId,
                label: item.collectionId + ": " + item.name + " ( " + item.category + " )"
              };
            });
            sampleCollectionList = sampleCollections;
            current.consentExtraProps = element.data.extraProperties;
            if (element.data.collectionLinks !== undefined) {
              current.sampleCollectionLinks = element.data.collectionLinks;
            }

            if (element.data.sampleCollections !== undefined) {
              current.sampleCollections = element.data.sampleCollections.map(sample => {
                return ({
                  key: sample.id,
                  value: sample.collectionId,
                  label: sample.collectionId + ": " + sample.name + " ( " + sample.category + " )"
                });
              });
            }

            if (element.data.extraProperties.institutionalSources !== undefined) {
              current.instSources = JSON.parse(element.data.extraProperties.institutionalSources);
            }

            current.consentForm = element.data.issue;
            currentStr = JSON.stringify(current);
            this.getReviewSuggestions();
            let edits = null;

            if (edits != null) {
              // prepare form data here, initially same as current ....
              future.consentExtraProps = edits.data.extraProperties;
              // ...
              // ...
              // ... need to complete future to look like current, same structure
              // ...
              // ...
              futureStr = JSON.stringify(future);

              formData = JSON.parse(futureStr);
              futureCopy = JSON.parse(futureStr);


            } else {
              // prepare form data here, initially same as current ....
              formData = JSON.parse(currentStr);
              future = JSON.parse((currentStr));
              futureCopy = JSON.parse(currentStr);
            }

            // });

            // store current issue info here ....
            this.setState(prev => {
              // prepare form data here, initially same as current ....
              prev.sampleCollectionList = sampleCollectionList;
              prev.formData = formData;
              prev.current = current;
              prev.future = future;
              prev.futureCopy = futureCopy;
              prev.questions = this.initQuestions();
              return prev;
            });
          }
        );
      }
    );
  };

  getReviewSuggestions = () => {
    Review.getSuggestions(this.props.serverURL, this.props.consentKey).then(data => {
      if (data.data !== '') {
        this.setState(prev => {
          prev.formData = JSON.parse(data.data.suggestions);
          prev.reviewSuggestion = true;
          return prev;
        });
      } else {
        this.setState(prev => {
          prev.reviewSuggestion = false;
          return prev;
        });
      }
    });
  };

  validateDetails = () => {
    if (this.isEmpty(this.state.collInst) || this.isEmpty('')) {

    }
  };

  parseBool() {
    if (this.state.formData.consentExtraProps.onGoingProcess !== undefined) {
      let stringValue = this.state.formData.consentExtraProps.onGoingProcess;
      let boolValue = stringValue.toLowerCase() === 'true';
      return boolValue;
    }
  }

  isEmpty(value) {
    return value === '' || value === null || value === undefined;
  }

  hasDate(date) {
    if (this.state.formData.consentExtraProps[date] !== undefined)
      return true
  }

  isValid = () => {
    let consent = false;
    let protocol = false;
    let collInst = false;
    let sampleCollections = false;
    let instSources = false;
    let describeConsentGroup = false;
    let requireMta = false;
    let pii = false;
    let compliance = false;
    let sensitive= false;
    let accessible = false;
    let textCompliance = false;
    let textSensitive = false;
    let textAccessible = false;
    let sharingPlan = false;
    let questions = false;

    if (this.isEmpty(this.state.formData.consentExtraProps.consent)) {
      consent = true;
    }

    if (this.isEmpty(this.state.formData.consentExtraProps.protocol)) {
      protocol = true;
    }

    if (this.isEmpty(this.state.formData.consentExtraProps.collInst)) {
      collInst = true;
    }

    if (this.isEmpty(this.state.formData.consentExtraProps.describeConsentGroup)) {
      describeConsentGroup = true;
    }

    if (this.isEmpty(this.state.formData.consentExtraProps.requireMta)) {
      requireMta = true;
    }

    if (this.state.formData.sampleCollections === undefined || this.state.formData.sampleCollections.length === 0) {
      sampleCollections = true;
    }

    if (this.isEmpty(this.state.formData.instSources)) {
      instSources = true;
    }

    if (this.isEmpty(this.state.formData.consentExtraProps.pii)) {
      pii = true;
    }

    if (this.isEmpty(this.state.formData.consentExtraProps.compliance)) {
      compliance = true;
    }

    if (this.isEmpty(this.state.formData.consentExtraProps.textCompliance) && compliance) {
      textCompliance = true;
    }

    if (this.isEmpty(this.state.formData.consentExtraProps.sensitive)) {
      sensitive = true;
    }

    if (this.isEmpty(this.state.formData.consentExtraProps.textSensitive) && sensitive) {
      textSensitive = true;
    }

    if (this.state.formData.consentExtraProps.sensitive && this.isEmpty(this.state.formData.consentExtraProps.textSensitive)) {
      textSensitive = true;
    }

    if (this.state.formData.consentExtraProps.accessible && this.isEmpty(this.state.formData.consentExtraProps.textAccessible)) {
      textAccessible = true;
    }

    if (this.isEmpty(this.state.formData.consentExtraProps.sharingPlan)) {
      sharingPlan = true;
    }

    if (!this.validateQuestionaire()) {
      questions = true;
    }

    this.setState(prev => {
      prev.errors.consent = consent;
      prev.errors.protocol = protocol;
      prev.errors.collInst = collInst;
      prev.errors.describeConsentGroup = describeConsentGroup;
      prev.errors.requireMta = requireMta;
      prev.errors.sampleCollections = sampleCollections;
      prev.errors.pii = pii;
      prev.errors.sharingPlan = sharingPlan;
      prev.errors.textCompliance = textCompliance;
      prev.errors.textSensitive = textSensitive;
      prev.errors.textAccessible = textAccessible;
      return prev;
    });

    return !consent &&
      !protocol &&
      !collInst &&
      !describeConsentGroup &&
      !requireMta &&
      !sampleCollections &&
      !pii &&
      !sharingPlan &&
      !questions &&
      !textCompliance &&
      !textSensitive &&
      !accessible &&
      !textAccessible;
  };

  validateQuestionaire = () => {
    let isValid = false;
    const determination = this.state.determination;
    if (determination.questions.length === 0 || determination.endState === true) {
      isValid = true;
    }
    return isValid;
  };

  approveConsentGroup = () => {
    this.setState({ disableApproveButton: true });
    const data = { approvalStatus: "Approved" };
    ConsentGroup.approve(this.props.approveConsentGroupUrl, this.props.consentKey, data).then(
      () =>
        this.setState(prev => {
          prev.formData.consentForm.approvalStatus = data.approvalStatus;
          return prev;
        })
    );
  };

  approveRevision = (e) => () => {
    this.setState({ disableApproveButton: true });
    const data = { projectReviewApproved: true };
    Project.addExtraProperties(this.props.addExtraPropUrl, this.props.projectKey, data).then(
      () => this.setState(prev => {
        prev.formData.consentExtraProps.projectReviewApproved = true;
        return prev;
      })
    );
  };

  isCurrentUserAdmin() {
    User.isCurrentUserAdmin(this.props.isAdminUrl).then(
      resp => this.setState({ isAdmin: resp.data.isAdmin })
    );
  }

  rejectConsentGroup() {
    spinnerService.showAll();

    ConsentGroup.rejectConsent(this.props.rejectConsentUrl, this.props.consentKey).then(resp => {
      window.location.href = this.getRedirectUrl(this.props.projectKey);
      spinnerService.hideAll();
    }).catch(error => {
      spinnerService.hideAll();
      console.error(error);
    });
  }

  discardEdits = () => {
    spinnerService.showAll();
    this.removeEdits();
    this.setState(prev =>{
      prev.showDiscardEditsDialog = !this.state.showDiscardEditsDialog;
      return prev;
    });
  };

  approveEdits = () => {
    spinnerService.showAll();
    let consentGroup = this.getConsentGroup();

    ConsentGroup.updateConsent(this.props.updateConsentUrl, consentGroup, this.props.consentKey).then(resp => {
      this.setState(prev =>{
        prev.showApproveDialog = !this.state.showApproveDialog;
        prev.questions.length = 0;
        return prev;
      });
      this.removeEdits();
    }).catch(error => {
      spinnerService.hideAll();
      console.error(error);
    });
  };

  handleApproveDialog = () => {
    if (this.isValid()) {
      this.setState({
        showApproveDialog: !this.state.showApproveDialog,
        errorSubmit: false
      });
    }
    else {
      this.setState({
        errorSubmit: true
      });
    }
  };

  enableEdit = (e) => () => {
    this.getReviewSuggestions();
    this.setState({
      readOnly: false,
      questions: this.initQuestions()
    });
  };

  cancelEdit = (e) => () => {
    this.setState({
      formData: this.state.futureCopy,
      readOnly: true,
      errorSubmit: false,
    });
    this.getReviewSuggestions();
  };

  submitEdit = (e) => () => {
    let data = {};

    if (this.validateQuestionaire()) {
      this.setState(prev => {
        prev.readOnly = true;
        prev.errorSubmit = false;

        prev.intCohortsAnswers.forEach(question => {
          prev.formData.consentExtraProps[question.key] = question.answer;
        });
        return prev;
      }, () => {
        data = {
          projectKey: this.props.consentKey,
          suggestions: JSON.stringify(this.state.formData),
        };


        if (this.state.reviewSuggestion) {
          Review.updateReview (this.props.serverURL, this.props.consentKey, data).then(() =>
            this.getReviewSuggestions()
          );
        } else {
          Review.submitReview (this.props.serverURL, data).then(() =>
            this.getReviewSuggestions()
          );
        }
      });
    } else {
      this.setState(prev => {
        prev.errorSubmit = true;
        prev.errorMessage = 'Please answer International Cohort questionnaire.';
        return prev;
      });
    }
  };

  parseDate(date) {
    if (date !== undefined) {
      let d = new Date(date).toISOString();
      return d.slice(0, d.indexOf("T"));
    }
  }

  getSampleCollections = () => {
    const sampleCollections = this.state.formData.sampleCollections;
    const sampleCollectionList = [];
    if (sampleCollections !== null && sampleCollections.length > 0) {
      sampleCollections.map((sc, idx) => {
        sampleCollectionList.push(sc.value);
      });
    }
    return sampleCollectionList;
  };

  getConsentGroup = () => {
    const consentGroup = {};

    consentGroup.summary = this.state.formData.consentForm.summary;
    consentGroup.samples = this.getSampleCollections();
    consentGroup.startDate = this.parseDate(this.state.formData.consentExtraProps.startDate);
    consentGroup.onGoingProcess = this.state.formData.consentExtraProps.onGoingProcess;
    consentGroup.source = this.props.projectKey;
    consentGroup.collInst = this.state.formData.consentExtraProps.collInst;
    consentGroup.collContact = this.state.formData.consentExtraProps.collContact;
    consentGroup.consent = this.state.formData.consentExtraProps.consent;
    consentGroup.protocol = this.state.formData.consentExtraProps.protocol;
    consentGroup.institutionalSources = JSON.stringify(this.state.formData.instSources);
    consentGroup.describeConsentGroup = this.state.formData.consentExtraProps.describeConsentGroup;
    consentGroup.requireMta = this.state.formData.consentExtraProps.requireMta

    if (this.state.formData.consentExtraProps.endDate !== null) {
      consentGroup.endDate = this.parseDate(this.state.formData.consentExtraProps.endDate);
    }

    const questions = this.state.intCohortsAnswers;
    if (questions !== null && questions.length > 1) {
      questions.map((q, idx) => {
        if (q.answer !== null) {
          consentGroup[q.key] = q.answer;
        }
      });
    }

    consentGroup.pii = this.state.formData.consentExtraProps.pii;
    consentGroup.compliance = this.state.formData.consentExtraProps.compliance;
    consentGroup.textCompliance = this.state.formData.consentExtraProps.textCompliance;
    consentGroup.sensitive = this.state.formData.consentExtraProps.sensitive;
    consentGroup.textSensitive = this.state.formData.consentExtraProps.textSensitive;
    consentGroup.accessible = this.state.formData.consentExtraProps.accessible;
    consentGroup.textAccessible = this.state.formData.consentExtraProps.textAccessible;

    consentGroup.sharingPlan = this.state.formData.consentExtraProps.sharingPlan;
    consentGroup.databaseControlled = this.state.formData.consentExtraProps.databaseControlled;
    consentGroup.databaseOpen = this.state.formData.consentExtraProps.databaseOpen;
    return consentGroup;

  };

  removeEdits = () => {
    Review.deleteSuggestions(this.props.discardReviewUrl, this.props.consentKey).then(
      resp => {
        this.init();
        spinnerService.hideAll();
      })
      .catch(error => {
        spinnerService.hideAll();
        console.error(error);
      });
  };

  handleSampleCollectionChange = () => (data) => {
    this.setState(prev => {
      prev.formData.sampleCollections = data;
      return prev;
    }, () => {
      if (this.state.errorSubmit === true) {
        this.isValid();
      }
    });
  };

  handleCheck = (e) => {
    const checked = e.target.checked;
    const date = this.state.current.consentExtraProps.endDate;
    this.setState(prev => {
      prev.formData.consentExtraProps.onGoingProcess = checked;
      prev.formData.consentExtraProps.endDate = checked ? null : date;
      return prev;
    });
  };

  addDays(date, days) {
    if (date !== null) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }
    return null
  }

  handleUpdateinstitutionalSources = (updated, field) => {
    this.setState(prev => {
      prev.formData.institutionalSources = updated;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, field.concat("Institutional")));
    // this.props.removeErrorMessage();
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }); //, () => {
    //   this.props.updateForm(this.state.formData, field);
    //   this.props.removeErrorMessage();
    // })
  };

  handleExtraPropsInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData.consentExtraProps[field] = value;
      return prev;
    }, () => {
      if (this.state.errorSubmit === true) {
        this.isValid();
      }
    });
  };

  handleChange = (id) => (date) => {
    this.setState(prev => {
      prev.formData.consentExtraProps[id] = date;
      return prev;
    },() => {
      if (this.state.errorSubmit === true) {
        this.isValid();
      }
    });

    //this.props.removeErrorMessage();
  };

  handleRadioChange = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }

    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, field));
    // this.props.removeErrorMessage();
  };

  handleRadio2Change = (e, field, value) => {
    this.setState(prev => {
      prev.formData.consentExtraProps[field] = value;
      return prev;
    }); //, () => this.props.updateForm(this.state.formData, field));
    // this.props.removeErrorMessage();
  };

  closeModal = () => {
    this.setState({ showDialog: !this.state.showDialog });
  };

  handleDialog = () => {
    this.setState({
      showDialog: !this.state.showDialog
    });
  };

  getRedirectUrl(projectKey) {
    if (projectKey === "") {
      return this.props.serverURL + "/search/index";
    } else {
      let key = projectKey.split("-");
      let projectType = '';
      if (key.length === 3) {
        projectType = key[1].toLowerCase();
      } else {
        projectType = key[0].toLowerCase();
      }
      return [this.props.serverURL, projectType, "show", projectKey, "?tab=consent-groups"].join("/");
    }
  }

  initQuestions = () => {
    const questions = [];

    questions.push({
      question: span({}, ["Are samples or individual-level data sourced from a country in the European Economic Area? ", span({ className: "normal" }, ["[provide link to list of countries included]"])]),
      yesOutput: 2,
      noOutput: EXIT,
      answer: null,
      progress: 0,
      key: 'individualDataSourced',
      id: 1
    });

    questions.push({
      question: span({}, ["Is a link maintained ", span({ className: "normal" }, ["(by anyone) "]), "between samples/data being sent to the Broad and the identities of living EEA subjects?"]),
      yesOutput: 3,
      noOutput: EXIT,
      answer: null,
      progress: 17,
      key: 'isLinkMaintained',
      id: 2
    });

    questions.push({
      question: 'Is the Broad work being performed as fee-for-service?',
      yesOutput: DPA,
      noOutput: 4,
      answer: null,
      progress: 34,
      key: 'feeForService',
      id: 3
    });

    questions.push({
      question: 'Are samples/data coming directly to the Broad from the EEA?',
      yesOutput: 5,
      noOutput: RA,
      answer: null,
      progress: 50,
      key: 'areSamplesComingFromEEAA',
      id: 4
    });

    questions.push({
      question: span({}, ["Is Broad or the EEA collaborator providing goods/services ", span({ className: "normal" }, ["(including routine return of research results) "]), "to EEA subjects, or engaging in ongoing monitoring of them", span({ className: "normal" }, ["(e.g. via use of a FitBit)?"])]),
      yesOutput: OSAP,
      noOutput: 6,
      answer: null,
      progress: 67,
      key: 'isCollaboratorProvidingGoodService',
      id: 5
    });

    questions.push({
      question: span({}, ["GDPR does not apply, but a legal basis for transfer must be established. Is consent unambiguous ", span({ className: "normal" }, ["(identifies transfer to the US, and risks associated with less stringent data protections here)?"])]),
      yesOutput: EXIT,
      noOutput: CTC,
      answer: null,
      progress: 83,
      key: 'isConsentUnambiguous',
      id: 6
    });

    return questions;
  };

  setEditedAnswers = () => {
    this.setState(prev => {
      prev.intCohortsAnswers.forEach(question => {
        prev.formData.consentExtraProps[question.key] = question.answer;
      });
      return prev;
    });
  };

  determinationHandler = (determination) => {
    const answers = [];
    determination.questions.forEach(question => {
      if (question.answer !== null) {
        let singleAnswer = {};
        singleAnswer.key = question.key;
        singleAnswer.answer = question.answer;
        answers.push(singleAnswer);
      } else {
        let singleAnswer = {};
        singleAnswer.key = question.key;
        singleAnswer.answer = null;
        answers.push(singleAnswer);
      }
    });


    this.setState(prev => {
      prev.intCohortsAnswers.length = 0;
      prev.intCohortsAnswers = answers;
      prev.determination = determination;
      return prev;
    });
  };

  handleDiscardEditsDialog = () => {
    this.setState({
      showDiscardEditsDialog: !this.state.showDiscardEditsDialog
    });
  };

  render() {
    const { startDate = null, endDate = null } = this.state.formData.consentExtraProps;

    const {
      consent = '',
      protocol = '',
      collInst = '',
      collContact = '',
      textCompliance = '',
      textSensitive = '',
      databaseControlled = '',
      databaseOpen = '',
      onGoingProcess = '',
      describeConsentGroup = '',
      requireMta = '',
    } = this.state.formData.consentExtraProps;


    return (
      div({}, [
        h2({ className: "stepTitle" }, ["Consent Group: " + this.props.consentKey]),
        ConfirmationDialog({
          closeModal: this.handleApproveDialog,
          show: this.state.showApproveDialog,
          handleOkAction: this.approveEdits,
          title: 'Approve Edits Confirmation',
          bodyText: 'Are you sure yo want to approve this edits?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.closeEditsModal,
          show: this.state.showDiscardEditsDialog,
          handleOkAction: this.discardEdits,
          title: 'Discard Edits Confirmation',
          bodyText: 'Are you sure yo want to remove this edits?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.closeModal,
          show: this.state.showDialog,
          handleOkAction: this.rejectConsentGroup,
          title: 'Remove Confirmation',
          bodyText: 'Are you sure yo want to remove this consent group?',
          actionLabel: 'Yes'
        }, []),
        button({
          className: "btn buttonPrimary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.enableEdit(),
          isRendered: this.state.readOnly === true
        }, ["Edit Information"]),

        button({
          className: "btn buttonSecondary floatRight",
          style: { 'marginTop': '15px' },
          onClick: this.cancelEdit(),
          isRendered: this.state.readOnly === false
        }, ["Cancel"]),

        Panel({ title: "Consent Group Details" }, [
          InputFieldText({
            id: "inputConsentGroupName",
            name: "consentGroupName",
            label: "Consent Group Name",
            disabled: !this.state.readOnly,
            value: consent + " / " + protocol,
            currentValue: this.state.current.consentForm.summary,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            id: "inputInvestigatorLastName",
            name: "consent",
            label: "Last Name of Investigator Listed on the Consent Form",
            value: consent,
            currentValue: this.state.current.consentExtraProps.consent,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.consent,
            errorMessage: "Required field"
          }),
          InputFieldText({
            id: "inputInstitutionProtocolNumber",
            name: "protocol",
            label: "Collaborating Institution's Protocol Number",
            value: protocol,
            currentValue: this.state.current.consentExtraProps.protocol,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.protocol,
            errorMessage: "Required field"
          }),
          InputFieldText({
            id: "inputCollaboratingInstitution",
            name: "collInst",
            label: "Collaborating Institution",
            value: collInst,
            currentValue: this.state.current.consentExtraProps.collInst,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.collInst,
            errorMessage: "Required field"
          }),
          InputFieldText({
            id: "inputprimaryContact",
            name: "collContact",
            label: "Primary Contact at Collaborating Institution ",
            value: collContact,
            currentValue: this.state.current.consentExtraProps.collContact,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly,
            valueEdited: !this.isEmpty(collContact) === this.isEmpty(this.state.current.consentExtraProps.collContact)
          }),
          InputFieldRadio({
            id: "radioDescribeConsentGroup",
            name: "describeConsentGroup",
            label: "Please choose one of the following to describe this proposed Consent Group: ",
            value: describeConsentGroup,
            currentValue: this.state.current.consentExtraProps.describeConsentGroup,
            optionValues: ["01", "02"],
            optionLabels: [
              "I am informing Broad's ORSP of a new amendment I already submitted to my IRB of record",
              "I am requesting assistance in updating and existing project"
            ],
            onChange: this.handleRadio2Change,
            readOnly: this.state.readOnly,
            error: this.state.errors.describeConsentGroup,
            errorMessage: "Required field"
          }),
          InputFieldRadio({
            id: "radioRequireMta",
            name: "requireMta",
            label: span({}, ["Has the ", span({ style: { 'textDecoration': 'underline' } }, ["tech transfer office "]), "of the institution providing samples/data confirmed that an Material or Data Transfer Agreement (MTA/DTA) is needed to transfer the materials/data? "]),
            moreInfo: span({ className: "italic" }, ["(PLEASE NOTE THAT ALL SAMPLES ARRIVING FROM THE DANA FARBER CANCER INSTITUTE NOW REQUIRE AN MTA)"]),
            value: requireMta,
            currentValue: this.state.current.consentExtraProps.requireMta,
            optionValues: ["true", "false", "uncertain"],
            optionLabels: [
              "Yes, the provider does require an MTA/DTA.",
              "No, the provider does not require an MTA/DTA.",
              "Not sure"
            ],
            onChange: this.handleRadio2Change,
            readOnly: this.state.readOnly,
            error: this.state.errors.requireMta,
            errorMessage: "Required field"
          })
        ]),

        Panel({ title: "Sample Collections" }, [

          InputFieldSelect({
            id: "sampleCollection_select",
            label: "Link Sample Collection to " + this.props.projectKey + "*",
            name: 'sampleCollections',
            isDisabled: false,
            options: this.state.sampleCollectionList,
            onChange: this.handleSampleCollectionChange,
            value: this.state.formData.sampleCollections,
            currentValue: this.state.current.sampleCollections,
            placeholder: "Start typing a Sample Collection",
            isMulti: true,
            error: this.state.errors.sampleCollections,
            errorMessage: "Required field",
            readOnly: this.state.readOnly
          }),
        ]),

        Panel({ title: "Sample Collection Date Range" }, [
          div({ className: "row" }, [
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                selected: startDate,
                value: startDate,
                currentValue: this.state.current.consentExtraProps.startDate,
                name: "startDate",
                label: "Start Date",
                onChange: this.handleChange,
                readOnly: this.state.readOnly
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                selected: this.addDays(endDate, 1),
                value: endDate,
                currentValue: this.state.current.consentExtraProps.endDate,
                name: "endDate",
                label: "End Date",
                onChange: this.handleChange,
                disabled: (this.state.formData.consentExtraProps.onGoingProcess === "true"),
                readOnly: this.state.readOnly
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12 checkbox" + (this.state.readOnly ? ' checkboxReadOnly' : ''), style: { 'marginTop': '32px' } }, [
              input({
                type: 'checkbox',
                id: "onGoingProcess",
                name: "onGoingProcess",
                checked: onGoingProcess === 'true' || onGoingProcess === true,
                onChange:this.handleCheck,
              }),
              label({ id: "lbl_onGoingProcess", htmlFor: "onGoingProcess", className: "regular-checkbox" }, ["Ongoing Process"])
            ])
          ])
        ]),

        Panel({ title: "Institutional Source of Data/Samples and Location" }, [
          InstitutionalSource({
            updateInstitutionalSource: () => { },
            institutionalSources: this.state.formData.instSources,
            currentValue: this.state.current.instSources,
            readOnly: this.state.readOnly
          })
        ]),

        Panel({
          title: "International Cohorts",
          isRendered: !this.state.readOnly,
        },[
          div({ style: { 'marginTop': '55px' } }, [
            QuestionnaireWorkflow({
               questions: this.state.questions,
               handler: this.determinationHandler,
               determination: this.state.determination
           })
          ]),
        ]),
        Panel({
          title: "International Cohorts",
          // isRendered: this.state.readOnly
        }, [
          div({ isRendered: !this.isEmpty(this.state.formData.consentExtraProps.individualDataSourced), className: "firstRadioGroup" }, [
            InputYesNo({
              id: "radioQuestion1",
              name: "individualDataSourced",
              value: this.state.formData.consentExtraProps.individualDataSourced,
              currentValue: this.state.current.consentExtraProps.individualDataSourced,
              label: span({}, ["Are samples or individual-level data sourced from a country in the European Economic Area? "]),
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.consentExtraProps.isLinkMaintained) }, [
            InputYesNo({
              id: "radioQuestion2",
              name: "isLinkMaintained",
              value: this.state.formData.consentExtraProps.isLinkMaintained,
              currentValue: this.state.current.consentExtraProps.isLinkMaintained,
              label: span({}, ["Is a link maintained ", span({ className: "normal" }, ["(by anyone) "]), "between samples/data being sent to the Broad and the identities of living EEA subjects?"]),
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
              valueEdited: this.isEmpty(this.state.current.consentExtraProps.isLinkMaintained) === !this.isEmpty(this.state.formData.consentExtraProps.individualDataSourced)
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.consentExtraProps.feeForService) }, [
            InputYesNo({
              id: "radioQuestion3",
              name: "feeForService",
              value: this.state.formData.consentExtraProps.feeForService,
              currentValue: this.state.current.consentExtraProps.feeForService,
              label: 'Is the Broad work being performed as fee-for-service?',
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
              valueEdited: this.isEmpty(this.state.current.consentExtraProps.feeForService) === !this.isEmpty(this.state.formData.consentExtraProps.isLinkMaintained)
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.consentExtraProps.areSamplesComingFromEEAA) }, [
            InputYesNo({
              id: "radioQuestion4",
              name: "areSamplesComingFromEEAA",
              value: this.state.formData.consentExtraProps.areSamplesComingFromEEAA,
              currentValue: this.state.current.consentExtraProps.areSamplesComingFromEEAA,
              label: 'Are samples/data coming directly to the Broad from the EEA?',
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
              valueEdited: this.isEmpty(this.state.current.consentExtraProps.areSamplesComingFromEEAA) === !this.isEmpty(this.state.formData.consentExtraProps.feeForService)
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.consentExtraProps.isCollaboratorProvidingGoodService) }, [
            InputYesNo({
              id: "radioQuestion5",
              name: "isCollaboratorProvidingGoodService",
              value: this.state.formData.consentExtraProps.isCollaboratorProvidingGoodService,
              currentValue: this.state.current.consentExtraProps.isCollaboratorProvidingGoodService,
              label: span({}, ["Is Broad or the EEA collaborator providing goods/services ", span({ className: "normal" }, ["(including routine return of research results) "]), "to EEA subjects, or engaging in ongoing monitoring of them", span({ className: "normal" }, ["(e.g. via use of a FitBit)?"])]),
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
              valueEdited: this.isEmpty(this.state.current.consentExtraProps.isCollaboratorProvidingGoodService) === !this.isEmpty(this.state.formData.consentExtraProps.areSamplesComingFromEEAA)
            })
          ]),
          div({ isRendered: !this.isEmpty(this.state.formData.consentExtraProps.isConsentUnambiguous) }, [
            InputYesNo({
              id: "radioQuestion6",
              name: "isConsentUnambiguous",
              value: this.state.formData.consentExtraProps.isConsentUnambiguous,
              currentValue: this.state.current.consentExtraProps.isConsentUnambiguous,
              label: span({}, ["GDPR does not apply, but a legal basis for transfer must be established. Is consent unambiguous ", span({ className: "normal" }, ["(identifies transfer to the US, and risks associated with less stringent data protections here)?"])]),
              readOnly: this.state.readOnly,
              onChange: this.handleExtraPropsInputChange,
              valueEdited: this.isEmpty(this.state.current.consentExtraProps.isConsentUnambiguous) === !this.isEmpty(this.state.formData.consentExtraProps.isCollaboratorProvidingGoodService)
            })
          ])
        ]),

        Panel({ title: "Security" }, [
          InputFieldRadio({
            id: "radioPII",
            name: "pii",
            label: "As part of this project, will Broad receive either personally identifiable information (PII) or protected health information (PHI)? ",
            moreInfo: span({}, ["For a list of what constitutes PII and PHI, ", a({ href: "https://intranet.broadinstitute.org/faq/storing-and-managing-phi", target: "_blank" }, ["visit this link"]), "."]),
            value: this.state.formData.consentExtraProps.pii,
            currentValue: this.state.current.consentExtraProps.pii,
            optionValues: ["true", "false"],
            optionLabels: [
              "Yes",
              "No"
            ],
            readOnly: this.state.readOnly,
            onChange: this.handleRadio2Change,
            error: this.state.errors.pii,
            errorMessage: "Required field"
          }),
          InputFieldRadio({
            id: "radioCompliance",
            name: "compliance",
            label: span({}, ["Are you bound by any regulatory compliance ", span({ className: 'normal' }, ["(FISMA, CLIA, etc.)"]), "?"]),
            value: this.state.formData.consentExtraProps.compliance,
            currentValue: this.state.current.consentExtraProps.compliance,
            optionValues: ["true", "false", "uncertain"],
            optionLabels: [
              "Yes",
              "No",
              "Uncertain"
            ],
            readOnly: this.state.readOnly,
            onChange: this.handleRadio2Change,
            error: this.state.errors.compliance,
            errorMessage: "Required field"
          }),
          InputFieldText({
            isRendered: this.state.formData.consentExtraProps.compliance === "true",
            id: "inputCompliance",
            name: "textCompliance",
            label: "Add regulatory compliance",
            value: textCompliance,
            currentValue: this.state.current.consentExtraProps.textCompliance,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.textCompliance,
            errorMessage: "Required field"
          }),
          InputFieldRadio({
            id: "radioSensitive",
            name: "sensitive",
            label: span({}, ["Is this data ", span({ className: 'italic' }, ["“sensitive” "]), "for any reason?"]),
            value: this.state.formData.consentExtraProps.sensitive,
            currentValue: this.state.current.consentExtraProps.sensitive,
            optionValues: ["true", "false", "uncertain"],
            optionLabels: [
              "Yes",
              "No",
              "Uncertain"
            ],
            readOnly: this.state.readOnly,
            onChange: this.handleRadio2Change,
            error: this.state.errors.sensitive,
            errorMessage: "Required field"
          }),
          InputFieldText({
            isRendered: this.state.formData.consentExtraProps.sensitive === "true",
            id: "inputSensitive",
            name: "textSensitive",
            label: "Please explain",
            value: textSensitive,
            currentValue: this.state.current.consentExtraProps.textSensitive,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.textSensitive,
            errorMessage: "Required field"
          }),
          InputFieldRadio({
            id: "radioAccessible",
            name: "accessible",
            label: span({}, ["Will your data be accessible on the Internet ", span({ className: 'normal' }, ["(even if authenticated)"]), "?"]),
            value: this.state.formData.consentExtraProps.accessible,
            currentValue: this.state.current.consentExtraProps.accessible,
            optionValues: ["true", "false", "uncertain"],
            optionLabels: [
              "Yes",
              "No",
              "Uncertain"
            ],
            readOnly: this.state.readOnly,
            onChange: this.handleRadio2Change,
            error: this.state.errors.accessible,
            errorMessage: "Required field"
          }),
          InputFieldText({
            isRendered: this.state.formData.consentExtraProps.accessible === "true",
            id: "inputAccessible",
            name: "textAccessible",
            label: "Please explain",
            value: this.state.formData.consentExtraProps.textAccessible,
            currentValue: this.state.current.consentExtraProps.textAccessible,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.textAccessible,
            errorMessage: "Required field"
          })
        ]),

        Panel({ title: "Data Sharing" }, [
          InputFieldRadio({
            id: "radioSharingPlan",
            name: "sharingPlan",
            label: "What is your Data Sharing plan?",
            moreInfo: "",
            optionValues: ["controlled", "open", "none", "undetermined"],
            optionLabels: ["Controlled Access", "Open Access", "No Sharing", "Data Sharing plan not yet determined"],
            value: this.state.formData.consentExtraProps.sharingPlan,
            currentValue: this.state.current.consentExtraProps.sharingPlan,
            onChange: this.handleRadio2Change,
            readOnly: this.state.readOnly,
            error: this.state.errors.sharingPlan,
            errorMessage: "Required field"
          }),
          InputFieldText({
            isRendered: this.state.formData.consentExtraProps.sharingPlan === "controlled",
            id: "inputDatabaseControlled",
            name: "databaseControlled",
            label: "Name of Database(s) ",
            moreInfo: "(Data Use LetterNR/link, consent or waiver of consent)",
            value: databaseControlled,
            currentValue: this.state.current.consentExtraProps.databaseControlled,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          }),
          InputFieldText({
            isRendered: this.state.formData.consentExtraProps.sharingPlan === "open",
            id: "inputDatabaseOpen",
            name: "databaseOpen",
            label: "Name of Database(s) ",
            moreInfo: "(Data Use LetterNR/link, consent or waiver of consent, or documentation from source that consent is not available but samples were appropriately collected and publicly available)",
            value: databaseOpen,
            currentValue: this.state.current.consentExtraProps.databaseOpen,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly
          })
        ]),
        AlertMessage({
          msg: this.state.errorMessage,
          show: this.state.errorSubmit
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
            // disabled: ,
            isRendered: this.state.readOnly === false
          }, ["Submit Edits"]),

          /*visible for Admin in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveDialog,
            isRendered: (this.state.isAdmin === true && this.state.reviewSuggestion === true)
          }, ["Approve Edits"]),

          /*visible for every user in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.handleDiscardEditsDialog,
            disabled: this.state.disableApproveButton,
            isRendered: (this.state.isAdmin === true && this.state.reviewSuggestion === true)
          }, ["Discard Edits"]),

          /*visible for Admin in readOnly mode and if the consent group is in "pending" status*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.approveConsentGroup,
            isRendered: this.state.consentForm.approvalStatus !== 'Approved' && this.state.isAdmin,
            disabled: this.state.disableApproveButton
          }, ["Approve"]),

          /*visible for Admin in readOnly mode and if the consent group is in "pending" status*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.handleDialog,
            disabled: this.state.disableApproveButton,
            isRendered: this.state.consentForm.approvalStatus !== 'Approved' && this.state.isAdmin,
          }, ["Reject"])
        ])
      ])
    )
  }
}

export default ConsentGroupReview;
