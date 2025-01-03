import { Component, React } from 'react';
import { hh, h1, span, a, div, p, b, u, small, label, button, i, hr, h, br, input } from 'react-hyperscript-helpers';
import { InputFieldText } from './InputFieldText';
import { InputFieldRadio } from './InputFieldRadio';
import { InputFieldCheckbox } from './InputFieldCheckbox';
import { createObjectCopy, isEmpty } from '../util/Utils'
import './QuestionnaireWorkflow.css';
import DatePicker from 'react-datepicker';
import ReactSelect from './ReactSelect';


const TEXT_SHARING_TYPES = ['open', 'controlled', 'both'];

const REASEARCH_STAGES = [
  {id: '1', value: 'pre', label: 'Pre-analysis'}, 
  {id: '2', value: 'post', label: 'Post-analysis'},
  {id: '3', value: 'intra_analysis', label: 'Intra-analysis'}
];

const DATA_LOCATIONS = [
  {id: '1', value: 'terra', label: 'Terra'}, 
  {id: '2', value: 'gcsa', label: 'Google Cloud storage assets (e.g. Cloud Storage; BigQuery)'},
  {id: '3', value: 'gdrive', label: 'Google Drive'},
  {id: '4', value: 'onprem', label: 'On prem storage'},
  {id: '5', value: 'bil', label: 'Broad-issued laptop'},
  {id: '6', value: 'other', label: 'Other'}
];

export const Security = hh(class Security extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        approvalDocument: {
          fileName: null
        }
      },
      errors: {
        pii: true,
        compliance: true,
        sharingType: true,
        textCompliance: true,
        externalAvailability: true,
        textStore: true,
        publiclyAvailable: true,
        textOtherIdentifier: true,
        identifiers: true,
        dataType: true,
        textSharingType: true
      },
      openSharingText: '(Data Use LetterNR/link, consent or waiver of consent, or documentation from source that consent is not available but samples were appropriately collected and publicly available)',
      controlledSharingText: '(Data Use LetterNR/link, consent or waiver of consent)',
      documents: [],
      collaboratorApprovalRequired: 'false'
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidMount() {
    this.setState({formData: this.props.securityInfoData});
  }

  handleRadio2Change = (e, field, value) => {
    this.setState(prev => {
      prev.formData[field] = value;
      if (field === "pii" && (value === "false" || value === "uncertain")) {
        prev.formData.piiDt = false;
        prev.formData.phi = false;
        prev.formData.genomicData = false;
        prev.formData.names = false
        prev.formData.dates = false;
        prev.formData.telephone = false;
        prev.formData.geographicData = false;
        prev.formData.fax = false;
        prev.formData.socialSecurityNumber = false;
        prev.formData.emailAddresses = false;
        prev.formData.medicalNumbers = false;
        prev.formData.accountNumbers = false;
        prev.formData.healthPlanNumbers = false;
        prev.formData.licenseNumbers = false;
        prev.formData.vehicleIdentifiers = false;
        prev.formData.webUrls = false;
        prev.formData.deviceIdentifiers = false;
        prev.formData.internetProtocolAddresses = false;
        prev.formData.facePhotos = false;
        prev.formData.biometricIdentifiers = false;
        prev.formData.uniqueIdentifying = false;
        prev.formData.otherIdentifier = false;
        prev.formData.textOtherIdentifier = '';
        prev.formData.externalAvailability = null;
      }
      if (field === "collaboratorApproval") prev.collaboratorApprovalRequired = value;
      return prev;
    }, () => {
      this.props.handleSecurityValidity(this.validate());
      this.props.updateForm(this.state.formData, field);
    });
  };

  handleDataTypesChange = (e) => {
    const value = e.target.checked;
    const field = e.target.name;
    this.setState(prev => {
      if (field === 'otherIdentifier' && !value) {
        prev.formData.textOtherIdentifier = '';
      }
      if (field === 'otherStore' && !value) {
        prev.formData.textStore = '';
      }

      prev.formData[field] = value;

      if (field === 'terra' ||
        field === 'bgp' ||
        field === 'gcp' ||
        field === 'bop' ||
        field === 'aws') {
          prev.formData.store = [];
          prev.formData.terra ? prev.formData.store.push('terra') : null;
          prev.formData.bgp ? prev.formData.store.push('bgp') : null;
          prev.formData.gcp ? prev.formData.store.push('gcp') : null;
          prev.formData.bop ? prev.formData.store.push('bop') : null;
          prev.formData.aws ? prev.formData.store.push('aws') : null;
      }
      return prev;
    }, () => {
      this.props.handleSecurityValidity(this.validate());
      this.props.updateForm(this.state.formData, field);
    });
  };

  handleDataSecondaryUseChange = (e) => {
    const value = e.target.checked;
    const field = e.target.name;
    this.setState(prev => {
      prev.formData[field] = value;
      if (prev.formData.dataSecondaryUse === undefined) prev.formData.dataSecondaryUse = [];
      if (value) {
        prev.formData.dataSecondaryUse.push(field);
      } else {
        prev.formData.dataSecondaryUse.splice(prev.formData.dataSecondaryUse.indexOf(field))
      }
      return prev;
    }, () => {
      this.props.handleSecurityValidity(this.validate());
      this.props.updateForm(this.state.formData, field);
    })
  }

  handleInputChange = (e) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData[field] = value;
      return prev;
    }, () => {
      this.props.handleSecurityValidity(this.validate());
      this.props.updateForm(this.state.formData, field);
    });
  };

  validate = (field) => {
    let pii = false;
    let compliance = false;
    let sharingType = false;
    let isValid = true;
    let textCompliance = false;
    let externalAvailability = false;
    let textStore = false;
    let publiclyAvailable = false;
    let textOtherIdentifier = false;
    let identifiers = false;
    let dataType = false;
    let textSharingType = false;

    if (isEmpty(this.state.formData.pii)) {
      pii = true;
      isValid = false;
    }
    if (this.state.formData.otherIdentifier && isEmpty(this.state.formData.textOtherIdentifier)) {
      textOtherIdentifier = true;
      isValid = false;
    }
    if ((this.state.formData.piiDt || this.state.formData.phi || this.state.formData.genomicData)
      && isEmpty(this.state.formData.externalAvailability)) {
      externalAvailability = true;
      isValid = false;
    }

    if (isEmpty(this.state.formData.publiclyAvailable)) {
      publiclyAvailable = true;
      isValid = false;
    }

    if (isEmpty(this.state.formData.compliance)) {
      compliance = true;
      isValid = false;
    }

    if (this.state.otherStore && isEmpty(this.state.formData.textStore)) {
      textStore = true;
      isValid = false;
    }

    if (!isEmpty(this.state.formData.compliance)
      && this.state.formData.compliance === "true"
      && isEmpty(this.state.formData.textCompliance)) {
      textCompliance = true;
      isValid = false;
    }
    if (isEmpty(this.state.formData.sharingType)) {
      sharingType = true;
      isValid = false;
    }
    if (this.props.securityInfoData.pii === "true" &&
      !this.state.formData.piiDt &&
      !this.state.formData.phi &&
      !this.state.formData.genomicData) {
      dataType = true;
      isValid = false;
    }
    if (TEXT_SHARING_TYPES.some((type) => type === this.state.formData.sharingType && isEmpty(this.state.formData.textSharingType))) {
      textSharingType = true;
      isValid = false;
    }
    if ((this.state.formData.piiDt || this.state.formData.phi) &&
      (!this.state.formData.names &&
        !this.state.formData.dates &&
        !this.state.formData.telephone &&
        !this.state.formData.geographicData &&
        !this.state.formData.fax &&
        !this.state.formData.socialSecurityNumber &&
        !this.state.formData.emailAddresses &&
        !this.state.formData.medicalNumbers &&
        !this.state.formData.accountNumbers &&
        !this.state.formData.healthPlanNumbers &&
        !this.state.formData.licenseNumbers &&
        !this.state.formData.vehicleIdentifiers &&
        !this.state.formData.webUrls &&
        !this.state.formData.deviceIdentifiers &&
        !this.state.formData.internetProtocolAddresses &&
        !this.state.formData.facePhotos &&
        !this.state.formData.biometricIdentifiers &&
        !this.state.formData.uniqueIdentifying &&
        !this.state.formData.otherIdentifier)) {
      identifiers = true;
      isValid = false;
    }
    if (field === undefined || field === null || field === 3) {
      this.setState(prev => {
        prev.errors.pii = pii;
        prev.errors.compliance = compliance;
        prev.errors.sharingType = sharingType;
        prev.errors.textCompliance = textCompliance;
        prev.errors.externalAvailability = externalAvailability;
        prev.errors.textStore = textStore;
        prev.errors.publiclyAvailable = publiclyAvailable;
        prev.errors.textOtherIdentifier = textOtherIdentifier;
        prev.errors.identifiers = identifiers;
        prev.errors.dataType = dataType;
        prev.errors.textSharingType = textSharingType;
        return prev;
      });
    }
    return isValid;
  };

  formHasError() {
    let stateError = false;
    Object.keys(this.state.errors).forEach(key => {
      if (this.state.errors[key] === true) {
        stateError = true;
      }
    });
    return stateError;
  }

  loadDataLocationsOptions(query, callback) {
    const dataLocations = DATA_LOCATIONS.filter(item => item.label.toLowerCase().includes(query));
    let options = dataLocations.map(function (item) {
      return {
        key: item.id,
        value: item.value,
        label: item.label
      };
    });
    callback(options);
  };

  loadResearchStageOptions(query, callback) {
    const researchStages = REASEARCH_STAGES.filter(item => item.label.toLowerCase().includes(query));
    let options = researchStages.map(function (item) {
      return {
        key: item.id,
        value: item.value,
        label: item.label
      };
    });
    callback(options);
  };

  addMoreDataLocations = () => {
    const hasData = this.props.securityInfoData.dataLocations.every(item => 
        !isEmpty(item.researchStage) || !isEmpty(item.dataStores));
    hasData && this.setState(prev => {
      prev.formData.dataLocations.push({
        researchStage: null,
        dataStores: null
      });
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'dataLocations'));
  };

  handleDataLocationsChange = (value, index, key) => {
    const DATA_LOCATIONS_COPY = createObjectCopy(this.state.formData.dataLocations);
    if (!isEmpty(DATA_LOCATIONS_COPY[index][key])) {
      const REMOVED_DATA = DATA_LOCATIONS_COPY[index][key].filter(item => 
        !value.some(val => item.label === val.label)
      );
      REMOVED_DATA.forEach(remItem => {
        if (remItem.value === "bil") DATA_LOCATIONS_COPY[index].bilCluster = null;
        if (remItem.value === "other") DATA_LOCATIONS_COPY[index].otherText = null;
        DATA_LOCATIONS_COPY[index][remItem.value + "Url"] = null;
      });
      this.setState(prev => prev.formData.dataLocations = DATA_LOCATIONS_COPY);
    }
    this.setState(prev => {
      prev.formData.dataLocations = DATA_LOCATIONS_COPY;
      prev.formData.dataLocations[index][key] = value;
      return prev;
    }, () => {
      this.props.updateForm(this.state.formData, 'dataLocations')
    });
  }

  handleResearchStagesChange = (value, index, key) => {
    this.setState(prev => {
      prev.formData.dataLocations[index][key] = value;
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'researchStage'));
  }

  handleDataLocationInputChange = (e, index) => {
    const field = e.target.name;
    const value = e.target.value;
    this.setState(prev => {
      prev.formData.dataLocations[index][field] = value;
      return prev;
    }, () => this.props.updateForm(this.state.formData, 'dataLocations'));
  }

  handleDatePicker = (date, key) => {
    this.setState(prev => {
      prev.formData[key] = date;
    }, () => this.props.updateForm(this.state.formData, key));
  }

  handleCollaboratorApprovalDoc = async (e) => {
    const file = e.target.files[0];
    let doc = {}
    doc.file = file;
    doc.fileKey = 'Collaborator Approval';
    doc.fileName = file.name;
    doc.fileDescription = "collaborator_approval";
    doc.id = Math.random();
    this.setState(prev => {
      prev.formData.approvalDocument = doc;
      return prev;
    }, () => {
      this.props.updateForm(this.state.formData, 'approvalDocument');
    });
  }

  handleFileRemoval = () => {
    this.setState(prev => {
      prev.formData.approvalDocument = {fileName: null};
      return prev;
    });
  }

  showQuestion = (dataArr, value) => {
    if(typeof dataArr === 'object' && !isEmpty(dataArr)) {
      return dataArr.some(item => {
        if(!isEmpty(item)) {
          return item.value === value
        }
      });
    }
    return false;
  }

  getBoolIfString = (value) => {
    if (isEmpty(value)) return null;
    if (typeof value === 'string') {
      return value === 'true' ? true : false;
    }
    return value;
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }
    return (
      div({ className: "questionnaireContainerLight" }, [
        p({}, [
          "The following questions help the Broad Risk Management and Information Security teams understand where sensitive data types are stored and how that data is shared with external collaborators. ", 
          b({}, ["Please answer the questions to the best of your ability. "])
        ]),
        p({ style: { 'marginBottom': '10px' } }, [
          `The Information Security or Risk Management team may reach out to understand more about your project but your answers to these questions will not stop your project from moving forward. 
          You do not need to wait for a response from the Risk Management or Information Security teams before continuing work. `,
          span({style: { 'textDecoration': 'underline' }}, ["Should storage locations change over time, please keep these fields up-to-date."])
        ]),
        p({ style: { 'marginBottom': '25px','fontWeight': '600','fontStyle': 'italic' } }, [
          b({}, ["Please note: "]), "Protected health information (PHI) must only be processed and/or stored on Broad-owned devices, including Broad’s cloud assets."
        ]),
        
        InputFieldRadio({
          id: "radioPII",
          name: "pii",
          label: "1. Will your project involve receiving at or distributing from Broad any personally identifiable information (PII), protected health information (PHI), or genomic data? ",
          moreInfo: span({}, ["For a list of what constitutes PII and PHI, ", a({ href: "https://intranet.broadinstitute.org/faq/storing-and-managing-phi", className: "link", target: "_blank" }, ["visit this link"]), "."]),
          value: this.props.securityInfoData.pii,
          optionValues: ["true", "false", "uncertain"],
          optionLabels: [
            "Yes",
            "No",
            "Uncertain"
          ],
          onChange: this.handleRadio2Change,
          required: true,
          error: this.state.errors.pii && this.props.generalError,
          errorMessage: "Required field",
          edit: false
        }),
        div({ isRendered: this.getBoolIfString(this.props.securityInfoData.pii), style: { 'marginBottom': '20px' } }, [
          p({ className: "inputFieldLabel" }, [
            "a. Which of these types of data does your project involve? ",
            span({ className: "normal" }, ["Select all that apply."])
          ]),
          InputFieldCheckbox({
            id: "ckb_pii",
            name: "piiDt",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['PII']),
            checked: this.getBoolIfString(this.props.securityInfoData.piiDt),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_phi",
            name: "phi",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['PHI']),
            checked: this.getBoolIfString(this.props.securityInfoData.phi),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_genomicData",
            name: "genomicData",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Genomic Data']),
            checked: this.getBoolIfString(this.props.securityInfoData.genomicData),
            readOnly: this.state.readOnly,
            error: this.state.errors.textOtherIdentifier && this.props.generalError,
            errorMessage: "Required field"
          }),
          small({ isRendered: this.state.errors.dataType && this.props.generalError, className: "errorMessage" }, ['Required Fields']),
        ]),
        div({ 
          isRendered: this.getBoolIfString(this.props.securityInfoData.pii) && (this.getBoolIfString(this.props.securityInfoData.piiDt) || this.getBoolIfString(this.props.securityInfoData.phi)), 
          style: { 'marginBottom': '20px' }
        }, [
          p({ className: "inputFieldLabel" }, [
            "b. Does your data contain any of the following direct identifiers? ",
            span({ className: "normal" }, ["Select all that apply."])
          ]),
          InputFieldCheckbox({
            id: "ckb_names",
            name: "names",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Names']),
            checked: this.getBoolIfString(this.props.securityInfoData.names),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_dates",
            name: "dates",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Dates, except year']),
            checked: this.getBoolIfString(this.props.securityInfoData.dates),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_telephone",
            name: "telephone",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Telephone numbers']),
            checked: this.getBoolIfString(this.props.securityInfoData.telephone),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_geographic",
            name: "geographicData",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Geographic data']),
            checked: this.getBoolIfString(this.props.securityInfoData.geographicData),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_fax",
            name: "fax",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['FAX numbers']),
            checked: this.getBoolIfString(this.props.securityInfoData.fax),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_social_security_number",
            name: "socialSecurityNumber",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Social Security numbers']),
            checked: this.getBoolIfString(this.props.securityInfoData.socialSecurityNumber),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_email",
            name: "emailAddresses",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Email addresses']),
            checked: this.getBoolIfString(this.props.securityInfoData.emailAddresses),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_medical_numbers",
            name: "medicalNumbers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Medical record numbers']),
            checked: this.getBoolIfString(this.props.securityInfoData.medicalNumbers),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_account_numbers",
            name: "accountNumbers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Account numbers']),
            checked: this.getBoolIfString(this.props.securityInfoData.accountNumbers),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_health_plan_numbers",
            name: "healthPlanNumbers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Health plan beneficiary numbers']),
            checked: this.getBoolIfString(this.props.securityInfoData.healthPlanNumbers),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_licence_number",
            name: "licenseNumbers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Certificate/license numbers']),
            checked: this.getBoolIfString(this.props.securityInfoData.licenseNumbers),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_vehicle_identifiers",
            name: "vehicleIdentifiers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Vehicle identifiers and serial numbers including license plates']),
            checked: this.getBoolIfString(this.props.securityInfoData.vehicleIdentifiers),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_web_urls",
            name: "webUrls",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Web URLs']),
            checked: this.getBoolIfString(this.props.securityInfoData.webUrls),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_device_identifiers",
            name: "deviceIdentifiers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Device identifiers and serial numbers']),
            checked: this.getBoolIfString(this.props.securityInfoData.deviceIdentifiers),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_internet_protocol",
            name: "internetProtocolAddresses",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Internet protocol addresses']),
            checked: this.getBoolIfString(this.props.securityInfoData.internetProtocolAddresses),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_facePhotos",
            name: "facePhotos",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Full face photos and comparable images']),
            checked: this.getBoolIfString(this.props.securityInfoData.facePhotos),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_biometric_identifiers",
            name: "biometricIdentifiers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Biometric identifiers (i.e. retinal scan, fingerprints)']),
            checked: this.getBoolIfString(this.props.securityInfoData.biometricIdentifiers),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_unique_identifying",
            name: "uniqueIdentifying",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Any unique identifying number or code']),
            checked: this.getBoolIfString(this.props.securityInfoData.uniqueIdentifying),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_other_identifier",
            name: "otherIdentifier",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Other']),
            checked: this.getBoolIfString(this.props.securityInfoData.otherIdentifier),
            readOnly: this.state.readOnly
          }),
          small({ isRendered: this.state.errors.identifiers && this.props.generalError, className: "errorMessage" }, ['Required Fields'])
        ]),

        div({ style: { 'marginBottom': '20px' } }, [
          InputFieldText({
            isRendered: this.props.securityInfoData.otherIdentifier === true,
            id: "inputOtherIdentifier",
            name: "textOtherIdentifier",
            label: " Please describe “other”:",
            value: this.props.securityInfoData.textOtherIdentifier,
            disabled: false,
            required: false,
            onChange: this.handleInputChange,
            error: this.state.errors.textOtherIdentifier && this.props.generalError,
            errorMessage: "Required field"
          })
        ]),
        div({ 
          isRendered: this.getBoolIfString(this.props.securityInfoData.pii) && (this.getBoolIfString(this.props.securityInfoData.piiDt) || this.getBoolIfString(this.props.securityInfoData.phi) || this.getBoolIfString(this.props.securityInfoData.genomicData)), 
          style: { 'marginBottom': '20px' }
        }, [
          InputFieldRadio({
            id: "radioFirecloud",
            name: "externalAvailability",
            label: span({}, ["c. Will your project make PII, PHI, or genomic data available to external collaborators via FireCloud/Terra?"]),
            value: this.props.securityInfoData.externalAvailability,
            optionValues: ["true", "false", "uncertain"],
            optionLabels: [
              "Yes",
              "No",
              "Uncertain"
            ],
            onChange: this.handleRadio2Change,
            required: true,
            error: this.state.errors.externalAvailability && this.props.generalError,
            errorMessage: "Required field",
            edit: false
          })
        ]),
        InputFieldRadio({
          id: "radioPubliclyAvailable",
          name: "publiclyAvailable",
          label: span({}, ["2. Will your project make ", u({}, ["any data that is not publicly available"]), " accessible to external collaborators over the internet (but not using Terra)?"]),
          moreInfo: ` This includes, for example, putting data in a Google Cloud Platform bucket outside of Terra and making it available to external parties. 
                      Another example is a custom application facing the public internet, or another digital file sharing service.`,
          value: this.props.securityInfoData.publiclyAvailable,
          optionValues: ["true", "false", "uncertain"],
          optionLabels: [
            "Yes",
            "No",
            "Uncertain"
          ],
          onChange: this.handleRadio2Change,
          required: true,
          error: this.state.errors.publiclyAvailable && this.props.generalError,
          errorMessage: "Required field",
          edit: false
        }),
        InputFieldRadio({
          id: "radioCompliance",
          name: "compliance",
          label: span({}, ["3. Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPAA, etc.)"]), "? "]),
          moreInfo: span([`Information security compliance requirements should be described in project award letters, contracts, or other agreements. If no agreement exists for a project, 
                      Broad has not agreed to meet a specific compliance requirement. `, p(),
                      p([`PLEASE NOTE THAT AS OF 01/25/2025, DATA OBTAINED FROM FEDERAL REPOSITORIES (SUCH AS dbGaP) ARE REQUIRED TO BE STORED AND PROCESSED ON SYSTEMS COMPLIANT WITH NIST 
                        800-171 AND THEREFOR ARE SUBJECT TO SPECIFIC DATA SECURITY REQUIREMENTS.`])
                    ]),
          value: this.props.securityInfoData.compliance,
          optionValues: ["true", "false", "uncertain"],
          optionLabels: [
            "Yes",
            "No",
            "Uncertain"
          ],
          onChange: this.handleRadio2Change,
          required: true,
          error: this.state.errors.compliance && this.props.generalError,
          errorMessage: "Required field",
          edit: false
        }),
        div({ style: { 'marginBottom': '20px' } }, [
          InputFieldText({
            isRendered: this.props.securityInfoData.compliance === "true",
            id: "inputCompliance",
            name: "textCompliance",
            label: "Please specify which regulations must be adhered to below:",
            value: this.props.securityInfoData.textCompliance,
            disabled: false,
            required: false,
            onChange: this.handleInputChange,
            error: this.state.errors.textCompliance && this.props.generalError,
            errorMessage: "Required field"
          })
        ]),
        InputFieldRadio({
          id: "radioAccessible",
          name: "sharingType",
          label: span({}, ["4. Will the individual level data collected or generated as part of this project be shared to fulfill Broad Institute’s obligation for data sharing for the project via: "]),
          value: this.props.securityInfoData.sharingType,
          optionLabels: [
            "An open/unrestricted repository (such as GEO)",
            "A controlled-access repository (such as dbGaP or DUOS)",
            "Both a controlled-access and an open-access repository",
            "No data sharing via a repository (data returned to research collaborator only)",
            "Data sharing plan not yet determined"
          ],
          optionValues: [
            "open",
            "controlled",
            "both",
            "noDataSharing",
            "undetermined"
          ],
          onChange: this.handleRadio2Change,
          required: true,
          error: this.state.errors.sharingType && this.props.generalError,
          errorMessage: "Required field"
        }),

        div({ style: { 'marginBottom': '20px' } }, [
          InputFieldText({
            isRendered: TEXT_SHARING_TYPES.some((type) => type === this.state.formData.sharingType),
            id: "inputAccessible",
            name: "textSharingType",
            label: "Name of Database(s):",
            value: this.props.securityInfoData.textSharingType,
            disabled: false,
            required: false,
            onChange: this.handleInputChange,
            errorMessage: "Required field",
            error: this.state.errors.textSharingType && this.props.generalError,
          }),
        ]),
        div({style: {marginBottom: '20px'}}, [
          label({
            style: {color: '#286090', fontSize: '1.071rem'}
          }, ["5. Data Location(s)"]),
          p({}, [
            `Please provide the expected location where your data will be stored throughout the research lifecycle. Use the checkboxes to multi-select 
            research stages that will share storage locations between those research stages. Use “Add More Locations” if storage locations change between research stages.`
          ]),
          div([this.props.securityInfoData.dataLocations.map(
            (data, idx) => 
              div({className: "row"}, [
                hr({
                  isRendered: idx > 0,
                  style: {margin: '8px 6px', background: '#c7c7c7', height: '1px', zIndex: 0}
                }),
                span({className: "col-lg-6"}, [
                  h(ReactSelect, {
                    key: "researchStage" + idx,
                    allowCustomData: false,
                    options: REASEARCH_STAGES,
                    placeholder: "Research Stage (Pre-analysis/Post-analysis/Intra-analysis)",
                    handleChange:(selected) => this.handleResearchStagesChange(selected, idx, 'researchStage'),
                    value: data.researchStage,
                    isMulti: true,
                    hideSelectedOptions: false
                  })
                ]),
                span({className: "col-lg-6"}, [
                  h(ReactSelect, {
                    key: "dataLocations" + idx,
                    options: DATA_LOCATIONS,
                    placeholder: "Data Location(s)",
                    value: data.dataStores,
                    handleChange: (selected) => this.handleDataLocationsChange(selected, idx, 'dataStores'),
                    isMulti: true,
                    allowCustomData: false,
                    hideSelectedOptions: true,
                    menuIsOpen: false
                  })
                ]),
                div({style: {margin: "0 5px"}}, [
                  span({className: "col-12 ml-15"}, [
                    InputFieldText({
                      isRendered: this.showQuestion(data.dataStores, "terra"),
                      key: "terra-text" + idx,
                      id: "terra-text",
                      name: "terraUrl",
                      label: "Terra: What is the URL of the Terra Workspace or Terra Data Repository (TDR) snapshot?",
                      value: data.terraUrl,
                      disabled: false,
                      required: false,
                      onChange: (e) => this.handleDataLocationInputChange(e, idx),
                      errorMessage: "Required field",
                      error: false,
                      style:{margin: "0 5px"}
                    }),
                    InputFieldText({
                      isRendered: this.showQuestion(data.dataStores, "gcsa"),
                      key: "gcsa-text" + idx,
                      id: "gcsa-text",
                      name: "gcsaUrl",
                      label: "Google Cloud storage assets: What is the URL of the GCP Project and bucket?",
                      value: data.gcsaUrl,
                      disabled: false,
                      required: false,
                      onChange: (e) => this.handleDataLocationInputChange(e, idx),
                      errorMessage: "Required field",
                      error: false,
                      style:{margin: "0 5px"}
                    }),
                    InputFieldText({
                      isRendered: this.showQuestion(data.dataStores, "gdrive"),
                      key: "gdrive-text" + idx,
                      id: "gdrive-text",
                      name: "gdriveUrl",
                      label: "Google Drive: What is the folder name and URL?",
                      value: data.gdriveUrl,
                      disabled: false,
                      required: false,
                      onChange: (e) => this.handleDataLocationInputChange(e, idx),
                      errorMessage: "Required field",
                      error: false,
                      style:{margin: "0 5px"}
                    }),
                    InputFieldText({
                      isRendered: this.showQuestion(data.dataStores, "onprem"),
                      key: "onprem-text" + idx,
                      id: "onprem-text",
                      name: "onpremUrl",
                      label: "On prem storage: What is the name of the cluster and mountpoint?",
                      value: data.onpremUrl,
                      disabled: false,
                      required: false,
                      onChange: (e) => this.handleDataLocationInputChange(e, idx),
                      errorMessage: "Required field",
                      error: false,
                      style:{margin: "0 5px"}
                    }),
                    InputFieldText({
                      isRendered: this.showQuestion(data.dataStores, "bil"),
                      key: "bil-text" + idx,
                      id: "bil-text",
                      name: "bilCluster",
                      label: "Broad-issued laptop: What is the laptop name (sometimes called hostname)?",
                      value: data.bilCluster,
                      disabled: false,
                      required: false,
                      onChange: (e) => this.handleDataLocationInputChange(e, idx),
                      errorMessage: "Required field",
                      error: false,
                      style:{margin: "0 5px"} 
                    }),
                    InputFieldText({
                      isRendered: this.showQuestion(data.dataStores, "other"),
                      key: "other-text" + idx,
                      id: "other-text",
                      name: "otherText",
                      label: "Other",
                      value: data.otherText,
                      disabled: false,
                      required: false,
                      onChange: (e) => this.handleDataLocationInputChange(e, idx),
                      errorMessage: "Required field",
                      error: false,
                      style:{margin: "0 5px"}
                    })
                  ])
                ])
              ]),
          )]),
          button({
            className: "btn buttonPrimary",
            style: {margin: '10px 0'},
            onClick: this.addMoreDataLocations
          }, [
            i({
              className: "glyphicon glyphicon-plus",
              style: {fontSize: '1rem', paddingRight: '5px'}
            }), "Add More Locations"]
          )
        ]),
        div({style: { 'marginBottom': '20px' }}, [
          p({ className: "inputFieldLabel", style: {fontSize: '1.071rem'} }, [
            `6. Are you willing to share this data for secondary use if sharing is permissible according to the 1) terms of the informed consent form, 
            2) any relevant material or data transfer agreements, and 3) the approval of the researcher who originally collected the samples or data? `,
            span({ className: "normal" }, [` (Secondary research makes use of existing data or specimens collected previously for a different purpose.) 
              Please note: Answering yes to this question only documents a willingness to share the data or specimens; actual sharing will require review 
              of the consent form(s) by ORSP, review of relevant MTAs or DTAs by OSAP, and the permission of the researcher who originally collected the data or specimens.`])
          ]),
        ]),
        div({style: { 'marginBottom': '20px' }}, [
          InputFieldCheckbox({
            isRendered: !this.getBoolIfString(this.props.securityInfoData.no),
            id: "dsu_broadFacilitatedSharing",
            name: "broadFacilitatedSharing",
            onChange: this.handleDataSecondaryUseChange,
            label: span({ className: "normal" }, ['Yes, the Broad may facilitate sharing my data for secondary use via the Broad Data Access Committee']),
            checked: this.getBoolIfString(this.props.securityInfoData.broadFacilitatedSharing),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            isRendered: !this.getBoolIfString(this.props.securityInfoData.no),
            id: "dsu_externalSharing",
            name: "externalSharing",
            onChange: this.handleDataSecondaryUseChange,
            label: span({ className: "normal" }, ['Yes, it will be shared through an external repository and/or data access committee (i.e. dbGaP)']),
            checked: this.getBoolIfString(this.props.securityInfoData.externalSharing),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            isRendered: !this.getBoolIfString(this.props.securityInfoData.externalSharing) && !this.getBoolIfString(this.props.securityInfoData.broadFacilitatedSharing),
            id: "dsu_no",
            name: "no",
            onChange: this.handleDataSecondaryUseChange,
            label: span({ className: "normal" }, ['No, this data should not be shared for secondary use']),
            checked: this.getBoolIfString(this.props.securityInfoData.no),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "dsu_needAssistanceg",
            name: "needAssistance",
            onChange: this.handleDataSecondaryUseChange,
            label: span({ className: "normal" }, ['I need assistance from ORSP to answer this question']),
            checked: this.getBoolIfString(this.props.securityInfoData.needAssistance),
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "dsu_uncertain",
            name: "uncertain",
            onChange: this.handleDataSecondaryUseChange,
            label: span({ className: "normal" }, ['Uncertain']),
            checked: this.getBoolIfString(this.props.securityInfoData.uncertain),
            readOnly: this.state.readOnly
          })
        ]),
        InputFieldRadio({
          id: "collaboratorApproval",
          name: "collaboratorApproval",
          label: span({}, ["7. If you received these samples/data from a collaborator, did that collaborator approve/agree to sharing the data?"]),
          value: this.props.securityInfoData.collaboratorApproval,
          optionValues: ["true", "false", "uncertain"],
          optionLabels: [
            "Yes, my collaborator has approved sharing. (Please upload an email or other documentation)",
            "No, I do not have approval for sharing",
            "Uncertain"
          ],
          onChange: this.handleRadio2Change,
          required: false,
          error: false,
          errorMessage: "Required field",
          edit: false         
        }),
        div({
          isRendered: this.props.securityInfoData.collaboratorApproval === "true" && isEmpty(this.state.formData.approvalDocument.fileName),
          style: {marginBottom: "20px"}
        }, [
          label({
            htmlFor: "approvalDocument",
            style: {paddingRight: "5px"}
          }, [
            i({className: "btn btn-primary"}, ["Upload Documentation"]),
            input({
              id: "approvalDocument",
              type: "file",
              name: "collaboratorApproval",
              onChange: this.handleCollaboratorApprovalDoc,
              style: {display: "none"}
            }),
          ]),
        ]),
        div({
          isRendered: !isEmpty(this.state.formData.approvalDocument.fileName),
          style: {marginBottom: "20px"}
        }, [
          span({
            className: "file-chip"
          }, [
            this.state.formData.approvalDocument.fileName, 
            i({
              className: 'glyphicon glyphicon-remove',
              onClick: this.handleFileRemoval
            }, [])
            ]),
        ]),
        InputFieldRadio({
          id: "mtaOrDta",
          name: "mtaOrDta",
          label: span({}, ["8. Has the tech transfer office of the institution providing samples/data confirmed that a Material or Data Transfer Agreement (MTA/DTA) is needed to transfer the materials/data? "]),
          moreInfo: span( [" Please note: All samples transferred from DFCI require a material transfer agreement.  Contact ", 
                    span({style: { 'textDecoration': 'underline' }}, ["agreements@broadinstitute.org "]),"  for assistance."]),
          value: this.props.securityInfoData.mtaOrDta,
          optionValues: ["true", "false", "uncertain"],
          optionLabels: [
            "Yes",
            "No",
            "Uncertain"
          ],
          onChange: this.handleRadio2Change,
          required: false,
          error: false,
          errorMessage: "Required field",
          edit: false
        }),        
        div({
          className: 'row'
        }, [
          span({className: 'col-xs-4'}, [
            label({className: 'inputFieldLabel'}, ["9. Target Data Delivery Date"]), br(),
            h(DatePicker, ({
              selected: this.props.securityInfoData.deliveryDate,
              className: 'DatePicker',
              onChange: (date) => this.handleDatePicker(date, 'deliveryDate'),
              placeholderText: 'Please enter the date'
            }))
          ]),
          span({className: 'col-xs-4'}, [
            label({className: 'inputFieldLabel'}, ["10. Target Date for Public Release of Data (if applicable)"]), br(),
            h(DatePicker, ({
              selected: this.props.securityInfoData.releaseDate,
              className: 'DatePicker',
              onChange: (date) => this.handleDatePicker(date, 'releaseDate'),
              placeholderText: 'Please enter the date'
            }))
          ])
        ])
      ])
    )
  }
});
