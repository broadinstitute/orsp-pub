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
import { MultiSelect } from "../components/MultiSelect";
import { Search } from "../util/ajax";
import { DataUse } from "../util/ajax";
import _ from 'lodash';


class DataUseLetter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      readOnly: false,
      submit: false,
      showSampleCollectionWarning: true,
      formData: {
        otherDiseasesID: [],
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
        primaryRestrictions: '',
        diseaseRestrictedOptions: {
          parasiticDisease: false,
          cancer: false,
          mentalDisorder: false,
          nervousDisease: false,
          cardiovascularDisease: false,
          respiratoryDisease: false,
          digestiveDisease: false,
          otherDisease: false,
          diseaseDOID: [],
        },
        commercialPurposes: false,
        methodsResearch: false,

        noPopulationRestricted: false,
        under18: false,
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
        GSRAvailabilitySpecify: '',

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
    this.getRestriction = this.getRestriction.bind(this);
  }

  componentDidCatch(error, info) {
    console.log('----------------------- error ----------------------')
    console.log(error, info);
  }

  componentDidMount() {
    this.initFormData();
  }

  initFormData = () => {
    const uuid = window.location.href.split('id=')[1];
    ConsentGroup.getConsentGroupByUUID(this.props.consentGroupUrl, uuid).then(consentGroup => {
      this.setState(prev => {
        prev.formData.protocolTitle = consentGroup.data.consent.summary !== undefined ? consentGroup.data.consent.summary : '';
        prev.formData.protocolNumber = consentGroup.data.consent.protocol !== undefined ? consentGroup.data.consent.protocol : '';
        prev.formData.date = this.parseDate(new Date());
        prev.formData.dataManagerName = consentGroup.data.consent.dataManagerName !== undefined ? consentGroup.data.consent.dataManagerName : '';
        prev.formData.dataManagerEmail = consentGroup.data.consent.dataManagerEmail !== undefined ? consentGroup.data.consent.dataManagerEmail : '';
        prev.formData.consentGroupKey = consentGroup.data.consent.consentGroupKey;
        prev.formData.consentPIName = consentGroup.data.consent.consentPIName !== undefined ? consentGroup.data.consent.consentPIName : '';
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

  loadDOIDOptions = (query, callback) => {
    if (query.length > 2) {
      Search.getMatchingQuery(this.props.sourceDiseases, query)
        .then(response => {
          let options = response.data.map(function (item) {
            return {
              key: item.id,
              value: item.definition[0],
              label: item.label
            };
          });
          callback(options);
        });
    }
  };

  handleDiseaseManagerChange = (data, action) => {
    this.setState(prev => {
      if (data !== null) {
        prev.formData.otherDiseasesID = data;
      } else {
        prev.formData.otherDiseasesID = [];
      }
      return prev;
    }, () => {
      if (this.state.submit) {
        this.validateForm();
      }
    });
  };

  handleRadioPrimaryChange = (e, field, value) => {
    if (value !== 'diseaseRestricted') {
      this.cleanDiseasesSelection();
    }
    this.setState(prev => {
      prev.formData.primaryRestrictions = value;
      return prev;
    }, () => {
      if (this.state.submit) {
        this.validateForm();
      }
    })
  };

  cleanDiseasesSelection = () => {
    this.setState(prev => {
      prev.formData.diseaseRestrictedOptions.parasiticDisease = false;
      prev.formData.diseaseRestrictedOptions.cancer = false;
      prev.formData.diseaseRestrictedOptions.mentalDisorder = false;
      prev.formData.diseaseRestrictedOptions.nervousDisease = false;
      prev.formData.diseaseRestrictedOptions.cardiovascularDisease = false;
      prev.formData.diseaseRestrictedOptions.respiratoryDisease = false;
      prev.formData.diseaseRestrictedOptions.digestiveDisease = false;
      prev.formData.diseaseRestrictedOptions.otherDisease = false;
      prev.formData.diseaseRestrictedOptions.diseaseDOID = [];
      prev.formData.otherDiseasesID = [];
      return prev;
    });
  };

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
    const formerDiseaseDOID = [...this.state.formData.diseaseRestrictedOptions.diseaseDOID];

    if (name === "parasiticDisease") {
      const diseaseKey = "http://purl.obolibrary.org/obo/DOID_0050117";
      if (checked) {
        formerDiseaseDOID.push({
          key: diseaseKey,
          label: "disease by infectious agent",
          value: "A disease that is the consequence of the presence of pathogenic microbial agents, including pathogenic viruses, pathogenic bacteria, fungi, protozoa, multicellular parasites, and aberrant proteins known as prions."
        });
      } else {
        formerDiseaseDOID.splice(_.findIndex(formerDiseaseDOID, { key: diseaseKey }), 1);
      }
    } else if (name === "cancer") {
      const diseaseKey = "http://purl.obolibrary.org/obo/DOID_162";
      if (checked) {
        formerDiseaseDOID.push({
          key: diseaseKey,
          label: "cancer",
          value: "A disease of cellular proliferation that is malignant and primary, characterized by uncontrolled cellular proliferation, local cell invasion and metastasis."
        });
      } else {
        formerDiseaseDOID.splice(_.findIndex(formerDiseaseDOID, { key: diseaseKey }), 1);
      }
    } else if (name === "mentalDisorder") {
      const diseaseKey = "http://purl.obolibrary.org/obo/DOID_150";
      if (checked) {
        formerDiseaseDOID.push({
          key: diseaseKey,
          label: "disease of mental health",
          value: "A disease that involves a psychological or behavioral pattern generally associated with subjective distress or disability that occurs in an individual, and which are not a part of normal development or culture."
        });
      } else {
        formerDiseaseDOID.splice(_.findIndex(formerDiseaseDOID, { key: diseaseKey }), 1);
      }
    } else if (name === "nervousDisease") {
      const diseaseKey = "http://purl.obolibrary.org/obo/DOID_863";
      if (checked) {
        formerDiseaseDOID.push({
          key: diseaseKey,
          label: "nervous system disease",
          value: "A disease of anatomical entity that is located_in the central nervous system or located_in the peripheral nervous system."
        });
      } else {
        formerDiseaseDOID.splice(_.findIndex(formerDiseaseDOID, { key: diseaseKey }), 1);
      }
    } else if (name === "cardiovascularDisease") {
      const diseaseKey = "http://purl.obolibrary.org/obo/DOID_1287";
      if (checked) {
        formerDiseaseDOID.push({
          key: diseaseKey,
          label: "cardiovascular system disease",
          value: "A disease of anatomical entity which occurs in the blood, heart, blood vessels or the lymphatic system that passes nutrients (such as amino acids and electrolytes), gases, hormones, blood cells or lymph to and from cells in the body to help fight diseases and help stabilize body temperature and pH to maintain homeostasis."
        });
      } else {
        formerDiseaseDOID.splice(_.findIndex(formerDiseaseDOID, { key: diseaseKey }), 1);
      }
    } else if (name === "respiratoryDisease") {
      const diseaseKey = "http://purl.obolibrary.org/obo/DOID_1579";
      if (checked) {
        formerDiseaseDOID.push({
          key: diseaseKey,
          label: "respiratory system disease",
          value: "A disease of anatomical entity that located_in the respiratory system which extends from the nasal sinuses to the diaphragm."
        });
      } else {
        formerDiseaseDOID.splice(_.findIndex(formerDiseaseDOID, { key: diseaseKey }), 1);
      }
    } else if (name === "digestiveDisease") {
      const diseaseKey = "http://purl.obolibrary.org/obo/DOID_77";
      if (checked) {
        formerDiseaseDOID.push({
          key: diseaseKey,
          label: "gastrointestinal system disease",
          value: "A disease of anatomical entity that is located_in the gastrointestinal tract."
        });
      } else {
        formerDiseaseDOID.splice(_.findIndex(formerDiseaseDOID, { key: diseaseKey }), 1);
      }
    }

    this.setState(prev => {
      if (name === 'otherDisease' && checked === false) {
        prev.formData.otherDiseasesID = [];
      }
      prev.formData.diseaseRestrictedOptions[name] = checked;
      prev.formData.diseaseRestrictedOptions.diseaseDOID = [...formerDiseaseDOID];
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
      } else if (field == 'dataUseConsent' || field == 'dataDepositionDescribed' || field == 'repositoryType') {
        this.setState(prev => {
          if (field === 'dataUseConsent') {
            prev.formData['dataDepositionDescribed'] = '';
            prev.formData['repositoryType'] = '';
          } else if (field === 'dataDepositionDescribed') {
            prev.formData['repositoryType'] = '';
          }
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
        this.createRestriction();
        DUL.createDulPdf({ uid: id }, this.props.serverUrl).then(() => {
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
    if (this.state.formData.primaryRestrictions === '') {
      errorForm = true;
      errorPrimaryRestrictionsChecks = true;
    }

    if (this.state.formData.primaryRestrictions === 'diseaseRestricted'
      && this.state.formData.diseaseRestrictedOptions.otherDisease === true
      && this.state.formData.otherDiseasesID.length === 0) {
      errorForm = true;
      errorDiseaseRestrictedOptions = true;
    }

    if (this.state.formData.primaryRestrictions === 'diseaseRestricted'
      && this.state.formData.diseaseRestrictedOptions.otherDisease === false
      && this.state.formData.diseaseRestrictedOptions.diseaseDOID.length === 0) {
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
      if (this.startsBefore("1/25/2015") && this.isEmpty(this.state.formData.dataSubmissionProhibition)) {
        errorForm = true;
        errorDataSubmissionProhibition = true;
      }
      if (this.state.formData.onGoingProcess === true || this.endsEqualOrAfter("1/25/2015")) {
        if (this.isEmpty(this.state.formData.dataUseConsent)) {
          errorForm = true;
          errorDataUseConsent = true;
        }
        if (this.state.formData.dataUseConsent === true && this.isEmpty(this.state.formData.dataDepositionDescribed)) {
          errorForm = true;
          errorDataDepositionDescribed = true;
        }
        if (this.state.formData.dataDepositionDescribed === true && this.isEmpty(this.state.formData.repositoryType)) {
          errorForm = true;
          errorRepositoryType = true;
        }
      }
      if (this.isEmpty(this.state.formData.GSRAvailability)) {
        errorForm = true;
        errorGSRAvailability = true
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

  createRestriction() {
    let restriction = this.getRestriction();
    DataUse.createRestriction(this.props.serverUrl, restriction);
  }

  getDiseases(diseases) {
    return diseases.map(disease =>
      disease.key
    );
  }

  getRestriction() {
    let diseaseRestrictions = [];
    let hasDiseases = false;
    if (this.state.formData.diseaseRestrictedOptions !== null &&
      this.state.formData.diseaseRestrictedOptions.diseaseDOID !== null &&
      this.state.formData.diseaseRestrictedOptions.diseaseDOID.length > 0) {
      diseaseRestrictions = [...this.getDiseases(this.state.formData.diseaseRestrictedOptions.diseaseDOID)];
      hasDiseases = true;
    }
    if (this.state.formData.otherDiseasesID !== null &&
      this.state.formData.otherDiseasesID.length > 0) {
      diseaseRestrictions = [...this.getDiseases(this.state.formData.otherDiseasesID), ...diseaseRestrictions];
      hasDiseases = true;
    }
    let restriction = {
      consentGroupKey: this.state.formData.consentGroupKey,
      consentPIName: this.state.formData.principalInvestigator,
      generalUse: this.state.formData.primaryRestrictions === 'generalUse' || this.state.formData.primaryRestrictions === 'noRestrictions' ? "Yes" : "No",
      hmbResearch: this.state.formData.primaryRestrictions === 'researchRestricted' ? "Yes" : "No",
      diseaseRestrictions: diseaseRestrictions,
      populationOriginsAncestry: this.state.formData.primaryRestrictions === 'researchRestricted' || hasDiseases ? "Yes" : null,
      commercialUseExcluded: this.state.formData.commercialPurposes === 'true' || this.state.formData.commercialPurposes === true ? "Yes" : "No",
      methodsResearchExcluded: this.state.formData.methodsResearch === 'true' || this.state.formData.methodsResearch === true ? "Yes" : "No",
      controlSetOption: this.state.formData.primaryRestrictions === 'generalUse' || this.state.formData.primaryRestrictions === 'noRestrictions' ? "No" : null,
      gender: this.getGender(),
      populationRestrictions: this.state.formData.ethnic === 'true' || this.state.formData.ethnic === true ? this.state.formData.ethnicSpecify : null,
      pediatric: this.getPediatricLimited(),
      other: this.state.formData.otherRestrictions,
      manualReview: this.state.formData.ethnic === 'true' || this.state.formData.ethnic === true || !this.isEmpty(this.state.formData.otherRestrictions) ? "Yes" : "No",
      externalForm: true
    }
    return restriction;
  }

  getGender() {
    let gender = 'NA';
    if (this.state.formData.onlyMen === 'true' || this.state.formData.onlyMen === true) {
      gender = 'Male';
    } else if (this.state.formData.onlyWomen === 'true' || this.state.formData.onlyWomen === true) {
      gender = 'Female';
    }
    return gender;
  }

  getPediatricLimited() {
    let pediatricLimited = 'No';
    if (this.state.formData.under18 === 'true' || this.state.formData.under18 === true) {
      pediatricLimited = 'Yes';
    }
    return pediatricLimited;
  }

  render() {

    const noPopulationRestrictedValidation = this.state.readOnly || this.state.formData.under18 === true || this.state.formData.onlyMen === true || this.state.formData.onlyWomen === true || this.state.formData.ethnic === true;

    return (
      div({}, [
        a({ className: "breadcrumbLink" }, [
          span({ className: "glyphicon glyphicon-chevron-left" }, []),
          //replace with actual Sample/Data Cohort name
          "DEV-CG-4355: Walter / Test"
        ]),
        h2({ className: "pageTitle" }, [
          div({}, ["Sample Collections associated to"]),
          //replace with actual Project name
          div({ className: "italic normal" }, ["DEV-IRB-4354: IRB 04"])
        ]),

        Panel({ title: "Data Manager ", moreInfo: "(individual responsible for communicating future decisions regarding data access and transfer)" }, [
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
        ])
      ])
    )
  }
}

export default DataUseLetter;
