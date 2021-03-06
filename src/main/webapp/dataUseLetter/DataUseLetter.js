import { Component } from 'react';
import { br, button, div, h1, h2, h4, hh, li, p, small, span, ul } from 'react-hyperscript-helpers';
import { Panel } from '../components/Panel';
import { InputFieldText } from '../components/InputFieldText';
import { InputFieldRadio } from '../components/InputFieldRadio';
import { InputFieldDatePicker } from '../components/InputFieldDatePicker';
import { InputYesNo } from '../components/InputYesNo';
import { InputFieldCheckbox } from '../components/InputFieldCheckbox';
import { InputFieldTextArea } from '../components/InputFieldTextArea';
import { AlertMessage } from '../components/AlertMessage';
import { ConsentGroup, DataUse, DUL, Search } from '../util/ajax';
import { MultiSelect } from '../components/MultiSelect';
import _ from 'lodash';
import { isEmpty } from '../util/Utils';
import LoadingWrapper from '../components/LoadingWrapper';

const DataUseLetter = hh(class DataUseLetter extends Component {

  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      readOnly: false,
      submit: false,
      save: false,
      showSuccessAlert: false,
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

        controlledAccessDataSubmissionProhibition: '',
        openAccessDataSubmissionProhibition: '',
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
        errorControlledAccessDataSubmissionProhibition: false,
        errorOpenAccessDataSubmissionProhibition: false,
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
    this.saveDUL = this.saveDUL.bind(this);
    this.getRestriction = this.getRestriction.bind(this);
  }

  componentDidMount() {
    this.initFormData();
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  initFormData = () => {
    const uuid = window.location.href.split('id=')[1];
    ConsentGroup.getConsentGroupByUUID(uuid).then(consentGroup => {
      this.setState(prev => {
        prev.formData.protocolTitle = consentGroup.data.consent.summary !== undefined ? consentGroup.data.consent.summary : '';
        prev.formData.protocolNumber = consentGroup.data.consent.protocol !== undefined ? consentGroup.data.consent.protocol : '';
        prev.formData.date = this.parseDate(new Date());
        prev.formData.dataManagerName = consentGroup.data.consent.dataManagerName !== undefined ? consentGroup.data.consent.dataManagerName : '';
        prev.formData.dataManagerEmail = consentGroup.data.consent.dataManagerEmail !== undefined ? consentGroup.data.consent.dataManagerEmail : '';
        prev.formData.consentGroupKey =  consentGroup.data.consent.consentGroupKey;
        prev.formData.consentPIName = consentGroup.data.consent.consentPIName !== undefined ? consentGroup.data.consent.consentPIName : '';
        return prev;
      });

        DUL.getDULInfo(uuid).then(resp => {
          let dulInfo = JSON.parse(resp.data.dul.dulInfo);
          this.setState(prev => {
            prev.formData.onGoingProcess = dulInfo.onGoingProcess;
            prev.formData.startDate = dulInfo.startDate;
            prev.formData.endDate = dulInfo.endDate;
            prev.formData.repositoryDeposition = dulInfo.repositoryDeposition;
            prev.formData.consentFormTitle = dulInfo.consentFormTitle ? dulInfo.consentFormTitle : '';
            prev.formData.principalInvestigator = dulInfo.principalInvestigator ? dulInfo.principalInvestigator : '';
            prev.formData.dataManagerName = dulInfo.dataManagerName ? dulInfo.dataManagerName : '';
            prev.formData.dataManagerEmail = dulInfo.dataManagerEmail ? dulInfo.dataManagerEmail : '';
            prev.formData.primaryRestrictions = dulInfo.primaryRestrictions ? dulInfo.primaryRestrictions : '';
            if (dulInfo.diseaseRestrictedOptions) {
              prev.formData.diseaseRestrictedOptions.parasiticDisease = dulInfo.diseaseRestrictedOptions.parasiticDisease;
              prev.formData.diseaseRestrictedOptions.cancer = dulInfo.diseaseRestrictedOptions.cancer;
              prev.formData.diseaseRestrictedOptions.mentalDisorder = dulInfo.diseaseRestrictedOptions.mentalDisorder;
              prev.formData.diseaseRestrictedOptions.nervousDisease = dulInfo.diseaseRestrictedOptions.nervousDisease;
              prev.formData.diseaseRestrictedOptions.cardiovascularDisease = dulInfo.diseaseRestrictedOptions.cardiovascularDisease;
              prev.formData.diseaseRestrictedOptions.respiratoryDisease = dulInfo.diseaseRestrictedOptions.respiratoryDisease;
              prev.formData.diseaseRestrictedOptions.digestiveDisease = dulInfo.diseaseRestrictedOptions.digestiveDisease;
              prev.formData.diseaseRestrictedOptions.otherDisease = dulInfo.diseaseRestrictedOptions.otherDisease;
              prev.formData.diseaseRestrictedOptions.diseaseDOID = dulInfo.diseaseRestrictedOptions.diseaseDOID;
            }
            prev.formData.otherDiseasesID = dulInfo.otherDiseasesID ? dulInfo.otherDiseasesID : [];
            prev.formData.commercialPurposes = dulInfo.commercialPurposes ? dulInfo.commercialPurposes : '';
            prev.formData.methodsResearch = dulInfo.methodsResearch ? dulInfo.methodsResearch : '';
            prev.formData.noPopulationRestricted = dulInfo.noPopulationRestricted ? dulInfo.noPopulationRestricted : '';
            prev.formData.under18 = dulInfo.under18 ? dulInfo.under18 : '';
            prev.formData.onlyMen = dulInfo.onlyMen ? dulInfo.onlyMen : '';
            prev.formData.onlyWomen = dulInfo.onlyWomen ? dulInfo.onlyWomen : '';
            prev.formData.ethnic = dulInfo.ethnic ? dulInfo.ethnic : '';
            prev.formData.ethnicSpecify = dulInfo.ethnicSpecify ? dulInfo.ethnicSpecify : '';
            prev.formData.otherRestrictions = dulInfo.otherRestrictions ? dulInfo.otherRestrictions : '';
            prev.formData.controlledAccessDataSubmissionProhibition = dulInfo.controlledAccessDataSubmissionProhibition ? dulInfo.controlledAccessDataSubmissionProhibition : '';
            prev.formData.openAccessDataSubmissionProhibition = dulInfo.openAccessDataSubmissionProhibition ? dulInfo.openAccessDataSubmissionProhibition : '';
            prev.formData.dataUseConsent = dulInfo.dataUseConsent ? dulInfo.dataUseConsent : '';
            prev.formData.dataDepositionDescribed = dulInfo.dataDepositionDescribed ? dulInfo.dataDepositionDescribed : '';
            prev.formData.repositoryType = dulInfo.repositoryType ? dulInfo.repositoryType : '';
            prev.formData.GSRAvailability = dulInfo.GSRAvailability ? dulInfo.GSRAvailability : '';
            prev.formData.GSRAvailabilitySpecify = dulInfo.GSRAvailabilitySpecify ? dulInfo.GSRAvailabilitySpecify : '';
            prev.formData.signature = dulInfo.signature ? dulInfo.signature : '';
            prev.formData.printedName = dulInfo.printedName ? dulInfo.printedName : '';
            prev.formData.position = dulInfo.position ? dulInfo.position : '';
            prev.formData.institution = dulInfo.institution ? dulInfo.institution : '';
            return prev;
          });
        }).catch(error => {
          this.setState(() => { throw error; });
        });
    }).catch(error => {
      this.setState(() => { throw error; });
    });

    this.setState(prev => {
      prev.errors.errorForm = false;
      prev.errors.errorPi = false;
      prev.errors.errorSampleCollectionDateRange = false;
      prev.errors.errorPrimaryRestrictionsChecks = false;
      prev.errors.errorDiseaseRestrictedOptions = false;
      prev.errors.errorOtherDiseaseSpecify = false;

      prev.errors.errorSignature = false;
      prev.errors.errorPrintedName = false;
      prev.errors.errorPosition = false;
      prev.errors.errorInstitution = false;

      prev.errors.errorGSRAvailability = false;
      prev.errors.errorControlledAccessDataSubmissionProhibition = false;
      prev.errors.errorOpenAccessDataSubmissionProhibition = false;
      prev.errors.errorRepositoryType = false;
      prev.errors.errorDataDepositionDescribed = false;
      prev.errors.errorDataUseConsent = false;

      return prev;
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
      Search.getSourceDiseases(query)
        .then(response => {
          let options = response.data.map(function (item) {
            return {
              key: item.id,
              value: item.definition[0],
              label: item.label
            };
          });
          callback(options);
        }).catch(error => {
          this.setState(() => { throw error; });
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
      this.props.showSpinner();
      const id = window.location.href.split('id=')[1];
      let form = { dulInfo: JSON.stringify(this.state.formData), uid: id };
      DUL.updateDUL(form).then(resp => {
        this.createRestriction();
        DUL.createDulPdf({ uid: id }).then(() => {
          this.props.init(id);
          this.props.hideSpinner();
        }, (reject) => {
          this.showDulError();
        })
      }).catch(error => {
         this.showDulError();
      });
    }
  };

  saveDUL() {
    this.setState(prev => {
      prev.save = true;
      prev.dulError = false;
      return prev;
    });
    this.props.showSpinner();
    const id = window.location.href.split('id=')[1];
    let form = { dulInfo: JSON.stringify(this.state.formData), uid: id };
    DUL.updateDUL(form).then(resp => {
      
      this.setState(prev => {
        prev.showSuccessAlert = true;
        return prev;
      });

      this.initFormData();
      this.props.hideSpinner();
      setTimeout(this.clearAlertMessage, 8000, null);
      
    }).catch(error => {
       this.showDulError();
    });
  };

  clearAlertMessage = () => {
    this.setState(prev => {
      prev.save = false;
      prev.showSuccessAlert = false;
      return prev;
    });
  };

  showDulError() {
    this.setState(prev => {
      prev.submit = false;
      prev.dulError = true;
      return prev;
    });
    this.props.hideSpinner();
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
    let errorControlledAccessDataSubmissionProhibition = false;
    let errorOpenAccessDataSubmissionProhibition = false;

    let errorRepositoryType = false;
    let errorDataDepositionDescribed = false;
    let errorDataUseConsent = false;

    // Pi Validation
    if (this.isEmpty(this.state.formData.principalInvestigator)) {
      errorForm = true;
      errorPi = true;
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
      if (this.startsBefore("1/25/2015") && this.isEmpty(this.state.formData.controlledAccessDataSubmissionProhibition)) {
        errorForm = true;
        errorControlledAccessDataSubmissionProhibition = true;
      }
      if (this.startsBefore("1/25/2015") && this.isEmpty(this.state.formData.openAccessDataSubmissionProhibition)) {
        errorForm = true;
        errorOpenAccessDataSubmissionProhibition = true;
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
      prev.errors.errorControlledAccessDataSubmissionProhibition = errorControlledAccessDataSubmissionProhibition;
      prev.errors.errorOpenAccessDataSubmissionProhibition = errorOpenAccessDataSubmissionProhibition;
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
    DataUse.createRestriction(restriction);
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
      generalUse: this.state.formData.primaryRestrictions === 'generalUse' ||  this.state.formData.primaryRestrictions === 'noRestrictions' ? "Yes" : "No",
      hmbResearch: this.state.formData.primaryRestrictions === 'researchRestricted' ? "Yes" : "No",
      diseaseRestrictions: diseaseRestrictions,
      populationOriginsAncestry: this.state.formData.primaryRestrictions === 'researchRestricted' || hasDiseases ? "Yes" : null,
      commercialUseExcluded: this.state.formData.commercialPurposes === 'true' || this.state.formData.commercialPurposes === true ? "Yes" : "No",
      methodsResearchExcluded: this.state.formData.methodsResearch === 'true' || this.state.formData.methodsResearch === true  ? "Yes" : "No",
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
          Panel({ title: "Data Manager ", moreInfo: "(individual responsible for communicating future decisions regarding data access and transfer)" }, [
            div({ className: "row" }, [
              div({ className: "col-lg-6 col-md-6 col-sm-12 col-12" }, [
                InputFieldText({
                  id: "inputDataManagerName",
                  name: "dataManagerName",
                  label: "Data Manager Name",
                  value: this.state.formData.dataManagerName,
                  onChange: this.handleFormDataTextChange,
                  readOnly: false
                })
              ]),
              div({ className: "col-lg-6 col-md-6 col-sm-12 col-12" }, [
                InputFieldText({
                  id: "inputDataManagerEmail",
                  name: "dataManagerEmail",
                  label: "Data Manager Email",
                  value: this.state.formData.dataManagerEmail,
                  onChange: this.handleFormDataTextChange,
                  readOnly: false
                })
              ])
            ])
          ]),

          Panel({ title: "Sample Collection Date Range*" }, [
            div({ className: "row readonly-content" }, [
              div({ className: "col-xs-12 col-sm-4 col-padding" }, [
                InputFieldDatePicker({
                  selected: this.state.formData.startDate,
                  name: "startDate",
                  label: "Start Date",
                  onChange: this.handleDatePickerChange,
                  placeholder: "Enter Start Date",
                  disabled: true
                })
              ]),
              div({ className: "col-xs-12 col-sm-4 col-padding" }, [
                InputFieldDatePicker({
                  name: "endDate",
                  label: "End Date",
                  selected: this.state.formData.endDate,
                  onChange: this.handleDatePickerChange,
                  placeholder: "Enter End Date",
                  disabled: true
                })
              ]),
              div({ className: "col-xs-12 col-sm-4 col-padding", style: { 'marginTop': '32px' } }, [
                InputFieldCheckbox({
                  id: "onGoingProcess",
                  name: "onGoingProcess",
                  onChange: this.handleCheck,
                  label: "Ongoing Process",
                  checked: this.state.formData.onGoingProcess,
                  readOnly: true
                })
              ])
            ])
          ]),

          InputYesNo({
            id: "radioRepositoryDeposition",
            name: "repositoryDeposition",
            value: this.state.formData.repositoryDeposition,
            label: "Data is intended for repository deposition?",
            onChange: this.handleRadioChange,
            readOnly: true,
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
            InputFieldRadio({
              id: "radioPrimaryRestriction",
              name: "primaryRestrictions",
              label: "",
              value: this.state.formData.primaryRestrictions,
              optionValues: ['noRestrictions', 'generalUse', 'researchRestricted', 'diseaseRestricted'],
              optionLabels: [
                span({ className: 'bold' }, ['No restrictions.']),
                span({ className: 'bold' }, ['General research use ', span({ className: 'normal italic' }, ['(Data can be used for any research purpose but would not be made available for non-research purposes. These data would generally be made available to any qualified investigator, irrespective of the specific research purpose for which the data are requested.)'])]),
                span({ className: 'bold"' }, ['Future use is ', span({ className: 'bold' }, ['restricted to health/medical/biomedical research (any type)'])]),
                span({ className: 'bold"' }, ['Future research is ', span({ className: 'bold' }, ['restricted to (a) specific disease(s): ']), span({ className: 'normal italic' }, ['(Please note that checking any of these boxes precludes all future research outside of the indicated disease.)'])]),
              ],
              onChange: this.handleRadioPrimaryChange,
              readOnly: this.state.readOnly,
              error: this.state.errors.errorPrimaryRestrictionsChecks,
              errorMessage: "Required Field"
            }),

            div({ isRendered: this.state.formData.primaryRestrictions === 'diseaseRestricted', className: "row subGroup" }, [
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
                id: "ckb_cardiovascularDisease",
                name: "cardiovascularDisease",
                onChange: this.handleSubOptionsCheck,
                label: span({ className: "normal" }, ['Circulatory & Cardiovascular system diseases']),
                checked: this.state.formData.diseaseRestrictedOptions.cardiovascularDisease === 'true' || this.state.formData.diseaseRestrictedOptions.cardiovascularDisease === true,
                readOnly: this.state.readOnly
              }),
              InputFieldCheckbox({
                id: "ckb_respiratoryDisease",
                name: "respiratoryDisease",
                onChange: this.handleSubOptionsCheck,
                label: span({ className: "normal" }, ['Respiratory system diseases']),
                checked: this.state.formData.diseaseRestrictedOptions.respiratoryDisease === 'true' || this.state.formData.diseaseRestrictedOptions.respiratoryDisease === true,
                readOnly: this.state.readOnly
              }),
              InputFieldCheckbox({
                id: "ckb_digestiveDisease",
                name: "digestiveDisease",
                onChange: this.handleSubOptionsCheck,
                label: span({ className: "normal" }, ['Digestive system diseases']),
                checked: this.state.formData.diseaseRestrictedOptions.digestiveDisease === 'true' || this.state.formData.diseaseRestrictedOptions.digestiveDisease === true,
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
                MultiSelect({
                  id: "inputOtherDiseaseSpecify",
                  label: "Please select",
                  name: "otherDiseaseSpecify",
                  isDisabled: false,
                  loadOptions: this.loadDOIDOptions,
                  handleChange: this.handleDiseaseManagerChange,
                  value: this.state.formData.otherDiseasesID,
                  placeholder: "Start typing the name of the disease",
                  isMulti: true,
                  edit: false,
                  error: this.state.errors.errorOtherDiseaseSpecify
                })
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
              readOnly: noPopulationRestrictedValidation
            }),
            InputFieldCheckbox({
              id: "ckb_under18",
              name: "under18",
              onChange: this.handleCheck,
              label: "Research in children under 18 years of age only",
              checked: this.state.formData.under18 === 'true' || this.state.formData.under18 === true,
              readOnly: this.state.readOnly || this.state.formData.noPopulationRestricted === true
            }),
            InputFieldCheckbox({
              id: "ckb_onlyMen",
              name: "onlyMen",
              onChange: this.handleCheck,
              label: "Research in men only",
              checked: this.state.formData.onlyMen === 'true' || this.state.formData.onlyMen === true,
              readOnly: this.state.readOnly || this.state.formData.noPopulationRestricted === true
            }),
            InputFieldCheckbox({
              id: "ckb_onlyWomen",
              name: "onlyWomen",
              onChange: this.handleCheck,
              label: "Research in women only",
              checked: this.state.formData.onlyWomen === 'true' || this.state.formData.onlyWomen === true,
              readOnly: this.state.readOnly || this.state.formData.noPopulationRestricted === true
            }),
            InputFieldCheckbox({
              id: "ckb_ethnic",
              name: "ethnic",
              onChange: this.handleCheck,
              label: "Research in the following ethnic or geographic population",
              checked: this.state.formData.ethnic === 'true' || this.state.formData.ethnic === true,
              readOnly: this.state.readOnly || this.state.formData.noPopulationRestricted === true
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

            // If SC Date Range starts before 1/25/2015 (OK)
            div({ isRendered: !(this.state.formData.startDate === null || (this.state.formData.onGoingProcess === false && this.state.formData.endDate === null)) }, [
              div({ isRendered: this.startsBefore("1/25/2015") }, [
                h2({ className: "pageSubtitle" }, [
                  small({}, ["(For samples collected BEFORE 1/25/2015)"])
                ]),
                InputFieldRadio({
                  id: "radioControlledAccessDataSubmissionProhibition",
                  name: "controlledAccessDataSubmissionProhibition",
                  label: "Is data submission into a controlled-access database not inconsistent with (not prohibited by) the informed consent provided by the research participant?*",
                  value: this.state.formData.controlledAccessDataSubmissionProhibition,
                  optionValues: ["allowed", "prohibited"],
                  optionLabels: [
                    span({}, ["Yes, data submission into a controlled-access database is ", span({ className: "bold" }, ["not inconsistent "]), "with the consent. ", span({ className: "normal italic" }, ["(Data submission is permitted)"])]),
                    span({}, ["No, data submission into a controlled-access database is ", span({ className: "bold" }, ["inconsistent "]), "with the consent. ", span({ className: "normal italic" }, ["(Data submission is not permitted)"])]),
                  ],
                  onChange: this.handleRadioChange,
                  readOnly: this.state.readOnly,
                  error: this.state.errors.errorControlledAccessDataSubmissionProhibition,
                  errorMessage: "Required Field"
                }),
                InputFieldRadio({
                  id: "radioOpenAccessDataSubmissionProhibition",
                  name: "openAccessDataSubmissionProhibition",
                  label: "Is data submission into an open-access (public) database not inconsistent with (not prohibited by) the informed consent provided by the research participant?*",
                  value: this.state.formData.openAccessDataSubmissionProhibition,
                  optionValues: ["allowed", "prohibited"],
                  optionLabels: [
                    span({}, ["Yes, data submission into an open-access (public) is ", span({ className: "bold" }, ["not inconsistent "]), "with the consent. ", span({ className: "normal italic" }, ["(Data submission is permitted)"])]),
                    span({}, ["No, data submission into an open-access (public) is ", span({ className: "bold" }, ["inconsistent "]), "with the consent. ", span({ className: "normal italic" }, ["(Data submission is not permitted)"])]),
                  ],
                  onChange: this.handleRadioChange,
                  readOnly: this.state.readOnly,
                  error: this.state.errors.errorOpenAccessDataSubmissionProhibition,
                  errorMessage: "Required Field"
                })
              ]),

              // If SC Date Range ends after (or that same) 1/25/2015 (OK)
              div({ isRendered: this.state.formData.onGoingProcess === true || this.endsEqualOrAfter("1/25/2015") }, [
                h2({ className: "pageSubtitle" }, [
                  small({}, ["(For samples collected AFTER 1/25/2015)"])
                ]),
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
                div({ isRendered: this.state.formData.dataUseConsent === true }, [
                  InputYesNo({
                    id: "radioDataDepositionDescribed",
                    name: "dataDepositionDescribed",
                    value: this.state.formData.dataDepositionDescribed,
                    label: "Is data deposition into a repository described in the consent form?*",
                    readOnly: this.state.readOnly,
                    onChange: this.handleRadioChange,
                    error: this.state.errors.errorDataDepositionDescribed,
                    errorMessage: "Required Field"
                  })
                ]),
                div({ isRendered: this.state.formData.dataDepositionDescribed === true }, [
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
                ])
              ]),
              InputFieldRadio({
                id: "radioGSRAvailability",
                name: "GSRAvailability",
                label: "Are the genomic summary results (GSR) from this study to be made available only through controlled-access?* ",
                value: this.state.formData.GSRAvailability,
                optionValues: ["GSRNotRequired", "GSRRequired"],
                optionLabels: [
                  "No, controlled-access for GSR is not required",
                  "Yes, controlled-access for GSR is required",
                ],
                onChange: this.handleRadioChange,
                readOnly: this.state.readOnly,
                error: this.state.errors.errorGSRAvailability,
                errorMessage: 'Required Field',
                tooltipLabel: "?",
                tooltipMsg: "NIH provides genomic summary results (GSR) from most studies submitted to NIH-designated data repositories through unrestricted access. However, data from data sets considered to have particular ‘sensitivities’ related to individual privacy or potential for group harm (e.g., those with populations from isolated geographic regions, or with rare or potentially stigmatizing traits) may be designated as “sensitive” by. In such cases, “controlled-access” should be checked below and a brief explanation for the sensitive designation should be provided. GSR from any such data sets will only be available through controlled-access."
              }),
              div({ isRendered: this.state.formData.GSRAvailability === 'GSRRequired' }, [
                InputFieldText({
                  id: "inputGSRAvailabilitySpecify",
                  name: "GSRAvailabilitySpecify",
                  label: "Please explain why the GSR should be designated as sensitive",
                  disabled: false,
                  value: this.state.formData.GSRAvailabilitySpecify,
                  onChange: this.handleFormDataTextChange,
                  readOnly: this.state.readOnly
                })
              ])
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
            id: "inputSignature",
            name: "signature",
            label: "Email*",
            disabled: false,
            required: true,
            value: this.state.formData.signature,
            onChange: this.handleFormDataTextChange,
            readOnly: this.state.readOnly,
            error: this.state.errors.errorSignature,
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
            }),
            AlertMessage({
              msg: 'Data Use Limitation Record form was saved successfully',
              show: this.state.showSuccessAlert,
              type: 'success'
            })
          ]),
          div({ className: "buttonContainer", style: { 'margin': '20px 0 40px 0' } }, [
            button({
              className: "btn buttonPrimary floatRight",
              onClick: this.submitDUL,
              disabled: this.state.submit
            }, ["Submit"]),
            button({
              className: "btn buttonPrimary floatRight",
              onClick: this.saveDUL,
              disabled: this.state.save
            }, ["Save"])
          ])
        ])
      ])
    )
  }
});
export default LoadingWrapper(DataUseLetter);
