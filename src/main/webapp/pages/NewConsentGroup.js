import { Component } from 'react';
import { Wizard } from '../components/Wizard';
import { NewConsentGroupDataSharing } from './NewConsentGroupDataSharing';
import { NewConsentGroupDocuments } from './NewConsentGroupDocuments';
import { NewConsentGroupGeneralData } from './NewConsentGroupGeneralData';
import { NewConsentGroupIntCohorts } from './NewConsentGroupIntCohorts';
import { NewConsentGroupSecurity } from './NewConsentGroupSecurity';

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
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  updateStep1FormData = (updatedForm) => {
    this.setState(prev => {
      prev.step1FormData = updatedForm;
      return prev;
    }
    );
  }

  render() {

    const { currentStep, determination } = this.state;

    let projectType = determination.projectType;

    return (
      Wizard({ title: "New Consent Group", stepChanged: this.stepChanged, isValid: this.isValid }, [
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