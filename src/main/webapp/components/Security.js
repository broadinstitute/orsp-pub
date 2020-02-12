import { Component, React } from 'react';
import { hh, h1, span, a, div, p, b, u, small } from 'react-hyperscript-helpers';

import { WizardStep } from './WizardStep';
import { InputFieldText } from './InputFieldText';
import { InputFieldRadio } from './InputFieldRadio';
import { InputFieldCheckbox } from './InputFieldCheckbox';
import { isEmpty } from '../util/Utils'
import './QuestionnaireWorkflow.css';

const TEXT_SHARING_TYPES = ['open', 'controlled', 'both'];

export const Security = hh(class Security extends Component {

  state = {};

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        pii: '',
        compliance: '',
        sharingType: '',
        textSharingType: '',
        textCompliance: '',
        publiclyAvailable: '',
        store: '',
        externalAvailability: '',
        textStore: '',
        piiDt: false,
        phi: false,
        genomicData: false,
        names: false,
        dates: false,
        telephone: false,
        geographicData: false,
        fax: false,
        socialSecurityNumber: false,
        emailAddresses: false,
        medicalNumbers: false,
        accountNumbers: false,
        healthPlanNumbers: false,
        licenseNumbers: false,
        vehicleIdentifiers: false,
        webUrls: false,
        deviceIdentifiers: false,
        internetProtocolAddresses: false,
        facePhotos: false,
        biometricIdentifiers: false,
        uniqueIdentifying: false,
        otherIdentifier: false,
        textOtherIdentifier: ''
      },
      errors: {
        pii: true,
        compliance: true,
        sharingType: true,
        textCompliance: true,
        externalAvailability: true,
        store: true,
        textStore: true,
        publiclyAvailable: true,
        textOtherIdentifier: true,
        identifiers: true,
        dataType: true,
        textSharingType: true
      },
      openSharingText: '(Data Use LetterNR/link, consent or waiver of consent, or documentation from source that consent is not available but samples were appropriately collected and publicly available)',
      controlledSharingText: '(Data Use LetterNR/link, consent or waiver of consent)'
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  handleRadio2Change = (e, field, value) => {
    this.setState(prev => {
      prev.formData[field] = value;
      if (field === 'store' && value !== 'other') {
        prev.formData.textStore = '';
      }
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
      prev.formData[field] = value;
      return prev;
    }, () => {
      this.props.handleSecurityValidity(this.validate());
      this.props.updateForm(this.state.formData, field);
    });
  };

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
    let store = false;
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

    if (isEmpty(this.state.formData.store)) {
      store = true;
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

    if (!isEmpty(this.state.formData.store)
      && this.state.formData.store === "other"
      && isEmpty(this.state.formData.textStore)) {
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
        prev.errors.store = store;
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

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return h1({}, ["Something went wrong."]);
    }
    return (
      div({ className: "questionnaireContainerLight" }, [
        p({}, ["The following questions help the Broad Risk Management and Information Security teams understand where sensitive data types are stored and how that data is shared with external collaborators. ", b({}, ["Please answer the questions to the best of your ability. "])]),
        p({ style: { 'marginBottom': '25px' } }, [b({}, ["Note: "]), "The Information Security or Risk Management team may reach out to understand more about your project but your answers to these questions will not stop your project from moving forward. You do not need to wait for a response from the Risk Management or Information Security teams before continuing work."]),
        InputFieldRadio({
          id: "radioStore",
          name: "store",
          label: span({}, ["Where will the data for this project be processed, handled, and stored?"]),
          value: this.props.securityInfoData.store,
          optionValues: ["terra", "bgp", "gcp", "aws", "bop", "other"],
          optionLabels: [
            "Terra",
            "Broad Genomics Platform",
            "Google Cloud Platform (without Terra)",
            "Amazon Web Services",
            "Broad on-prem",
            "Other"
          ],
          onChange: this.handleRadio2Change,
          required: true,
          error: this.state.errors.store && this.props.generalError,
          errorMessage: "Required field",
          edit: false
        }),
        div({ style: { 'marginBottom': '20px' } }, [
          InputFieldText({
            isRendered: this.props.securityInfoData.store === 'other',
            id: "inputOther",
            name: "textStore",
            label: " Please describe “other”:",
            value: this.props.securityInfoData.textStore,
            disabled: false,
            required: false,
            onChange: this.handleInputChange,
            error: this.state.errors.textStore && this.props.generalError,
            errorMessage: "Required field"
          })
        ]),
        InputFieldRadio({
          id: "radioPII",
          name: "pii",
          label: "Will your project involve receiving at or distributing from Broad any personally identifiable information (PII), protected health information (PHI), or genomic data? ",
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
        div({ isRendered: this.props.securityInfoData.pii === "true", style: { 'marginBottom': '20px' } }, [
          p({ className: "inputFieldLabel" }, [
            "Which of these types of data does your project involve? ",
            span({ className: "normal" }, ["Select all that apply."])
          ]),
          InputFieldCheckbox({
            id: "ckb_pii",
            name: "piiDt",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['PII']),
            checked: this.state.formData.piiDt,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_phi",
            name: "phi",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['PHI']),
            checked: this.state.formData.phi,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_genomicData",
            name: "genomicData",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Genomic Data']),
            checked: this.state.formData.genomicData,
            readOnly: this.state.readOnly,
            error: this.state.errors.textOtherIdentifier && this.props.generalError,
            errorMessage: "Required field"
          }),
          small({ isRendered: this.state.errors.dataType && this.props.generalError, className: "errorMessage" }, ['Required Fields']),
        ]),
        div({ isRendered: this.props.securityInfoData.piiDt === true || this.props.securityInfoData.phi === true, style: { 'marginBottom': '20px' } }, [
          p({ className: "inputFieldLabel" }, [
            "Does your data contain any of the following direct identifiers? ",
            span({ className: "normal" }, ["Select all that apply."])
          ]),
          InputFieldCheckbox({
            id: "ckb_names",
            name: "names",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Names']),
            checked: this.state.formData.names,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_dates",
            name: "dates",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Dates, except year']),
            checked: this.state.formData.dates,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_telephone",
            name: "telephone",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Telephone numbers']),
            checked: this.state.formData.telephone,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_geographic",
            name: "geographicData",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Geographic data']),
            checked: this.state.formData.geographicData,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_fax",
            name: "fax",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['FAX numbers']),
            checked: this.state.formData.fax,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_social_security_number",
            name: "socialSecurityNumber",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Social Security numbers']),
            checked: this.state.formData.socialSecurityNumber,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_email",
            name: "emailAddresses",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Email addresses']),
            checked: this.state.formData.emailAddresses,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_medical_numbers",
            name: "medicalNumbers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Medical record numbers']),
            checked: this.state.formData.medicalNumbers,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_account_numbers",
            name: "accountNumbers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Account numbers']),
            checked: this.state.formData.accountNumbers,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_health_plan_numbers",
            name: "healthPlanNumbers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Health plan beneficiary numbers']),
            checked: this.state.formData.healthPlanNumbers,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_licence_number",
            name: "licenseNumbers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Certificate/license numbers']),
            checked: this.state.formData.licenseNumbers,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_vehicle_identifiers",
            name: "vehicleIdentifiers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Vehicle identifiers and serial numbers including license plates']),
            checked: this.state.formData.vehicleIdentifiers,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_web_urls",
            name: "webUrls",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Web URLs']),
            checked: this.state.formData.webUrls,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_device_identifiers",
            name: "deviceIdentifiers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Device identifiers and serial numbers']),
            checked: this.state.formData.deviceIdentifiers,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_internet_protocol",
            name: "internetProtocolAddresses",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Internet protocol addresses']),
            checked: this.state.formData.internetProtocolAddresses,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_facePhotos",
            name: "facePhotos",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Full face photos and comparable images']),
            checked: this.state.formData.facePhotos,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_biometric_identifiers",
            name: "biometricIdentifiers",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Biometric identifiers (i.e. retinal scan, fingerprints)']),
            checked: this.state.formData.biometricIdentifiers,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_unique_identifying",
            name: "uniqueIdentifying",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Any unique identifying number or code']),
            checked: this.state.formData.uniqueIdentifying,
            readOnly: this.state.readOnly
          }),
          InputFieldCheckbox({
            id: "ckb_other_identifier",
            name: "otherIdentifier",
            onChange: this.handleDataTypesChange,
            label: span({ className: "normal" }, ['Other']),
            checked: this.state.formData.otherIdentifier,
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
        div({ isRendered: this.props.securityInfoData.piiDt === true || this.props.securityInfoData.phi === true || this.props.securityInfoData.genomicData === true, style: { 'marginBottom': '20px' } }, [
          InputFieldRadio({
            id: "radioFirecloud",
            name: "externalAvailability",
            label: span({}, ["Will your project make PII, PHI, or genomic data available to external collaborators via FireCloud/Terra?"]),
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
          label: span({}, ["Will your project make ", u({}, ["any data that is not publicly available"]), " accessible to external collaborators over the internet?"]),
          moreInfo: " This includes, for example, putting data in Google Cloud Platform and making it available to external parties, a custom application facing the public internet, or another digital file sharing service.",
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
          label: span({}, ["Is this project subject to any regulations with specific data security requirements ", span({ className: 'normal' }, ["(FISMA, HIPAA, etc.)"]), "?"]),
          moreInfo: "Information security compliance requirements should be described in project award letters, contracts, or other agreements. If no agreement exists for a project, Broad has not agreed to meet a specific compliance requirement.",
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
          label: span({}, ["Will the individual level data collected or generated as part of this project be shared to fulfill Broad Institute’s obligation for data sharing for the project via: "]),
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
        })
      ])
    )
  }
});
