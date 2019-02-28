import { Component } from 'react';
import { h, p, div, h1, h2, h4, small, br, input, label, span, a, ul, li, button } from 'react-hyperscript-helpers';

import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { InputYesNo } from '../components/InputYesNo';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { AlertMessage } from '../components/AlertMessage';
import { ConsentGroup, DUL } from "../util/ajax";
import { Spinner } from '../components/Spinner';
import { spinnerService } from "../util/spinner-service";


class DataUseLetter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      readOnly: false,
      submit: false,
      showSampleCollectionWarning: true,
      formData: {
        protocolTitle: '',
        protocolNumber: '',
        consentFormTitle: '',
        principalInvestigator: '',
        dataManagerName: '',
        dataManagerEmail: '',
        startDate: null,
        endDate: null,
        onGoingProcess: false,
        repositoryDeposition: '',
        primaryRestrictions: {},
        noRestrictions: false,
        generalUse: false,
        researchRestricted: false,
        diseaseRestricted: false,
        diseaseRestrictedOptions: {
          parasiticDisease: false,
          cancer: false,
          endocrineDisease: false,
          endocrineDiabetes: false,
          mentalDisorder: false,
          nervousDisease: false,
          eyeDisease: false,
          earDisease: false,
          respiratoryDisease: false,
          digestiveDisease: false,
          inflammatoryDisease: false,
          skinDisease: false,
          musculoskeletalDisease: false,
          genitourinaryDisease: false,
          pregnancy: false,
          congenitalMalformation: false,
          bloodDisorder: false,
          otherDisease: false,
        },
        otherDiseaseSpecify: '',

        commercialPurposes: false,
        methodsResearch: false,

        noPopulationRestricted: false,
        under18: false,
        over18: false,
        onlyMen: false,
        onlyWomen: false,
        ethnic: false,
        ethnicSpecify: '',

        otherRestrictions: '',

        dataSubmissionProhibition: '',
        dataUseConsent: '',
        dataDepositionDescribed: '',
        repositoryType: '',
        GSRAvailability: '',

        signature: '',
        printedName: '',
        position: '',
        institution: '',
        date: '',
      },
      errors: {
        errorForm: false,
        errorPi: false,
        errorSampleCollectionDateRange: false,
        errorPrimaryRestrictionsChecks: false,
        errorDiseaseRestrictedOptions: false,
        errorOtherDiseaseSpecify: false,

        errorSignature: false,
        errorPrintedName: false,
        errorPosition: false,
        errorInstitution: false,

        errorGSRAvailability: false,
        errorDataSubmissionProhibition: false,
        errorRepositoryType: false,
        errorDataDepositionDescribed: false,
        errorDataUseConsent: false
      },
      dulError: false,
      dulMsg: "Something went wrong, please try again"
    };
    this.handleFormDataTextChange = this.handleFormDataTextChange.bind(this);
    this.handleDatePickerChange = this.handleDatePickerChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.submitDUL = this.submitDUL.bind(this);
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  componentDidMount() {
    this.initFormData();
  }

  initFormData = () => {
    const uuid =  window.location.href.split('id=')[1];
    ConsentGroup.getConsentGroupByUUID(this.props.consentGroupUrl, uuid).then(consentGroup => {
      this.setState(prev => {
        prev.formData.protocolTitle = consentGroup.data.consent.summary !== undefined ? consentGroup.data.consent.summary : '';
        prev.formData.protocolNumber = consentGroup.data.consent.protocol !== undefined ? consentGroup.data.consent.protocol : '';
        prev.formData.date = this.parseDate(new Date());
        prev.formData.dataManagerName = consentGroup.data.consent.dataManagerName !== undefined ? consentGroup.data.consent.dataManagerName : '';
        prev.formData.dataManagerEmail = consentGroup.data.consent.dataManagerEmail !== undefined ? consentGroup.data.consent.dataManagerEmail : '';
        return prev;
      });
    });
  };

  handleFormDataTextChange = (e) => {
    const { name = '', value = '' } = e.target;
    this.setState(prev => {
      prev.formData[name] = value;
      return prev;
    }, () => {
      if (this.state.submit) {
        this.validateForm();
      }
    });
  };

  handleDatePickerChange = (id) => (date) => {
    this.setState(prev => {
      prev.formData[id] = date;
      return prev;
    }, () => {
      if (this.state.submit) {
        this.validateForm();
      }
    });
  };

  parseDate(date) {
    if (date !== null) {
      return (new Date(date)).toLocaleDateString('en-US');
    }
  }

  handleCheck = (e) => {
    const { name = '', checked = '' } = e.target;
    this.setState(prev => {
      prev.formData[name] = checked;
      if (name === 'ethnic' && checked === false) {
        prev.formData['ethnicSpecify'] = '';
      } else if (name === 'onGoingProcess' && checked === true) {
        prev.formData['endDate'] = null;
      }
      return prev;
    }, () => {
      if (this.state.submit) {
        this.validateForm();
      }
    });
  };

  handleSubOptionsCheck = (e) => {
    const { name = '', checked = '' } = e.target;
    this.setState(prev => {
      if (name === 'endocrineDisease' && checked === false) {
        prev.formData.diseaseRestrictedOptions['endocrineDiabetes'] = false;
      }
      if (name === 'digestiveDisease' && checked === false) {
        prev.formData.diseaseRestrictedOptions['inflammatoryDisease'] = false;
      }
      if (name === 'otherDisease' && checked === false) {
        prev.formData['otherDiseaseSpecify'] = '';
      }
      prev.formData.diseaseRestrictedOptions[name] = checked;
      return prev;
    }, () => {
      if (this.state.submit) {
        this.validateForm();
      }
    });
  };

  handleRadioChange = (e, field, value) => {
    if (value === 'true') {
      value = true;
    } else if (value === 'false') {
      if (field === 'repositoryDeposition') {
        this.setState(prev => {
          prev.formData['GSRAvailability'] = '';
          prev.formData['dataSubmissionProhibition'] = '';
          prev.formData['repositoryType'] = '';
          prev.formData['dataDepositionDescribed'] = '';
          prev.formData['dataUseConsent'] = '';
          return prev;
        });
      }
    }
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => {
      if (this.state.submit) {
        this.validateForm();
      }
    });
  };

  submitDUL() {
    this.setState(prev => {
      prev.submit = true;
      prev.dulError = false;
      return prev;
    });
    if (this.validateForm() === false) {
      spinnerService.showAll();
      const id = window.location.href.split('id=')[1];
      let form = { dulInfo: JSON.stringify(this.state.formData), uid: id };
      DUL.updateDUL(form, this.props.serverUrl).then(resp => {
        DUL.uploadDulPdf({ uid: id }, this.props.serverUrl).then(() => {
          window.location.href = this.props.serverUrl + "/dataUseLetter/show?id=" + id;
        }, (reject) => {
          this.showDulError();
        })
      }).catch(error => {
        this.showDulError();
      });
    }
  };

  showDulError() {
    this.setState(prev => {
      prev.submit = false;
      prev.dulError = true;
      return prev;
    });
    spinnerService.hideAll();
  }

  validateForm() {
    let errorForm = false;
    let errorSampleCollectionDateRange = false;

    let errorPi = false;
    let errorPrimaryRestrictionsChecks = false;
    let errorDiseaseRestrictedOptions = false;
    let errorOtherDiseaseSpecify = false;

    let errorSignature = false;
    let errorPrintedName = false;
    let errorPosition = false;
    let errorInstitution = false;

    let errorGSRAvailability = false;
    let errorDataSubmissionProhibition = false;
    let errorRepositoryType = false;
    let errorDataDepositionDescribed = false;
    let errorDataUseConsent = false;

    // Pi Validation
    if (this.isEmpty(this.state.formData.principalInvestigator)) {
      errorForm = true;
      errorPi = true;
    }

    // Date Range Validations
    if (this.state.formData.startDate === null
      || (this.state.formData.onGoingProcess === false && this.state.formData.endDate === null)) {
      errorForm = true;
      errorSampleCollectionDateRange = true;
    }

    // Primary Restrictions validations
    if (this.state.formData.noRestrictions === false
      && this.state.formData.generalUse === false
      && this.state.formData.researchRestricted === false
      && this.state.formData.diseaseRestricted === false) {
      errorForm = true;
      errorPrimaryRestrictionsChecks = true;
    }
    if (this.state.formData.diseaseRestricted === true
      && Object.keys(this.state.formData.diseaseRestrictedOptions).every(key =>
        this.state.formData.diseaseRestrictedOptions[key] === false)) {
      errorForm = true;
      errorDiseaseRestrictedOptions = true;
    }

    // Institutional Review Board/Ethics Validations
    if (this.isEmpty(this.state.formData.signature)) {
      errorForm = true;
      errorSignature = true;
    }
    if (this.isEmpty(this.state.formData.printedName)) {
      errorForm = true;
      errorPrintedName = true;
    }
    if (this.isEmpty(this.state.formData.position)) {
      errorForm = true;
      errorPosition = true;
    }
    if (this.isEmpty(this.state.formData.institution)) {
      errorForm = true;
      errorInstitution = true;
    }
    if (this.state.formData.repositoryDeposition === true) {
      if ((this.state.formData.onGoingProcess === true || this.endsEqualOrAfter("1/25/2015")) && this.isEmpty(this.state.formData.GSRAvailability)) {
        errorForm = true;
        errorGSRAvailability = true
      }
      if (this.startsBefore("1/25/2015") && this.isEmpty(this.state.formData.dataSubmissionProhibition)) {
        errorForm = true;
        errorDataSubmissionProhibition = true;
      }
      if (this.state.formData.onGoingProcess === true || this.endsEqualOrAfter("1/25/2015")) {
        if (this.isEmpty(this.state.formData.repositoryType)) {
          errorForm = true;
          errorRepositoryType = true;
        }
        if (this.isEmpty(this.state.formData.dataDepositionDescribed)) {
          errorForm = true;
          errorDataDepositionDescribed = true;
        }
        if (this.isEmpty(this.state.formData.dataUseConsent)) {
          errorForm = true;
          errorDataUseConsent = true;
        }
      }
    }

    this.setState(prev => {
      prev.errors.errorForm = errorForm;
      prev.errors.errorPi = errorPi;
      prev.errors.errorSampleCollectionDateRange = errorSampleCollectionDateRange;
      prev.errors.errorPrimaryRestrictionsChecks = errorPrimaryRestrictionsChecks;
      prev.errors.errorDiseaseRestrictedOptions = errorDiseaseRestrictedOptions;
      prev.errors.errorOtherDiseaseSpecify = errorOtherDiseaseSpecify;

      prev.errors.errorSignature = errorSignature;
      prev.errors.errorPrintedName = errorPrintedName;
      prev.errors.errorPosition = errorPosition;
      prev.errors.errorInstitution = errorInstitution;

      prev.errors.errorGSRAvailability = errorGSRAvailability;
      prev.errors.errorDataSubmissionProhibition = errorDataSubmissionProhibition;
      prev.errors.errorRepositoryType = errorRepositoryType;
      prev.errors.errorDataDepositionDescribed = errorDataDepositionDescribed;
      prev.errors.errorDataUseConsent = errorDataUseConsent;
      if (errorForm === false) {
        prev.submit = false;
      }
      return prev;
    });
    return errorForm;
  };

  getUsersArray(array) {
    let usersArray = [];
    if (array !== undefined && array !== null && array.length > 0) {
      array.map(element => {
        usersArray.push(
          element.displayName + " (" + element.emailAddress + ") "
        );
      });
    }
    return usersArray
  }

  startsBefore(date) {
    let result = false;
    if (!this.isEmpty(date) && !this.isEmpty(this.state.formData.startDate)) {
      const start = new Date(this.state.formData.startDate).getTime();
      const limit = new Date(date).getTime();
      result = limit > start;
    }
    return result;
  }

  endsEqualOrAfter(date) {
    let result = false;
    if (!this.isEmpty(date) && !this.isEmpty(this.state.formData.endDate)) {
      const end = new Date(this.state.formData.endDate).getTime();
      const limit = new Date(date).getTime();
      result = limit <= end;
    }
    return result;
  }

  isEmpty(value) {
    return value === '' || value === null || value === undefined;
  }
  render() {
    return (
      div({}, [
        h1({ className: "pageTitle" }, [
          "Data Use Limitation Record",
          p({ className: "pageClarification" }, [
            "Broad Institute - Data Use Limitation Record",
            br({}),
            "Version 5.21.2018"
          ])
        ]),
        div({ className: "pageContainer" }, [
          div({ style: { 'marginBottom': '20px' } }, [
            InputFieldText({
              id: "inputProtocolTitle",
              name: "protocolTitle",
              label: "Title of Specimen Collection Protocol",
              disabled: true,
              value: this.state.formData.protocolTitle,
              onChange: this.handleExtraPropsInputChange,
              readOnly: false
            }),
            InputFieldText({
              id: "inputProtocolNumber",
              name: "protocolNumber",
              label: "Protocol Number",
              disabled: true,
              value: this.state.formData.protocolNumber,
              onChange: this.handleExtraPropsInputChange,
              readOnly: false
            }),
            InputFieldText({
              id: "inputConsentFormTitle",
              name: "consentFormTitle",
              label: "Consent Form Title ",
              moreInfo: "(Please enter the title at the top of the consent form referenced by this form)",
              disabled: false,
              value: this.state.formData.consentFormTitle,
              required: false,
              onChange: this.handleFormDataTextChange,
              edit: false
            }),
            InputFieldText({
              id: "inputPrincipalInvestigator",
              name: "principalInvestigator",
              label: "Principal Investigator Listed on Consent Form*",
              disabled: false,
              value: this.state.formData.principalInvestigator,
              onChange: this.handleFormDataTextChange,
              readOnly: false,
              required: true,
              error: this.state.errors.errorPi,
              errorMessage: 'Required Field'
            })
          ]),
          Panel({ title: "Data Manager ", moreInfo: "(individual decisions regarding data access and transfer)" }, [
            div({ className: "row" }, [
              div({ className: "col-lg-6 col-md-6 col-sm-12 col-12" }, [
                InputFieldText({
                  id: "inputDataManagerName",
                  name: "dataManagerName",
                  label: "Data Manager Name",
                  disabled: true,
                  value: this.state.formData.dataManagerName,
                  onChange: this.handleExtraPropsInputChange,
                  readOnly: false
                })
              ]),
              div({ className: "col-lg-6 col-md-6 col-sm-12 col-12" }, [
                InputFieldText({
                  id: "inputDataManagerEmail",
                  name: "dataManagerEmail",
                  label: "Data Manager Email",
                  disabled: true,
                  value: this.state.formData.dataManagerEmail,
                  onChange: this.handleExtraPropsInputChange,
                  readOnly: false
                })
              ])
            ])
          ]),

          Panel({ title: "Sample Collection Date Range*" }, [
            div({ className: "row" }, [
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                InputFieldDatePicker({
                  selected: this.state.formData.startDate,
                  name: "startDate",
                  label: "Start Date",
                  onChange: this.handleDatePickerChange,
                  placeholder: "Enter Start Date",
                  maxDate: this.state.formData.endDate !== null ? this.state.formData.endDate : null,
                  error: this.state.errors.errorSampleCollectionDateRange,
                  errorMessage: 'Required Fields'
                })
              ]),
              div({ className: "col-lg-4 col-md-4 col-sm-4 col-12" }, [
                InputFieldDatePicker({
                  startDate: this.state.formData.startDate,
                  name: "endDate",
                  label: "End Date",
                  selected: this.state.formData.endDate,
                  onChange: this.handleDatePickerChange,
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

          InputYesNo({
            id: "radioRepositoryDeposition",
            name: "repositoryDeposition",
            value: this.state.formData.repositoryDeposition,
            label: "Data is intended for repository deposition?",
            readOnly: this.state.readOnly,
            onChange: this.handleRadioChange,
          }),

          div({ className: "boxWrapper" }, [
            p({}, ["Samples from the above referenced protocol have been or will be part of a genomic research collaboration with the Broad Institute."]),
            p({}, ["In order to be responsible stewards of the genomic data that is generated, we are asking your IRB/Ethics Committee to identify appropriate use and sharing limitations based on a review of the consent form research participants signed when the samples were collected."]),
            p({}, ["Identification of these data use limitations will ensure that future use is aligned with the commitments made to research subjects in the consent. The data use limitations may be used in one of two ways to identify use restrictions: 1) to facilitate data management, and/or 2) if appropriate, for data deposition into a controlled-access or open-access repository.  "]),
            p({}, ["Please answer the following questions to describe data use limitations based on the consent form interpretation."])
          ]),

          // SECTION 1
          h2({ className: "pageSubtitle" }, [
            small({}, ["Section 1"]),
            "Information required for data management"
          ]),

          Panel({ title: "1. Primary Restrictions*" }, [
            InputFieldCheckbox({
              id: "ckb_noRestrictions",
              name: "noRestrictions",
              onChange: this.handleCheck,
              label: "No restrictions",
              checked: this.state.formData.noRestrictions === 'true' || this.state.formData.noRestrictions === true,
              readOnly: this.state.readOnly
            }),
            InputFieldCheckbox({
              id: "ckb_generalUse",
              name: "generalUse",
              onChange: this.handleCheck,
              label: span({}, ['General research use ', span({ className: 'normal italic' }, ['(Data can be used for any research purpose but would not be made available for non-research purposes. These data would generally be made available to any qualified investigator, irrespective of the specific research purpose for which the data are requested.)'])]),
              checked: this.state.formData.generalUse === 'true' || this.state.formData.generalUse === true,
              readOnly: this.state.readOnly
            }),
            InputFieldCheckbox({
              id: "ckb_researchRestricted",
              name: "researchRestricted",
              onChange: this.handleCheck,
              label: span({}, [span({ className: 'normal' }, ['Future use is ']), span({ className: 'bold' }, ['restricted to health/medical/biomedical research (any type)'])]),
              checked: this.state.formData.researchRestricted === 'true' || this.state.formData.researchRestricted === true,
              readOnly: this.state.readOnly
            }),
            InputFieldCheckbox({
              id: "ckb_diseaseRestricted",
              name: "diseaseRestricted",
              onChange: this.handleCheck,
              label: span({}, [span({ className: 'normal' }, ['Future research is ']), span({ className: 'bold' }, ['restricted to (a) specific disease(s): ']), span({ className: 'normal italic' }, ['(Please note that checking any of these boxes precludes all future research outside of the indicated disease.)'])]),
              checked: this.state.formData.diseaseRestricted === 'true' || this.state.formData.diseaseRestricted === true,
              readOnly: this.state.readOnly
            }),
            small({ isRendered: this.state.errors.errorPrimaryRestrictionsChecks, className: "errorMessage" }, ['Required Fields']),

            div({ isRendered: this.state.formData.diseaseRestricted === true, className: "row subGroup" }, [
              div({ className: "col-lg-6 col-md-6 col-sm-12 col-12" }, [
                InputFieldCheckbox({
                  id: "ckb_parasiticDisease",
                  name: "parasiticDisease",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Infectious and parasitic diseases']),
                  checked: this.state.formData.diseaseRestrictedOptions.parasiticDisease === 'true' || this.state.formData.diseaseRestrictedOptions.parasiticDisease === true,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  id: "ckb_cancer",
                  name: "cancer",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Cancer']),
                  checked: this.state.formData.diseaseRestrictedOptions.cancer === 'true' || this.state.formData.diseaseRestrictedOptions.cancer === true,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  id: "ckb_endocrineDisease",
                  name: "endocrineDisease",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Endocrine, nutritional and metabolic diseases']),
                  checked: this.state.formData.diseaseRestrictedOptions.endocrineDisease === 'true' || this.state.formData.diseaseRestrictedOptions.endocrineDisease === true,
                  readOnly: this.state.readOnly
                }),
                //if endocrineDisease is checked (OK)
                div({ isRendered: this.state.formData.diseaseRestrictedOptions.endocrineDisease === true, className: "subGroup" }, [
                  InputFieldCheckbox({
                    id: "ckb_endocrineDiabetes",
                    name: "endocrineDiabetes",
                    onChange: this.handleSubOptionsCheck,
                    label: span({ className: "normal" }, ['Diabetes mellitus']),
                    checked: this.state.formData.diseaseRestrictedOptions.endocrineDiabetes === 'true' || this.state.formData.diseaseRestrictedOptions.endocrineDiabetes === true,
                    readOnly: this.state.readOnly
                  })
                ]),
                InputFieldCheckbox({
                  id: "ckb_mentalDisorder",
                  name: "mentalDisorder",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Mental, Behavioral and Neurodevelopmental disorders']),
                  checked: this.state.formData.diseaseRestrictedOptions.mentalDisorder === 'true' || this.state.formData.diseaseRestrictedOptions.mentalDisorder === true,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  id: "ckb_nervousDisease",
                  name: "nervousDisease",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Nervous system diseases']),
                  checked: this.state.formData.diseaseRestrictedOptions.nervousDisease === 'true' || this.state.formData.diseaseRestrictedOptions.nervousDisease === true,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  id: "ckb_eyeDisease",
                  name: "eyeDisease",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Eye diseases']),
                  checked: this.state.formData.diseaseRestrictedOptions.eyeDisease === 'true' || this.state.formData.diseaseRestrictedOptions.eyeDisease === true,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  id: "ckb_earDisease",
                  name: "earDisease",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Ear and mastoid process diseases']),
                  checked: this.state.formData.diseaseRestrictedOptions.earDisease === 'true' || this.state.formData.diseaseRestrictedOptions.earDisease === true,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  id: "ckb_respiratoryDisease",
                  name: "respiratoryDisease",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Respiratory system diseases']),
                  checked: this.state.formData.diseaseRestrictedOptions.respiratoryDisease === 'true' || this.state.formData.diseaseRestrictedOptions.respiratoryDisease === true,
                  readOnly: this.state.readOnly
                })
              ]),

              div({ className: "col-lg-6 col-md-6 col-sm-12 col-12" }, [
                InputFieldCheckbox({
                  id: "ckb_digestiveDisease",
                  name: "digestiveDisease",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Digestive system diseases']),
                  checked: this.state.formData.diseaseRestrictedOptions.digestiveDisease === 'true' || this.state.formData.diseaseRestrictedOptions.digestiveDisease === true,
                  readOnly: this.state.readOnly
                }),
                //if digestiveDisease is checked (OK)
                div({ isRendered: this.state.formData.diseaseRestrictedOptions.digestiveDisease === true, className: "subGroup" }, [
                  InputFieldCheckbox({
                    id: "ckb_inflammatoryDisease",
                    name: "inflammatoryDisease",
                    onChange: this.handleSubOptionsCheck,
                    label: span({ className: "normal" }, ['Inflammatory bowel disease']),
                    checked: this.state.formData.diseaseRestrictedOptions.inflammatoryDisease === 'true' || this.state.formData.diseaseRestrictedOptions.inflammatoryDisease === true,
                    readOnly: this.state.readOnly
                  })
                ]),
                InputFieldCheckbox({
                  id: "ckb_skinDisease",
                  name: "skinDisease",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Skin and subcutaneous tissue diseases']),
                  checked: this.state.formData.diseaseRestrictedOptions.skinDisease === 'true' || this.state.formData.diseaseRestrictedOptions.skinDisease === true,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  id: "ckb_musculoskeletalDisease",
                  name: "musculoskeletalDisease",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Musculoskeletal system & connective tissue diseases']),
                  checked: this.state.formData.diseaseRestrictedOptions.musculoskeletalDisease === 'true' || this.state.formData.diseaseRestrictedOptions.musculoskeletalDisease === true,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  id: "ckb_genitourinaryDisease",
                  name: "genitourinaryDisease",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Genitourinary system diseases']),
                  checked: this.state.formData.diseaseRestrictedOptions.genitourinaryDisease === 'true' || this.state.formData.diseaseRestrictedOptions.genitourinaryDisease === true,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  id: "ckb_pregnancy",
                  name: "pregnancy",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Pregnancy, childbirth and the puerperium']),
                  checked: this.state.formData.diseaseRestrictedOptions.pregnancy === 'true' || this.state.formData.diseaseRestrictedOptions.pregnancy === true,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  id: "ckb_congenitalMalformation",
                  name: "congenitalMalformation",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Congenital malformations, deformations and chromosomal abnormalities']),
                  checked: this.state.formData.diseaseRestrictedOptions.congenitalMalformation === 'true' || this.state.formData.diseaseRestrictedOptions.congenitalMalformation === true,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  id: "ckb_bloodDisorder",
                  name: "bloodDisorder",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Blood and blood-forming organs and certain disorders involving the immune mechanism diseases']),
                  checked: this.state.formData.diseaseRestrictedOptions.bloodDisorder === 'true' || this.state.formData.diseaseRestrictedOptions.bloodDisorder === true,
                  readOnly: this.state.readOnly
                }),
                InputFieldCheckbox({
                  id: "ckb_otherDisease",
                  name: "otherDisease",
                  onChange: this.handleSubOptionsCheck,
                  label: span({ className: "normal" }, ['Other']),
                  checked: this.state.formData.diseaseRestrictedOptions.otherDisease === 'true' || this.state.formData.diseaseRestrictedOptions.otherDisease === true,
                  readOnly: this.state.readOnly
                }),
                //if otherDisease is checked (OK)
                div({ isRendered: this.state.formData.diseaseRestrictedOptions.otherDisease === true, className: "subGroup", style: { 'marginTop': '5px', 'marginBottom': '0' } }, [
                  InputFieldText({
                    id: "inputOtherDiseaseSpecify",
                    name: "otherDiseaseSpecify",
                    label: "Please describe",
                    disabled: false,
                    value: this.state.formData.otherDiseaseSpecify,
                    onChange: this.handleFormDataTextChange,
                    readOnly: this.state.readOnly
                  })
                ])
              ]),
              small({ isRendered: this.state.errors.errorDiseaseRestrictedOptions, className: "errorMessage" }, ['Required Fields']),
            ])
          ]),

          Panel({ title: "2. Does the informed consent form or the IRB/EC prohibit any of the following?" }, [
            InputFieldCheckbox({
              id: "ckb_commercialPurposes",
              name: "commercialPurposes",
              onChange: this.handleCheck,
              label: "Use by commercial entities or for commercial purposes",
              checked: this.state.formData.commercialPurposes === 'true' || this.state.formData.commercialPurposes === true,
              readOnly: this.state.readOnly
            }),
            InputFieldCheckbox({
              id: "ckb_methodsResearch",
              name: "methodsResearch",
              onChange: this.handleCheck,
              label: span({}, ['Methods research ', span({ className: "normal italic" }, ['(analytic/software/technology development)'])]),
              checked: this.state.formData.methodsResearch === 'true' || this.state.formData.methodsResearch === true,
              readOnly: this.state.readOnly
            })
          ]),

          Panel({ title: "3. Future research is restricted to the following populations" }, [
            InputFieldCheckbox({
              id: "ckb_noPopulationRestricted",
              name: "noPopulationRestricted",
              onChange: this.handleCheck,
              label: "No population restrictions",
              checked: this.state.formData.noPopulationRestricted === 'true' || this.state.formData.noPopulationRestricted === true,
              readOnly: this.state.readOnly
            }),
            InputFieldCheckbox({
              id: "ckb_under18",
              name: "under18",
              onChange: this.handleCheck,
              label: "Research in children under 18 years of age only",
              checked: this.state.formData.under18 === 'true' || this.state.formData.under18 === true,
              readOnly: this.state.readOnly
            }),
            InputFieldCheckbox({
              id: "ckb_over18",
              name: "over18",
              onChange: this.handleCheck,
              label: "Research in adults 18 years of age and older only",
              checked: this.state.formData.over18 === 'true' || this.state.formData.over18 === true,
              readOnly: this.state.readOnly
            }),
            InputFieldCheckbox({
              id: "ckb_onlyMen",
              name: "onlyMen",
              onChange: this.handleCheck,
              label: "Research in men only",
              checked: this.state.formData.onlyMen === 'true' || this.state.formData.onlyMen === true,
              readOnly: this.state.readOnly
            }),
            InputFieldCheckbox({
              id: "ckb_onlyWomen",
              name: "onlyWomen",
              onChange: this.handleCheck,
              label: "Research in women only",
              checked: this.state.formData.onlyWomen === 'true' || this.state.formData.onlyWomen === true,
              readOnly: this.state.readOnly
            }),
            InputFieldCheckbox({
              id: "ckb_ethnic",
              name: "ethnic",
              onChange: this.handleCheck,
              label: "Research in the following ethnic or geographic population",
              checked: this.state.formData.ethnic === 'true' || this.state.formData.ethnic === true,
              readOnly: this.state.readOnly
            }),
            //if ethnic is checked (OK)
            div({ isRendered: this.state.formData.ethnic === true, className: "subGroup", style: { 'marginTop': '5px' } }, [
              InputFieldText({
                id: "inputEthnicSpecify",
                name: "ethnicSpecify",
                label: "Please specify",
                disabled: false,
                value: this.state.formData.ethnicSpecify,
                onChange: this.handleFormDataTextChange,
                readOnly: this.state.readOnly
              })
            ])
          ]),

          Panel({ title: "4. Other restrictions" }, [
            InputFieldTextArea({
              id: "inputOtherRestrictions",
              name: "otherRestrictions",
              label: "Please describe. ",
              moreInfo: "(For example: future research use requires review by the data recipient’s IRB/EC; no data deposition from samples collected using consent forms before 1992)",
              value: this.state.formData.otherRestrictions,
              disabled: false,
              onChange: this.handleFormDataTextChange
            })
          ]),

          // SECTION 2 If repositoryDeposition is true (OK)
          div({ isRendered: this.state.formData.repositoryDeposition === true }, [
            h2({ className: "pageSubtitle" }, [
              small({}, ["Section 2"]),
              "Information required for data sharing via a repository"
            ]),

            // If SC Date Range still not answered (OK)
            AlertMessage({
              msg: "Please enter sample collection date range above before proceeding.",
              show: this.state.formData.startDate === null || (this.state.formData.onGoingProcess === false && this.state.formData.endDate === null)
            }),

            // If SC Date Range starts before 1/25/2015 (OK)
            div({ isRendered: !(this.state.formData.startDate === null || (this.state.formData.onGoingProcess === false && this.state.formData.endDate === null)) }, [
              div({ isRendered: this.startsBefore("1/25/2015") }, [
                InputFieldRadio({
                  id: "radioDataSubmissionProhibition",
                  name: "dataSubmissionProhibition",
                  label: "Is data submission not inconsistent with (not prohibited by) the informed consent provided by the research participant?*",
                  value: this.state.formData.dataSubmissionProhibition,
                  optionValues: ["allowed", "prohibited"],
                  optionLabels: [
                    span({}, ["Yes, data submission is ", span({ className: "bold" }, ["not inconsistent "]), "with the consent. ", span({ className: "normal italic" }, ["(Data submission is permitted)"])]),
                    span({}, ["No, data submission is ", span({ className: "bold" }, ["inconsistent "]), "with the consent. ", span({ className: "normal italic" }, ["(Data submission is not permitted)"])]),
                  ],
                  onChange: this.handleRadioChange,
                  readOnly: this.state.readOnly,
                  error: this.state.errors.errorDataSubmissionProhibition,
                  errorMessage: "Required Field"
                })
              ]),

              // If SC Date Range ends after (or that same) 1/25/2015 (OK)
              div({ isRendered: this.state.formData.onGoingProcess === true || this.endsEqualOrAfter("1/25/2015") }, [
                InputYesNo({
                  id: "radioDataUseConsent",
                  name: "dataUseConsent",
                  value: this.state.formData.dataUseConsent,
                  label: "Did participants consent to the use of their genomic and phenotypic data for future research and broad sharing?*",
                  readOnly: this.state.readOnly,
                  onChange: this.handleRadioChange,
                  error: this.state.errors.errorDataUseConsent,
                  errorMessage: "Required Field"
                }),
                InputYesNo({
                  id: "radioDataDepositionDescribed",
                  name: "dataDepositionDescribed",
                  value: this.state.formData.dataDepositionDescribed,
                  label: "Is data deposition into a repository described in the consent form?*",
                  readOnly: this.state.readOnly,
                  onChange: this.handleRadioChange,
                  error: this.state.errors.errorDataDepositionDescribed,
                  errorMessage: "Required Field"
                }),
                InputFieldRadio({
                  id: "radioRepositoryType",
                  name: "repositoryType",
                  label: "What type of repository is permitted?*",
                  value: this.state.formData.repositoryType,
                  optionValues: ["controlledAccess", "openAccess", 'controlledAccessAndOpenAccess'],
                  optionLabels: [
                    span({ className: "bold" }, ["Controlled-access ", span({ className: "normal italic" }, ["(researchers are required to apply for access, e.g. dbGaP, EGA)"])]),
                    span({ className: "bold" }, ["Open-access ", span({ className: "normal italic" }, ["(data publicly available without application or restrictions)"])]),
                    span({ className: "bold" }, ["Both controlled-access and open-access are permitted"]),
                  ],
                  onChange: this.handleRadioChange,
                  readOnly: this.state.readOnly,
                  error: this.state.errors.errorRepositoryType,
                  errorMessage: "Required Field"
                })
              ]),
              div({ className: "boxWrapper" }, [
                p({}, ["NIH provides genomic summary results (GSR) from most studies submitted to NIH-designated data repositories through unrestricted access. However, data from data sets considered to have particular ‘sensitivities’ related to individual privacy or potential for group harm (e.g., those with populations from isolated geographic regions, or with rare or potentially stigmatizing traits) may be designated as “sensitive” by. In such cases, “controlled-access” should be checked below and a brief explanation for the sensitive designation should be provided. GSR from any such data sets will only be available through controlled-access."]),
              ]),
              InputFieldRadio({
                id: "radioGSRAvailability",
                name: "GSRAvailability",
                label: "Are the genomic summary results (GSR) from this study to be made available only through controlled-access?*",
                value: this.state.formData.GSRAvailability,
                optionValues: ["GSRNotRequired", "GSRRequired"],
                optionLabels: [
                  "No, controlled-access for GSR is not required",
                  "Yes, controlled-access for GSR is required",
                ],
                onChange: this.handleRadioChange,
                readOnly: this.state.readOnly,
                error: this.state.errors.errorGSRAvailability,
                errorMessage: 'Required Field'
              })
            ])
          ]),
          // SECTION 2 if repositoryDeposition is not true, otherwise SECTION 3 (OK)
          h2({ className: "pageSubtitle" }, [
            small({}, [
              "Section ",
              span({ isRendered: this.state.formData.repositoryDeposition === true }, ["3"]),
              span({ isRendered: this.state.formData.repositoryDeposition !== true }, ["2"])
            ]),
            span({}, ["Assurances ", span({ className: "normal italic" }, ["(by signing this form, you are also attesting)"])])
          ]),
          div({ className: "boxWrapper" }, [
            p({}, ["- Consideration was given to risks to individual participants and their families associated with data submitted to the data repository and subsequent sharing."]),
            p({}, ["- To the extent possible, consideration was given to risks to groups or populations associated with data submitted to the data repository and subsequent sharing."]),
            p({}, ["The protocol for the collection of genomic and phenotypic data is consistent with the U.S. Code of Federal Regulations, 45CFR46 (or your equivalent national human subjects research standards, if outside the US). This means that in the above referenced protocol:"]),
            ul({}, [
              li({}, ["Risks to subjects are minimized"]),
              li({}, ["Risks to subjects are reasonable in relation to anticipated benefits, if any, to subjects, and the importance of the knowledge that may reasonably be expected to result."]),
              li({}, ["Selection of subjects is equitable."]),
              li({}, ["Informed consent is sought from each prospective subject or the subject's legally authorized representative, in accordance with, and to the extent required by applicable national and local laws and regulations"]),
              li({}, ["Informed consent is appropriately documented, in accordance with, and to the extent required by applicable national and local laws and regulations."]),
              li({}, ["When appropriate, the research plan makes adequate provision for monitoring the data collected to ensure the safety of subjects."]),
              li({}, ["When appropriate, there are adequate provisions to protect the privacy of subjects and to maintain the confidentiality of data."]),
              li({}, ["When some or all of the subjects are likely to be vulnerable to coercion or undue influence, such as children, prisoners, pregnant women, mentally disabled persons, or economically or educationally disadvantaged persons, additional safeguards have been included in the study to protect the rights and welfare of these subjects."])
            ])
          ]),

          h4({ className: "bold", style: { 'lineHeight': '1.3' } }, [
            "Institutional Review Board/Ethics Committee Official",
            br({}),
            span({ className: "normal italic" }, ["I hereby attest that I am qualified to sign this agreement on behalf of the Institution listed below:"])
          ]),

          InputFieldText({
            id: "inputSignature",
            name: "signature",
            label: "Signature*",
            disabled: false,
            required: true,
            value: this.state.formData.signature,
            onChange: this.handleFormDataTextChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.errorSignature,
            errorMessage: 'Required Field'
          }),
          InputFieldText({
            id: "inputPrintedName",
            name: "printedName",
            label: "Printed Name*",
            disabled: false,
            required: true,
            value: this.state.formData.printedName,
            onChange: this.handleFormDataTextChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.errorPrintedName,
            errorMessage: 'Required Field'
          }),
          InputFieldText({
            id: "inputPosition",
            name: "position",
            label: "Position/Title in your Institution*",
            disabled: false,
            required: true,
            value: this.state.formData.position,
            onChange: this.handleFormDataTextChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.errorPosition,
            errorMessage: 'Required Field'
          }),
          InputFieldText({
            id: "inputInstitution",
            name: "institution",
            label: "Institution*",
            disabled: false,
            required: true,
            value: this.state.formData.institution,
            onChange: this.handleFormDataTextChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.errorInstitution,
            errorMessage: 'Required Field'
          }),
          InputFieldText({
            id: "inputDate",
            name: "date",
            label: "Date",
            disabled: true,
            value: this.state.formData.date,
            onChange: this.handleFormDataTextChange,
            readOnly: false
          }),

          div({ style: { 'marginTop': '15px' } }, [
            AlertMessage({
              msg: "Please complete all required fields.",
              show: this.state.errors.errorForm
            })
          ]),
          div({ style: { 'marginTop': '15px' } }, [
            AlertMessage({
              msg: this.state.dulMsg,
              show: this.state.dulError
            })
          ]),
          div({ className: "buttonContainer", style: { 'margin': '20px 0 40px 0' } }, [
            button({
              className: "btn buttonPrimary floatRight",
              onClick: this.submitDUL,
              disabled: this.state.submit
            }, ["Submit"])
          ])
        ]),
        h(Spinner, {
          name: "mainSpinner", group: "orsp", loadingImage: this.props.loadingImage
        })
      ])
    )
  }
}

export default DataUseLetter;
