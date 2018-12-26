import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewConsentGroupDataSharing } from './NewConsentGroupDataSharing';
import { NewConsentGroupDocuments } from './NewConsentGroupDocuments';
import { NewConsentGroupGeneralData } from './NewConsentGroupGeneralData';
import { NewConsentGroupIntCohorts } from './NewConsentGroupIntCohorts';
import { NewConsentGroupSecurity } from './NewConsentGroupSecurity';
import { span, a } from 'react-hyperscript-helpers';

import { ConsentGroup } from '../util/ajax'
class NewConsentGroup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      determination: {
        projectType: 900,
        questions: [],
        requiredError: false,
        currentQuestionIndex: 0,
        nextQuestionIndex: 1,
        endState: false
      },
      consentGroupName:'',
      step1FormData: {
        investigatorLastName: '',
        institutionProtocolNumber:''
      },
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
        subjectProtection: false,
        institutionalSources: false,
        startDate: false,
        endDate: false,
        onGoingProcess: false
      }
    };

    this.updateStep1FormData = this.updateStep1FormData.bind(this);
    this.isValid = this.isValid.bind(this);
    this.removeErrorMessage = this.removeErrorMessage.bind(this);
  }

  componentDidMount() {
    this.initDocuments();
  }

  submitNewConsentGroup = (xxx) => {
    console.log('submitNewConsentGroup');
  };

  getConsentGroup() {
    // Build Json
    let consentGroup = {};
    consentGroup.summary = this.state.step1FormData.groupName;
    // consentGroup.pTitle = this.state.step1FormData.pTitle !== '' ? this.state.step1FormData.pTitle : null;
    // consentGroup.protocol = this.state.step1FormData.irbProtocolId !== '' ? this.state.step1FormData.irbProtocolId : null;
    // consentGroup.subjectProtection = this.state.step1FormData.subjectProtection !== '' ? this.state.step1FormData.subjectProtection : null;
    // consentGroup.questions = this.getQuestions(this.state.determination.questions);
    // consentGroup.collaborators = this.getCollaborators(this.state.step1FormData.collaborators);
    // consentGroup.fundings = this.getFundings(this.state.step1FormData.fundings);
    return consentGroup;
  }

  stepChanged = (newStep) => {
    this.setState({
      currentStep: newStep
    });
  };

  showSubmit = (currentStep) => {
    let renderSubmit = false;
    if (currentStep === 5) {
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
    }
    return isValid;
  };

  consentGroupNameExists () {
  // TODO: add here check if consent group name already exists to validations
    let match = [];
//    console.log("URL = ", this.props.sampleSearchUrl, "consentGroup ", this.state.consentGroupName)
    let consentGroupNames = ["Janeway / 123", "Church / 123", "123 / Leo"]; // Check order for name composition
    match.push(consentGroupNames.find(element => {return element === this.state.consentGroupName }));
    //    let consentGroupNames = ConsentGroup.getConsentGroupNames(this.props.sampleSearchUrl, this.state.step1FormData.consentGroupName);
//    console.log("consent Groups Names ", consentGroupNames)
//    console.log("match? =  ", match);
    return match.length > 1;
//    return false;
  }


validateStep1(field) {
    let investigatorLastName = false;
    let institutionProtocolNumber = false;
    let consentGroupName = false;
    let collaboratingInstitution = false;
    let primaryContact = false;
    let sampleCollections = false;
    let describeConsentGroup = false;
    let subjectProtection = false;
    let institutionalSources = false;
    let startDate = false;
    let endDate = false;
    let isValid = true;

    if (!this.isTextValid(this.state.step1FormData.consentGroupName) && this.consentGroupNameExists()) {
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
    if (this.state.step1FormData.subjectProtection !== true && this.state.step1FormData.subjectProtection !== false) {
      subjectProtection = true;
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
    if (!this.state.step1FormData.onGoingProcess  && !this.isTextValid(this.state.step1FormData.startDate)) {
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
        prev.errors.subjectProtection = subjectProtection;
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
      field === 'describeConsentGroup' || field === 'subjectProtection' ||
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
        } else if (field === 'subjectProtection') {
          prev.errors.subjectProtection = subjectProtection;
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
    this.setState({
      files: [],
      determination: determination
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

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  updateStep1FormData = (updatedForm, field) => {
    if (this.currentStep === 0) {
      this.validateStep1(field);
    }
    this.setState(prev => {
      prev.step1FormData = updatedForm;
      return prev;
    }, () => {
      this.setGroupName(); // improve this
      this.isValid(field);
      })
  };

  setGroupName () {
    this.setState(prev => {
      prev.consentGroupName = [this.state.step1FormData.institutionProtocolNumber.concat(), this.state.step1FormData.investigatorLastName].join(" / ");
      return prev;
    });
  }

  initDocuments() {
    let documents = [];

    documents.push({
      required: true,
      fileKey: 'Consent Document',
      label: span({}, ["Upload the ", span({className: "bold"}, ["Consent Document "]), "for this Consent Group here:"]),
      file: null,
      fileName: null,
      error: false
    });
    documents.push({
      required: true,
      fileKey: 'IRB approval',
      label: span({}, ["Upload local ", span({className: "bold"}, ["IRB approval "]), "document (required for DFCI & MIT IRBs only):"]),
      file: null,
      fileName: null,
      error: false
    });

    documents.push({
      required: false,
      fileKey: 'Sample Providers Permission',
      label: span({}, ["Upload the ", span({className: "bold"}, ["Sample Provider's Permission to add cohort "]), "to this Broad project (DFCI IRB only. Optional):"]),
      file: null,
      fileName: null,
      error: false
    });

    documents.push({
      text: 'Download fillable PDF here.'
    });

    documents.push({
      required: false,
      fileKey: 'Data Use Letter',
      label: span({}, ["Upload the ", span({className: "bold"}, ["Data Use Letter "]), "here (optional):"]),
      file: null,
      fileName: null,
      error: false
    });

    this.setState({
      files: documents
    });
  }

  removeErrorMessage() {
    this.setState(prev => {
      prev.generalError = false;
      return prev;
    });
  }

  render() {

    const { currentStep, determination } = this.state;

    let projectType = determination.projectType;

    return (
      Wizard({ title: "New Consent Group", stepChanged: this.stepChanged, isValid: this.isValid, showSubmit: this.showSubmit }, [
        NewConsentGroupGeneralData({ title: "General Data", currentStep: currentStep, user: this.props.user, sampleSearchUrl: this.props.sampleSearchUrl, updateForm: this.updateStep1FormData, errors: this.state.errors, removeErrorMessage: this.removeErrorMessage }),
        NewConsentGroupDocuments({ title: "Documents", currentStep: currentStep, fileHandler: this.fileHandler, projectType: projectType, files: this.state.files, fillablePdfURL: this.props.fillablePdfURL }),
        NewConsentGroupIntCohorts({ title: "International Cohorts", currentStep: currentStep, handler: this.determinationHandler, determination: this.state.determination }),
        NewConsentGroupSecurity({ title: "Security", currentStep: currentStep, user: this.props.user, searchUsersURL: this.props.searchUsersURL, updateForm: this.updateStep1FormData, errors: this.state.errors }),
        NewConsentGroupDataSharing({ title: "Data Sharing", currentStep: currentStep, user: this.props.user, searchUsersURL: this.props.searchUsersURL, updateForm: this.updateStep1FormData, errors: this.state.errors }),
      ])
    );
  }
}

export default NewConsentGroup;