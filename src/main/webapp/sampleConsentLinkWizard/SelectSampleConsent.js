import { Component } from 'react';
import { hh, h1, p } from 'react-hyperscript-helpers';
import { WizardStep } from "../components/WizardStep";
import { InputFieldSelect } from "../components/InputFieldSelect";
import { Panel } from '../components/Panel';

export const SelectSampleConsent = hh(class SelectSampleConsent extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      sampleCollectionList: {},
      sampleCollections : {},
    };
  }

  fileHandler = (docs) => {
    this.setState({
      files: docs
    });
  };

  handleSampleCollectionChange = () => (data) => {
    this.setState(prev => {
      prev.sampleCollections = data;
      return prev;
    }, () => this.props.updateForm(this.state.formData, "sampleCollections"));
    this.props.removeErrorMessage();
  };

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------');
    console.log(error, info);
  }

  render() {
    return (
      WizardStep({
        title: this.props.title,
        step: 0,
        currentStep: this.props.currentStep,
        error: this.props.errors.collectionSample || this.props.errors.consentGroup,
        errorMessage: 'Please complete all required fields'
      }, [
        Panel({
          title: "Select a sample collection",
          moreInfo: "(person filling the form)",
        }, [
          InputFieldSelect({
            id: "sampleCollection_select",
            label: "Link Sample Collection to " + this.props.projectKey,
            isDisabled: false,
            options: this.props.sampleCollectionList,
            onChange: this.handleSampleCollectionChange,
            value: this.state.sampleCollections,
            placeholder: "Start typing a Sample Collection",
            isMulti: true,
            edit: false
          }),
        ])
      ])
    );
  }
});
