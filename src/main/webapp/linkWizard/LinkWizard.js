import { Component } from 'react';
import { div, h1, hh } from 'react-hyperscript-helpers';
import { Wizard } from '../components/Wizard';
import { SelectSampleConsent } from './SelectSampleConsent';
import { LinkQuestions } from './LinkQuestions';
import { ConsentCollectionLink, User } from '../util/ajax';
import { handleUnauthorized, isEmpty } from '../util/Utils';
import '../index.css';
import * as qs from 'query-string';
import LoadingWrapper from '../components/LoadingWrapper';
import defaultTo from 'lodash/defaultTo';

const LAST_STEP = 1;

const LinkWizard = hh( class LinkWizard extends Component {
  state = {};
  _isMount = false;
  projectKey = '';

  constructor(props) {
    super(props);
    const params = new URLSearchParams(this.props.location.search);
    this.projectKey = defaultTo(params.get('projectKey'), component.projectKey);
    this.state = {
      files: [],
      startDate: null,
      endDate: null,
      onGoingProcess: '',
      user: {
        displayName: '',
        userName: '',
        emailAddress: ''
      },
      submitError: false,
      errors: {
        consentGroup: false,
        errorSampleCollectionDateRange: false,
        isValid: true,
        internationalCohortsError: {
        },
        security: {},
        requireMta: false
      },
      generalError: false,
      formSubmitted: false,
      currentStep: 0,
      consentGroup: {},
      sampleCollection: {},
      internationalCohorts: {},
      requireMta: false,
      isValid: true,
      determination: {
        projectType: null,
        questions: [],
        requiredError: false,
        currentQuestionIndex: 0,
        nextQuestionIndex: 1,
        endState: false
      },
      linkFormData: {},
      showInternationalCohortsError: false,
      showErrorInfoSecurity: false,
      isInfoSecurityValid: false,
      securityInfoFormData: {},
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  stepChanged = (newStep) => {
    this.setState({
      currentStep: newStep
    });
  };

  componentDidMount() {
    this._isMount = true;
    this.getUserSession();
  }

  componentWillUnmount() {
    this._isMount = false;
  }

  getUserSession() {
    User.getUserSession().then( resp => {
      if (this._isMount) {
        this.setState({ user: resp.data })
      }
    }).catch(error => {
      if (this._isMount) {
        this.setState(() => { throw error; });
      }
    });
  }

  changeSubmitState = () => {
    this.setState(prev => {
      prev.formSubmitted = !prev.formSubmitted;
      return prev;
    });
  };

  toggleSubmitError = () => {
    this.setState(prev => {
      prev.submitError = true;
      return prev;
    });
  };

  determinationHandler = (determination) => {
    this.setState(prev => {
      prev.determination = determination;
      if (this.state.determination.projectType !== null && this.state.showInternationalCohortsError === true) {
        prev.showInternationalCohortsError = false;
      }
      return prev;
    }, () => {
      this.isValid(null);
    })
  };

  updateInfoSecurityFormData = (updatedForm) => {
    this.setState(prev => {
      prev.securityInfoFormData = updatedForm;
      return prev;
    }, () => {
      this.isValid(null);
    })
  };

  handleInfoSecurityValidity = (isValid) => {
    this.setState(prev => {
      prev.isInfoSecurityValid = isValid;
      prev.showErrorInfoSecurity = !isValid;
      return prev;
    })
  };

  validateMTA() {
    let isValid = true;
    // if (this.state.linkFormData.requireMta === undefined || this.state.linkFormData.requireMta === '') {
    //   isValid = false;
    // }
    // this.setState(prev => {
    //   prev.errors.requireMta = !isValid;
    //   return prev;
    // });
    return isValid
  }

  updateMTA = (updatedForm, field) => {
    this.setState(prev => {
      prev.linkFormData = updatedForm;
      return prev;
    }, () => {
      this.isValid(field);
    })
  };

  fileHandler = (file) => {
    this.setState({
      files: file
    });
  };

  removeErrorMessage = () => {
    this.setState(prev => {
      prev.generalError = false;
      return prev;
    });
  };

  showSubmit = (currentStep) => {
    let renderSubmit = false;
    if (currentStep === LAST_STEP) {
      renderSubmit = true;
    }
    return renderSubmit;
  };

  validateForm = () => {
    const isValidStep1 = this.validateLinkStep();
    const isInternationalCohortsValid = this.validateInternationalCohorts();
    const isInfoSecurityValid = this.validateInfoSecurity();
    const isMTAValid = this.validateMTA();
    return isValidStep1 && isInfoSecurityValid && isInternationalCohortsValid && isMTAValid;
  };

  getConsentCollectionData = () => {
    let consentCollectionLink = {};
    // consent group info
    consentCollectionLink.consentKey = this.state.consentGroup.key;
    // consent collection link info
    consentCollectionLink.sampleCollectionId = this.state.sampleCollection.value;
    consentCollectionLink.projectKey = this.projectKey;
    consentCollectionLink.requireMta = this.state.linkFormData.requireMta;
    // security
    consentCollectionLink.pii = this.state.securityInfoFormData.pii == "true" ? true : false;
    consentCollectionLink.compliance = this.state.securityInfoFormData.compliance;
    consentCollectionLink.textCompliance = isEmpty(this.state.securityInfoFormData.textCompliance) ? null : this.state.securityInfoFormData.textCompliance;
    consentCollectionLink.sharingType = this.state.securityInfoFormData.sharingType;
    consentCollectionLink.textSharingType = isEmpty(this.state.securityInfoFormData.textSharingType) ? null : this.state.securityInfoFormData.textSharingType;
    consentCollectionLink.publiclyAvailable = this.state.securityInfoFormData.publiclyAvailable;
    consentCollectionLink.store = isEmpty(this.state.securityInfoFormData.store) ? null : this.state.securityInfoFormData.store.join();
    consentCollectionLink.externalAvailability = isEmpty(this.state.securityInfoFormData.externalAvailability) ? null : this.state.securityInfoFormData.externalAvailability;
    consentCollectionLink.textStore = isEmpty(this.state.securityInfoFormData.textStore) ? null : this.state.securityInfoFormData.textStore;
    consentCollectionLink.piiDt = this.state.securityInfoFormData.piiDt;
    consentCollectionLink.phi = this.state.securityInfoFormData.phi;
    consentCollectionLink.genomicData = this.state.securityInfoFormData.genomicData;
    consentCollectionLink.names = this.state.securityInfoFormData.names;
    consentCollectionLink.dates = this.state.securityInfoFormData.dates;
    consentCollectionLink.telephone = this.state.securityInfoFormData.telephone;
    consentCollectionLink.geographicData = this.state.securityInfoFormData.geographicData;
    consentCollectionLink.fax = this.state.securityInfoFormData.fax;
    consentCollectionLink.socialSecurityNumber = this.state.securityInfoFormData.socialSecurityNumber;
    consentCollectionLink.emailAddresses = this.state.securityInfoFormData.emailAddresses;
    consentCollectionLink.medicalNumbers = this.state.securityInfoFormData.medicalNumbers;
    consentCollectionLink.accountNumbers = this.state.securityInfoFormData.accountNumbers;
    consentCollectionLink.healthPlanNumbers = this.state.securityInfoFormData.healthPlanNumbers;
    consentCollectionLink.licenseNumbers = this.state.securityInfoFormData.licenseNumbers;
    consentCollectionLink.vehicleIdentifiers = this.state.securityInfoFormData.vehicleIdentifiers;
    consentCollectionLink.webUrls =  this.state.securityInfoFormData.webUrls;
    consentCollectionLink.deviceIdentifiers = this.state.securityInfoFormData.deviceIdentifiers;
    consentCollectionLink.internetProtocolAddresses = this.state.securityInfoFormData.internetProtocolAddresses;
    consentCollectionLink.facePhotos = this.state.securityInfoFormData.facePhotos;
    consentCollectionLink.biometricIdentifiers = this.state.securityInfoFormData.biometricIdentifiers;
    consentCollectionLink.uniqueIdentifying = this.state.securityInfoFormData.uniqueIdentifying;
    consentCollectionLink.otherIdentifier = this.state.securityInfoFormData.otherIdentifier;
    consentCollectionLink.textOtherIdentifier = isEmpty(this.state.securityInfoFormData.textOtherIdentifier) ? null : this.state.securityInfoFormData.textOtherIdentifier;
    // date range
    consentCollectionLink.startDate = this.state.startDate;
    consentCollectionLink.endDate = this.state.endDate;
    consentCollectionLink.onGoingProcess = this.state.onGoingProcess;
    // cohorts
    let questions = this.state.determination.questions;
    if (questions !== null && questions.length > 1) {
      let cohortsForm = [];
      questions.map((q, idx) => {
        if (q.answer !== null) {
          cohortsForm.push({ name: q.key, value: q.answer });
        }
      });
      consentCollectionLink.internationalCohorts = JSON.stringify(cohortsForm);
    }

    return consentCollectionLink;
  };

  submitLink = async () => {
    this.setState({ submitError: false });
    this.props.showSpinner();
    if (this.validateForm()) {
      this.removeErrorMessage();
      this.changeSubmitState();
      const documents = this.state.files;
      const consentCollectionData = this.getConsentCollectionData();
      ConsentCollectionLink.create(consentCollectionData, documents).then(resp => {
        this.props.hideSpinner();
        this.props.history.push('/project/main?projectKey=' + qs.parse(this.props.location.search).projectKey + '&tab=consent-groups&new', {tab: 'consent-groups'});
      }).catch(error => {
        if (error.response != null && error.response.status === 401) {
          handleUnauthorized(this.props.history.location);
        } else {
          console.error(error);
          this.toggleSubmitError();
          this.changeSubmitState();
          this.props.hideSpinner();
        }
      });
    } else {
      if (this._isMount) {
        this.setState(prev => {
          prev.generalError = true;
          return prev;
        }, () => {
          this.props.hideSpinner();
        });
      }
    }

  };

  validateLinkStep = (field) => {
    let consentGroup = false;
    let isValid = true;
    let isDateRangeValid = true;
    if (isEmpty(this.state.consentGroup)) {
      consentGroup = true;
      isValid = false;
    }  
    if (field === undefined || field === null || field === 0) {
      this.setState(prev => {
        prev.errors.consentGroup = consentGroup;
        prev.errors.errorSampleCollectionDateRange = !isDateRangeValid;
        prev.errors.isValid = isValid;
        if (isValid) {
          prev.generalError = false;
        }
        return prev;
      });
    }

    else if (field === 'consentGroup') {
      this.setState(prev => {
        if (field === 'consentGroup') {
          prev.errors.consentGroup = consentGroup;
        }
        return prev;
      });
    }
    return isValid;
  };

  isValid = (field) => {
    let isValid = true;
    if (this.state.currentStep === 0) {
      isValid = this.validateLinkStep(field)
    } else if (this.state.currentStep === 1) {
      isValid = this.validateInternationalCohorts() && this.validateInfoSecurity();
      if (!this.validateMTA()) {
        isValid = false;
      }
    }
    if (this.state.generalError && isValid) {
      this.removeErrorMessage();
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

  validateInternationalCohorts() {
    let isValid = true;
    // if (this.state.determination.requiredError || this.state.determination.endState === false) {
    //   isValid = false;
    // }
    // this.setState(prev => {
    //   prev.showInternationalCohortsError = !isValid;
    //   return prev;
    // });
    return isValid;
  }

  updateGeneralForm = (updatedForm, field) => {
    this.setState(prev => {
      prev[field] = updatedForm;
      return prev;
    }, () => this.isValid(field));
  };

  updateDateRange = (onGoingProcess, endDate, startDate) => {
    this.setState(prev => {
      prev.startDate = startDate;
      prev.endDate = endDate;
      prev.onGoingProcess = onGoingProcess;
      return prev;
    });
  };

  render() {
    const { currentStep } = this.state;
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }
    return (
      div({ name: 'wizardContainer' },[
        Wizard({
          title: "Add Existing Sample/Data Cohort",
          note: "",
          stepChanged: this.stepChanged,
          isValid: this.isValid,
          submitHandler: this.submitLink,
          showSubmit: this.showSubmit,
          disabledSubmit: this.state.formSubmitted,
        }, [
          SelectSampleConsent({
            title: "Sample/Data Cohort Info",
            removeErrorMessage: this.removeErrorMessage,
            sampleCollectionList: this.state.sampleCollectionList,
            sampleCollection: this.state.sampleCollection,
            errors: this.state.errors,
            fileHandler: this.fileHandler,
            files: this.state.files,
            currentStep: currentStep,
            consentGroup: this.state.consentGroup,
            updateForm: this.updateGeneralForm,
            consentGroupIsLoading: this.state.consentGroupIsLoading,
            updateDateRange: this.updateDateRange,
            generalError: this.state.generalError,
            projectKey: this.projectKey
          }),
          LinkQuestions({
            title: "Data Security Info",
            currentStep: currentStep,
            // handler: this.determinationHandler,
            // determination: this.state.determination,
            // showErrorIntCohorts: this.state.showInternationalCohortsError,
            origin: 'consentGroup',
            // requireMta: this.state.linkFormData.requireMta,
            errors: this.state.errors,
            user: this.state.user,
            updateInfoSecurityFormData: this.updateInfoSecurityFormData,
            showErrorInfoSecurity: this.state.showErrorInfoSecurity,
            generalError: this.state.generalError,
            submitError: this.state.submitError,
            handleInfoSecurityValidity: this.handleInfoSecurityValidity,
            securityInfoData: this.state.securityInfoFormData,
            // updateMTA: this.updateMTA,
            removeErrorMessage: this.removeErrorMessage,
          })
        ])
      ])
    )
  }
});

export default LoadingWrapper(LinkWizard);
