import { Component } from 'react';
import { h, hh, p, div, h2, h3, input, label, span, a, button } from 'react-hyperscript-helpers';

import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { InstitutionalSource } from '../components/InstitutionalSource';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { ConsentGroup, SampleCollections, User, Review } from "../util/ajax";
import { RequestClarificationDialog } from "../components/RequestClarificationDialog";
import { ConfirmationDialog } from "../components/ConfirmationDialog";
import { spinnerService } from "../util/spinner-service";
import { AlertMessage } from "../components/AlertMessage";
import { Spinner } from "../components/Spinner";
import get from 'lodash/get';
import { format } from 'date-fns';
import { IntCohortsReview } from "../components/IntCohortsReview";

const TEXT_SHARING_TYPES = ['open', 'controlled', 'both'];

class ConsentGroupReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dialog: false,
      discardEditsDialog: false,
      approveDialog: false,
      approveInfoDialog: false,
      rejectProjectDialog: false,
      requestClarification: false,
      readOnly: true,
      isAdmin: false,
      disableApproveButton: false,
      reviewSuggestion: false,
      submitted: false,
      alertType: '',
      consentForm: {
        summary: '',
        approvalStatus: 'Pending'
      },
      determination: {
        projectType: null,
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
        sharingType: null,
        textSharingType: null,
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
        sharingType: false,
        textCompliance: false,
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
      isEdited: false,
      intCohortsAnswers: [],
      resetIntCohorts: false,

      openSharingText: '(Data Use LetterNR/link, consent or waiver of consent, or documentation from source that consent is not available but samples were appropriately collected and publicly available)',
      controlledSharingText: '(Data Use LetterNR/link, consent or waiver of consent)'
    };
    this.rejectConsentGroup = this.rejectConsentGroup.bind(this);
    this.consentGroupNameExists = this.consentGroupNameExists.bind(this);
    this.resetHandler = this.resetHandler.bind(this);
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

            const intCohortsQuestions = [
              {key: 'individualDataSourced', answer: null },
              {key: 'isLinkMaintained', answer: null},
              {key: 'feeForService', answer: null},
              {key: 'areSamplesComingFromEEAA', answer: null},
              {key: 'isCollaboratorProvidingGoodService', answer: null},
              {key: 'isConsentUnambiguous', answer: null}
            ];

            let intCohortsAnswers = [];
            intCohortsQuestions.forEach(it => {
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
              prev.intCohortsQuestions = intCohortsQuestions;
              prev.intCohortsAnswers = intCohortsAnswers;
              return prev;
            });
          }
        );
      }
    );
  };

  parseIntCohorts() {
    let intCohortsAnswers = [];
    this.state.intCohortsQuestions.forEach(it => {
      if (this.state.formData.consentExtraProps[it.key] !== undefined) {
        intCohortsAnswers.push({
          key: it.key,
          answer: this.state.formData.consentExtraProps[it.key]
        });
      }
    });
    return intCohortsAnswers;
  }

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
    let sharingType = false;
    let textCompliance = false;
    let questions = false;
    let endDate = false;
    let startDate = false;
    let consentGroupName = false;
    let intCohortsAnswers = false;

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

    if (this.state.formData.consentExtraProps.compliance === "true" && this.isEmpty(this.state.formData.consentExtraProps.textCompliance)) {
      textCompliance = true;
    }

    if (!this.validateQuestionnaire()) {
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

    if (this.isEmpty(this.state.formData.consentExtraProps.sharingType)) {
      sharingType = true;
    }

    if (this.consentGroupNameExists()) {
      consentGroupName = true;
    }

    if (this.state.intCohortsAnswers.length === 0) {
      intCohortsAnswers = true;
    }

    const valid = !consent &&
      !this.institutionalSrcHasErrors() &&
      !protocol &&
      !collInst &&
      !describeConsentGroup &&
      !requireMta &&
      !sampleCollections &&
      !pii &&
      !questions &&
      !textCompliance &&
      !sharingType &&
      !compliance &&
      !startDate &&
      !consentGroupName &&
      !endDate &&
      !intCohortsAnswers;

    this.setState(prev => {
      prev.errors.consent = consent;
      prev.errors.protocol = protocol;
      prev.errors.collInst = collInst;
      prev.errors.describeConsentGroup = describeConsentGroup;
      prev.errors.requireMta = requireMta;
      prev.errors.sampleCollections = sampleCollections;
      prev.errors.pii = pii;
      prev.errors.textCompliance = textCompliance;
      prev.errors.endDate = endDate;
      prev.errors.compliance = compliance;
      prev.errors.sharingType = sharingType;
      prev.errors.startDate = startDate;
      prev.errors.consentGroupName = consentGroupName;
      prev.internationalCohortsError = intCohortsAnswers;
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
      prev.errors.textCompliance = false;
      prev.errors.endDate = false;
      prev.errors.compliance = false;
      prev.errors.sharingType = false;
      prev.errors.startDate = false;
      prev.errors.consentGroupName = false;
      prev.errors.instError = false;
      prev.errors.institutionalNameErrorIndex = [];
      prev.errors.institutionalCountryErrorIndex = [];
      prev.internationalCohortsError = false;
      return prev;
    });
  };

  validateQuestionnaire = () => {
    let isValid = false;
    const determination = this.state.determination;
    if (determination.questions.length === 0 || determination.endState === true) {
      isValid = true;
    }
    if (this.state.intCohortsAnswers.length === 0) {
      isValid = false;
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
          prev.current.consentExtraProps.projectReviewApproved = true;
          prev.approveInfoDialog = false;
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
    this.setState({ discardEditsDialog: false });
    this.removeEdits('reject');
  };

  approveEdits = () => {
    spinnerService.showAll();
    let consentGroup = this.getConsentGroup();
    consentGroup.editsApproved = true;
    ConsentGroup.updateConsent(this.props.updateConsentUrl, consentGroup, this.props.consentKey).then(resp => {
      this.setState(prev => {
        prev.approveDialog = false;
        return prev;
      });
      this.removeEdits('approve');
    }).catch(error => {
      spinnerService.hideAll();
      console.error(error);
    });
  };

  handleApproveDialog = () => {
    if (this.isValid()) {
      this.setState({
        approveDialog: true,
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
        approveInfoDialog: true,
        errorSubmit: false,
      });
    }
    else {
      this.setState({
        errorSubmit: true
      });
    }
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

  enableEdit = (e) => () => {
    this.getReviewSuggestions();
    this.setState(prev => {
      prev.readOnly = false;
      prev.resetIntCohorts = true;
      prev.isEdited = false;
      return prev;
    });
  };

  toggleState = (e) => () => {
    this.setState((state, props) => {
      return { [e]: !state[e] }
    });
  };

  cancelEdit = (e) => () => {
    this.cleanErrors();
    this.getReviewSuggestions();
    this.setState(prev => {
      prev.formData = this.state.futureCopy;
      prev.readOnly = true;
      prev.errorSubmit = false;
      prev.resetIntCohorts = false;
      return prev;
    });
  };

  submitEdit = (e) => () => {
    let data = {};
    if (this.validateQuestionnaire()) {
      if (this.isValid()) {
        this.setState(prev => {
          prev.readOnly = true;
          prev.errorSubmit = false;
          prev.resetIntCohorts = false;
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
    const instSources = this.state.formData.instSources == undefined ? [{ current: { name: '', country: '' }, future: { name: '', country: '' } }] : this.state.formData.instSources;
    let institutionalNameErrorIndex = [];
    let institutionalCountryErrorIndex = [];
    let institutionalError = instSources.filter((obj, idx) => {
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
      if (!instSources.filter(element => !this.isEmpty(element.future.name) && !this.isEmpty(element.future.country)).length > 0) {
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
    const questions = this.parseIntCohorts();
    if (questions !== null && questions.length > 0) {
      questions.map((q) => {
        if (q.answer !== null) {
          consentGroup[q.key] = q.answer;
        }
      });
    }

    consentGroup.pii = this.state.formData.consentExtraProps.pii;
    consentGroup.compliance = this.state.formData.consentExtraProps.compliance;
    consentGroup.sensitive = this.state.formData.consentExtraProps.sensitive;
    consentGroup.sharingType = this.state.formData.consentExtraProps.sharingType;

    if (TEXT_SHARING_TYPES.some((type) => type === consentGroup.sharingType)) {
      consentGroup.textSharingType = this.state.formData.consentExtraProps.textSharingType;
    } else {
      consentGroup.textSharingType = "";
    }
    if (consentGroup.compliance === 'true') {
      consentGroup.textCompliance = this.state.formData.consentExtraProps.textCompliance;
    } else {
      consentGroup.textCompliance = "";
    }

    return consentGroup;

  };

  removeEdits = (type) => {
    Review.deleteSuggestions(this.props.discardReviewUrl, this.props.consentKey, type).then(
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
      prev.resetIntCohorts = false;
      prev.isEdited = true;
      prev.intCohortsAnswers = [...answers];
      prev.determination = determination;
      prev.submitError = false;
      prev.errorSubmit = false;
      prev.internationalCohortsError = false;
      return prev;
    });
  };

  cleanAnswersIntCohorts = (questionIndex, where) => {
    this.setState(prev => {
      this.state.intCohortsQuestions.forEach((q, index) => {
        if (index > questionIndex.currentQuestionIndex) {
          prev.formData.consentExtraProps[q.key] = null;
        }
      });
      return prev;
    })
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
    if (this.state.existingGroupNames !== undefined) {
      let consentGroupNameExists = groupName === this.state.formData.consentForm.summary ? false : this.state.existingGroupNames.indexOf(groupName) > -1;
      this.setState(prev => {
        prev.errors.consentGroupName = consentGroupNameExists;
        return prev;
      });
      return consentGroupNameExists;
    }
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

  successClarification = () => {
    setTimeout(this.clearAlertMessage, 5000, null);
    this.setState(prev => {
      prev.errorSubmit = true;
      prev.errorMessage = 'Request clarification sent.';
      prev.alertType = 'success';
      return prev;
    });
  };

  clearAlertMessage = () => {
    this.setState(prev => {
      prev.errorSubmit = false;
      prev.errorMessage = '';
      prev.alertType = '';
      return prev;
    });
  };

  render() {
    const {
      consent = '',
      protocol = '',
      collInst = '',
      collContact = '',
      textCompliance = '',
      onGoingProcess = false,
      describeConsentGroup = '',
      requireMta = '',
      startDate = null,
      endDate = null
    } = get(this.state.formData, 'consentExtraProps', '');
    const instSources = this.state.formData.instSources == undefined ? [{ current: { name: '', country: '' }, future: { name: '', country: '' } }] : this.state.formData.instSources;

    let currentEndDate = this.state.current.consentExtraProps.endDate !== null ? format(new Date(this.state.current.consentExtraProps.endDate), 'MM/DD/YYYY') : null;
    let currentStartDate = this.state.current.consentExtraProps.startDate !== null ? format(new Date(this.state.current.consentExtraProps.startDate), 'MM/DD/YYYY') : null;
    return (
      div({}, [
        h2({ className: "stepTitle" }, ["Consent Group: " + this.props.consentKey]),
        RequestClarificationDialog({
          closeModal: this.toggleState('requestClarification'),
          show: this.state.requestClarification,
          issueKey: this.props.consentKey,
          user: this.props.user,
          emailUrl: this.props.emailUrl,
          userName: this.props.userName,
          clarificationUrl: this.props.clarificationUrl,
          successClarification: this.successClarification
        }),
        ConfirmationDialog({
          closeModal: this.toggleState('approveDialog'),
          show: this.state.approveDialog,
          handleOkAction: this.approveEdits,
          title: 'Approve Edits Confirmation',
          bodyText: 'Are you sure you want to approve these edits?',
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
          closeModal: this.toggleState('approveInfoDialog'),
          show: this.state.approveInfoDialog,
          handleOkAction: this.approveConsentGroup,
          title: 'Approve Project Information',
          bodyText: 'Are you sure you want to approve this Consent Group Details?',
          actionLabel: 'Yes'
        }, []),
        ConfirmationDialog({
          closeModal: this.toggleState('dialog'),
          show: this.state.dialog,
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
                value: startDate !== null ? format(new Date(startDate), 'MM/DD/YYYY') : null,
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
                value: endDate !== null ? format(new Date(endDate), 'MM/DD/YYYY') : null,
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
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12 checkbox", style: { 'marginTop': '32px' } }, [
              InputFieldCheckbox({
                id: "onGoingProcess",
                name: "onGoingProcess",
                onChange: this.handleCheck,
                label: "Ongoing Process",
                checked: onGoingProcess === true || onGoingProcess === "true",
                readOnly: this.state.readOnly
              })
            ])
          ])
        ]),
        Panel({ title: "Institutional Source of Data/Samples and Location" }, [
          InstitutionalSource({
            updateInstitutionalSource: this.handleUpdateinstitutionalSources,
            institutionalSources: instSources,
            readOnly: this.state.readOnly,
            edit: true,
            errorHandler: this.setInstitutionalError,
            institutionalNameErrorIndex: this.state.errors.institutionalNameErrorIndex,
            institutionalCountryErrorIndex: this.state.errors.institutionalCountryErrorIndex,
            error: this.state.errors.instError
          })
        ]),
        Panel({ title: "International Cohorts"}, [
          IntCohortsReview({
            future: get(this.state.formData, 'consentExtraProps', ''),
            current: this.state.current.consentExtraProps,
            readOnly: this.state.readOnly,
            resetHandler: this.resetHandler,
            determination: this.state.determination,
            handler: this.determinationHandler,
            cleanQuestionsUnanswered: this.cleanAnswersIntCohorts,
            resetIntCohorts: this.state.resetIntCohorts
          })
        ]),
        Panel({ title: "Security" }, [
          InputFieldRadio({
            edit: true,
            id: "radioPII",
            name: "pii",
            label: "As part of this project, will Broad receive either personally identifiable information (PII) or protected health information (PHI)?* ",
            moreInfo: span({}, ["For a list of what constitutes PII and PHI, ", a({ href: "https://intranet.broadinstitute.org/faq/storing-and-managing-phi", className: "link", target: "_blank" }, ["visit this link"]), "."]),
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
            label: span({}, ["Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPAA, etc.)"]), "?*"]),
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
            label: "Please specify which regulations must be adhered to below:*",
            value: textCompliance,
            currentValue: this.state.current.consentExtraProps.textCompliance,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.textCompliance,
            errorMessage: "Required field"
          }),
          InputFieldRadio({
            id: "radioAccessible",
            name: "sharingType",
            label: span({}, ["Will the individual level data collected or generated as part of this project be shared via: *"]),
            value: this.state.formData.consentExtraProps.sharingType,
            currentValue: this.state.current.consentExtraProps.sharingType,
            optionLabels: [
              "An open/unrestricted repository (such as GEO)",
              "A controlled-access repository (such as dbGaP or DUOS)",
              "Both a controlled-access and an open-access repository",
              "No data sharing via a repository (data returned to research collaborator only)",
              "Data sharing plan not yet determined"
            ],
            optionValues: [
              "open",
              "controlled",
              "both",
              "noDataSharing",
              "undetermined"
            ],
            onChange: this.handleRadio2Change,
            required: true,
            error: this.state.errors.sharingType,
            errorMessage: "Required field",
            readOnly: this.state.readOnly,
            edit: this.state.edit,
          }),
          InputFieldText({
            isRendered: TEXT_SHARING_TYPES.some((type) => type === this.state.formData.consentExtraProps.sharingType),
            id: "inputAccessible",
            name: "textSharingType",
            label: "Name of Database(s) ",
            moreInfo: this.state.formData.consentExtraProps.sharingType === 'controlled' ? this.state.controlledSharingText : this.state.openSharingText,
            value: this.state.formData.consentExtraProps.textSharingType,
            currentValue: this.state.current.consentExtraProps.textSharingType,
            disabled: false,
            required: false,
            onChange: this.handleExtraPropsInputChange,
            readOnly: this.state.readOnly,
            edit: true,
            review: true
          })

        ]),

        AlertMessage({
          msg: this.state.errorMessage,
          show: this.state.errorSubmit,
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
            disabled: this.areFormsEqual(),
            isRendered: this.state.readOnly === false
          }, ["Submit Edits"]),

          /*visible for Admin in readOnly mode and if the consent group is in "pending" status*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveInfoDialog,
            isRendered: this.state.current.consentExtraProps.projectReviewApproved !== true && this.state.isAdmin && this.state.readOnly === true,
            disabled: this.state.disableApproveButton
          }, ["Approve"]),

          /*visible for Admin in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonPrimary floatRight",
            onClick: this.handleApproveDialog,
            isRendered: this.state.isAdmin
              && this.state.reviewSuggestion === true
              && this.state.current.consentExtraProps.projectReviewApproved === true
              && this.state.readOnly === true
          }, ["Approve Edits"]),

          /*visible for Admin in readOnly mode and if the consent group is in "pending" status*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.toggleState('dialog'),
            disabled: this.state.disableApproveButton,
            isRendered: this.state.current.consentExtraProps.projectReviewApproved !== true && this.state.isAdmin && this.state.readOnly === true,
          }, ["Reject"]),
          /*visible for every user in readOnly mode and if there are changes to review*/
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.toggleState('discardEditsDialog'),
            isRendered: this.state.isAdmin && this.state.reviewSuggestion === true && this.state.readOnly === true
          }, ["Discard Edits"]),
          button({
            className: "btn buttonSecondary floatRight",
            onClick: this.toggleState('requestClarification'),
            isRendered: this.state.isAdmin && this.state.readOnly === true
          }, ["Request Clarification"])
        ]),
        h(Spinner, {
          name: "mainSpinner", group: "orsp", loadingImage: this.props.loadingImage
        })
      ])
    )
  }
}

export default ConsentGroupReview;
