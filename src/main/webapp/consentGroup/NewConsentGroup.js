import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewConsentGroupDataSharing } from './NewConsentGroupDataSharing';
import { NewConsentGroupDocuments } from './NewConsentGroupDocuments';
import { NewConsentGroupGeneralData } from './NewConsentGroupGeneralData';
import { NewConsentGroupIntCohorts } from './NewConsentGroupIntCohorts';
import { NewConsentGroupSecurity } from './NewConsentGroupSecurity';
import { span } from 'react-hyperscript-helpers';

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
      step1FormData: {},
      currentStep: 0,
      files: [],
      errors: {
        studyDescription: false,
        pTitle: false,
        subjectProtection: false
      }
    }

    this.updateStep1FormData = this.updateStep1FormData.bind(this);
  }

  submitNewConsentGroup = (xxx) => {
    console.log('submitNewConsentGroup');
  }

  stepChanged = (newStep) => {
    this.setState({
      currentStep: newStep
    });
  }

  showSubmit = (currentStep) => {
    let renderSubmit = false;
    if (currentStep === 5) {
      renderSubmit = true;
    }
    return renderSubmit;
  };

  isValid = (currentSep) => {
    let isValid = true;
    if (currentSep === 0) {
      isValid = this.isStep1Valid();
    }
    return isValid;
  }

  isStep1Valid() {
    let isValid = true;
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
  }

  componentDidCatch(error, info) {
    console.log('----------------------- new consent group error ----------------------')
    console.log(error, info);
  }

  fileHandler = (file) => {
    if (file.fileData !== undefined && file.fileData) {
      let result = this.state.files.filter(element => element.fileKey !== file.fileKey);
      result.push(file);
      this.setState(prev => {
        prev.files = result;
        return prev
      });
    }
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  updateStep1FormData = (updatedForm) => {
    this.setState(prev => {
      prev.step1FormData = updatedForm;
      return prev;
    }, () => {
      this.initDocuments()
    });
  };

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
      required: true,
      fileKey: 'Sample Providers Permission',
      label: span({}, ["Upload the ", span({className: "bold"}, ["Sample Provider's Permission to add cohort "]), "to this Broad project (DFCI IRB only. Optional):"]),
      file: null,
      fileName: null,
      error: false
    });
    documents.push({
      required: true,
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

  render() {

    const { currentStep, determination } = this.state;

    let projectType = determination.projectType;

    return (
      Wizard({ title: "New Consent Group", stepChanged: this.stepChanged, isValid: this.isValid, showSubmit: this.showSubmit }, [
        NewConsentGroupGeneralData({ title: "General Data", currentStep: currentStep, user: this.props.user, searchUsersURL: this.props.searchUsersURL, updateForm: this.updateStep1FormData, errors: this.state.errors }),
        NewConsentGroupDocuments({ title: "Documents", currentStep: currentStep, fileHandler: this.fileHandler, projectType: projectType, files: this.state.files }),
        NewConsentGroupIntCohorts({ title: "International Cohorts", currentStep: currentStep, handler: this.determinationHandler, determination: this.state.determination }),
        NewConsentGroupSecurity({ title: "Security", currentStep: currentStep, user: this.props.user, searchUsersURL: this.props.searchUsersURL, updateForm: this.updateStep1FormData, errors: this.state.errors }),
        NewConsentGroupDataSharing({ title: "Data Sharing", currentStep: currentStep, user: this.props.user, searchUsersURL: this.props.searchUsersURL, updateForm: this.updateStep1FormData, errors: this.state.errors }),
      ])
    );
  }
}

export default NewConsentGroup;