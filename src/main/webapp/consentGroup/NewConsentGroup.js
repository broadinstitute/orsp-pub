import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { div, hh } from 'react-hyperscript-helpers';
import { NewConsentGroupGeneralData } from './NewConsentGroupGeneralData';
import { ConsentGroup, Files, SampleCollections, User } from '../util/ajax';
import { CONSENT_DOCUMENTS } from '../util/DocumentType';
import { NewLinkCohortData } from './NewLinkCohortData';
import * as qs from 'query-string';
import LoadingWrapper from '../components/LoadingWrapper';
import defaultTo from 'lodash/defaultTo';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

const LAST_STEP = 1;
const NEXT_INDICATOR = 0;
const NewConsentGroup = hh(class NewConsentGroup extends Component {

  _isMounted = false;
  projectKey = '';

  constructor(props) {
    super(props);
    const params = new URLSearchParams(this.props.location.search);
    this.projectKey = defaultTo(params.get('projectKey'), component.projectKey);
    this.state = {
      user: {
        displayName: '',
        userName: ''
      },
      documentOptions: [],
      showInternationalCohortsError: false,
      showErrorInfoSecurity: false,
      isInfoSecurityValid: false,
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
      generalDataFormData: {
        noConsentFormReason: ''
      },
      securityInfoFormData: {},
      linkFormData: {},
      currentStep: 0,
      files: [],
      isConsentFormPresent: false,
      errors: {
        investigatorLastName: false,
        institutionProtocolNumber: false,
        consentGroupName: false,
        collaboratingInstitution: false,
        requireMta: false,
        institutionalSourcesCountry: false,
        pii: false,
        compliance: false,
        sharingType: false,
        textCompliance: false,
        noConsentFormReason: false
      }
    };
    this.updateGeneralDataFormData = this.updateGeneralDataFormData.bind(this);
    this.updateInfoSecurityFormData = this.updateInfoSecurityFormData.bind(this);
    this.isValid = this.isValid.bind(this);
    this.removeErrorMessage = this.removeErrorMessage.bind(this);
    this.downloadFillablePDF = this.downloadFillablePDF.bind(this);
    this.submitNewConsentGroup = this.submitNewConsentGroup.bind(this);
    this.handleInfoSecurityValidity = this.handleInfoSecurityValidity.bind(this);
    this.updateMTA = this.updateMTA.bind(this);
    this.isConsentFormUploaded = this.isConsentFormUploaded.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.initDocuments();
    this.getUserSession();

    SampleCollections.getSampleCollections().then(
      resp => {
        const sampleCollections = resp.data.map(item => {
          return {
            key: item.id,
            value: item.collectionId,
            label: item.collectionId + ": " + item.name + " ( " + item.category + " )"
          };
        });
        if (this._isMounted) {
          this.setState({ sampleCollectionList: sampleCollections })
        }
      }
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getUserSession() {
    User.getUserSession().then(resp => {
      if (this._isMounted) {
        this.setState({ user: resp.data })
      }
    });
  }

  submitNewConsentGroup = async () => {

    this.props.showSpinner();
    this.setState({ submitError: false });

    if (await this.validateForm()) {
      this.removeErrorMessage();
      this.changeSubmitState();
      let consentGroup = this.getConsentGroup();
      ConsentGroup.create(
        consentGroup,
        this.getConsentCollectionData(consentGroup.samples),
        this.state.files,
        this.state.user.displayName,
        this.state.user.userName)
        .then(resp => {
          this.props.history.push('/project/main?projectKey=' + qs.parse(this.props.location.search).projectKey + '&tab=consent-groups&new');
          this.props.hideSpinner()
        }).catch(error => {
        console.error(error);
        this.props.hideSpinner();
        this.toggleSubmitError();
        this.changeSubmitState();
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

  getConsentCollectionData(samples) {
    let sampleCollectionId = null;
    if (samples !== null && samples.length > 0) {
      // samples will be only one
      sampleCollectionId = samples[0];
    }
    let consentCollectionLink = {};
    // consent collection link info
    consentCollectionLink.sampleCollectionId = sampleCollectionId;
    consentCollectionLink.projectKey = this.projectKey;
    consentCollectionLink.requireMta = this.state.linkFormData.requireMta || null;
    consentCollectionLink.startDate = this.parseDate(this.state.generalDataFormData.startDate);
    consentCollectionLink.onGoingProcess = this.state.generalDataFormData.onGoingProcess ;
    if (this.state.generalDataFormData.endDate !== null) {
      consentCollectionLink.endDate = this.state.generalDataFormData.endDate;
    }
    // security
    consentCollectionLink.pii = this.state.securityInfoFormData.pii == "true" ? true : false;
    consentCollectionLink.compliance = this.state.securityInfoFormData.compliance;
    consentCollectionLink.textCompliance = isEmpty(this.state.securityInfoFormData.textCompliance) ? null : this.state.securityInfoFormData.textCompliance;
    consentCollectionLink.sharingType = this.state.securityInfoFormData.sharingType;
    consentCollectionLink.textSharingType = isEmpty(this.state.securityInfoFormData.textSharingType) ? null : this.state.securityInfoFormData.textSharingType;
    consentCollectionLink.status = "Pending";
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
    // International cohorts
    let questions = this.state.determination.questions;
    if (questions !== null && questions.length > 1) {
      let cohortsForm = [];
      questions.map((q, idx) => {
        if (q.answer !== null) {
          cohortsForm.push({ name: q.key, value: q.answer });
        }
      });
      // consentCollectionLink.internationalCohorts = JSON.stringify(cohortsForm);
      consentCollectionLink.internationalCohorts = null;
    }
    return consentCollectionLink;
  }

  getConsentGroup() {
    // step 1
    let consentGroup = {};
    consentGroup.summary = this.state.generalDataFormData.consentGroupName;
    consentGroup.reporter = this.state.user.userName;
    consentGroup.samples = this.getSampleCollections();
    let extraProperties = [];

    extraProperties.push({ name: 'source', value: this.projectKey });
    extraProperties.push({ name: 'collInst', value: this.state.generalDataFormData.collaboratingInstitution });
    extraProperties.push({ name: 'collContact', value: this.state.generalDataFormData.primaryContact });
    extraProperties.push({ name: 'consent', value: this.state.generalDataFormData.investigatorLastName });
    extraProperties.push({ name: 'protocol', value: this.state.generalDataFormData.institutionProtocolNumber });
    extraProperties.push({ name: 'institutionalSources', value: JSON.stringify(this.state.generalDataFormData.institutionalSources) });
    extraProperties.push({ name: 'noConsentFormReason', value: this.state.generalDataFormData.noConsentFormReason });

    consentGroup.extraProperties = extraProperties;
    return consentGroup;

  }

  getSampleCollections() {
    let sampleCollections = this.state.generalDataFormData.sampleCollections;
    let sampleCollectionList = [];
    if (sampleCollections !== null && sampleCollections.length > 0) {
      sampleCollections.map((sc, idx) => {
        sampleCollectionList.push(sc.value);
      });
    }
    return sampleCollectionList;
  }

  stepChanged = (newStep) => {
    this.setState({
      currentStep: newStep
    });
  };

  showSubmit = (currentStep) => {
    let renderSubmit = false;
    if (currentStep === LAST_STEP) {
      renderSubmit = true;
    }
    return renderSubmit;
  };

  isValid = async (field) => {
    let isValid = true;
    if (this.state.currentStep === 0) {
      isValid = await this.validateGeneralData(field);
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

  async validateForm() {
    let isGeneralDataValid = await this.validateGeneralData();
    let isInternationalCohortsValid = this.validateInternationalCohorts();
    let isInfoSecurityValid = this.validateInfoSecurity();
    let isMTAValid = this.validateMTA();
    return isGeneralDataValid && isInternationalCohortsValid && isInfoSecurityValid && isMTAValid;
  }

  async consentGroupNameExists() {
    return !isEmpty(this.state.generalDataFormData.consentGroupName)
      ? get(await ConsentGroup.getMatchingConsentByName(this.state.generalDataFormData.consentGroupName), 'data', false)
      : false;
  }

  isConsentFormUploaded() {
    let isConsentFormUploaded = false;
    if (this.state.files !== null && this.state.files.length > 0 &&
      this.state.files.filter(file => file.fileKey === 'Consent Document').length > 0) {
      isConsentFormUploaded = true;
    }
    this.setState(prev => {
      prev.isConsentFormPresent = isConsentFormUploaded;
      if (isConsentFormUploaded) {
        prev.generalDataFormData.noConsentFormReason = '';
        prev.errors.noConsentFormReason = false;
      }
      return prev;
    });
    return isConsentFormUploaded;
  }

  async validateGeneralData(field) {
    let investigatorLastName = false;
    let institutionProtocolNumber = false;
    let consentGroupName = false;
    let collaboratingInstitution = false;
    let institutionalSourcesCountry = false;
    let noConsentFormReason = false;
    let isValid = true;

    if (!this.state.isConsentFormPresent && isEmpty(this.state.generalDataFormData.noConsentFormReason)) {
      noConsentFormReason = true;
      isValid = false;
    }
    if ((field === "consentGroupName" || field === NEXT_INDICATOR || field === undefined ) && await this.consentGroupNameExists()) {
      consentGroupName = true;
      isValid = false;
    }
    if (isEmpty(this.state.generalDataFormData.investigatorLastName)) {
      investigatorLastName = true;
      isValid = false;
    }
    if (isEmpty(this.state.generalDataFormData.institutionProtocolNumber)) {
      institutionProtocolNumber = true;
      isValid = false;
    }
    if (isEmpty(this.state.generalDataFormData.collaboratingInstitution)) {
      collaboratingInstitution = true;
      isValid = false;
    }
    if (this.state.generalDataFormData.institutionalSources === undefined) {
      institutionalSourcesCountry = true;
      isValid = false;
    } else {
      this.state.generalDataFormData.institutionalSources.forEach(institutionalSource => {
        if (isEmpty(institutionalSource.country)) {
          institutionalSourcesCountry = true;
          isValid = false;
        }
      });
    }

    if (field === undefined || field === null || field === 0) {
      this.setState(prev => {
        prev.errors.investigatorLastName = investigatorLastName;
        prev.errors.institutionProtocolNumber = institutionProtocolNumber;
        prev.errors.consentGroupName = consentGroupName;
        prev.errors.collaboratingInstitution = collaboratingInstitution;
        prev.errors.institutionalSourcesCountry = institutionalSourcesCountry;
        prev.errors.noConsentFormReason = noConsentFormReason;
        prev.errors.isValid = isValid;
        prev.generalError = isValid;
        return prev;
      });
    }

    else if (field === 'investigatorLastName' || field === 'institutionProtocolNumber' ||
      field === 'consentGroupName' || field === 'collaboratingInstitution' ||
      field === 'countryInstitutional' || field === 'noConsentFormReason') {

      this.setState(prev => {
        if (field === 'investigatorLastName') {
          prev.errors.investigatorLastName = investigatorLastName;
        } else if (field === 'institutionProtocolNumber') {
          prev.errors.institutionProtocolNumber = institutionProtocolNumber;
        } else if (field === 'consentGroupName') {
          prev.errors.consentGroupName = consentGroupName;
        } else if (field === 'collaboratingInstitution') {
          prev.errors.collaboratingInstitution = collaboratingInstitution;
        } else if (field === 'countryInstitutional') {
          prev.errors.institutionalSourcesCountry = institutionalSourcesCountry;
        } else if (field === 'noConsentFormReason') {
          prev.errors.noConsentFormReason = noConsentFormReason;
        }
        return prev;
      });
    }
    return isValid;
  }

  determinationHandler = (determination) => {
    this.setState(prev => {
      prev.determination = determination;
      if (this.state.determination.projectType !== null && this.state.showInternationalCohortsError === true) {
        prev.showInternationalCohortsError = false;
      }
      return prev;
    }, async () => {
      await this.isValid(null);
    })
  };

  handleInfoSecurityValidity(isValid) {
    this.setState({
      isInfoSecurityValid: isValid,
      showErrorInfoSecurity: !isValid
    })
  }

  fileHandler = (file) => {
    this.setState({
      files: file
    },() => this.isConsentFormUploaded());
  };

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

  validateInfoSecurity() {
    this.setState(prev => {
      prev.showErrorInfoSecurity = !this.state.isInfoSecurityValid;
      return prev;
    });
    return this.state.isInfoSecurityValid;
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  updateGeneralDataFormData = async (updatedForm, field) => {
    if (this.state.currentStep === 0) {
      await this.validateGeneralData(field);
    }
    this.setState(prev => {
      prev.generalDataFormData = updatedForm;
      return prev;
    }, async () => {
      await this.isValid(field);
    })
  };

  updateMTA = (updatedForm, field) => {
    this.setState(prev => {
      prev.linkFormData = updatedForm;
      return prev;
    }, async () => {
      await this.isValid(field);
    })
  };

  updateInfoSecurityFormData = (updatedForm) => {
    this.setState(prev => {
      prev.securityInfoFormData = updatedForm;
      return prev;
    }, async () => {
      await this.isValid(null);
    })
  };

  initDocuments() {
    let documents = [];
    CONSENT_DOCUMENTS.forEach(type => {
      documents.push({ value: type, label: type });
    });
    if (this._isMounted) {
      this.setState({
        documentOptions: documents
      });
    }
  }

  downloadFillablePDF = () => {
    Files.downloadFillable().then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Broad_DUL_Draft-Cover_Letter_Form_Fillable.pdf');
      document.body.appendChild(link);
      link.click();
    }).catch(error => {
      console.error(error);
    });
  };

  removeErrorMessage() {
    this.setState(prev => {
      prev.generalError = false;
      return prev;
    });
  }

  parseDate(date) {
    if (date !== null) {
      let d = new Date(date).toISOString();
      return d.slice(0, d.indexOf("T"));
    }
  }

  render() {

    const { currentStep, determination } = this.state;

    let projectType = determination.projectType;

    return (
      div({name: 'wizardContainer'},[
        Wizard({
          title: "New Sample/Data Cohort",
          note: "Please use this section to provide information about the data and/or samples you will receive.  Also upload any consent forms or associated documents.  If no consent form is available, please explain why this is the case.",
          stepChanged: this.stepChanged,
          isValid: this.isValid,
          showSubmit: this.showSubmit,
          submitHandler: this.submitNewConsentGroup,
          disabledSubmit: this.state.formSubmitted
        }, [
          NewConsentGroupGeneralData({
            title: "Sample/Data Cohort Info",
            currentStep: currentStep,
            user: this.state.user,
            updateForm: this.updateGeneralDataFormData,
            errors: this.state.errors,
            removeErrorMessage: this.removeErrorMessage,
            projectKey: this.projectKey,
            sampleCollectionList: this.state.sampleCollectionList,
            fileHandler: this.fileHandler,
            projectType: projectType,
            options: this.state.documentOptions,
            files: this.state.files,
            isConsentFormPresent: this.state.isConsentFormPresent
          }),
          /* Eliminated International Cohorts and MTA */
          NewLinkCohortData({
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
            // updateMTA: this.updateMTA
          })
        ])
      ])
    );
  }
});

export default LoadingWrapper(NewConsentGroup);
