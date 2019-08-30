import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { h, div } from 'react-hyperscript-helpers';
import { NewConsentGroupGeneralData } from './NewConsentGroupGeneralData';
import { Files, ConsentGroup, SampleCollections, User } from '../util/ajax';
import { spinnerService } from '../util/spinner-service';
import { Spinner } from "../components/Spinner";
import { isEmpty } from "../util/Utils";
import { CONSENT_DOCUMENTS } from '../util/DocumentType';
import { NewLinkCohortData } from './NewLinkCohortData';

const LAST_STEP = 1;
const CONSENT_SPINNER = 'consentSpinner';

class NewConsentGroup extends Component {

  _isMounted = false;

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
    this._isMounted = true;
    this.initDocuments();
    this.getUserSession();
    ConsentGroup.getConsentGroupNames().then(resp => {
      if (this._isMounted) {
        this.setState({ existingGroupNames: resp.data })
      }
    });

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
    spinnerService._unregister(CONSENT_SPINNER);
  }

  getUserSession() {
    User.getUserSession().then(resp => {
      if (this._isMounted) {
        this.setState({ user: resp.data })
      }
    });
  }

  submitNewConsentGroup = async () => {

    spinnerService.show(CONSENT_SPINNER);
    this.setState({ submitError: false });

    if (this.validateForm()) {
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
          // TODO: window.location.href is a temporal way to redirect the user to project's consent-group page tab. We need to change this after
          // transitioning from old gsps style is solved.
          window.location.href = [component.serverURL, "project", "main?projectKey=" + component.projectKey + "&tab=consent-groups&new"].join("/");
          spinnerService.hide(CONSENT_SPINNER);
        }).catch(error => {
        console.error(error);
        spinnerService.hide(CONSENT_SPINNER);
        this.toggleSubmitError();
        this.changeSubmitState();
      });
    } else {
      this.setState(prev => {
        prev.generalError = true;
        return prev;
      }, () => {
        spinnerService.hide(CONSENT_SPINNER);
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
    consentCollectionLink.projectKey = component.projectKey;
    consentCollectionLink.requireMta = this.state.linkFormData.requireMta;
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

    extraProperties.push({ name: 'source', value: component.projectKey });
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
      field === 'consentGroupName' || field === 'collaboratingInstitution' ||
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
            projectKey: component.projectKey,
            sampleCollectionList: this.state.sampleCollectionList,
            fileHandler: this.fileHandler,
            projectType: projectType,
            options: this.state.documentOptions,
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
            updateInfoSecurityFormData: this.updateInfoSecurityFormData,
            showErrorInfoSecurity: this.state.showErrorInfoSecurity,
            generalError: this.state.generalError,
            submitError: this.state.submitError,
            handleInfoSecurityValidity: this.handleInfoSecurityValidity,
            securityInfoData: this.state.securityInfoFormData,
            updateMTA: this.updateMTA
          })
        ]),
        h(Spinner, {
          name: CONSENT_SPINNER, group: "orsp", loadingImage: component.loadingImage
        })
      ])
    );
  }
}

export default NewConsentGroup;
