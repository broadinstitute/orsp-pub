import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewConsentGroupDocuments } from './NewConsentGroupDocuments';
import { NewConsentGroupGeneralData } from './NewConsentGroupGeneralData';
import { InternationalCohorts } from '../components/InternationalCohorts';
import { span, a } from 'react-hyperscript-helpers';
import { Files, ConsentGroup, SampleCollections, User, Project } from '../util/ajax';
import { spinnerService } from '../util/spinner-service';
import { Security } from '../components/Security';
import { isEmpty } from "../util/Utils";
import { DOCUMENT_TYPE } from '../util/DocumentType';

const LAST_STEP = 3;

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
      showInfoSecurityError: false,
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
      generalDataFormData: {},
      securityInfoFormData: {},
      currentStep: 0,
      files: [],
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
      }
    };

    this.updateGeneralDataFormData = this.updateGeneralDataFormData.bind(this);
    this.updateInfoSecurityFormData = this.updateInfoSecurityFormData.bind(this);
    this.isValid = this.isValid.bind(this);
    this.removeErrorMessage = this.removeErrorMessage.bind(this);
    this.downloadFillablePDF = this.downloadFillablePDF.bind(this);
    this.submitNewConsentGroup = this.submitNewConsentGroup.bind(this);
    this.handleInfoSecurityValidity = this.handleInfoSecurityValidity.bind(this);
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
      ConsentGroup.create(
        this.props.createConsentGroupURL,
        this.getConsentGroup(),
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
    extraProperties.push({ name: 'requireMta', value: this.state.generalDataFormData.requireMta });
    if (this.state.generalDataFormData.endDate !== null) {
      extraProperties.push({ name: 'endDate', value: this.parseDate(this.state.generalDataFormData.endDate) });
    }
    // step 3
    let questions = this.state.determination.questions;
    if (questions !== null && questions.length > 1) {
      questions.map((q, idx) => {
        if (q.answer !== null) {
          extraProperties.push({ name: q.key, value: q.answer });
        }
      });
    }
    // step 4
    extraProperties.push({ name: 'pii', value: this.state.securityInfoFormData.pii });
    extraProperties.push({ name: 'compliance', value: this.state.securityInfoFormData.compliance });
    extraProperties.push({ name: 'textCompliance', value: this.state.securityInfoFormData.textCompliance });
    extraProperties.push({ name: 'sharingType', value: this.state.securityInfoFormData.sharingType });
    extraProperties.push({ name: 'textSharingType', value: this.state.securityInfoFormData.textSharingType });

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
    } else if (this.state.currentStep === 2) {
      isValid = this.validateInternationalCohorts();
    } else if (this.state.currentStep === LAST_STEP) {
      isValid = this.validateInfoSecurity();
    }
    return isValid;
  };

  validateForm() {
    let isGeneralDataValid = this.validateGeneralData();
    let isInternationalCohortsValid = this.validateInternationalCohorts();
    let isInfoSecurityValid = this.validateInfoSecurity();
    return isGeneralDataValid && isInternationalCohortsValid && isInfoSecurityValid;
  }

  consentGroupNameExists() {
    if (this.state.existingGroupNames !== undefined) {
      return this.state.existingGroupNames.indexOf(this.state.generalDataFormData.consentGroupName) > -1;
    }
  }

  validateGeneralData(field) {
    let investigatorLastName = false;
    let institutionProtocolNumber = false;
    let consentGroupName = false;
    let collaboratingInstitution = false;
    let describeConsentGroup = false;
    let requireMta = false;
    let institutionalSourcesName = false;
    let institutionalSourcesCountry = false;

    let isValid = true;
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
    if (this.state.generalDataFormData.requireMta === undefined || this.state.generalDataFormData.requireMta === '') {
      requireMta = true;
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
        prev.errors.requireMta = requireMta;
        prev.errors.institutionalSourcesName = institutionalSourcesName;
        prev.errors.institutionalSourcesCountry = institutionalSourcesCountry;
        prev.errors.isValid = isValid;
        return prev;
      });
    }

    else if (field === 'investigatorLastName' || field === 'institutionProtocolNumber' ||
      field === 'consentGroupName' || field === 'collaboratingInstitution' || field === 'describeConsentGroup' ||
      field === 'requireMta' || field === 'nameInstitutional' || field === 'countryInstitutional') {

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
        } else if (field === 'requireMta') {
          prev.errors.requireMta = requireMta;
        } else if (field === 'nameInstitutional') {
          prev.errors.institutionalSourcesName = institutionalSourcesName;
        } else if (field === 'countryInstitutional') {
          prev.errors.institutionalSourcesCountry = institutionalSourcesCountry;
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
        prev.generalError = false;
      }
      return prev;
    });
  };

  handleInfoSecurityValidity(isValid) {
    this.setState({ isInfoSecurityValid: isValid })
  }

  componentDidCatch(error, info) {
    console.log('----------------------- new consent group error ----------------------')
    console.log(error, info);
  }

  fileHandler = (file) => {
    this.setState({
      files: file
    });
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
      prev.showInfoSecurityError = !this.state.isInfoSecurityValid;
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

  updateInfoSecurityFormData = (updatedForm) => {
    this.setState(prev => {
      prev.securityInfoFormData = updatedForm;
      return prev;
    })
  };

  initDocuments() {
    let documents = [];
    DOCUMENT_TYPE.forEach(type => {
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
        title: "New Consent Group",
        note: "Note that this application cannot be saved and returned to for completion later. However, allowing the page to remain open in your browser will permit you to return to the application at any time.",
        stepChanged: this.stepChanged,
        isValid: this.isValid,
        showSubmit: this.showSubmit,
        submitHandler: this.submitNewConsentGroup,
        disabledSubmit: this.state.formSubmitted,
        loadingImage: this.props.loadingImage
      }, [
        NewConsentGroupGeneralData({
          title: "General Data",
          currentStep: currentStep,
          user: this.state.user,
          sampleSearchUrl: this.props.sampleSearchUrl,
          updateForm: this.updateGeneralDataFormData,
          errors: this.state.errors,
          removeErrorMessage: this.removeErrorMessage,
          projectKey: this.props.projectKey,
          sampleCollectionList: this.state.sampleCollectionList
        }),
        NewConsentGroupDocuments({
          title: "Documents",
          currentStep: currentStep,
          projectType: projectType,
          options: this.state.documentOptions,
          fillablePdfURL: this.props.fillablePdfURL,
          fileHandler: this.fileHandler,
          files: this.state.files
        }),
        InternationalCohorts({
          title: "International Cohorts",
          currentStep: currentStep,
          handler: this.determinationHandler,
          determination: this.state.determination,
          showErrorIntCohorts: this.state.showInternationalCohortsError,
          origin: 'consentGroup'
        }),
        Security({
          title: "Security",
          step: LAST_STEP,
          currentStep: currentStep,
          user: this.state.user,
          searchUsersURL: this.props.searchUsersURL,
          updateForm: this.updateInfoSecurityFormData,
          showErrorInfoSecurity: this.state.showInfoSecurityError,
          generalError: this.state.generalError,
          submitError: this.state.submitError,
          removeErrorMessage: this.removeErrorMessage,
          handleSecurityValidity: this.handleInfoSecurityValidity,
          currentValue: this.state,
          edit: false,
          review: false,
          readOnly: false
        })
      ])
    );
  }
}

export default NewConsentGroup;
