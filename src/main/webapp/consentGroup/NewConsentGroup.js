import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewConsentGroupDataSharing } from './NewConsentGroupDataSharing';
import { NewConsentGroupDocuments } from './NewConsentGroupDocuments';
import { NewConsentGroupGeneralData } from './NewConsentGroupGeneralData';
import { NewConsentGroupIntCohorts } from './NewConsentGroupIntCohorts';
import { NewConsentGroupSecurity } from './NewConsentGroupSecurity';
import { span, a } from 'react-hyperscript-helpers';
import { Files, ConsentGroup } from "../util/ajax";

class NewConsentGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showErrorStep3: false,
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
        primaryContact: false,
        sampleCollections: false,
        describeConsentGroup: false,
        requireMta: false,
        institutionalSources: false,
        startDate: false,
        endDate: false,
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
  }

  componentDidMount() {
    this.initDocuments();
    ConsentGroup.getConsentGroupNames(this.props.consentNamesSearchURL).then(
      resp => this.setState({ existingGroupNames: resp.data }));
  }

  submitNewConsentGroup = () => {
    if(this.isValid()) {
      ConsentGroup.create(this.props.createConsentGroupURL, this.getConsentGroup()).then(resp => {
        console.log("creadoooooooooooooo");
      });
    }   
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
    extraProperties.push({ name: 'questions', values: this.getQuestions(this.state.determination.questions) });
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

  getQuestions(questions) {
    let questionList = [];
    if (questions !== undefined && questions !== null && questions.length > 1) {
      questions.map((q, idx) => {
        if (q.answer !== null) {
          questionList.push({ name: q.key, value: q.answer });
        }
      });
    }
    return questionList;
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
    let primaryContact = false;
    let sampleCollections = false;
    let describeConsentGroup = false;
    let requireMta = false;
    let institutionalSources = false;
    let startDate = false;
    let endDate = false;
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
    if (!this.isTextValid(this.state.step1FormData.primaryContact)) {
      primaryContact = true;
      isValid = false;
    }
    if (this.state.step1FormData.sampleCollections === undefined || !this.state.step1FormData.sampleCollections.length > 0) {
      sampleCollections = true;
      isValid = false;
    }
    if (this.state.step1FormData.requireMta !== true && this.state.step1FormData.requireMta !== false) {
      requireMta = true;
      isValid = false;
    }
    if (!this.isTextValid(this.state.step1FormData.collaboratingInstitution)) {
      collaboratingInstitution = true;
      isValid = false;
    }
    if (!this.isTextValid(this.state.step1FormData.startDate)) {
      startDate = true;
      isValid = false;
    }
    if (!this.state.step1FormData.onGoingProcess && !this.isTextValid(this.state.step1FormData.endDate)) {
      endDate = true;
      isValid = false;
    }
    if (!this.isTextValid(this.state.step1FormData.describeConsentGroup)) {
      describeConsentGroup = true;
      isValid = false;
    }
    if (this.state.step1FormData.institutionalSources === undefined) {
      institutionalSources = true;
      isValid = false;
    } else {
      this.state.step1FormData.institutionalSources.forEach(institutionalSource => {
        if (!this.isTextValid(institutionalSource.name)
          || !this.isTextValid(institutionalSource.country)) {
          institutionalSources = true;
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
        prev.errors.primaryContact = primaryContact;
        prev.errors.sampleCollections = sampleCollections;
        prev.errors.describeConsentGroup = describeConsentGroup;
        prev.errors.requireMta = requireMta;
        prev.errors.institutionalSources = institutionalSources;
        prev.errors.startDate = startDate;
        prev.errors.endDate = endDate;
        prev.errors.isValid = isValid;
        return prev;
      });
    }

    else if (field === 'investigatorLastName' || field === 'institutionProtocolNumber' ||
      field === 'consentGroupName' || field === 'collaboratingInstitution' ||
      field === 'primaryContact' || field === 'sampleCollections' ||
      field === 'describeConsentGroup' || field === 'requireMta' ||
      field === 'institutionalSources' || field === 'startDate' ||
      field === 'endDate') {

      this.setState(prev => {
        if (field === 'investigatorLastName') {
          prev.errors.investigatorLastName = investigatorLastName;
        } else if (field === 'institutionProtocolNumber') {
          prev.errors.institutionProtocolNumber = institutionProtocolNumber;
        } else if (field === 'consentGroupName') {
          prev.errors.consentGroupName = consentGroupName;
        } else if (field === 'collaboratingInstitution') {
          prev.errors.collaboratingInstitution = collaboratingInstitution;
        } else if (field === 'primaryContact') {
          prev.errors.primaryContact = primaryContact;
        } else if (field === 'sampleCollections') {
          prev.errors.sampleCollections = sampleCollections;
        } else if (field === 'describeConsentGroup') {
          prev.errors.describeConsentGroup = describeConsentGroup;
        } else if (field === 'requireMta') {
          prev.errors.requireMta = requireMta;
        } else if (field === 'institutionalSources') {
          prev.errors.institutionalSources = institutionalSources;
        } else if (field === 'startDate') {
          prev.errors.startDate = startDate;
        } else if (field === 'endDate') {
          prev.errors.endDate = endDate;
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
    if (this.isTextValid(this.state.step4FormData.compliance) && this.state.step4FormData.compliance === "01" && !this.isTextValid(this.state.step4FormData.textCompliance)) {
      textCompliance = true;
      isValid = false;
    }
    if (!this.isTextValid(this.state.step4FormData.sensitive)) {
      sensitive = true;
      isValid = false;
    }
    if (this.isTextValid(this.state.step4FormData.sensitive) && this.state.step4FormData.sensitive === "01" && !this.isTextValid(this.state.step4FormData.textSensitive)) {
      textSensitive = true;
      isValid = false;
    }
    if (!this.isTextValid(this.state.step4FormData.accessible)) {
      accessible = true;
      isValid = false;
    }
    if (this.isTextValid(this.state.step4FormData.accessible) && this.state.step4FormData.accessible === "01" && !this.isTextValid(this.state.step4FormData.textAccessible)) {
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
      label: span({}, ["Upload the ", span({ className: "bold" }, ["Consent Document "]), "for this Consent Group here:"]),
      file: null,
      fileName: null,
      error: false
    });
    documents.push({
      required: true,
      fileKey: 'IRB approval',
      label: span({}, ["Upload local ", span({ className: "bold" }, ["IRB approval "]), "document (required for DFCI & MIT IRBs only):"]),
      file: null,
      fileName: null,
      error: false
    });

    documents.push({
      required: false,
      fileKey: 'Sample Providers Permission',
      label: span({}, ["Upload the ", span({ className: "bold" }, ["Sample Provider's Permission to add cohort "]), "to this Broad project (DFCI IRB only. Optional):"]),
      file: null,
      fileName: null,
      error: false
    });

    documents.push({
      required: false,
      fileKey: 'Data Use Letter',
      label: span({}, ["Upload the ", span({ className: "bold" }, ["Data Use Letter "]), "here (optional):"]),
      file: null,
      fileName: null,
      error: false,
      link: a({ onClick: this.downloadFillablePDF }, ["Download fillable PDF here."])
    });

    this.setState({
      files: documents
    });
  }

  downloadFillablePDF = () => {
    Files.downloadFillable(this.props.fillablePdfURL);
  };

  removeErrorMessage() {
    this.setState(prev => {
      prev.generalError = false;
      return prev;
    });
  }

  parseDate(date) {
    if (date !== null) {
      let d = new Date(date);
      return [d.getFullYear(), d.getMonth() + 1, d.getDate()].join("-");
    }
  }

  render() {

    const { currentStep, determination } = this.state;

    let projectType = determination.projectType;

    return (
      Wizard({ title: "New Consent Group", stepChanged: this.stepChanged, isValid: this.isValid, showSubmit: this.showSubmit, submitHandler: this.submitNewConsentGroup }, [
        NewConsentGroupGeneralData({ title: "General Data", currentStep: currentStep, user: this.props.user, sampleSearchUrl: this.props.sampleSearchUrl, updateForm: this.updateStep1FormData, errors: this.state.errors, removeErrorMessage: this.removeErrorMessage }),
        NewConsentGroupDocuments({ title: "Documents", currentStep: currentStep, fileHandler: this.fileHandler, projectType: projectType, files: this.state.files, fillablePdfURL: this.props.fillablePdfURL }),
        NewConsentGroupIntCohorts({ title: "International Cohorts", currentStep: currentStep, handler: this.determinationHandler, determination: this.state.determination, errors: this.state.showErrorStep3 }),
        NewConsentGroupSecurity({ title: "Security", currentStep: currentStep, user: this.props.user, searchUsersURL: this.props.searchUsersURL, updateForm: this.updateStep4FormData, errors: this.state.errors, removeErrorMessage: this.removeErrorMessage }),
        NewConsentGroupDataSharing({ title: "Data Sharing", currentStep: currentStep, user: this.props.user, searchUsersURL: this.props.searchUsersURL, updateForm: this.updateStep5FormData, errors: this.state.errors, removeErrorMessage: this.removeErrorMessage }),
      ])
    );
  }
}

export default NewConsentGroup;