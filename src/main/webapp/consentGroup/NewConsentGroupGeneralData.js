import { Component } from 'react';
import { hh, h1, div, input, label } from 'react-hyperscript-helpers';

import { WizardStep } from '../components/WizardStep';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputYesNo } from '../components/InputYesNo';
import { InstitutionalSource } from '../components/InstitutionalSource';
import { MultiSelect } from '../components/MultiSelect';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';

import { SampleCollections } from '../util/ajax';

export const NewConsentGroupGeneralData = hh(class NewConsentGroupGeneralData extends Component {

  constructor(props) {
    super(props);
    this.loadSampleCollections = this.loadSampleCollections.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      formData: {
        investigatorLastName: '',
        institutionProtocolNumber: '',
        consentGroupName: '',
        collaboratingInstitution: '',
        primaryContact: '',
        sampleCollections: [],
        describeConsentGroup: '',
        requireMta: '',
        institutionalSources: [{ name: '', country: '' }],
        startDate: null,
        endDate: null,
        onGoingProcess: false
      }
    };
  }

  handleUpdateinstitutionalSources = (updated) => {
    this.setState(prev => {
      prev.formData.institutionalSources = updated;
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'institutionalSources'));
    this.props.removeErrorMessage();
  };

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () =>{
    this.props.updateForm(this.state.formData, field);
    this.props.removeErrorMessage();
    })
  };

  handleChange= (id) => (date) => {
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

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  loadSampleCollections(query, callback) {
     if (query.length > 2) {
       SampleCollections.getSampleCollections(this.props.sampleSearchUrl, query)
         .then(response => {
           let options = response.data.map(function (item) {
             return {
               key: item.id,
               value: item.collectionId,
               label: item.collectionId + ": " + item.name + " ( " + item.category + " )"
             };
           });
           callback(options);
         });
     }
  };

  handleSampleCollectionChange = (data, action) => {
    this.setState(prev => {
      prev.formData.sampleCollections = data;
      return prev;
    }, () => this.props.updateForm(this.state.formData, "sampleCollections"));
    this.props.removeErrorMessage();
  };

  handleCheck = () => {
    this.setState(prev =>
    { prev.formData.onGoingProcess = !this.state.formData.onGoingProcess;
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
        this.props.errors.sampleCollections ||
        this.props.errors.describeConsentGroup ||
        this.props.errors.requireMta ||
        this.props.errors.institutionalSources ||
        this.props.errors.startDate ||
        this.props.errors.endDate ||
        this.props.errors.onGoingProcess,
        errorMessage: 'Please complete all required fields'}, [

        InputFieldText({
          id: "inputInvestigatorLastName",
          name: "investigatorLastName",
          label: "Last Name of Investigator Listed on the Consent Form*",
          value: this.state.formData.investigatorLastName,
          disabled: false,
          required: true,
          onChange: this.handleInputChange,
          focusOut : this.checkGroupName,
          error:this.props.errors.investigatorLastName,
          errorMessage: "Required field"
        }),

        InputFieldText({
          id: "inputInstitutionProtocolNumber",
          name: "institutionProtocolNumber",
          label: "Collaborating Institution's Protocol Number",
          value: this.state.formData.institutionProtocolNumber,
          disabled: false,
          required: true,
          onChange: this.handleInputChange,
          focusOut : this.checkGroupName,
          error:this.props.errors.institutionProtocolNumber,
          errorMessage: "Required field"
        }),

        InputFieldText({
          id: "inputConsentGroupName",
          name: "consentGroupName",
          label: "Consent Group Name",
          value: this.state.formData.investigatorLastName + " / " + this.state.formData.institutionProtocolNumber ,
          disabled: true,
          required: false,
          onChange: null,
          error:this.props.errors.consentGroupName,
          errorMessage: "An existing Consent Group with this protocol exists. Please choose a different one."
        }),

        InputFieldText({
          id: "inputCollaboratingInstitution",
          name: "collaboratingInstitution",
          label: "Collaborating Institution*",
          value: this.state.formData.collaboratingInstitution,
          disabled: false,
          required: true,
          onChange: this.handleInputChange,
          error:this.props.errors.collaboratingInstitution,
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
          onChange: this.handleInputChange,
          error:this.props.errors.primaryContact,
          errorMessage: "Required field"
        }),

        MultiSelect({
          id: "sampleCollection_select",
          label: "Link Sample Collection to [add here project id]",
          isDisabled: false,
          loadOptions: this.loadSampleCollections,
          handleChange: this.handleSampleCollectionChange,
          value: this.state.formData.sampleCollections,
          placeholder: "Choose a sample collection",
          isMulti: true,
          error: this.props.errors.sampleCollections,
          errorMessage: "Required field"
        }),

        InputFieldRadio({
          id: "radioDescribeConsentGroup",
          name: "describeConsentGroup",
          label: "Please choose one of the following to describe this proposed Consent Group: ",
          moreInfo: "",
          value: this.state.formData.describeConsentGroup,
          optionValues: ["01", "02"],
          optionLabels: [
            "I am informing Broad's ORSP of a new amendment I already submitted to my IRB of record",
            "I am requesting assistance in updating and existing project"
          ],
          onChange: this.handleRadio2Change,
          required: true,
          error:this.props.errors.describeConsentGroup,
          errorMessage: "Required field"
        }),

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
                maxDate: this.state.formData.endDate !== null ? this.state.formData.endDate : null,
                error:this.props.errors.startDate,
                errorMessage: "Required field"
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
                minDate: this.state.formData.startDate,
                error:this.props.errors.endDate,
                errorMessage: "Required field"
              })
            ]),
            div({ className: "col-lg-4 col-md-4 col-sm-4 col-12 checkbox", style: { 'marginTop': '32px' } }, [
              input({
                type: 'checkbox',
                id: "onGoingProcess",
                name: "onGoingProcess",
                onChange: this.handleCheck,
                defaultChecked: this.state.formData.onGoingProcess
              }),
              label({ id: "lbl_onGoingProcess", htmlFor: "onGoingProcess", className: "regular-checkbox" }, ["Ongoing Process"])
            ])
          ])
        ]),

        Panel({ title: "Institutional Source of Data/Samples and Location*" }, [
          InstitutionalSource({
            updateInstitutionalSource: this.handleUpdateinstitutionalSources,
            institutionalSources: this.state.formData.institutionalSources,
            error: this.props.errors.institutionalSources,
            errorMessage: "Required field"
          })
        ]),

        InputYesNo({
          id: "radioRequireMta",
          name: "requireMta",
          label: "Does the institution providing samples/data to the Broad require a Material or Data Transfer Agreement (MTA)?",
          moreInfo: "(Please note that all samples arriving from Dana Farber Cancer Institute now requiere an MTA)",
          value: this.state.formData.requireMta,
          onChange: this.handleRadioChange,
          required: true,
          error:this.props.errors.requireMta,
          errorMessage: "Required field"
        })
      ])
    )
  }
});