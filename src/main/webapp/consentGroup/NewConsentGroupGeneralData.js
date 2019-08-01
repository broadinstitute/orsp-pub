import { Component } from 'react';
import { hh, h1, div, input, label, br, span } from 'react-hyperscript-helpers';

import { WizardStep } from '../components/WizardStep';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldSelect } from '../components/InputFieldSelect';
import { InstitutionalSource } from '../components/InstitutionalSource';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { NewConsentGroupDocuments } from './NewConsentGroupDocuments'

export const NewConsentGroupGeneralData = hh(class NewConsentGroupGeneralData extends Component {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      formData: {
        investigatorLastName: '',
        institutionProtocolNumber: '',
        consentGroupName: '',
        collaboratingInstitution: '',
        primaryContact: '',
        sampleCollections: [],
        requireMta: '',
        institutionalSources: [{ name: '', country: '' }],
        startDate: null,
        endDate: null,
        onGoingProcess: false,
        noConsentFormReason: ''
      }
    };
  }

  handleUpdateinstitutionalSources = (updated, field) => {
    this.setState(prev => {
      prev.formData.institutionalSources = updated;
      return prev;
    }, () => this.props.updateForm(this.state.formData, field !== undefined ? field.concat("Institutional") : ''));
    this.props.removeErrorMessage();
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => {
      this.props.updateForm(this.state.formData, field);
      this.props.removeErrorMessage();
    })
  };

  handleChange = (id) => (date) => {
    this.setState(prev => {
      prev.formData[id] = date;
      return prev;
    }, () => this.props.updateForm(this.state.formData, id));
    this.props.removeErrorMessage();
  };

  handleRadioChange = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      value = false;
    }

    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => this.props.updateForm(this.state.formData, field));
    this.props.removeErrorMessage();
  };

  handleRadio2Change = (e, field, value) => {
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => this.props.updateForm(this.state.formData, field));
    this.props.removeErrorMessage();
  };

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  handleSampleCollectionChange = () => (data) => {
    let sampleCollections = [data];
    this.setState(prev => {
      prev.formData.sampleCollections = sampleCollections;
      return prev;
    }, () => this.props.updateForm(this.state.formData, "sampleCollections"));
    this.props.removeErrorMessage();
  };

  handleCheck = () => {
    this.setState(prev => {
      prev.formData.onGoingProcess = !this.state.formData.onGoingProcess;
      prev.formData.endDate = null;
      return prev;
    }, () => this.props.updateForm(this.state.formData, "onGoingProcess"));
    this.props.removeErrorMessage();
  };

  checkGroupName = () => {
    if (this.state.formData.investigatorLastName !== '' && this.state.formData.institutionProtocolNumber !== '') {
      this.setState(prev => {
        prev.formData.consentGroupName = [this.state.formData.investigatorLastName, this.state.formData.institutionProtocolNumber].join(" / ");
        return prev;
      }, () => this.props.updateForm(this.state.formData, "consentGroupName"));
      this.props.removeErrorMessage();
    }
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    return (
      WizardStep({
        title: this.props.title, step: 0, currentStep: this.props.currentStep,
        error: this.props.errors.investigatorLastName ||
          this.props.errors.institutionProtocolNumber ||
          this.props.errors.collaboratingInstitution ||
          this.props.errors.primaryContact ||
          this.props.errors.requireMta ||
          this.props.errors.institutionalSourcesName ||
          this.props.errors.institutionalSourcesCountry ||
          this.props.errors.startDate ||
          this.props.errors.endDate ||
          this.props.errors.onGoingProcess ||
          this.props.errors.noConsentFormReason,
        errorMessage: 'Please complete all required fields'
      }, [

          InputFieldText({
            id: "inputInvestigatorLastName",
            name: "investigatorLastName",
            label: "Last Name of Investigator Listed on the Consent Form*",
            value: this.state.formData.investigatorLastName,
            disabled: false,
            required: true,
            onChange: this.handleInputChange,
            focusOut: this.checkGroupName,
            error: this.props.errors.investigatorLastName,
            errorMessage: "Required field"
          }),

          InputFieldText({
            id: "inputInstitutionProtocolNumber",
            name: "institutionProtocolNumber",
            label: "Collaborating Institution's Protocol Number*",
            value: this.state.formData.institutionProtocolNumber,
            disabled: false,
            required: true,
            onChange: this.handleInputChange,
            focusOut: this.checkGroupName,
            error: this.props.errors.institutionProtocolNumber,
            errorMessage: "Required field"
          }),

          InputFieldText({
            id: "inputConsentGroupName",
            name: "consentGroupName",
            label: "Sample/Data Cohort Name",
            value: this.state.formData.investigatorLastName + " / " + this.state.formData.institutionProtocolNumber,
            disabled: true,
            required: false,
            onChange: null,
            error: this.props.errors.consentGroupName,
            errorMessage: "There is already a Sample/Data Cohort with this protocol number. Please choose a different one."
          }),

          InputFieldText({
            id: "inputCollaboratingInstitution",
            name: "collaboratingInstitution",
            label: "Collaborating Institution*",
            value: this.state.formData.collaboratingInstitution,
            disabled: false,
            required: true,
            onChange: this.handleInputChange,
            error: this.props.errors.collaboratingInstitution,
            errorMessage: "Required field"
          }),

          InputFieldText({
            id: "inputprimaryContact",
            name: "primaryContact",
            label: "Primary Contact at Collaborating Institution ",
            moreInfo: "(optional)",
            value: this.state.formData.primaryContact,
            disabled: false,
            required: true,
            onChange: this.handleInputChange
          }),

          div({ style: { 'margin': '20px 0' }}, [
            InputFieldSelect({
              id: "sampleCollection_select",
              label: "Link Sample Collection to " + this.props.projectKey,
              isDisabled: false,
              options: this.props.sampleCollectionList,
              onChange: this.handleSampleCollectionChange,
              value: this.state.formData.sampleCollections,
              placeholder: "Start typing a Sample Collection",
              isMulti: false,
              isClearable: true,
              edit: false
            }),
          ]),

        Panel({
          title: "Sample Collection Date Range ",
          moreInfo: "(if data will be deposited to GEO, dbGaP, or other federal repository. Optional)",
        }, [
          div({ className: "row" }, [
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                selected: this.state.formData.startDate,
                name: "startDate",
                label: "Start Date",
                onChange: this.handleChange,
                placeholder: "Enter Start Date",
                maxDate: this.state.formData.endDate !== null ? this.state.formData.endDate : null
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
              InputFieldDatePicker({
                startDate: this.state.formData.startDate,
                name: "endDate",
                label: "End Date",
                selected: this.state.formData.endDate,
                onChange: this.handleChange,
                placeholder: "Enter End Date",
                disabled: (this.state.formData.onGoingProcess === true) || (this.state.formData.startDate === null),
                minDate: this.state.formData.startDate
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12 checkbox", style: { 'marginTop': '32px' } }, [
              InputFieldCheckbox({
                id: "onGoingProcess",
                name: "onGoingProcess",
                onChange: this.handleCheck,
                label: "Ongoing Process",
                defaultChecked: this.state.formData.onGoingProcess
              })
            ])
          ])
        ]),

        Panel({ title: "Institutional Source of Data/Samples and Location*" }, [
          InstitutionalSource({
            updateInstitutionalSource: this.handleUpdateinstitutionalSources,
            institutionalSources: this.state.formData.institutionalSources,
            errorName: this.props.errors.institutionalSourcesName,
            errorCountry: this.props.errors.institutionalSourcesCountry,
            errorMessage: "Required field",
            edit: false
          })
        ]),
        Panel({ title: "Documents" }, [
          NewConsentGroupDocuments({
            fileHandler: this.props.fileHandler,
            projectType: this.props.projectType,
            options: this.props.documentOptions,
            files: this.props.files
          }),
          InputFieldText({
            isRendered: !this.props.isConsentFormPresent,
            id: "inputNoConsentFormReason",
            name: "noConsentFormReason",
            label: "If a Consent Form is not available, please describe the reason below",
            value: this.state.formData.noConsentFormReason,
            disabled: false,
            required: true,
            onChange: this.handleInputChange,
            error: this.props.errors.noConsentFormReason,
            errorMessage: "Required field"
          }),
        ])
      ])
    )
  }
});