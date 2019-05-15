import { Component } from 'react';
import { h1, hh, p } from 'react-hyperscript-helpers';
import { Wizard } from "../components/Wizard";
import { SelectSampleConsent } from "./SelectSampleConsent";
import { User, ConsentGroup, SampleCollections } from "../util/ajax";
import { DOCUMENT_TYPE } from '../util/DocumentType';

const LAST_STEP = 1;

class SampleConsentLinkWizard extends Component {
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
        collectionSample: false,
        consentGroup: false,
      },
      generalError: false,
      formSubmitted: false,
      currentStep: 0,
    }
  }

  stepChanged = (newStep) => {
    this.setState({
      currentStep: newStep
    });
  };

  componentDidMount() {
    this.initDocuments();
    this.getUserSession();
    ConsentGroup.getConsentGroupNames(this.props.consentNamesSearchURL).then(
      resp => this.setState({ existingGroupNames: resp.data }));

    SampleCollections.getSampleCollections(this.props.sampleSearchUrl).then(
      resp => {
        console.log(resp);
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

  initDocuments() {
    let documents = [];
    DOCUMENT_TYPE.forEach(type => {
      documents.push({ value: type, label: type });
    });

    this.setState({
      documentOptions: documents
    });
  }

  componentDidCatch(error, info) {
    console.log('----------------------- new consent group error ----------------------');
    console.log(error, info);
  }

  fileHandler = (file) => {
    this.setState({
      files: file
    });
  };

  removeErrorMessage() {
    this.setState(prev => {
      prev.generalError = false;
      return prev;
    });
  }

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

  isValid = () => {

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
          consentNamesSearchURL: this.props.consentNamesSearchURL,
          sampleSearchUrl: this.props.sampleSearchUrl,
          removeErrorMessage: this.removeErrorMessage,
          sampleCollectionList: this.state.sampleCollectionList,
          sampleCollections: this.state.sampleCollections,
          errors: this.state.errors,
          fileHandler: this.fileHandler,
          files: this.state.files,
          currentStep: currentStep,
        })
      ])
    );
  }
}

export default SampleConsentLinkWizard;
