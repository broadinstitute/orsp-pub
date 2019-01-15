import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewConsentGroupDataSharing } from './NewConsentGroupDataSharing';
import { NewConsentGroupDocuments } from './NewConsentGroupDocuments';
import { NewConsentGroupGeneralData } from './NewConsentGroupGeneralData';
import { NewConsentGroupIntCohorts } from './NewConsentGroupIntCohorts';
import { NewConsentGroupSecurity } from './NewConsentGroupSecurity';
import { span, a } from 'react-hyperscript-helpers';
import { Files, ConsentGroup, SampleCollections } from "../util/ajax";
import { spinnerService } from "../util/spinner-service";

class NewConsentGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showErrorStep3: false,
      generalError: false,
      formSubmitted: false,
      submitError: false,
      determination: {
        projectType: 900,
        questions: [],
        requiredError: false,
        currentQuestionIndex: 0,
        nextQuestionIndex: 1,
        endState: false
      },
      step1FormData: {},
      step4FormData: {},
      step5FormData: {},
      currentStep: 0,
      files: [],
      errors: {
        investigatorLastName: false,
        institutionProtocolNumber: false,
        consentGroupName: false,
        collaboratingInstitution: false,
        sampleCollections: false,
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
      }
    };

    this.updateStep1FormData = this.updateStep1FormData.bind(this);
    this.updateStep4FormData = this.updateStep4FormData.bind(this);
    this.updateStep5FormData = this.updateStep5FormData.bind(this);
    this.isValid = this.isValid.bind(this);
    this.removeErrorMessage = this.removeErrorMessage.bind(this);
    this.downloadFillablePDF = this.downloadFillablePDF.bind(this);
    this.submitNewConsentGroup = this.submitNewConsentGroup.bind(this);
    this.uploadFiles = this.uploadFiles.bind(this);
  }

  componentDidMount() {
    this.initDocuments();
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
        })
        this.setState({ sampleCollectionList: sampleCollections })
      }
    );
  }

  submitNewConsentGroup = () => {

    spinnerService.showAll();
    this.setState({submitError: false});

    if (this.validateStep1() && this.validateStep2() &&
      this.validateStep3() && this.validateStep4() && this.validateStep5()) {
      this.removeErrorMessage();

      this.changeSubmitState();
      ConsentGroup.create(this.props.createConsentGroupURL, this.getConsentGroup()).then(resp => {
        this.uploadFiles(resp.data.message.projectKey);
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

  uploadFiles = (projectKey) => {
    Files.upload(this.props.attachDocumentsURL, this.state.files, projectKey, this.props.user.displayName, this.props.user.userName)
      .then(resp => {
        window.location.href = this.getRedirectUrl(projectKey);
        spinnerService.hideAll();
        this.setState(prev => {
          prev.formSubmitted = true;
          return prev;
        });
      }).catch(error => {
        this.changeSubmitState();
        console.error(error);
        this.toggleSubmitError();
      });
  };

  toggleSubmitError = () => {
    this.setState(prev => {
      prev.submitError = true;
      prev.generalError = true;
      return prev;
    });
  };

  getConsentGroup() {
    // step 1
    let consentGroup = {};
    consentGroup.summary = this.state.step1FormData.consentGroupName;
    consentGroup.reporter = this.props.user.userName;
    consentGroup.samples = this.getSampleCollections();
    let extraProperties = [];
    extraProperties.push({ name: 'startDate', value: this.parseDate(this.state.step1FormData.startDate) });
    extraProperties.push({ name: 'onGoingProcess', value: this.state.step1FormData.onGoingProcess });
    extraProperties.push({ name: 'source', value: this.props.projectKey });
    extraProperties.push({ name: 'collInst', value: this.state.step1FormData.collaboratingInstitution });
    extraProperties.push({ name: 'collContact', value: this.state.step1FormData.primaryContact });
    extraProperties.push({ name: 'consent', value: this.state.step1FormData.investigatorLastName });
    extraProperties.push({ name: 'protocol', value: this.state.step1FormData.institutionProtocolNumber });
    extraProperties.push({ name: 'institutionalSources', value: JSON.stringify(this.state.step1FormData.institutionalSources) });
    extraProperties.push({ name: 'describeConsentGroup', value: this.state.step1FormData.describeConsentGroup });
    extraProperties.push({ name: 'requireMta', value: this.state.step1FormData.requireMta });
    if (this.state.step1FormData.endDate !== null) {
      extraProperties.push({ name: 'endDate', value: this.parseDate(this.state.step1FormData.endDate) });
    }
    // step 3
    let questions = this.state.determination.questions;
    if (questions !== null && questions.length > 1) {
     questions.map((q, idx) => {
        if (q.answer !== null) {
          extraProperties.push({name: q.key, value: q.answer});
        }
     });
    }
    // step 4
    extraProperties.push({ name: 'pii', value: this.state.step4FormData.pii });
    extraProperties.push({ name: 'compliance', value: this.state.step4FormData.compliance });
    extraProperties.push({ name: 'textCompliance', value: this.state.step4FormData.textCompliance });
    extraProperties.push({ name: 'sensitive', value: this.state.step4FormData.sensitive });
    extraProperties.push({ name: 'textSensitive', value: this.state.step4FormData.textSensitive });
    extraProperties.push({ name: 'accessible', value: this.state.step4FormData.accessible });
    extraProperties.push({ name: 'textAccessible', value: this.state.step4FormData.textAccessible });
    // step 5
    extraProperties.push({ name: 'sharingPlan', value: this.state.step5FormData.sharingPlan });
    extraProperties.push({ name: 'databaseControlled', value: this.state.step5FormData.databaseControlled });
    extraProperties.push({ name: 'databaseOpen', value: this.state.step5FormData.databaseOpen });
    consentGroup.extraProperties = extraProperties;
    return consentGroup;

  }

  getSampleCollections() {
    let sampleCollections = this.state.step1FormData.sampleCollections;
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
    if (currentStep === 4) {
      renderSubmit = true;
    }
    return renderSubmit;
  };

  getRedirectUrl() {
    let projectKey = this.props.projectKey.split("-");
    let projectType = '';
    if (projectKey.length === 3) {
      projectType = projectKey[1].toLowerCase();
    } else {
      projectType = projectKey[0].toLowerCase();
    }
    return [this.props.serverURL, projectType, "show", this.props.projectKey, "?tab=consent-groups"].join("/");
  }

  isValid = (field) => {
    let isValid = true;
    if (this.state.currentStep === 0) {
      isValid = this.validateStep1(field);
    } else if (this.state.currentStep === 1) {
      isValid = this.validateStep2();
    } else if (this.state.currentStep === 2) {
      isValid = this.validateStep3();
    } else if (this.state.currentStep === 3) {
      isValid = this.validateStep4(field);
    } else if (this.state.currentStep === 4) {
      isValid = this.validateStep5(field);
    }
    return isValid;
  };

  consentGroupNameExists() {
    return this.state.existingGroupNames.indexOf(this.state.step1FormData.consentGroupName) > -1;
  }

  validateStep1(field) {
    let investigatorLastName = false;
    let institutionProtocolNumber = false;
    let consentGroupName = false;
    let collaboratingInstitution = false;
    let sampleCollections = false;
    let describeConsentGroup = false;
    let requireMta = false;
    let institutionalSourcesName = false;
    let institutionalSourcesCountry = false;

    let isValid = true;
    if (field === "consentGroupName" && this.consentGroupNameExists()) {
      consentGroupName = true;
      isValid = false;
    }

    if (!this.isTextValid(this.state.step1FormData.investigatorLastName)) {
      investigatorLastName = true;
      isValid = false;
    }
    if (!this.isTextValid(this.state.step1FormData.institutionProtocolNumber)) {
      institutionProtocolNumber = true;
      isValid = false;
    }
    if (this.state.step1FormData.sampleCollections === undefined || !this.state.step1FormData.sampleCollections.length > 0) {
      sampleCollections = true;
      isValid = false;
    }
    if (this.state.step1FormData.requireMta === undefined || this.state.step1FormData.requireMta === '') {
      requireMta = true;
      isValid = false;
    }
    if (!this.isTextValid(this.state.step1FormData.collaboratingInstitution)) {
      collaboratingInstitution = true;
      isValid = false;
    }
    if (!this.isTextValid(this.state.step1FormData.describeConsentGroup)) {
      describeConsentGroup = true;
      isValid = false;
    }
    if (this.state.step1FormData.institutionalSources === undefined) {
      institutionalSourcesName = true;
      institutionalSourcesCountry = true;
      isValid = false;
    } else {
      this.state.step1FormData.institutionalSources.forEach(institutionalSource => {
        if (!this.isTextValid(institutionalSource.name)) {
          institutionalSourcesName = true;
          isValid = false;
        }
        if (!this.isTextValid(institutionalSource.country)) {
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
        prev.errors.sampleCollections = sampleCollections;
        prev.errors.describeConsentGroup = describeConsentGroup;
        prev.errors.requireMta = requireMta;
        prev.errors.institutionalSourcesName = institutionalSourcesName;
        prev.errors.institutionalSourcesCountry = institutionalSourcesCountry;
        prev.errors.isValid = isValid;
        return prev;
      });
    }

    else if (field === 'investigatorLastName' || field === 'institutionProtocolNumber' ||
      field === 'consentGroupName' || field === 'collaboratingInstitution' ||
      field === 'sampleCollections' || field === 'describeConsentGroup' ||
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
        } else if (field === 'sampleCollections') {
          prev.errors.sampleCollections = sampleCollections;
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

  isTextValid(value) {
    let isValid = false;
    if (value !== '' && value !== null && value !== undefined) {
      isValid = true;
    }
    return isValid;
  };

  determinationHandler = (determination) => {
    this.setState(prev => {
      prev.determination = determination;
      if (this.state.determination.projectType !== null && this.state.showErrorStep3 === true) {
        prev.showErrorStep3 = false;
      }
      return prev;
    });
  };

  componentDidCatch(error, info) {
    console.log('----------------------- new consent group error ----------------------')
    console.log(error, info);
  }

  fileHandler = (file) => {
    this.setState({
      files: file
    });
  };

  validateStep2 = () => {
    let isValid = true;

    let docs = [];
    if (this.state.files !== null) {
      this.state.files.forEach(file => {
        if (file.required === true && file.file === null) {
          file.error = true;
          isValid = false;
        } else {
          file.error = false;
        }
        docs.push(file);
      });
    }
    else {
      isValid = false;
    }

    this.setState(prev => {
      prev.files = docs;
      return prev;
    });

    return isValid;
  };

  validateStep3() {
    let isValid = true;
    if (this.state.determination.requiredError || this.state.determination.endState == false) {
      isValid = false;
    }
    this.setState(prev => {
      prev.showErrorStep3 = !isValid;
      return prev;
    });
    return isValid;
  }

  validateStep4(field) {
    let pii = false;
    let compliance = false;
    let sensitive = false;
    let accessible = false;
    let isValid = true;
    let textCompliance = false;
    let textSensitive = false;
    let textAccessible = false;

    if (!this.isTextValid(this.state.step4FormData.pii)) {
      pii = true;
      isValid = false;
    }
    if (!this.isTextValid(this.state.step4FormData.compliance)) {
      compliance = true;
      isValid = false;
    }
    if (this.isTextValid(this.state.step4FormData.compliance) && this.state.step4FormData.compliance === "true" && !this.isTextValid(this.state.step4FormData.textCompliance)) {
      textCompliance = true;
      isValid = false;
    }
    if (!this.isTextValid(this.state.step4FormData.sensitive)) {
      sensitive = true;
      isValid = false;
    }
    if (this.isTextValid(this.state.step4FormData.sensitive) && this.state.step4FormData.sensitive === "true" && !this.isTextValid(this.state.step4FormData.textSensitive)) {
      textSensitive = true;
      isValid = false;
    }
    if (!this.isTextValid(this.state.step4FormData.accessible)) {
      accessible = true;
      isValid = false;
    }
    if (this.isTextValid(this.state.step4FormData.accessible) && this.state.step4FormData.accessible === "true" && !this.isTextValid(this.state.step4FormData.textAccessible)) {
      textAccessible = true;
      isValid = false;
    }

    if (field === undefined || field === null || field === 3) {
      this.setState(prev => {
        prev.errors.pii = pii;
        prev.errors.compliance = compliance;
        prev.errors.sensitive = sensitive;
        prev.errors.accessible = accessible;
        prev.errors.textCompliance = textCompliance;
        prev.errors.textSensitive = textSensitive;
        prev.errors.textAccessible = textAccessible;
        return prev;
      });
    }
    else if (field === 'pii' || field === 'compliance' || field === 'textCompliance' || field === 'sensitive'
      || field === 'textSensitive' || field === 'accessible' || field === 'textAccessible') {

      this.setState(prev => {
        if (field === 'pii') {
          prev.errors.pii = pii;
        }
        else if (field === 'compliance') {
          prev.errors.compliance = compliance;
        }
        else if (field === 'textCompliance') {
          prev.errors.textCompliance = textCompliance;
        }
        else if (field === 'sensitive') {
          prev.errors.sensitive = sensitive;
        }
        else if (field === 'textSensitive') {
          prev.errors.textSensitive = textSensitive;
        }
        else if (field === 'accessible') {
          prev.errors.accessible = accessible;
        }
        else if (field === 'textAccessible') {
          prev.errors.textAccessible = textAccessible;
        }
        return prev;
      });
    }
    return isValid;
  }

  validateStep5(field) {
    let sharingPlan = false;
    let isValid = true;

    if (!this.isTextValid(this.state.step5FormData.sharingPlan)) {
      sharingPlan = true;
      isValid = false;
    }

    if (field === undefined || field === null || field === 4) {
      this.setState(prev => {
        prev.errors.sharingPlan = sharingPlan;
        return prev;
      });
    }
    else if (field === 'sharingPlan') {

      this.setState(prev => {
        if (field === 'sharingPlan') {
          prev.errors.sharingPlan = sharingPlan;
        }
        return prev;
      });
    }
    return isValid;
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  updateStep1FormData = (updatedForm, field) => {
    if (this.state.currentStep === 0) {
      this.validateStep1(field);
    }
    this.setState(prev => {
      prev.step1FormData = updatedForm;
      return prev;
    }, () => {
      this.isValid(field);
    })
  };

  updateStep4FormData = (updatedForm, field) => {
    if (this.state.currentStep === 3) {
      this.validateStep4(field);
    }
    this.setState(prev => {
      prev.step4FormData = updatedForm;
      return prev;
    }, () => {
      this.isValid(field);
    })
  };

  updateStep5FormData = (updatedForm, field) => {
    if (this.state.currentStep === 4) {
      this.validateStep5(field);
    }
    this.setState(prev => {
      prev.step5FormData = updatedForm;
      return prev;
    }, () => {
      this.isValid(field);
    })
  };

  initDocuments() {
    let documents = [];

    documents.push({
      required: true,
      fileKey: 'Consent Document',
      label: span({}, ["Upload the ", span({ className: "bold" }, ["Consent Document "]), "for this Consent Group here ", span({ className: "italic" }, ["(this may be a Consent Form, Assent Form, or Waiver of Consent)"]), ":"]),
      file: null,
      fileName: null,
      error: false
    });
    documents.push({
      required: true,
      fileKey: 'Approval Memo',
      label: span({}, ["Upload local ", span({ className: "bold" }, ["IRB approval "]), "document ", span({ className: "italic" }, ["(required for DFCI & MIT IRBs only):"])]),
      file: null,
      fileName: null,
      error: false
    });

    documents.push({
      required: false,
      fileKey: 'Sample Providers Permission',
      label: span({}, ["Upload the ", span({ className: "bold" }, ["Sample Provider's Permission to add cohort "]), "to this Broad project ", span({ className: "italic" }, ["(DFCI IRB only. Optional):"])]),
      file: null,
      fileName: null,
      error: false
    });

    documents.push({
      required: false,
      fileKey: 'Data Use Letter',
      label: span({}, ["Upload the ", span({ className: "bold" }, ["Data Use Letter "]), "here ", span({ className: "italic" }, ["(optional):"])]),
      file: null,
      fileName: null,
      error: false,
      link: a({ className: "link", onClick: this.downloadFillablePDF, style: {'position' : 'absolute', 'right' : '0', 'bottom' : '60px'} }, ["Download fillable PDF here"])
    });

    this.setState({
      files: documents
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
      Wizard({
        title: "New Consent Group",
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
          user: this.props.user,
          sampleSearchUrl: this.props.sampleSearchUrl,
          updateForm: this.updateStep1FormData,
          errors: this.state.errors,
          removeErrorMessage: this.removeErrorMessage,
          projectKey: this.props.projectKey,
          sampleCollectionList: this.state.sampleCollectionList
        }),
        NewConsentGroupDocuments({
          title: "Documents",
          currentStep: currentStep,
          fileHandler: this.fileHandler,
          projectType: projectType,
          files: this.state.files,
          fillablePdfURL: this.props.fillablePdfURL
        }),
        NewConsentGroupIntCohorts({
          title: "International Cohorts",
          currentStep: currentStep,
          handler: this.determinationHandler,
          determination: this.state.determination,
          errors: this.state.showErrorStep3
        }),
        NewConsentGroupSecurity({
          title: "Security",
          currentStep: currentStep,
          user: this.props.user,
          searchUsersURL: this.props.searchUsersURL,
          updateForm: this.updateStep4FormData,
          errors: this.state.errors,
          removeErrorMessage: this.removeErrorMessage
        }),
        NewConsentGroupDataSharing({
          title: "Data Sharing",
          currentStep: currentStep,
          user: this.props.user,
          searchUsersURL: this.props.searchUsersURL,
          updateForm: this.updateStep5FormData,
          errors: this.state.errors,
          removeErrorMessage: this.removeErrorMessage,
          generalError: this.state.generalError,
          submitError: this.state.submitError
        }),
      ])
    );
  }
}

export default NewConsentGroup;