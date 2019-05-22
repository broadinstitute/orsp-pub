import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewConsentGroupGeneralData } from './NewConsentGroupGeneralData';
import { Files, ConsentGroup, SampleCollections, User, Project } from '../util/ajax';
import { spinnerService } from '../util/spinner-service';
import { isEmpty } from "../util/Utils";
import { CONSENT_DOCUMENTS } from '../util/DocumentType';
import { NewLinkCohortData } from './NewLinkCohortData';

const LAST_STEP = 1;

class NewConsentGroup extends Component {

  constructor(props) {
    super(props);
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
        describeConsentGroup: false,
        requireMta: false,
        institutionalSourcesName: false,
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
    this.initDocuments();
    this.getUserSession();
    ConsentGroup.getConsentGroupNames(this.props.consentNamesSearchURL).then(
      resp => this.setState({ existingGroupNames: resp.data }));

    SampleCollections.getSampleCollections(this.props.sampleSearchUrl).then(
      resp => {
        const sampleCollections = resp.data.map(item => {
          return {
            key: item.id,
            value: item.collectionId,
            label: item.collectionId + ": " + item.name + " ( " + item.category + " )"
          };
        });
        this.setState({ sampleCollectionList: sampleCollections })
      }
    );
  }

  getUserSession() {
    User.getUserSession(this.props.getUserUrl).then(
      resp => this.setState({ user: resp.data })
    )
  }

  submitNewConsentGroup = async () => {

    spinnerService.showAll();
    this.setState({ submitError: false });

    if (this.validateForm()) {
      let projectType = await Project.getProjectType(this.props.serverURL, this.props.projectKey);
      this.removeErrorMessage();
      this.changeSubmitState();
      let consentGroup = this.getConsentGroup();
      ConsentGroup.create(
        this.props.createConsentGroupURL,
        consentGroup,
        this.getConsentCollectionData(consentGroup.samples),
        this.state.files,
        this.state.user.displayName,
        this.state.user.userName)
        .then(resp => {
          // TODO: window.location.href is a temporal way to redirect the user to project's consent-group page tab. We need to change this after
          // transitioning from old gsps style is solved.
          window.location.href = [this.props.serverURL, projectType, "show", this.props.projectKey, "?tab=consent-groups&new"].join("/");
          spinnerService.hideAll();
        }).catch(error => {
        console.error(error);
        spinnerService.hideAll();
        this.toggleSubmitError();
        this.changeSubmitState();
      });
    } else {
      this.setState(prev => {
        prev.generalError = true;
        return prev;
      }, () => {
        spinnerService.hideAll();
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
    consentCollectionLink.projectKey = this.props.projectKey;
    consentCollectionLink.requireMta = this.state.linkFormData.requireMta;
    // security
    consentCollectionLink.pii = this.state.securityInfoFormData.pii == "true" ? true : false;
    consentCollectionLink.compliance = this.state.securityInfoFormData.compliance;
    consentCollectionLink.textCompliance = isEmpty(this.state.securityInfoFormData.textCompliance) ? null : this.state.securityInfoFormData.textCompliance;
    consentCollectionLink.sharingType = this.state.securityInfoFormData.sharingType;
    consentCollectionLink.textSharingType = isEmpty(this.state.securityInfoFormData.textSharingType) ? null : this.state.securityInfoFormData.textSharingType;
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
  }

  getConsentGroup() {
    // step 1
    let consentGroup = {};
    consentGroup.summary = this.state.generalDataFormData.consentGroupName;
    consentGroup.reporter = this.state.user.userName;
    consentGroup.samples = this.getSampleCollections();
    let extraProperties = [];
    extraProperties.push({ name: 'startDate', value: this.parseDate(this.state.generalDataFormData.startDate) });
    extraProperties.push({ name: 'onGoingProcess', value: this.state.generalDataFormData.onGoingProcess });
    extraProperties.push({ name: 'source', value: this.props.projectKey });
    extraProperties.push({ name: 'collInst', value: this.state.generalDataFormData.collaboratingInstitution });
    extraProperties.push({ name: 'collContact', value: this.state.generalDataFormData.primaryContact });
    extraProperties.push({ name: 'consent', value: this.state.generalDataFormData.investigatorLastName });
    extraProperties.push({ name: 'protocol', value: this.state.generalDataFormData.institutionProtocolNumber });
    extraProperties.push({ name: 'institutionalSources', value: JSON.stringify(this.state.generalDataFormData.institutionalSources) });
    extraProperties.push({ name: 'describeConsentGroup', value: this.state.generalDataFormData.describeConsentGroup });
    extraProperties.push({ name: 'noConsentFormReason', value: this.state.generalDataFormData.noConsentFormReason });
    if (this.state.generalDataFormData.endDate !== null) {
      extraProperties.push({ name: 'endDate', value: this.parseDate(this.state.generalDataFormData.endDate) });
    }
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

  isValid = (field) => {
    let isValid = true;
    if (this.state.currentStep === 0) {
      isValid = this.validateGeneralData(field);
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
    if (this.state.linkFormData.requireMta === undefined || this.state.linkFormData.requireMta === '') {
      isValid = false;
    }
    this.setState(prev => {
      prev.errors.requireMta = !isValid;
      return prev;
    });
    return isValid
  }

  validateForm() {
    let isGeneralDataValid = this.validateGeneralData();
    let isInternationalCohortsValid = this.validateInternationalCohorts();
    let isInfoSecurityValid = this.validateInfoSecurity();
    let isMTAValid = this.validateMTA();
    return isGeneralDataValid && isInternationalCohortsValid && isInfoSecurityValid && isMTAValid;
  }

  consentGroupNameExists() {
    if (this.state.existingGroupNames !== undefined) {
      return this.state.existingGroupNames.indexOf(this.state.generalDataFormData.consentGroupName) > -1;
    }
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

  validateGeneralData(field) {
    let investigatorLastName = false;
    let institutionProtocolNumber = false;
    let consentGroupName = false;
    let collaboratingInstitution = false;
    let describeConsentGroup = false;
    let institutionalSourcesName = false;
    let institutionalSourcesCountry = false;
    let noConsentFormReason = false;
    let isValid = true;
    
    if (!this.state.isConsentFormPresent && isEmpty(this.state.generalDataFormData.noConsentFormReason)) {
      noConsentFormReason = true;
      isValid = false;
    }
    if (field === "consentGroupName" && this.consentGroupNameExists()) {
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
    if (isEmpty(this.state.generalDataFormData.describeConsentGroup)) {
      describeConsentGroup = true;
      isValid = false;
    }
    if (this.state.generalDataFormData.institutionalSources === undefined) {
      institutionalSourcesName = true;
      institutionalSourcesCountry = true;
      isValid = false;
    } else {
      this.state.generalDataFormData.institutionalSources.forEach(institutionalSource => {
        if (isEmpty(institutionalSource.name)) {
          institutionalSourcesName = true;
          isValid = false;
        }
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
        prev.errors.describeConsentGroup = describeConsentGroup;
        prev.errors.institutionalSourcesName = institutionalSourcesName;
        prev.errors.institutionalSourcesCountry = institutionalSourcesCountry;
        prev.errors.noConsentFormReason = noConsentFormReason;
        prev.errors.isValid = isValid;
        if (isValid) {
          prev.generalError = false;
        }
        return prev;
      });
    }

    else if (field === 'investigatorLastName' || field === 'institutionProtocolNumber' ||
      field === 'consentGroupName' || field === 'collaboratingInstitution' || field === 'describeConsentGroup' ||
      field === 'nameInstitutional' || field === 'countryInstitutional' || field === 'noConsentFormReason') {

      this.setState(prev => {
        if (field === 'investigatorLastName') {
          prev.errors.investigatorLastName = investigatorLastName;
        } else if (field === 'institutionProtocolNumber') {
          prev.errors.institutionProtocolNumber = institutionProtocolNumber;
        } else if (field === 'consentGroupName') {
          prev.errors.consentGroupName = consentGroupName;
        } else if (field === 'collaboratingInstitution') {
          prev.errors.collaboratingInstitution = collaboratingInstitution;
        } else if (field === 'describeConsentGroup') {
          prev.errors.describeConsentGroup = describeConsentGroup;
        } else if (field === 'nameInstitutional') {
          prev.errors.institutionalSourcesName = institutionalSourcesName;
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
    }, () => {
      this.isValid(null);
    })
  };

  handleInfoSecurityValidity(isValid) {
    this.setState(prev => { 
      prev.isInfoSecurityValid = isValid;
      prev.showErrorInfoSecurity = !isValid;
      return prev; 
    })
  }

  componentDidCatch(error, info) {
    console.log('----------------------- new consent group error ----------------------')
    console.log(error, info);
  }

  fileHandler = (file) => {
    this.setState({
      files: file
    },() => this.isConsentFormUploaded());
  };

  validateInternationalCohorts() {
    let isValid = true;
    if (this.state.determination.requiredError || this.state.determination.endState === false) {
      isValid = false;
    }
    this.setState(prev => {
      prev.showInternationalCohortsError = !isValid;
      return prev;
    });
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

  updateGeneralDataFormData = (updatedForm, field) => {
    if (this.state.currentStep === 0) {
      this.validateGeneralData(field);
    }
    this.setState(prev => {
      prev.generalDataFormData = updatedForm;
      return prev;
    }, () => {
      this.isValid(field);
    })
  };

  updateMTA = (updatedForm, field) => {
    this.setState(prev => {
      prev.linkFormData = updatedForm;
      return prev;
    }, () => {
      this.isValid(field);
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

  initDocuments() {
    let documents = [];
    CONSENT_DOCUMENTS.forEach(type => {
      documents.push({ value: type, label: type });
    });
    this.setState({
      documentOptions: documents
    });
  }

  downloadFillablePDF = () => {
    Files.downloadFillable(this.props.fillablePdfURL).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Broad_DUL_Draft-Cover_Letter_Form_Fillable.pdf');
      document.body.appendChild(link);
      link.click();
    }).catch(error => {
      console.error(error);
    });
  }

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
      Wizard({
        title: "New Sample/Data Cohort",
        note: "Please use this section to provide information about the data and/or samples you will receive.  Also upload any consent forms or associated documents.  If no consent form is available, please explain why this is the case.",
        stepChanged: this.stepChanged,
        isValid: this.isValid,
        showSubmit: this.showSubmit,
        submitHandler: this.submitNewConsentGroup,
        disabledSubmit: this.state.formSubmitted,
        loadingImage: this.props.loadingImage
      }, [
          NewConsentGroupGeneralData({
            title: "Sample/Data Cohort Info",
            currentStep: currentStep,
            user: this.state.user,
            sampleSearchUrl: this.props.sampleSearchUrl,
            updateForm: this.updateGeneralDataFormData,
            errors: this.state.errors,
            removeErrorMessage: this.removeErrorMessage,
            projectKey: this.props.projectKey,
            sampleCollectionList: this.state.sampleCollectionList,
            fileHandler: this.fileHandler,
            projectType: projectType,
            options: this.state.documentOptions,
            fillablePdfURL: this.props.fillablePdfURL,
            files: this.state.files,
            isConsentFormPresent: this.state.isConsentFormPresent
          }),
          NewLinkCohortData({
            title: "Security/MTA/International Info",
            currentStep: currentStep,
            handler: this.determinationHandler,
            determination: this.state.determination,
            showErrorIntCohorts: this.state.showInternationalCohortsError,
            origin: 'consentGroup',
            requireMta: this.state.linkFormData.requireMta,
            errors: this.state.errors,
            user: this.state.user,
            searchUsersURL: this.props.searchUsersURL,
            updateInfoSecurityFormData: this.updateInfoSecurityFormData,
            showErrorInfoSecurity: this.state.showErrorInfoSecurity,
            generalError: this.state.generalError,
            submitError: this.state.submitError,
            handleInfoSecurityValidity: this.handleInfoSecurityValidity,
            securityInfoData: this.state.securityInfoFormData,
            updateMTA: this.updateMTA
          })
        ])
    );
  }
}

export default NewConsentGroup;
