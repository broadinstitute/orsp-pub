import { Component } from 'react';
import { hh, p, div, h2, h3, input, label, span, a, button } from 'react-hyperscript-helpers';

import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { InstitutionalSource } from '../components/InstitutionalSource';
import { ConsentGroup, SampleCollections, User, Review } from "../util/ajax";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { spinnerService } from "../util/spinner-service";
import { QuestionnaireWorkflow } from "../components/QuestionnaireWorkflow";
import { AlertMessage } from "../components/AlertMessage";
import get from 'lodash/get';

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
      submitted: false,
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
        instError: false,
        institutionalSourceNameError: false,
        institutionalSourceCountryError: false,
        institutionalNameErrorIndex: [],
        institutionalCountryErrorIndex: [],
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
        sharingPlan: false,
        endDate: false,
        startDate: false,
      },
      editedForm: {},
      formData: {
        currentInstSources: [{ name: '', country: '' }],
        consentExtraProps: {},
        consentForm: {},
        sampleCollections: []
      },
      current: {
        consentExtraProps: {
          endDate: null,
        },
        consentForm: {}
      },
      futureCopy: {
        instSources: [{ name: '', country: '' }],
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
      isEdited: false,
      intCohortsAnswers: [],
    };
    this.rejectConsentGroup = this.rejectConsentGroup.bind(this);
    this.consentGroupNameExists = this.consentGroupNameExists.bind(this);
  }

  componentDidMount() {
    this.isCurrentUserAdmin();
    ConsentGroup.getConsentGroupNames(this.props.consentNamesSearchURL).then(
      resp => this.setState({ existingGroupNames: resp.data })
    );
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
                sampleCollectionList.push({
                  key: sample.id,
                  value: sample.collectionId,
                  label: sample.collectionId + ": " + sample.name + " ( " + sample.category + " )"
                });
                return ({
                  key: sample.id,
                  value: sample.collectionId,
                  label: sample.collectionId + ": " + sample.name + " ( " + sample.category + " )"
                });
              });
            }

            if (element.data.extraProperties.institutionalSources !== undefined) {
              current.instSources = this.parseInstSources(JSON.parse(element.data.extraProperties.institutionalSources));
            }

            current.consentForm = element.data.issue;
            currentStr = JSON.stringify(current);
            this.getReviewSuggestions();
            let edits = null;

            if (edits != null) {
              future.consentExtraProps = edits.data.extraProperties;
              futureStr = JSON.stringify(future);
              formData = JSON.parse(futureStr);
              futureCopy = JSON.parse(futureStr);
            } else {
              formData = JSON.parse(currentStr);
              future = JSON.parse((currentStr));
              futureCopy = JSON.parse(currentStr);
            }
            let questions = this.initQuestions();
            let intCohortsAnswers = [];
            questions.forEach(it =>{
              if (current.consentExtraProps[it.key] !== undefined) {
                intCohortsAnswers.push({
                  key: it.key,
                  answer: current.consentExtraProps[it.key]
                });
              }
            });

            this.setState(prev => {
              // prepare form data here, initially same as current ....
              prev.sampleCollectionList = sampleCollectionList;
              prev.formData = formData;
              prev.current = current;
              prev.future = future;
              prev.futureCopy = futureCopy;
              prev.questions.length = 0;
              prev.intCohortsAnswers = intCohortsAnswers;
              prev.questions = questions;
              return prev;
            });
          }
        );
      }
    );
  };

  parseInstSources(instSources) {
    let instSourcesArray = [];
    if (instSources !== undefined && instSources !== null && instSources.length > 0) {
      instSources.map(instSource => {
        instSourcesArray.push({
          current: { name: instSource.name, country: instSource.country },
          future: { name: instSource.name, country: instSource.country }
        });
      });
    }
    return instSourcesArray;
  }

  getReviewSuggestions = () => {
    Review.getSuggestions(this.props.serverURL, this.props.consentKey).then(data => {
      if (data.data !== '') {
        this.setState(prev => {
          prev.formData = JSON.parse(data.data.suggestions);
          prev.editedForm = JSON.parse(data.data.suggestions);
          prev.reviewSuggestion = true;
          return prev;
        });
      } else {
        this.setState(prev => {
          prev.formData = JSON.parse(JSON.stringify(this.state.current));
          prev.reviewSuggestion = false;
          return prev;
        });
      }
    });
  };

  isEmpty(value) {
    return value === '' || value === null || value === undefined;
  }

  isValid = () => {
    let consent = false;
    let protocol = false;
    let collInst = false;
    let sampleCollections = false;
    let describeConsentGroup = false;
    let requireMta = false;
    let pii = false;
    let compliance = false;
    let sensitive = false;
    let accessible = false;
    let textCompliance = false;
    let textSensitive = false;
    let textAccessible = false;
    let sharingPlan = false;
    let questions = false;
    let endDate = false;
    let startDate = false;
    let consentGroupName = false;

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

    if (this.state.formData.consentExtraProps.accessible === "true" && this.isEmpty(this.state.formData.consentExtraProps.textAccessible)) {
      textAccessible = true;
    }

    if (this.isEmpty(this.state.formData.consentExtraProps.sharingPlan)) {
      sharingPlan = true;
    }

    if (!this.validateQuestionaire()) {
      questions = true;
    }

    if (!this.state.formData.consentExtraProps.onGoingProcess
      && this.isEmpty(this.state.formData.consentExtraProps.endDate)
      && !this.isEmpty(this.state.formData.consentExtraProps.startDate)
    ) {
      endDate = true;
    }

    if (!this.isEmpty(this.state.formData.consentExtraProps.endDate) && this.isEmpty(this.state.formData.consentExtraProps.startDate)) {
      startDate = true;
    }

    if (this.isEmpty(this.state.formData.consentExtraProps.accessible)) {
      accessible = true;
    }

    if (this.consentGroupNameExists()) {
      consentGroupName = true;
    }

    const valid = !consent &&
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
      !textAccessible &&
      !compliance &&
      !sensitive &&
      !startDate &&
      !consentGroupName &&
      !endDate &&
      !this.institutionalSrcHasErrors();
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
      prev.errors.endDate = endDate;
      prev.errors.compliance = compliance;
      prev.errors.sensitive = sensitive;
      prev.errors.accessible = accessible;
      prev.errors.startDate = startDate;
      prev.errors.consentGroupName = consentGroupName;
      return prev;
    });
    this.setState({ errorSubmit: !valid });
    return valid;
  };

  cleanErrors = () => {
    this.setState(prev => {
      prev.errors.consent = false;
      prev.errors.protocol = false;
      prev.errors.collInst = false;
      prev.errors.describeConsentGroup = false;
      prev.errors.requireMta = false;
      prev.errors.sampleCollections = false;
      prev.errors.pii = false;
      prev.errors.sharingPlan = false;
      prev.errors.textCompliance = false;
      prev.errors.textSensitive = false;
      prev.errors.textAccessible = false;
      prev.errors.endDate = false;
      prev.errors.compliance = false;
      prev.errors.sensitive = false;
      prev.errors.accessible = false;
      prev.errors.startDate = false;
      prev.errors.consentGroupName = false;
      prev.errors.instError = false;
      prev.errors.institutionalNameErrorIndex = [];
      prev.errors.institutionalCountryErrorIndex = [];
      return prev;
    });
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
      () => {
        if (this.state.reviewSuggestion) {
          let consentGroup = this.getConsentGroup();
          ConsentGroup.updateConsent(this.props.updateConsentUrl, consentGroup, this.props.consentKey).then(resp => {
            this.removeEdits();
          }).catch(error => {
            console.error(error);
          });
        }
        this.setState(prev => {
          prev.formData.consentForm.approvalStatus = data.approvalStatus;
          prev.current.consentExtraProps.projectReviewApproved = "true";
          prev.showApproveInfoDialog = !this.state.showApproveInfoDialog;
          prev.questions.length = 0;
          return prev;
        })
      }
    );
  };

  isCurrentUserAdmin() {
    User.isCurrentUserAdmin(this.props.isAdminUrl).then(
      resp => {
        this.setState({ isAdmin: resp.data.isAdmin });
      }
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
    this.setState(prev => {
      prev.showDiscardEditsDialog = !this.state.showDiscardEditsDialog;
      return prev;
    });
  };

  approveEdits = () => {
    spinnerService.showAll();
    let consentGroup = this.getConsentGroup();
    ConsentGroup.updateConsent(this.props.updateConsentUrl, consentGroup, this.props.consentKey).then(resp => {
      this.setState(prev => {
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
        isEdited: true,
        errorSubmit: false
      });
    }
    else {
      this.setState({
        errorSubmit: true
      });
    }
  };

  handleApproveInfoDialog = () => {
    if (this.isValid()) {
      this.setState({
        showApproveInfoDialog: !this.state.showApproveInfoDialog,
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
    this.setState(prev => {
      prev.readOnly = false;
      prev.questions.length = 0;
      prev.questions = this.initQuestions();
      prev.isEdited = false;
      return prev;
    });
  };

  cancelEdit = (e) => () => {
    this.cleanErrors();
    this.getReviewSuggestions();
    this.setState(prev => {
      prev.formData = this.state.futureCopy;
      prev.readOnly = true;
      prev.errorSubmit = false;
      prev.questions.length = 0;
      return prev;
    });
  };

  submitEdit = (e) => () => {
    let data = {};
    if (this.validateQuestionaire()) {
      if (this.isValid()) {
        this.setState(prev => {
          prev.readOnly = true;
          prev.errorSubmit = false;
          prev.intCohortsAnswers.forEach(question => {
            prev.formData.consentExtraProps[question.key] = question.answer;
          });
          return prev;
        }, () => {
          let institutionalSourceArray = this.state.formData.instSources;
          let newFormData = Object.assign({}, this.state.formData);
          newFormData.instSources = institutionalSourceArray;
          data.projectKey = this.props.consentKey;
          data.suggestions = JSON.stringify(newFormData);

          if (this.state.reviewSuggestion) {
            Review.updateReview(this.props.serverURL, this.props.consentKey, data).then(() =>
              this.getReviewSuggestions()
            );
          } else {
            Review.submitReview(this.props.serverURL, data).then(() =>
              this.getReviewSuggestions()
            );
          }
        });
      } else {
        this.setState(prev => {
          prev.submitted = true;
          prev.errorSubmit = true;
          prev.errorMessage = 'Please complete required fields.';
          return prev;
        });
      }
    } else {
      this.setState(prev => {
        prev.submitted = true;
        prev.errorSubmit = true;
        prev.errorMessage = 'Please complete International Cohorts';
        return prev;
      });
    }

  };

  institutionalSrcHasErrors = () => {
    let institutionalNameErrorIndex = [];
    let institutionalCountryErrorIndex = [];
    let institutionalError = this.state.formData.instSources.filter((obj, idx) => {
      let response = false;
      // Error if Name is missing
      if (this.isEmpty(obj.current.name) && this.isEmpty(obj.future.name)
        || this.isEmpty(obj.future.name) && !this.isEmpty(obj.future.country)
      ) {
        institutionalNameErrorIndex.push(idx);
        response = true;
      }
      // Error if Country is missing
      if (this.isEmpty(obj.future.country) && this.isEmpty(obj.current.country)
        || this.isEmpty(obj.future.country) && !this.isEmpty(obj.future.name)
      ) {
        institutionalCountryErrorIndex.push(idx);
        response = true;
      }
      // Error if all elements are empty
      if (!this.state.formData.instSources.filter(element => !this.isEmpty(element.future.name) && !this.isEmpty(element.future.country)).length > 0) {
        institutionalNameErrorIndex.push(0);
        institutionalCountryErrorIndex.push(0);
        response = true;
      }
      return response;
    }).length > 0;
    this.setState(prev => {
      prev.errors.institutionalNameErrorIndex = institutionalNameErrorIndex;
      prev.errors.institutionalCountryErrorIndex = institutionalCountryErrorIndex;
      prev.errors.instError = institutionalError;
      return prev;
    });

    return institutionalError;
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

  getInstitutionalSrc(institutionalSources) {
    let institutionalSourcesList = [];
    if (institutionalSources !== null && institutionalSources.length > 0) {
      institutionalSources.map((f) => {
        if (!this.isEmpty(f.future.name) && !this.isEmpty(f.future.country)) {
          institutionalSourcesList.push({ name: f.future.name, country: f.future.country });
        }
      });
    }
    return institutionalSourcesList;
  }

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
    consentGroup.institutionalSources = JSON.stringify(this.getInstitutionalSrc(this.state.formData.instSources));
    consentGroup.describeConsentGroup = this.state.formData.consentExtraProps.describeConsentGroup;
    consentGroup.requireMta = this.state.formData.consentExtraProps.requireMta;

    if (this.state.formData.consentExtraProps.endDate !== null) {
      consentGroup.endDate = this.parseDate(this.state.formData.consentExtraProps.endDate);
    }

    const questions = this.state.intCohortsAnswers;
    if (questions !== null && questions.length > 0) {
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
      prev.isEdited = !this.areObjectsEqual("formData", "current");
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
      prev.errors.endDate = false;
      prev.formData.consentExtraProps.onGoingProcess = checked;
      prev.formData.consentExtraProps.endDate = checked ? null : date;
      prev.isEdited = !this.areObjectsEqual("formData", "current");
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

  handleUpdateinstitutionalSources = (updated) => {
    this.setState(prev => {
      prev.formData.instSources = updated;
      prev.isEdited = true;
      prev.errors.instError = false;
      return prev;
    }, () => {
      if (this.state.submitted) {
        this.isValid();
      }
    });
  };

  setInstitutionalError = (error) => {
    this.setState(prev => {
      prev.errors.instError = error;
      return prev;
    })
  };

  handleExtraPropsInputChange = (e) => {

    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData.consentExtraProps[field] = value;
      prev.errors[field] = false;
      prev.isEdited = !this.areObjectsEqual("formData", "current");
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
      prev.isEdited = !this.areObjectsEqual("formData", "current");
      prev.errors[id] = false;
      return prev;
    }, () => {
      if (this.state.errorSubmit === true) {
        this.isValid();
      }
    });
  };

  handleRadio2Change = (e, field, value) => {
    this.setState(prev => {
      prev.formData.consentExtraProps[field] = value;
      prev.errors[field] = false;
      prev.isEdited = !this.areObjectsEqual("formData", "current");
      return prev;
    }, () => {
      if (this.state.errorSubmit) this.isValid()
    });
  };

  closeModal = () => {
    this.setState({ showDialog: !this.state.showDialog });
  };

  closeEditsModal = () => {
    this.setState({
      showDiscardEditsDialog: !this.state.showDiscardEditsDialog
    });
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

  determinationHandler = (determination) => {
    let newValues = {};
    const answers = [];
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
        prev.formData.consentExtraProps[key] = newValues[key];
      });
      prev.questions = determination.questions;
      prev.isEdited = true;
      prev.intCohortsAnswers = [...answers];
      prev.determination = determination;
      prev.submitError = false;
      return prev;
    });
  };

  cleanAnswersIntCohorts = (questionIndex, where) => {
    this.setState(prev => {
      this.state.questions.forEach((q, index) => {
        if (index > questionIndex.currentQuestionIndex) {
          prev.formData.consentExtraProps[q.key] = null;
          prev.questions[index].answer = null
        }
      });
      return prev;
    })};

  handleDiscardEditsDialog = () => {
    this.setState({
      showDiscardEditsDialog: !this.state.showDiscardEditsDialog
    });
  };

  stringAnswer = (current) => {
    let answer = '';
    if (current === 'true' || current === true) {
      answer = 'Yes';
    } else if (current === 'false' || current === false) {
      answer = 'No'
    } else if (current === 'null' || current === null || this.isEmpty(current)) {
      answer = '--';
    }
    return answer
  };

  isEquals = (a, b) => {
    if (this.isEmpty(b) && !this.isEmpty(a) || !this.isEmpty(a) && this.isEmpty(b)) {
      return false;
    }
    if (a !== undefined && b !== undefined) {
      if (JSON.parse(a) === JSON.parse(b)) {
        return true;
      } else if ((JSON.parse(a) !== JSON.parse(b))) {
        return false;
      }
    }
    return true;
  };

  areObjectsEqual(formData, current) {
    let newValues = JSON.parse(JSON.stringify(this.state[formData]));
    let currentValues = JSON.parse(JSON.stringify(this.state[current]));

    // remove Null consentExtraprops objects and normalize true/false to strings
    Object.keys(newValues.consentExtraProps).forEach((key) => {
      if (newValues.consentExtraProps[key] === true) newValues.consentExtraProps[key] = "true";
      else if (newValues.consentExtraProps[key] === false) newValues.consentExtraProps[key] = "false";
      return (newValues.consentExtraProps[key] === null) && delete newValues.consentExtraProps[key]

    });
    Object.keys(currentValues.consentExtraProps).forEach((key) => {
      if (currentValues.consentExtraProps[key] === true) currentValues.consentExtraProps[key] = "true";
      else if (currentValues.consentExtraProps[key] === false)
      return (currentValues.consentExtraProps[key] === null) && delete currentValues.consentExtraProps[key]
    });
    return JSON.stringify(newValues) === JSON.stringify(currentValues);
  }

  consentGroupNameExists() {
    const groupName = [this.state.formData.consentExtraProps.consent, this.state.formData.consentExtraProps.protocol].join(" / ");
    let consentGroupNameExists = groupName === this.state.formData.consentForm.summary ? false : this.state.existingGroupNames.indexOf(groupName) > -1;
    this.setState(prev => {
      prev.errors.consentGroupName = consentGroupNameExists;
      return prev;
    });
    return consentGroupNameExists;
  }

  areFormsEqual() {
    let areFormsEqual = false;
    if (this.state.reviewSuggestion) {
      areFormsEqual = this.areObjectsEqual("formData", "editedForm");
    } else {
      areFormsEqual = this.areObjectsEqual("formData", "current");
    }
    return areFormsEqual;
  };

  render() {
    const {
      consent = '',
      protocol = '',
      collInst = '',
      collContact = '',
      textCompliance = '',
      textSensitive = '',
      databaseControlled = '',
      databaseOpen = '',
      onGoingProcess = false,
      describeConsentGroup = '',
      requireMta = '',
      startDate = null,
      endDate = null,
      individualDataSourced = '',
      isLinkMaintained = '',
      feeForService = '',
      areSamplesComingFromEEAA = '',
      isCollaboratorProvidingGoodService = '',
      isConsentUnambiguous = '',
    } = get(this.state.formData, 'consentExtraProps', '');

    const currentEndDate = this.state.current.consentExtraProps.endDate !== undefined ? this.state.current.consentExtraProps.endDate : null;
    const currentStartDate = this.state.current.consentExtraProps.startDate !== undefined ? this.state.current.consentExtraProps.startDate : null;
    return (
      div({}, [
        h2({ className: "stepTitle" }, ["Consent Group: " + this.props.consentKey]),
        ConfirmationDialog({
          closeModal: this.handleApproveDialog,
          show: this.state.showApproveDialog,
          handleOkAction: this.approveEdits,
          title: 'Approve Edits Confirmation',
          bodyText: 'Are you sure you want to approve these edits?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.closeEditsModal,
          show: this.state.showDiscardEditsDialog,
          handleOkAction: this.discardEdits,
          title: 'Discard Edits Confirmation',
          bodyText: 'Are you sure you want to remove these edits?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.handleApproveInfoDialog,
          show: this.state.showApproveInfoDialog,
          handleOkAction: this.approveConsentGroup,
          title: 'Approve Project Information',
          bodyText: 'Are you sure you want to approve this Consent Group Details?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.closeModal,
          show: this.state.showDialog,
          handleOkAction: this.rejectConsentGroup,
          title: 'Remove Confirmation',
          bodyText: 'Are you sure you want to remove this Consent Group?',
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
            readOnly: this.state.readOnly,
            error: this.state.errors.consentGroupName,
            errorMessage: "An existing Consent Group with this protocol exists. Please choose a different one."
          }),
          InputFieldText({
            id: "inputInvestigatorLastName",
            name: "consent",
            label: "Last Name of Investigator Listed on the Consent Form",
            value: consent,
            currentValue: this.state.current.consentExtraProps.consent,
            onChange: this.handleExtraPropsInputChange,
            focusOut: this.consentGroupNameExists,
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
            focusOut: this.consentGroupNameExists,
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
            edit: true,
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
            edit: true,
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
            readOnly: this.state.readOnly,
            edit: true
          }),
        ]),

        Panel({ title: "Sample Collection Date Range" }, [
          div({ className: "row" }, [
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                selected: startDate,
                value: startDate,
                currentValue: currentStartDate,
                name: "startDate",
                label: "Start Date",
                onChange: this.handleChange,
                readOnly: this.state.readOnly,
                maxDate: this.state.formData.consentExtraProps.endDate !== null ? new Date(this.state.formData.consentExtraProps.endDate) : null,
                error: this.state.errors.startDate,
                errorMessage: "Required field",
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                minDate: new Date(this.state.formData.consentExtraProps.startDate),
                selected: endDate,
                value: endDate,
                currentValue: currentEndDate,
                name: "endDate",
                label: "End Date",
                onChange: this.handleChange,
                disabled: onGoingProcess === true || onGoingProcess === "true",
                readOnly: this.state.readOnly,
                error: this.state.errors.endDate,
                errorMessage: "Required field",
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12 checkbox" + (this.state.readOnly ? ' checkboxReadOnly' : ''), style: { 'marginTop': '32px' } }, [
              input({
                type: 'checkbox',
                id: "onGoingProcess",
                name: "onGoingProcess",
                checked: onGoingProcess === 'true' || onGoingProcess === true,
                onChange: this.handleCheck,
              }),
              label({ id: "lbl_onGoingProcess", htmlFor: "onGoingProcess", className: "regular-checkbox" }, ["Ongoing Process"])
            ])
          ])
        ]),
        Panel({ title: "Institutional Source of Data/Samples and Location" }, [
          InstitutionalSource({
            updateInstitutionalSource: this.handleUpdateinstitutionalSources,
            institutionalSources: this.state.formData.instSources !== undefined ? this.state.formData.instSources : [],
            readOnly: this.state.readOnly,
            edit: true,
            errorHandler: this.setInstitutionalError,
            institutionalNameErrorIndex: this.state.errors.institutionalNameErrorIndex,
            institutionalCountryErrorIndex: this.state.errors.institutionalCountryErrorIndex,
            error: this.state.errors.instError
          })
        ]),

        Panel({ title: "International Cohorts" }, [
          div({ className: "answerWrapper" }, [
            label({}, ["Are samples or individual-level data sourced from a country in the European Economic Area?"]),
            div({
              className: !this.isEquals(individualDataSourced, this.state.current.consentExtraProps.individualDataSourced) ? 'answerUpdated' : ''
            }, [this.stringAnswer(individualDataSourced)]),
            div({
              isRendered: !this.isEquals(individualDataSourced, this.state.current.consentExtraProps.individualDataSourced),
              className: "answerCurrent"
            }, [this.stringAnswer(this.state.current.consentExtraProps.individualDataSourced),])
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Is a link maintained ", span({ className: "normal" }, ["(by anyone) "]), "between samples/data being sent to the Broad and the identities of living EEA subjects?"]),
            div({
              className: !this.isEquals(isLinkMaintained, this.state.current.consentExtraProps.isLinkMaintained) ? 'answerUpdated' : ''
            }, [this.stringAnswer(isLinkMaintained)]),
            div({
              isRendered: !this.isEquals(isLinkMaintained, this.state.current.consentExtraProps.isLinkMaintained),
              className: "answerCurrent"
            }, [this.stringAnswer(this.state.current.consentExtraProps.isLinkMaintained)])
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Is the Broad work being performed as fee-for-service?"]),
            div({
              className: !this.isEquals(feeForService, this.state.current.consentExtraProps.feeForService) ? 'answerUpdated' : ''
            }, [this.stringAnswer(feeForService)]),
            div({
              isRendered: !this.isEquals(feeForService, this.state.current.consentExtraProps.feeForService),
              className: "answerCurrent"
            }, [this.stringAnswer(this.state.current.consentExtraProps.feeForService)])
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Are samples/data coming directly to the Broad from the EEA?"]),
            div({
              className: !this.isEquals(areSamplesComingFromEEAA, this.state.current.consentExtraProps.areSamplesComingFromEEAA) ? 'answerUpdated' : ''
            }, [this.stringAnswer(areSamplesComingFromEEAA)]),
            div({
              isRendered: !this.isEquals(areSamplesComingFromEEAA, this.state.current.consentExtraProps.areSamplesComingFromEEAA),
              className: "answerCurrent"
            }, [this.stringAnswer(this.state.current.consentExtraProps.areSamplesComingFromEEAA)])
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["Is Broad or the EEA collaborator providing goods/services ", span({ className: "normal" }, ["(including routine return of research results) "]), "to EEA subjects, or engaging in ongoing monitoring of them", span({ className: "normal" }, ["(e.g. via use of a FitBit)?"])]),
            div({
              className: !this.isEquals(isCollaboratorProvidingGoodService, this.state.current.consentExtraProps.isCollaboratorProvidingGoodService) ? 'answerUpdated' : ''
            }, [this.stringAnswer(isCollaboratorProvidingGoodService)]),
            div({
              isRendered: !this.isEquals(isCollaboratorProvidingGoodService, this.state.current.consentExtraProps.isCollaboratorProvidingGoodService),
              className: "answerCurrent"
            }, [this.stringAnswer(this.state.current.consentExtraProps.isCollaboratorProvidingGoodService)])
          ]),

          div({ className: "answerWrapper" }, [
            label({}, ["GDPR does not apply, but a legal basis for transfer must be established. Is consent unambiguous ", span({ className: "normal" }, ["(identifies transfer to the US, and risks associated with less stringent data protections here)?"])]),
            div({
              className: !this.isEquals(isConsentUnambiguous, this.state.current.consentExtraProps.isConsentUnambiguous) ? 'answerUpdated' : ''
            }, [this.stringAnswer(isConsentUnambiguous)]),
            div({
              isRendered: !this.isEquals(isConsentUnambiguous, this.state.current.consentExtraProps.isConsentUnambiguous),
              className: "answerCurrent"
            }, [this.stringAnswer(this.state.current.consentExtraProps.isConsentUnambiguous)])
          ]),

          div({ isRendered: !this.state.readOnly, className: "questionnaireEdits" }, [
            div({ style: { 'margin': '15px 0 40px 0' } }, [
              AlertMessage({
                type: 'info',
                msg: "If you would like to change the answers to any of the International Cohort questions displayed above, please proceed through the questions below to change your answers accordingly.",
                show: true
              })
            ]),
            h3({}, ["International Cohorts' Questionnaire"]),
            QuestionnaireWorkflow({
              questions: this.state.questions,
              edit: true,
              cleanQuestionsUnanswered: this.cleanAnswersIntCohorts,
              handler: this.determinationHandler,
              determination: this.state.determination
            })
          ])
        ]),

        Panel({ title: "Security" }, [
          InputFieldRadio({
            edit: true,
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
            errorMessage: "Required field",
            edit: true,
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
            edit: true,
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
            edit: true,
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
            edit: true,
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
            disabled: this.areFormsEqual(),
            isRendered: this.state.readOnly === false
          }, ["Submit Edits"]),

          /*visible for Admin in readOnly mode and if the consent group is in "pending" status*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveInfoDialog,
            isRendered: this.state.current.consentExtraProps.projectReviewApproved !== 'true' && this.state.isAdmin && this.state.readOnly === true,
            disabled: this.state.disableApproveButton
          }, ["Approve"]),

          /*visible for Admin in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveDialog,
            isRendered: this.state.isAdmin
              && this.state.reviewSuggestion === true
              && this.state.current.consentExtraProps.projectReviewApproved === 'true'
              && this.state.readOnly === true
          }, ["Approve Edits"]),

          /*visible for Admin in readOnly mode and if the consent group is in "pending" status*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.handleDialog,
            disabled: this.state.disableApproveButton,
            isRendered: this.state.current.consentExtraProps.projectReviewApproved !== 'true' && this.state.isAdmin && this.state.readOnly === true,
          }, ["Reject"]),
          /*visible for every user in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.handleDiscardEditsDialog,
            isRendered: this.state.isAdmin && this.state.reviewSuggestion === true && this.state.readOnly === true
          }, ["Discard Edits"])
        ])
      ])
    )
  }
}

export default ConsentGroupReview;
