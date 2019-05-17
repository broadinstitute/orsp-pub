import { Component } from 'react';
import { h1, hh, p } from 'react-hyperscript-helpers';
import { Wizard } from "../components/Wizard";
import { SelectSampleConsent } from "./SelectSampleConsent";
import { SampleConsentLinkQuestions } from "./SampleConsentLinkQuestions";
import { User, ConsentGroup, SampleCollections } from "../util/ajax";
import { DOCUMENT_TYPE } from '../util/DocumentType';
import { isEmpty } from "../util/Utils";

const LAST_STEP = 1;

export const SampleConsentLinkWizard = hh( class SampleConsentLinkWizard extends Component {
  state = {};

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      user: {
        displayName: '',
        userName: '',
        emailAddress: ''
      },
      errors: {
        sampleCollection: false,
        consentGroup: false,
        internationalCohortsError: {
        },
        security: {
        },
        requireMta: false
      },
      generalError: false,
      formSubmitted: false,
      currentStep: 0,
      consentGroup: {},
      sampleCollections: {},
      internationalCohorts: {},
      security: {},
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
    this.initDocuments();
    this.getUserSession();
    this.getConsentGroups();
    this.getSampleCollections();
  }

  getSampleCollections = () => {
    SampleCollections.getSampleCollections(this.props.sampleSearchUrl).then(
      resp => {
        const sampleCollectionsList = resp.data.map(item => {
          return {
            key: item.id,
            value: item.collectionId,
            label: item.collectionId + ": " + item.name + " ( " + item.category + " )"
          };
        });
        this.setState({ sampleCollectionList: sampleCollectionsList })
      }
    );
  };

  getConsentGroups = () => {
    ConsentGroup.getConsentGroupNames(this.props.getConsentGroups).then(
      resp => {
        const existingConsentGroups = resp.data.map(item => {
          return {
            key: item.id,
            value: item.label,
            label: item.label
          }
        });
        this.setState({ existingConsentGroups: existingConsentGroups });
      });
  };

  getUserSession() {
    User.getUserSession(this.props.getUserUrl).then(
      resp => this.setState({ user: resp.data })
    )
  }

  initDocuments() {
    let documents = [];
    DOCUMENT_TYPE.forEach(type => {
      documents.push({ value: type, label: type });
    });

    this.setState({
      documentOptions: documents
    });
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
    if (this.state.linkFormData.requireMta === undefined || this.state.linkFormData.requireMta === '') {
      isValid = false;
    }
    this.setState(prev => {
      prev.errors.requireMta = !isValid;
      return prev;
    });
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

  componentDidCatch(error, info) {
    console.log('----------------------- new consent group error ----------------------');
    console.log(error, info);
  }

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

  submitLink = () => {
    console.log('sumit new link');
  };

  isValid = (field) => {
    let valid = true;
    if (this.state.currentStep === 0) {
      valid = this.validateStep1(field)
    }
    return valid;
  };

  validateStep1 = (field) => {
    let sampleCollection = false;
    let consentGroup = false;

    let isValid = true;

    if (isEmpty(this.state.consentGroup)) {
      consentGroup = true;
      isValid = false;
    }

    if (isEmpty(this.state.sampleCollections)) {
      sampleCollection = true;
      isValid = false;
    }

    // if (field === )
    console.log(field);
    this.setState(prev => {
      prev.errors.sampleCollection = sampleCollection;
      prev.errors.consentGroup = consentGroup;
      return prev;
    });
    return isValid;
  };

  updateGeneralForm = (updatedForm, field) => {
    if (this.state.currentStep === 0) {
      this.validateStep1(field);
    }
    this.setState(prev => {
      prev[field] = updatedForm;
      return prev;
    }, () => this.isValid(field));
  };

  render() {
    const { currentStep } = this.state;
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }
    return (
      Wizard({
        title: "Sample Collection Link to Data Cohort",
        note: "",
        stepChanged: this.stepChanged,
        isValid: this.isValid,
        submitHandler: this.submitLink,
        showSubmit: this.showSubmit,
        disabledSubmit: this.state.formSubmitted,
        loadingImage: this.props.loadingImage,
      }, [
        SelectSampleConsent({
          title: "Link Samples / Data Cohorts",
          consentNamesSearchURL: this.props.consentNamesSearchURL,
          sampleSearchUrl: this.props.sampleSearchUrl,
          removeErrorMessage: this.removeErrorMessage,
          sampleCollectionList: this.state.sampleCollectionList,
          sampleCollections: this.state.sampleCollections,
          errors: this.state.errors,
          fileHandler: this.fileHandler,
          files: this.state.files,
          currentStep: currentStep,
          existingConsentGroups: this.state.existingConsentGroups,
          consentGroup: this.state.consentGroup,
          updateForm: this.updateGeneralForm,
          options: this.state.documentOptions,
        }),
        SampleConsentLinkQuestions({
          title: "Security, International Cohort and MTA",
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
          updateMTA: this.updateMTA,
          removeErrorMessage: this.removeErrorMessage,
        })
      ])
    );
  }
});

