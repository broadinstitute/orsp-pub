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

//import { Search } from '../util/ajax';

export const NewConsentGroupGeneralData = hh(class NewConsentGroupGeneralData extends Component {

  constructor(props) {
    console.log("Props general data: **** ", props);
    super(props);
    this.loadUsersOptions = this.loadUsersOptions.bind(this);
    this.state = {
      formData: {
        investigatorLastName: this.props.user !== undefined ? this.props.user.name : '',
        institutionProtocolNumber: this.props.user !== undefined ? this.props.user.email : '',
        consentGroupName: '',
        collaboratingInstitution: '',
        primaryContact: '',
        sampleCollections: [],
        describeConsentGroup: '',
        subjectProtection: '',
        institutionalSources: [{ name: '', country: '' }],
        startDate: '',
        endDate: '',
        onGoingProcess: false
      }
    };
  }

  handleUpdateinstitutionalSources = (updated) => {
    this.setState(prev => {
      prev.formData.institutionalSources = updated;
      return prev;
    }, () => this.props.updateForm(this.state.formData))
  }

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => this.props.updateForm(this.state.formData));
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
    }, () => this.props.updateForm(this.state.formData));
  };

  handleRadio2Change = (e, field, value) => {
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => this.props.updateForm(this.state.formData));
  };

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  loadUsersOptions(query, callback) {
    //   if (query.length > 2) {
    //     Search.getMatchingUsers(this.props.searchUsersURL, query)
    //       .then(response => {
    //         let options = response.data.map(function (item) {
    //           return {
    //             key: item.id,
    //             value: item.value,
    //             label: item.label
    //           };
    //         });
    //         callback(options);
    //       });
    //   }
  };

  handleSampleCollectionChange = (data, action) => {
    this.setState(prev => {
      prev.formData.sampleCollections = data;
      return prev;
    }, () => this.props.updateForm(this.state.formData));
  };

  handlePIChange = (data, action) => {
    this.setState(prev => {
      prev.formData.piName = data;
      return prev;
    }, () => this.props.updateForm(this.state.formData));
  }

  handleCheck = () => {
    this.setState({ checked: !this.state.checked });
  }

  stepChanged(previousStep) {
    console.log("validate");
    if (previousStep === 0) {
      // validar
      console.log("validarrrrr");
    }
  }

  render() {

    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }

    return (
      WizardStep({ title: this.props.title, step: 0, currentStep: this.props.currentStep }, [

        InputFieldText({
          id: "inputInvestigatorLastName",
          name: "investigatorLastName",
          label: "Last Name of Investigator Listed on the Consent Form*",
          value: this.state.formData.investigatorLastName,
          disabled: false,
          required: true,
          onChange: this.handleInputChange
        }),

        InputFieldText({
          id: "inputInstitutionProtocolNumber",
          name: "institutionProtocolNumber",
          label: "Collaborating Institution's Protocol Number",
          value: this.state.formData.institutionProtocolNumber,
          disabled: false,
          required: false,
          onChange: this.handleInputChange
        }),

        InputFieldText({
          id: "inputConsentGroupName",
          name: "consentGroupName",
          label: "Consent Group Name",
          value: this.state.formData.consentGroupName,
          disabled: false,
          required: false,
          onChange: this.handleInputChange
        }),

        InputFieldText({
          id: "inputCollaboratingInstitution",
          name: "collaboratingInstitution",
          label: "Collaborating Institution*",
          value: this.state.formData.collaboratingInstitution,
          disabled: false,
          required: true,
          onChange: this.handleInputChange
        }),

        InputFieldText({
          id: "inputprimaryContact",
          name: "primaryContact",
          label: "Primary Contact at Collaborating Institution ",
          moreInfo: "(optional)",
          value: this.state.formData.primaryContact,
          disabled: false,
          required: false,
          onChange: this.handleInputChange
        }),

        MultiSelect({
          id: "sampleCollection_select",
          label: "Link Sample Collection to [add here project id]",
          isDisabled: false,
          loadOptions: this.loadUsersOptions,
          handleChange: this.handleSampleCollectionChange,
          value: this.state.formData.sampleCollections,
          placeholder: "Choose a sample collection",
          isMulti: true
        }),

        InputFieldRadio({
          id: "radioDescribeConsentGroup",
          name: "describeConsentGroup",
          label: "Please choose one of the following to describe this proposed Consent Group: ",
          moreInfo: "",
          value: this.state.formData.describeConsentGroup,
          optionValues: ["o1", "02"],
          optionLabels: [
            "I am informing Broad's ORSP of a new amendment I already submitted to my IRB of record",
            "I am requesting assistance in updating and existing project"
          ],
          onChange: this.handleRadio2Change,
          required: false
        }),

        Panel({
          title: "Sample Collection Date Range ",
          moreInfo: "(if data will be deposited to GEO, dbGaP, or other federal repository. Optional)",
        }, [
            div({ className: "row" }, [
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                InputFieldDatePicker({
                  name: "startDate",
                  label: "Start Date",
                  onChange: this.handleChange,
                  placeholder: "Enter Start Date"
                })
              ]),
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                InputFieldDatePicker({
                  name: "endDate",
                  label: "End Date",
                  onChange: this.handleChange,
                  placeholder: "Enter End Date",
                  disabled: this.state.checked === true
                })
              ]),
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12 checkbox", style: { 'marginTop': '32px' } }, [
                input({ type: 'checkbox', id: "onGoingProcess", name: "onGoingProcess", onChange: this.handleCheck, defaultChecked: this.state.checked }),
                label({ id: "lbl_onGoingProcess", htmlFor: "onGoingProcess", className: "regular-checkbox" }, ["Ongoing Process"])
              ])
            ])
          ]),

        Panel({ title: "Institutional Source of Data/Samples and Location*" }, [
          InstitutionalSource({
            institutionalSources: this.state.formData.institutionalSources
          })
        ]),

        InputYesNo({
          id: "radioSubjectProtection",
          name: "subjectProtection",
          label: "Does the institution providing samples/data to the Broad require a Material or Data Transfer Agreement (MTA)?",
          moreInfo: "(Please note that all samples arriving from Dana Farber Cancer Institute now requiere an MTA)",
          value: this.state.formData.subjectProtection,
          onChange: this.handleRadioChange,
          required: false
        })
      ])
    )
  }
});